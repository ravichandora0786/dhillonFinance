/**
 * Permission selector
 * @format
 */

const permissionSelector = (state) => state.permissionReducer;

export const selectPermissionPagination = (state) => permissionSelector(state).pagination;
export const selectAllPermissionList = (state) => permissionSelector(state).allPermissionList;
export const selectPermissionData = (state) => permissionSelector(state).permissionData;
export const selectPermissionSearchData = (state) => permissionSelector(state).permissionSearchData;
