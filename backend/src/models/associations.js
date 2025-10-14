/*
 * Associations between models
 */

import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";
import ActivityMasterModel from "./activityMaster.model.js";
import PermissionModel from "./permission.model.js";
import ActivityPermissionModel from "./activityPermission.model.js";
import CustomerModel from "./customer.model.js";
import UploadFileModel from "./uploadFile.model.js";
import LoanModel from "./loan.model.js";
import TransactionModel from "./transaction.model.js";

/*
 * =======================
 * User & Role Relations
 * =======================
 */
RoleModel.hasMany(UserModel, { foreignKey: "roleId", as: "users" });
UserModel.belongsTo(RoleModel, { foreignKey: "roleId", as: "role" });

/*
 * =======================
 * User & UploadFile Relation
 * =======================
 */
UserModel.belongsTo(UploadFileModel, {
  foreignKey: "profileImage",
  as: "profileFile",
  onDelete: "SET NULL",
});

/*
 * ==============================
 * Role & ActivityPermission Relations
 * ==============================
 */
RoleModel.hasMany(ActivityPermissionModel, {
  foreignKey: "roleId",
  as: "activityPermissions",
});
ActivityPermissionModel.belongsTo(RoleModel, {
  foreignKey: "roleId",
  as: "role",
});

ActivityMasterModel.hasMany(ActivityPermissionModel, {
  foreignKey: "activityId",
  as: "activityPermissions",
});
ActivityPermissionModel.belongsTo(ActivityMasterModel, {
  foreignKey: "activityId",
  as: "activity",
});

/*
 * =======================
 * Customer & UploadFile Relations
 * =======================
 */
CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "aadharImage",
  as: "aadharFile",
  onDelete: "CASCADE",
});

CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "panCardImage",
  as: "panCardFile",
  onDelete: "CASCADE",
});

CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "agreementImage",
  as: "agreementFile",
  onDelete: "CASCADE",
});

CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "profileImage",
  as: "profileFile",
  onDelete: "CASCADE",
});

CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "otherImage",
  as: "otherFile",
  onDelete: "CASCADE",
});

/*
 * =======================
 * Customer & Loan Relations
 * =======================
 */
CustomerModel.hasMany(LoanModel, {
  foreignKey: "customerId",
  as: "loans",
  onDelete: "CASCADE",
  hooks: true,
});
LoanModel.belongsTo(CustomerModel, {
  foreignKey: "customerId",
  as: "customer",
});

/*
 * =======================
 * Customer & Transaction Relations
 * =======================
 */
CustomerModel.hasMany(TransactionModel, {
  foreignKey: "customerId",
  as: "transactions",
  onDelete: "CASCADE",
  hooks: true,
});
TransactionModel.belongsTo(CustomerModel, {
  foreignKey: "customerId",
  as: "customer",
});

/*
 * =======================
 * Loan & Transaction Relations
 * =======================
 */
LoanModel.hasMany(TransactionModel, {
  foreignKey: "loanId",
  as: "transactions",
  onDelete: "CASCADE",
  hooks: true,
});
TransactionModel.belongsTo(LoanModel, {
  foreignKey: "loanId",
  as: "loan",
});

/*
 * =======================
 * Export All Models
 * =======================
 */
export {
  UserModel,
  RoleModel,
  ActivityMasterModel,
  PermissionModel,
  ActivityPermissionModel,
  CustomerModel,
  UploadFileModel,
  LoanModel,
  TransactionModel,
};
