import sequelize from "../config/db.js";
import LoanModel from "../models/loan.model.js";
import CustomerModel from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import TransactionModel from "../models/transaction.model.js";
import { col, fn, Op, where } from "sequelize";

/** Create Loan with initial Disbursement transaction */
const createLoan = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { customerId, emiAmount, amount, startDate, tenureMonths } = req.body;

    if (!customerId || !emiAmount || !amount || !startDate || !tenureMonths) {
      await transaction.rollback();
      return next(new ApiError(400, "All required fields must be provided"));
    }

    // Customer check
    const customer = await CustomerModel.findByPk(customerId, { transaction });
    if (!customer) {
      await transaction.rollback();
      return next(new ApiError(404, "Customer not found"));
    }
    if (["Blocked", "Inactive"].includes(customer.status)) {
      await transaction.rollback();
      return next(
        new ApiError(403, `Customer is ${customer.status}, cannot create loan`)
      );
    }

    // Check existing active/pending/defaulted loan
    const existingLoan = await LoanModel.findOne({
      where: {
        customerId,
        status: ["Active", "Pending", "Defaulted"],
        isActive: true,
      },
      transaction,
    });
    if (existingLoan) {
      await transaction.rollback();
      return next(new ApiError(400, "Customer already has an ongoing loan"));
    }

    // ---- Generate Loan Number ----
    const companyCode = "LN";
    const year = new Date().getFullYear().toString().slice(-3);

    // Last loan for this company+year
    const lastLoan = await LoanModel.findOne({
      where: {
        loanNumber: {
          [Op.like]: `${companyCode}${year}%`, // starts with LN + year
        },
      },
      order: [
        // order by numeric part descending
        [
          sequelize.literal(`CAST(SUBSTRING(loanNumber, 6) AS UNSIGNED)`),
          "DESC",
        ],
      ],
      transaction,
    });

    console.log(lastLoan);

    let nextSequence = 1;

    if (lastLoan && lastLoan.loanNumber) {
      const lastNumStr = lastLoan.loanNumber.slice(5); // 0-1=LN, 2-4=year last 3 digits
      nextSequence = parseInt(lastNumStr, 10) + 1;
    }

    const loanNumber = `${companyCode}${year}${nextSequence
      .toString()
      .padStart(3, "0")}`;

    // Initialize loan fields
    const loanData = {
      ...req.body,
      paidEmis: 0,
      pendingEmis: tenureMonths,
      nextEmiAmount: emiAmount,
      lossAmount: amount,
      loanNumber,
    };

    // Create loan
    const loan = await LoanModel.create(loanData, { transaction });

    // Create Disbursement transaction automatically
    await TransactionModel.create(
      {
        loanId: loan.id,
        customerId,
        amount,
        transactionType: "Disbursement",
        transactionDate: startDate,
        description: "Loan disbursed",
      },
      { transaction }
    );

    await transaction.commit();

    return res
      .status(201)
      .json(
        new ApiResponse(201, loan, "Loan created and disbursed successfully")
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Get all Loans with pagination, sorting, search, status filter, and next/previous flags */
const getLoans = asyncHandler(async (req, res, next) => {
  try {
    // Extract query params with defaults
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
      search = "",
      status,
      customerId,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // Validate order
    order = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Validate sortBy (ensure it's a column in LoanModel)
    const validSortFields = [
      "createdAt",
      "updatedAt",
      "totalPayableAmount",
      "status",
    ];
    if (!validSortFields.includes(sortBy)) sortBy = "createdAt";

    // Build WHERE condition
    const whereCondition = {};
    if (status) whereCondition.status = status;
    if (customerId) whereCondition.customerId = customerId;

    // Dynamic search across customer fields
    if (search) {
      const searchLower = search.toLowerCase();
      const searchableFields = ["firstName", "lastName", "mobileNumber"];
      whereCondition[Op.or] = searchableFields.map((field) =>
        where(fn("LOWER", col(`customer.${field}`)), "LIKE", `%${searchLower}%`)
      );
    }

    // Fetch loans with related customer and transactions
    const loans = await LoanModel.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: CustomerModel,
          as: "customer",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "mobileNumber",
            "status",
            "address",
            "city",
            "fatherName",
          ],
        },
        {
          model: TransactionModel,
          as: "transactions",
          separate: true,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [[sortBy, order]],
      limit,
      offset,
    });

    // Map loans with paymentsReceived and pendingAmount
    const loanData = loans.rows.map((loan) => {
      const paymentsReceived = loan.transactions.reduce((sum, tx) => {
        return tx.transactionType === "Repayment"
          ? sum + parseFloat(tx.amount || 0)
          : sum;
      }, 0);

      const receivedCharges = loan.transactions
        .filter((tx) => tx.transactionType === "Repayment")
        .reduce((sum, tx) => sum + parseFloat(tx.lateEMICharges || 0), 0);

      const pendingAmount =
        parseFloat(loan.totalPayableAmount || 0) - paymentsReceived;

      // Sum of all late EMI charges
      const totalLateCharges = loan.transactions.reduce(
        (sum, tx) => sum + parseFloat(tx.lateEMICharges || 0),
        0
      );

      return {
        ...loan.toJSON(),
        paymentsReceived: (paymentsReceived + receivedCharges).toFixed(2),
        pendingAmount: pendingAmount >= 0 ? pendingAmount.toFixed(2) : "0.00",
        totalLateCharges: totalLateCharges.toFixed(2),
      };
    });

    const totalPages = Math.ceil(loans.count / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total: loans.count,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          loans: loanData,
        },
        responseMessage.fetched("Loans")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Get Loan by ID */
const getLoanById = asyncHandler(async (req, res, next) => {
  try {
    const loan = await LoanModel.findByPk(req.params.id, {
      include: [
        {
          model: CustomerModel,
          as: "customer",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "mobileNumber",
            "status",
            "address",
            "city",
            "fatherName",
          ],
        },
        {
          model: TransactionModel,
          as: "transactions",
          // attributes: ["amount", "transactionType"], // include type
          separate: true,
          order: [["createdAt", "DESC"]], // latest transaction first
        },
      ],
    });

    if (!loan) return next(new ApiError(404, responseMessage.notFound("Loan")));

    // Calculate paymentsReceived and pendingAmount
    const paymentsReceived = loan.transactions
      .filter((tx) => tx.transactionType === "Repayment")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const receivedCharges = loan.transactions
      .filter((tx) => tx.transactionType === "Repayment")
      .reduce((sum, tx) => sum + parseFloat(tx.lateEMICharges || 0), 0);

    const pendingAmount =
      parseFloat(loan.totalPayableAmount) - paymentsReceived;

    // Sum of all late EMI charges
    const totalLateCharges = loan.transactions.reduce(
      (sum, tx) => sum + parseFloat(tx.lateEMICharges || 0),
      0
    );

    const loanWithPayments = {
      ...loan.toJSON(),
      paymentsReceived: (paymentsReceived + receivedCharges).toFixed(2),
      pendingAmount: pendingAmount >= 0 ? pendingAmount : 0,
      totalLateCharges: totalLateCharges.toFixed(2),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, loanWithPayments, responseMessage.fetched("Loan"))
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Update Loan */
const updateLoan = asyncHandler(async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const loanId = req.params.id;

    // Check if loan exists
    const loan = await LoanModel.findByPk(loanId, { transaction: t });
    if (!loan) {
      await t.rollback();
      return next(new ApiError(404, responseMessage.notFound("Loan")));
    }

    // Check if any repayment transaction exists
    const existingRepayment = await TransactionModel.findOne({
      where: { loanId, transactionType: "Repayment" },
      transaction: t,
    });

    if (existingRepayment) {
      await t.rollback();
      return next(
        new ApiError(
          400,
          "Cannot update loan after a repayment transaction has been made"
        )
      );
    }

    // Safe to update
    await loan.update(req.body, { transaction: t });
    await t.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, loan, responseMessage.updated("Loan")));
  } catch (err) {
    await t.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Delete Loan */
const deleteLoan = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await LoanModel.findByPk(req.params.id, { transaction });
    if (!loan) return next(new ApiError(404, responseMessage.notFound("Loan")));

    // Prevent deleting Active loans
    if (loan.status === "Active") {
      await transaction.rollback();
      return next(
        new ApiError(
          400,
          "Active loans cannot be deleted. Please close the loan first."
        )
      );
    }

    // Delete non-active loans
    await loan.destroy({ force: true, transaction });
    await transaction.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("Loan")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export const closeLoanWithTransaction = asyncHandler(async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { customerId, loanId } = req.body;

    if (!customerId || !loanId) {
      await t.rollback();
      return next(new ApiError(400, "Customer ID and Loan ID are required"));
    }

    // Validate Customer
    const customer = await CustomerModel.findByPk(customerId, {
      transaction: t,
    });
    if (!customer) {
      await t.rollback();
      return next(new ApiError(404, "Customer not found"));
    }

    // Validate Loan
    const loan = await LoanModel.findOne({
      where: { id: loanId, customerId },
      transaction: t,
    });

    if (!loan) {
      await t.rollback();
      return next(new ApiError(404, "Loan not found for this customer"));
    }

    if (loan.status === "Closed") {
      await t.rollback();
      return next(new ApiError(400, "Loan is already closed"));
    }

    // All transactions for this loan
    const transactionsBefore = await TransactionModel.findAll({
      where: { loanId, customerId, transactionType: "Repayment" },
      transaction: t,
    });

    const totalRepaymentAmountBefore = transactionsBefore.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    // Calculate pending amount
    const pendingAmount =
      Number(loan.totalPayableAmount || 0) - totalRepaymentAmountBefore;

    // If no pending amount
    if (pendingAmount <= 0) {
      await loan.update(
        {
          status: "Closed",
          nextEmiAmount: 0,
          installmentDate: null,
          pendingEmis: 0,
        },
        { transaction: t }
      );

      await t.commit();
      return res
        .status(200)
        .json(new ApiResponse(200, loan, "Loan already fully paid and closed"));
    }

    // Create final repayment transaction
    const finalTransaction = await TransactionModel.create(
      {
        loanId,
        customerId,
        amount: pendingAmount,
        transactionType: "Repayment",
        paymentMode: "Cash",
        transactionDate: new Date(),
        description: "Final repayment (Loan Closed)",
      },
      { transaction: t }
    );

    // All transactions for this loan
    const transactions = await TransactionModel.findAll({
      where: { loanId, customerId, transactionType: "Repayment" },
      transaction: t,
    });

    const totalRepaymentAmount = transactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    const totalLateCharges = transactions.reduce(
      (sum, t) => sum + Number(t.lateEMICharges || 0),
      0
    );

    // ===== Profit / Loss Calculation =====
    const principal = parseFloat(loan.amount || 0);
    let profitAmount = 0;
    let lossAmount = 0;
    const totalReceived = totalRepaymentAmount + totalLateCharges;

    if (totalReceived > principal) {
      profitAmount = totalReceived - principal;
      lossAmount = 0;
    } else if (totalReceived < principal) {
      lossAmount = principal - totalReceived;
      profitAmount = 0;
    }

    // Update loan to closed
    await loan.update(
      {
        status: "Closed",
        pendingEmis: 0,
        nextEmiAmount: 0,
        installmentDate: null,
        paidEmis: loan.paidEmis + 1,
        profitAmount,
        lossAmount,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          loan,
          finalTransaction,
        },
        "Loan closed successfully with final repayment transaction"
      )
    );
  } catch (err) {
    await t.rollback();
    next(new ApiError(500, err.message));
  }
});

