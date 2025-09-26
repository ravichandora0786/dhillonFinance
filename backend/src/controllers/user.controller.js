import sequelize from "../config/db.js";
import UserModel from "../models/user.model.js";
import RoleModel from "../models/role.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import { Op } from "sequelize";
import {
  checkImageUrlExpired,
  s3getUploadedFile,
} from "../services/aws/s3.config.js";
import UploadFileModel from "../models/uploadFile.model.js";

/**
 * Refresh signed URL of a file if expired
 */
const refreshFileUrl = async (fileObj, folderName) => {
  if (!fileObj) return null;
  const isExpired = checkImageUrlExpired(fileObj.image);
  if (isExpired) {
    const newUrl = await s3getUploadedFile(fileObj.fileName, folderName);
    fileObj.image = newUrl;
    if (typeof fileObj.save === "function") await fileObj.save();
  }
  return fileObj;
};

/** Create User */
const createUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { userName, email, mobileNumber, password, roleId, profileImage } =
      req.body;

    // role check
    const role = await RoleModel.findByPk(roleId);
    if (!role) return next(new ApiError(400, "Invalid roleId"));

    // check duplicate email or mobile
    const existing = await UserModel.findOne({
      where: { [Op.or]: [{ email }, { mobileNumber }] },
    });
    if (existing)
      return next(new ApiError(400, "Email or Mobile already exists"));

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await UserModel.create(
      {
        userName,
        email,
        mobileNumber,
        password: hashedPassword,
        roleId,
        profileImage,
      },
      { transaction }
    );

    // Refresh profileImage URL if uploaded
    if (user.profileImage) {
      await refreshFileUrl(user.profileImage, process.env.PROFILE_PIC_FOLDER);
    }

    await transaction.commit();
    return res
      .status(201)
      .json(new ApiResponse(201, user, responseMessage.created("User")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Get all users */
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await UserModel.findAll({
      include: [
        { model: RoleModel, as: "role", attributes: ["id", "name"] },
        { model: UploadFileModel, as: "profileFile" },
      ],
    });

    // Refresh profile images
    await Promise.all(
      users.map(async (user) => {
        if (user.profileImage) {
          user.profileImage = await refreshFileUrl(
            user.profileImage,
            process.env.PROFILE_PIC_FOLDER
          );
        }
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, users, responseMessage.fetched("Users")));
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Get user by ID */
const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const user = await UserModel.findByPk(req.params.id, {
      include: [
        { model: RoleModel, as: "role", attributes: ["id", "name"] },
        { model: UploadFileModel, as: "profileFile" },
      ],
    });

    if (!user) return next(new ApiError(404, responseMessage.notFound("User")));

    if (user.profileImage) {
      user.profileImage = await refreshFileUrl(
        user.profileImage,
        process.env.PROFILE_PIC_FOLDER
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, responseMessage.fetched("User")));
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Update User */
const updateUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) return next(new ApiError(404, responseMessage.notFound("User")));

    const { password, ...rest } = req.body;

    if (password) rest.password = await bcrypt.hash(password, 10);

    await user.update(rest, { transaction });

    // Refresh profileImage URL if updated
    if (user.profileImage) {
      user.profileImage = await refreshFileUrl(
        user.profileImage,
        process.env.PROFILE_PIC_FOLDER
      );
    }

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, user, responseMessage.updated("User")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Delete User */
const deleteUser = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) return next(new ApiError(404, responseMessage.notFound("User")));

    await user.destroy({ force: true, transaction });
    await transaction.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("User")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
