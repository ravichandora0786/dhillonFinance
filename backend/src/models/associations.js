// src/models/index.js
import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";
import ActivityMasterModel from "./activityMaster.model.js";
import PermissionModel from "./permission.model.js";
import ActivityPermissionModel from "./activityPermission.model.js";
import CountryModel from "./country.model.js";
import DistrictModel from "./district.model.js";
import StateModel from "./state.model.js";

// =======================
// User & Role Relations
// =======================
RoleModel.hasMany(UserModel, { foreignKey: "roleId", as: "users" });
UserModel.belongsTo(RoleModel, { foreignKey: "roleId", as: "role" });

// =======================
// Role & ActivityPermission Relations
// =======================
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

// =======================
// Export
// =======================
export {
  UserModel,
  RoleModel,
  ActivityMasterModel,
  PermissionModel,
  ActivityPermissionModel,
  CountryModel,
  DistrictModel,
  StateModel,
};