/**
 * GET /api/loans/upcoming-emi?days=5&includeToday=false
 * - days: number of days ahead to check (default 5)
 * - includeToday: "true" or "false" (default false). If true, includes today's date.
 */
export const getUpcomingEmis = asyncHandler(async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 5;
    const includeToday = req.query.includeToday === "true";

    if (isNaN(days) || days < 0) {
      return next(new ApiError(400, "Invalid 'days' query parameter"));
    }

    // Helper: get YYYY-MM-DD for a date in server local timezone
    const toYMD = (d) => d.toLocaleDateString("en-CA");

    const today = new Date();

    // start: either today (if includeToday) OR tomorrow
    const startDateObj = new Date(today);
    if (!includeToday) startDateObj.setDate(startDateObj.getDate() + 1);

    // end: startDate + (days - (includeToday ? 0 : 1)) days => simpler: end = today + days
    const endDateObj = new Date(today);
    endDateObj.setDate(endDateObj.getDate() + days);

    const startDate = toYMD(startDateObj);
    const endDate = toYMD(endDateObj);

    // Fetch loans whose installmentDate is between startDate and endDate (inclusive)
    const loans = await LoanModel.findAll({
      where: {
        installmentDate: {
          [Op.between]: [startDate, endDate],
        },
        status: "Active",
      },
      include: [
        {
          model: CustomerModel,
          as: "customer",
        },
      ],
      order: [["installmentDate", "ASC"]],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, loans, "Upcoming EMIs fetched successfully"));
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

export default {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  closeLoanWithTransaction,
  getUpcomingEmis,
};
