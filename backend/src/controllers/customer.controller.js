import { Op } from "sequelize";
import sequelize from "../config/db.js";
import CustomerModel from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import UploadFileModel from "../models/uploadFile.model.js";
import TransactionModel from "../models/transaction.model.js";
import LoanModel from "../models/loan.model.js";

/** Create Customer */
const createCustomer = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { mobileNumber } = req.body;

    // check duplicate mobile
    const existing = await CustomerModel.findOne({ where: { mobileNumber } });
    if (existing)
      return next(new ApiError(400, "Mobile number already exists"));

    const customer = await CustomerModel.create(req.body, { transaction });
    await transaction.commit();
    return res
      .status(201)
      .json(
        new ApiResponse(201, customer, responseMessage.created("Customer"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Get all Customers with pagination, sorting, search, and next/previous page flags */
const getCustomers = asyncHandler(async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
      search = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const searchCondition = search
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { mobileNumber: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    // Include loans and transactions for stats
    const customers = await CustomerModel.findAndCountAll({
      where: searchCondition,
      include: [
        { model: UploadFileModel, as: "aadharFile" },
        { model: UploadFileModel, as: "panCardFile" },
        { model: UploadFileModel, as: "agreementFile" },
        { model: UploadFileModel, as: "profileFile" },
        {
          model: LoanModel,
          as: "loans",
          include: [
            {
              model: TransactionModel,
              as: "transactions",
              attributes: ["amount", "transactionType"],
            },
          ],
        },
      ],
      order: [[sortBy, order.toUpperCase()]],
      limit,
      offset,
    });

    // Map customers with loan/payment stats
    const customerData = customers.rows.map((customer) => {
      const loans = customer.loans || [];
      const totalLoans = loans.length;
      const closedLoans = loans.filter((l) => l.status === "Closed").length;
      const pendingLoans = loans.filter(
        (l) =>
          l.status === "Active" ||
          l.status === "Pending" ||
          l.status === "Defaulted"
      ).length;

      // Aggregate payments across all loans
      let totalRepaymentsReceived = 0;
      let totalRepaymentsPending = 0;

      loans.forEach((loan) => {
        const repaymentsReceived = loan.transactions
          .filter((tx) => tx.transactionType === "Repayment")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        totalRepaymentsReceived += repaymentsReceived;

        const pendingAmount =
          parseFloat(loan.totalPayableAmount) - repaymentsReceived;
        totalRepaymentsPending += pendingAmount >= 0 ? pendingAmount : 0;
      });

      return {
        ...customer.toJSON(),
        totalLoans,
        closedLoans,
        pendingLoans,
        totalRepaymentsReceived,
        totalRepaymentsPending,
      };
    });

    const totalPages = Math.ceil(customers.count / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total: customers.count,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          customers: customerData,
        },
        responseMessage.fetched("Customers")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Get Customer by ID */
const getCustomerById = asyncHandler(async (req, res, next) => {
  try {
    const customer = await CustomerModel.findByPk(req.params.id, {
      include: [
        { model: UploadFileModel, as: "aadharFile" },
        { model: UploadFileModel, as: "panCardFile" },
        { model: UploadFileModel, as: "agreementFile" },
        { model: UploadFileModel, as: "profileFile" },
        {
          model: LoanModel,
          as: "loans",
          include: [
            {
              model: TransactionModel,
              as: "transactions",
              attributes: ["amount", "transactionType"],
            },
          ],
        },
      ],
    });

    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    const loans = customer.loans || [];
    const totalLoans = loans.length;
    const closedLoans = loans.filter((l) => l.status === "Closed").length;
    const pendingLoans = loans.filter(
      (l) =>
        l.status === "Active" ||
        l.status === "Pending" ||
        l.status === "Defaulted"
    ).length;

    let totalRepaymentsReceived = 0;
    let totalRepaymentsPending = 0;

    loans.forEach((loan) => {
      const repaymentsReceived = loan.transactions
        .filter((tx) => tx.transactionType === "Repayment")
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      totalRepaymentsReceived += repaymentsReceived;

      const pendingAmount =
        parseFloat(loan.totalPayableAmount) - repaymentsReceived;
      totalRepaymentsPending += pendingAmount >= 0 ? pendingAmount : 0;
    });

    const customerWithStats = {
      ...customer.toJSON(),
      totalLoans,
      closedLoans,
      pendingLoans,
      totalRepaymentsReceived,
      totalRepaymentsPending,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          customerWithStats,
          responseMessage.fetched("Customer")
        )
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Update Customer */
const updateCustomer = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const customer = await CustomerModel.findByPk(req.params.id);
    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    await customer.update(req.body, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(200, customer, responseMessage.updated("Customer"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Delete Customer */
const deleteCustomer = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const customer = await CustomerModel.findByPk(req.params.id);
    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    await customer.destroy({ force: true, transaction });
    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("Customer")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
