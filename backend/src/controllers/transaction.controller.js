import sequelize from "../config/db.js";
import TransactionModel from "../models/transaction.model.js";
import LoanModel from "../models/loan.model.js";
import CustomerModel from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import { Op } from "sequelize";
import UploadFileModel from "../models/uploadFile.model.js";

/** Create Transaction with Loan Update Logic */
const createTransaction = asyncHandler(async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    let {
      customerId,
      amount,
      transactionType,
      paymentMode,
      transactionDate,
      description,
      perDayLateCharge,
    } = req.body;

    transactionDate = new Date(transactionDate);

    // Validate Customer
    const customer = await CustomerModel.findByPk(customerId, {
      transaction: t,
    });
    if (!customer) {
      await t.rollback();
      return next(new ApiError(404, "Customer not found"));
    }

    // find the active loan for the customer
    const activeLoan = await LoanModel.findOne({
      where: { customerId, status: "Active", isActive: true },
      transaction: t,
    });

    if (!activeLoan) {
      await t.rollback();
      return next(new ApiError(404, "No active loan found for this customer"));
    }

    const loanId = activeLoan.id;

    // ===== Late EMI Calculation Logic =====
    let lateEMIDays = 0;
    let lateEMICharges = 0;

    if (transactionType === "Repayment" && activeLoan.installmentDate) {
      const installmentDate = new Date(activeLoan.installmentDate);
      if (transactionDate > installmentDate) {
        // Calculate difference in days
        const diffTime = transactionDate.getTime() - installmentDate.getTime();
        lateEMIDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        lateEMICharges = (
          lateEMIDays * parseFloat(perDayLateCharge || 0)
        ).toFixed(2);
      } else {
        lateEMIDays = 0;
        lateEMICharges = 0;
      }
    }

    // Create Transaction
    const transactionRecord = await TransactionModel.create(
      {
        loanId,
        customerId,
        amount,
        transactionType,
        paymentMode,
        transactionDate,
        description,
        lateEMIDays,
        lateEMICharges,
      },
      { transaction: t }
    );

    // Update Loan if transactionType is Repayment
    const loanToUpdate = await LoanModel.findByPk(loanId, { transaction: t });

    if (transactionType === "Repayment") {
      const newPaidEmis = loanToUpdate.paidEmis + 1;

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
      const principal = parseFloat(loanToUpdate.amount || 0);
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

      // ===== Update EMI and loan status =====
      if (totalRepaymentAmount >= activeLoan.totalPayableAmount) {
        // Loan fully paid
        await loanToUpdate.update(
          {
            paidEmis: newPaidEmis,
            pendingEmis: 0,
            nextEmiAmount: 0,
            installmentDate: null,
            status: "Closed",
            profitAmount,
            lossAmount,
          },
          { transaction: t }
        );
      } else {
        const newPendingEmis = loanToUpdate.tenureMonths - newPaidEmis;

        const calculatedNextEmiAmount = parseFloat(
          (
            parseFloat(loanToUpdate.nextEmiAmount || 0) -
            parseFloat(amount) +
            parseFloat(loanToUpdate.emiAmount || 0)
          ).toFixed(2)
        );

        const newNextEmiAmount =
          calculatedNextEmiAmount > 0 ? calculatedNextEmiAmount : 0;

        const currentInstallmentDate = loanToUpdate.installmentDate
          ? new Date(loanToUpdate.installmentDate)
          : new Date();

        const newInstallmentDate =
          newPendingEmis > 0
            ? (() => {
                currentInstallmentDate.setMonth(
                  currentInstallmentDate.getMonth() + 1
                );
                return currentInstallmentDate.toISOString().split("T")[0];
              })()
            : null;

        await loanToUpdate.update(
          {
            paidEmis: newPaidEmis,
            pendingEmis: newPendingEmis > 0 ? newPendingEmis : 0,
            nextEmiAmount: newPendingEmis > 0 ? newNextEmiAmount : 0,
            installmentDate: newPendingEmis > 0 ? newInstallmentDate : null,
            status: newPendingEmis === 0 ? "Closed" : loanToUpdate.status,
            profitAmount,
            lossAmount,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          transactionRecord,
          "Transaction created successfully"
        )
      );
  } catch (err) {
    await t.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Get Transactions with pagination, search, filter */
const getTransactions = asyncHandler(async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
      search = "",
      transactionType,
      paymentMode,
      startDate,
      endDate,
      customerId,
      loanId,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereCondition = {};

    // Search by customer name or mobile
    if (search) {
      whereCondition[Op.or] = [
        { "$customer.firstName$": { [Op.iLike]: `%${search}%` } },
        { "$customer.lastName$": { [Op.iLike]: `%${search}%` } },
        { "$customer.mobileNumber$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filter by transactionType
    if (transactionType) whereCondition.transactionType = transactionType;

    // Filter by paymentMode
    if (paymentMode) whereCondition.paymentMode = paymentMode;

    // Filter by customerId
    if (customerId) whereCondition.customerId = customerId;

    // Filter by loanId
    if (loanId) whereCondition.loanId = loanId;

    // Filter by transactionDate
    if (startDate && endDate) {
      whereCondition.transactionDate = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      whereCondition.transactionDate = { [Op.gte]: startDate };
    } else if (endDate) {
      whereCondition.transactionDate = { [Op.lte]: endDate };
    }

    const transactions = await TransactionModel.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: LoanModel,
          as: "loan",
          attributes: ["id", "amount", "status"],
        },
        {
          model: CustomerModel,
          as: "customer",
          include: [
            {
              model: UploadFileModel,
              as: "profileFile",
            },
          ],
          // attributes: ["id", "firstName", "lastName", "mobileNumber"],
        },
      ],
      order: [[sortBy, order.toUpperCase()]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(transactions.count / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total: transactions.count,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          transactions: transactions.rows,
        },
        responseMessage.fetched("Transactions")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Get Transaction by ID */
const getTransactionById = asyncHandler(async (req, res, next) => {
  const transactionRecord = await TransactionModel.findByPk(req.params.id, {
    include: [
      { model: LoanModel, as: "loan", attributes: ["id", "amount", "status"] },
      {
        model: CustomerModel,
        as: "customer",
        attributes: ["id", "firstName", "lastName", "mobileNumber"],
      },
    ],
  });

  if (!transactionRecord)
    return next(new ApiError(404, responseMessage.notFound("Transaction")));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transactionRecord,
        responseMessage.fetched("Transaction")
      )
    );
});

/** Update Transaction (adjust next EMI dynamically when amount changes) */
const updateTransaction = asyncHandler(async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    let {
      customerId,
      amount,
      transactionType,
      paymentMode,
      transactionDate,
      description,
      perDayLateCharge,
    } = req.body;

    transactionDate = new Date(transactionDate);

    // Find existing transaction
    const transactionRecord = await TransactionModel.findByPk(req.params.id, {
      transaction: t,
    });

    if (!transactionRecord) {
      await t.rollback();
      return next(new ApiError(404, "Transaction not found"));
    }

    // Prevent updating Disbursement transactions
    if (transactionRecord.transactionType === "Disbursement") {
      await t.rollback();
      return next(
        new ApiError(400, "Cannot update a Disbursement transaction")
      );
    }

    //  Validate customer
    const customer = await CustomerModel.findByPk(customerId, {
      transaction: t,
    });
    if (!customer) {
      await t.rollback();
      return next(new ApiError(404, "Customer not found"));
    }

    //  Find active loan
    const activeLoan = await LoanModel.findOne({
      where: {
        id: transactionRecord?.loanId,
        status: "Active",
        isActive: true,
      },
      transaction: t,
    });

    if (!activeLoan) {
      await t.rollback();
      return next(new ApiError(404, "No active loan found for this customer"));
    }

    const loanId = activeLoan.id;

    // ===== Late EMI Calculation =====
    let lateEMIDays = 0;
    let lateEMICharges = 0;

    if (transactionType === "Repayment" && activeLoan.installmentDate) {
      const installmentDate = new Date(activeLoan.installmentDate);
      if (transactionDate > installmentDate) {
        const diffTime = transactionDate - installmentDate;
        lateEMIDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        lateEMICharges = (
          lateEMIDays * parseFloat(perDayLateCharge || 0)
        ).toFixed(2);
      }
    }

    //  Store old amount before update
    const oldAmount = parseFloat(transactionRecord.amount || 0);
    const newAmount = parseFloat(amount || 0);

    //  Update the transaction itself
    await transactionRecord.update(
      {
        customerId,
        amount: newAmount,
        transactionType,
        paymentMode,
        transactionDate,
        description,
        lateEMIDays,
        lateEMICharges,
      },
      { transaction: t }
    );

    //  If it's repayment, adjust next EMI dynamically
    if (transactionType === "Repayment") {
      const loanToUpdate = await LoanModel.findByPk(loanId, { transaction: t });

      // Core Logic:
      // nextEmiAmount = (old nextEmiAmount + oldAmount) - newAmount
      let nextEmiAmount =
        parseFloat(loanToUpdate.nextEmiAmount || 0) + oldAmount - newAmount;

      if (nextEmiAmount < 0) nextEmiAmount = 0;

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
      const principal = parseFloat(loanToUpdate.amount || 0);
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

      await loanToUpdate.update(
        {
          nextEmiAmount: nextEmiAmount.toFixed(2),
          profitAmount,
          lossAmount,
        },
        { transaction: t }
      );
    }

    await t.commit();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transactionRecord,
          "Transaction updated successfully"
        )
      );
  } catch (err) {
    await t.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Delete Transaction */
const deleteTransaction = asyncHandler(async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const transactionRecord = await TransactionModel.findByPk(req.params.id, {
      transaction: t,
    });
    if (!transactionRecord) {
      await t.rollback();
      return next(new ApiError(404, responseMessage.notFound("Transaction")));
    }

    await transactionRecord.destroy({ transaction: t });
    await t.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("Transaction")));
  } catch (err) {
    await t.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
