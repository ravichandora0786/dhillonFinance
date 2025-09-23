import sequelize from "../config/db.js";
import CustomerModel from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import UploadFileModel from "../models/uploadFile.model.js";

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

/** Get all Customers */
const getCustomers = asyncHandler(async (req, res, next) => {
  try {
    const customers = await CustomerModel.findAll({
      include: [
        { model: UploadFileModel, as: "aadharFile" },
        { model: UploadFileModel, as: "panCardFile" },
        { model: UploadFileModel, as: "agreementFile" },
        { model: UploadFileModel, as: "profileFile" },
      ],
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, customers, responseMessage.fetched("Customers"))
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
      ],
    });
    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));
    return res
      .status(200)
      .json(
        new ApiResponse(200, customer, responseMessage.fetched("Customer"))
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
