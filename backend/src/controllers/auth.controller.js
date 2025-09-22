/**
 * auth Controller
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sequelize from "../config/db.js";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import sendMail from "../services/mail.service.js";
import RoleModel from "../models/role.model.js";
import { generateVerificationToken } from "../utils/verificationToken.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import ActivityPermissionModel from "../models/activityPermission.model.js";
import PermissionModel from "../models/permission.model.js";
import ActivityMasterModel from "../models/activityMaster.model.js";
import { encryptData } from "../utils/encryptDecrypt.js";

export const BASE_URL = process.env.BASE_URL;

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      roles: user.role?.name,
    },
    process.env.JWT_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN_TIME }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN_TIME }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify User
 */
const verifyUser = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  try {
    const { id } = jwt.verify(token, process.env.JWT_VERIFY_SECRET_KEY);

    await UserModel.update(
      { isVerified: true, updatedAt: Date.now() },
      {
        where: { id },
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User verified successfully"));
  } catch (error) {
    throw new ApiError(401, "Link is invalid or expired");
  }
});

/**
 * Login User
 */
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.scope("withPassword").findOne({
      where: { email },
      include: [
        {
          model: RoleModel,
          attributes: ["id", "name"],
          as: "role",
        },
      ],
    });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isActive) {
      throw new ApiError(401, "User is not active");
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // 1. Fetch raw activity-permission records with role and activity info
    const activityPermsRaw = await ActivityPermissionModel.findAll({
      where: { roleId: user.roleId },
      include: [
        { model: RoleModel, as: "role", attributes: ["id", "name"] },
        {
          model: ActivityMasterModel,
          as: "activity",
          attributes: ["id", "name"],
        },
      ],
      raw: true,
      nest: true,
    });

    // 2. Aggregate all permission ID arrays into a unique list
    const allPermissionIds = activityPermsRaw.flatMap((item) =>
      Array.isArray(item.permissionIds) ? item.permissionIds : []
    );
    const uniquePermissionIds = [...new Set(allPermissionIds)];

    // 3. Fetch permission records from permission master table
    const permissionRecords = await PermissionModel.findAll({
      where: { id: uniquePermissionIds },
      attributes: ["id", "name"],
    });

    // 4. Build a lookup map: permission ID → permission name
    const idToNameMap = {};
    permissionRecords.forEach(({ id, name }) => {
      idToNameMap[id] = name;
    });

    // 5. Transform original array: replace IDs with names
    const enrichedPermissions = activityPermsRaw.map((item) => {
      const permIds = Array.isArray(item.permissionIds)
        ? item.permissionIds
        : [];
      const permissionNames = permIds
        .map((id) => idToNameMap[id])
        .filter(Boolean);

      return {
        id: item.id,
        role: item.role,
        activity: item.activity,
        permissionNames,
      };
    });
    // Generate JWT token
    const token = generateToken(user);
    //TODO: remove this
    console.log({ token });

    // Save token in the database
    user.refreshToken = token.refreshToken;
    await user.save();

    // Convert user model to plain object and exclude sensitive fields
    const userPlain = user.get({ plain: true });
    delete userPlain.password; // Remove password
    delete userPlain.refreshToken; // Remove refreshToken
    const data = encryptData({
      token,
      user: userPlain,
      permissions: enrichedPermissions,
    });

    return res.status(200).json(new ApiResponse(200, data, "Login successful"));
  } catch (err) {
    next(err);
  }
});

/**
 * Forgot Password
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({
    where: { email, isVerified: true },
  });

  if (!user) {
    throw new ApiError(400, "Invalid Email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Reset Password email sent successfully"));
});

/**
 * Reset Password
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const { id } = jwt.verify(token, process.env.JWT_VERIFY_SECRET_KEY);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.update(
      {
        password: hashedPassword,
        updatedAt: Date.now(),
        refreshToken: null,
      },
      {
        where: { id },
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successfully"));
  } catch (error) {
    throw new ApiError(401, "Link is invalid or expired");
  }
});

/**
 * Refresh Token
 */

const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );

    // User ke sath role bhi fetch kare
    const user = await UserModel.findByPk(decoded.id, {
      include: [
        {
          model: RoleModel,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Generate new access token with roleId and roleName
    const tokens = generateToken(user);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: tokens?.accessToken },
          "Access token refreshed"
        )
      );
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      throw new ApiError(400, "Token is expired");
    }
    next(err);
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, "Token missing in request"));
    }

    // Optional: agar blacklist maintain karna hai
    // await TokenBlacklist.create({ token });

    // Client ko bolenge cookie clear kare ya token ignore kare
    return res
      .status(200)
      .json(new ApiResponse(true, null, "Logout successful"));
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json(new ApiResponse(false, null, "Logout failed"));
  }
});

export default {
  verifyUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  logoutUser,
};
