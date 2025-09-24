import sequelize from "../config/db.js";
import LoanModel from "../models/loan.model.js";
import CustomerModel from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import TransactionModel from "../models/transaction.model.js";

/** Create Loan */
const createLoan = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { customerId } = req.body;

    // Check if customer exists
    const customer = await CustomerModel.findByPk(customerId, { transaction });
    if (!customer) {
      await transaction.rollback();
      return next(new ApiError(404, "Customer not found"));
    }

    // Check if customer already has an active/pending/defaulted loan
    const existingLoan = await LoanModel.findOne({
      where: {
        customerId,
        status: ["Active", "Pending", "Defaulted"], // Closed loans are allowed
        isActive: true,
      },
      transaction,
    });

    if (existingLoan) {
      await transaction.rollback();
      return next(new ApiError(400, "Customer already has an ongoing loan"));
    }

    // Create new loan
    const loan = await LoanModel.create(req.body, { transaction });
    await transaction.commit();

    return res
      .status(201)
      .json(new ApiResponse(201, loan, "Loan created successfully"));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Get all Loans with pagination, sorting, search, status filter, and next/previous flags */
const getLoans = asyncHandler(async (req, res, next) => {
  try {
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

    const whereCondition = {};
    if (status) whereCondition.status = status;
    if (customerId) whereCondition.customerId = customerId;

    if (search) {
      whereCondition[Op.or] = [
        { "$customer.firstName$": { [Op.iLike]: `%${search}%` } },
        { "$customer.lastName$": { [Op.iLike]: `%${search}%` } },
        { "$customer.mobileNumber$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    const loans = await LoanModel.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: CustomerModel,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "mobileNumber"],
        },
        {
          model: TransactionModel,
          as: "transactions",
          attributes: ["amount", "transactionType"], // include type
        },
      ],
      order: [[sortBy, order.toUpperCase()]],
      limit,
      offset,
    });

    // Map loans with paymentsReceived and pendingAmount
    const loanData = loans.rows.map((loan) => {
      // sum of repayments received
      const paymentsReceived = loan.transactions
        .filter((tx) => tx.transactionType === "Repayment")
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      const pendingAmount =
        parseFloat(loan.totalPayableAmount) - paymentsReceived;

      return {
        ...loan.toJSON(),
        paymentsReceived,
        pendingAmount: pendingAmount >= 0 ? pendingAmount : 0, // ensure no negative
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
          attributes: ["id", "firstName", "lastName", "mobileNumber"],
        },
        {
          model: TransactionModel,
          as: "transactions",
          attributes: ["amount", "transactionType"], // include type
        },
      ],
    });

    if (!loan) return next(new ApiError(404, responseMessage.notFound("Loan")));

    // Calculate paymentsReceived and pendingAmount
    const paymentsReceived = loan.transactions
      .filter((tx) => tx.transactionType === "Repayment")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const pendingAmount =
      parseFloat(loan.totalPayableAmount) - paymentsReceived;

    const loanWithPayments = {
      ...loan.toJSON(),
      paymentsReceived,
      pendingAmount: pendingAmount >= 0 ? pendingAmount : 0,
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
  const transaction = await sequelize.transaction();
  try {
    const loan = await LoanModel.findByPk(req.params.id, { transaction });
    if (!loan) return next(new ApiError(404, responseMessage.notFound("Loan")));

    await loan.update(req.body, { transaction });
    await transaction.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, loan, responseMessage.updated("Loan")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Delete Loan */
const deleteLoan = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await LoanModel.findByPk(req.params.id, { transaction });
    if (!loan) return next(new ApiError(404, responseMessage.notFound("Loan")));

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

export default {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
};
