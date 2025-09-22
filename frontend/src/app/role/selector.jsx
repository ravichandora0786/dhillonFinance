/**
 * Role selector
 * @format
 */

const roleSelector = (state) => state.roleReducer;

export const selectRolePagination = (state) => roleSelector(state).pagination;
export const selectAllRoleList = (state) => roleSelector(state).allRoleList;
export const selectRoleData = (state) => roleSelector(state).roleData;
export const selectRoleSearchData = (state) =>
  roleSelector(state).roleSearchData;
export const selectRoleId = (state) => roleSelector(state).roleId;
// modules
export const selectAllModuleList = (state) =>
  roleSelector(state).allModuleList;
export const selectModuleSearchData = (state) =>
  roleSelector(state).moduleSearchData;
export const selectModulePagination = (state) =>
  roleSelector(state).modulePagination;
export const selectActivityModuleData = (state) =>
  roleSelector(state).activityModuleData;
export const selectActivityPermissionData = (state) =>
  roleSelector(state).activityPermissionData;
