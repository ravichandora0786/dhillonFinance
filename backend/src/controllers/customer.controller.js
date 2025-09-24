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
import {
  checkImageUrlExpired,
  s3getUploadedFile,
} from "../services/aws/s3.config.js";

/**
 * Refresh signed URL of a file if expired
 */
const refreshFileUrl = async (fileObj, folderName) => {
  if (!fileObj) return null;
  const isExpired = checkImageUrlExpired(fileObj.image);
  if (isExpired) {
    const newUrl = await s3getUploadedFile(fileObj.fileName, folderName);
    fileObj.image = newUrl;

    // DB update
    if (typeof fileObj.save === "function") {
      await fileObj.save();
    }
  }
  return fileObj;
};

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
              attributes: ["amount", "transactionType", "createdAt"],
              separate: true,
              order: [["createdAt", "DESC"]],
            },
          ],
          separate: true,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [[sortBy, order.toUpperCase()]],
      limit,
      offset,
    });

    // Refresh file URLs for all customers
    await Promise.all(
      customers.rows.map(async (customer) => {
        customer.aadharFile = await refreshFileUrl(
          customer.aadharFile,
          process.env.AADHAR_FOLDER
        );
        customer.panCardFile = await refreshFileUrl(
          customer.panCardFile,
          process.env.PANCARD_FOLDER
        );
        customer.agreementFile = await refreshFileUrl(
          customer.agreementFile,
          process.env.AGREEMENT_FOLDER
        );
        customer.profileFile = await refreshFileUrl(
          customer.profileFile,
          process.env.PROFILE_PIC_FOLDER
        );
      })
    );

    // Map customers with loan/payment stats
    const customerData = customers.rows.map((customer) => {
      const loans = customer.loans || [];

      const loansWithStats = loans.map((loan) => {
        const repaymentsReceived = loan.transactions
          .filter((tx) => tx.transactionType === "Repayment")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const repaymentsPending =
          parseFloat(loan.totalPayableAmount) - repaymentsReceived;

        return {
          ...loan.toJSON(),
          repaymentsReceived,
          repaymentsPending: repaymentsPending >= 0 ? repaymentsPending : 0,
        };
      });

      const totalLoans = loans.length;
      const closedLoans = loans.filter((l) => l.status === "Closed").length;
      const pendingLoans = loans.filter(
        (l) =>
          l.status === "Active" ||
          l.status === "Pending" ||
          l.status === "Defaulted"
      ).length;

      return {
        ...customer.toJSON(),
        totalLoans,
        closedLoans,
        pendingLoans,
        loans: loansWithStats,
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

/** Get Customer by ID with loans/transactions stats */
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
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: TransactionModel,
              as: "transactions",
              attributes: ["amount", "transactionType", "createdAt"],
              separate: true,
              order: [["createdAt", "DESC"]],
            },
          ],
        },
      ],
    });

    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    // Refresh file URLs
    customer.aadharFile = await refreshFileUrl(
      customer.aadharFile,
      process.env.AADHAR_FOLDER
    );
    customer.panCardFile = await refreshFileUrl(
      customer.panCardFile,
      process.env.PANCARD_FOLDER
    );
    customer.agreementFile = await refreshFileUrl(
      customer.agreementFile,
      process.env.AGREEMENT_FOLDER
    );
    customer.profileFile = await refreshFileUrl(
      customer.profileFile,
      process.env.PROFILE_PIC_FOLDER
    );

    const loans = customer.loans || [];

    const loansWithStats = loans.map((loan) => {
      const repaymentsReceived = loan.transactions
        .filter((tx) => tx.transactionType === "Repayment")
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      const repaymentsPending =
        parseFloat(loan.totalPayableAmount) - repaymentsReceived;

      return {
        ...loan.toJSON(),
        repaymentsReceived,
        repaymentsPending: repaymentsPending >= 0 ? repaymentsPending : 0,
      };
    });

    const totalLoans = loans.length;
    const closedLoans = loans.filter((l) => l.status === "Closed").length;
    const pendingLoans = loans.filter(
      (l) =>
        l.status === "Active" ||
        l.status === "Pending" ||
        l.status === "Defaulted"
    ).length;

    const customerWithStats = {
      ...customer.toJSON(),
      totalLoans,
      closedLoans,
      pendingLoans,
      loans: loansWithStats,
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

const getCustomerOptions = asyncHandler(async (req, res, next) => {
  try {
    // Agar search query hai to filter karenge
    const { search = "" } = req.query;

    const searchCondition = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { mobileNumber: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Fetch customers, only required fields
    const customers = await CustomerModel.findAll({
      attributes: ["id", "firstName", "lastName", "mobileNumber"],
      where: searchCondition,
      order: [["firstName", "ASC"]],
    });

    // Map to option format (optional)
    const options = customers.map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      mobileNumber: c.mobileNumber,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          status: "success",
          total: options.length,
          customers: options,
        },
        "Customers fetched successfully"
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

export default {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerOptions,
};
