/*
 * Associations between models
 */

import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";
import ActivityMasterModel from "./activityMaster.model.js";
import PermissionModel from "./permission.model.js";
import ActivityPermissionModel from "./activityPermission.model.js";
import CountryModel from "./country.model.js";
import DistrictModel from "./district.model.js";
import StateModel from "./state.model.js";
import CustomerModel from "./customer.model.js";
import UploadFileModel from "./uploadFile.model.js";
import LoanModel from "./loan.model.js";

/*
 * =======================
 * User & Role Relations
 * =======================
 */
RoleModel.hasMany(UserModel, { foreignKey: "roleId", as: "users" });
UserModel.belongsTo(RoleModel, { foreignKey: "roleId", as: "role" });

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
});

CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "panCardImage",
  as: "panCardFile",
});

CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "agreementImage",
  as: "agreementFile",
});

CustomerModel.belongsTo(UploadFileModel, {
  foreignKey: "profileImage",
  as: "profileFile",
});

/*
 * =======================
 * Customer & Loan Relations
 * =======================
 */
CustomerModel.hasMany(LoanModel, { foreignKey: "customerId", as: "loans" });
LoanModel.belongsTo(CustomerModel, {
  foreignKey: "customerId",
  as: "customer",
});

/*
 * =======================
 * Export
 * =======================
 */
export {
  UserModel,
  RoleModel,
  ActivityMasterModel,
  PermissionModel,
  ActivityPermissionModel,
  CountryModel,
  DistrictModel,
  StateModel,
  CustomerModel,
  UploadFileModel,
  LoanModel,
};
