/**
 * Role slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allRoleList: {},
  roleData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  roleSearchData: { name: "" },
  roleId: "",
  //modules
  allModuleList: {},
  modulePagination: { pageIndex: 0, pageSize: 10 },
  moduleSearchData: { name: "" },
  activityModuleData: {},
  activityPermissionData: {},
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRolePagination(state, action) {
      state.pagination = action.payload;
    },
    setAllRoleList(state, action) {
      state.allRoleList = action.payload;
    },
    setRoleData(state, action) {
      state.roleData = action.payload;
    },
    setRoleSearchData(state, action) {
      state.roleSearchData = action.payload;
    },
    setRoleId(state, action) {
      state.roleId = action.payload;
    },
    //modules
    setAllModuleList(state, action) {
      state.allModuleList = action.payload;
    },
    setModulePagination(state, action) {
      state.modulePagination = action.payload;
    },
    setModuleSearchData(state, action) {
      state.moduleSearchData = action.payload;
    },
    setActivityModuleData(state, action) {
      state.activityModuleData = action.payload;
    },
    setActivityPermissionData(state, action) {
      state.activityPermissionData = action.payload;
    },
  },
});

// Reducer
export const roleReducer = roleSlice.reducer;

// states Actions
export const {
  setRolePagination,
  setAllRoleList,
  setRoleData,
  setRoleSearchData,
  setRoleId,
  // module
  setAllModuleList,
  setModulePagination,
  setModuleSearchData,
  setActivityModuleData,
  setActivityPermissionData,
} = roleSlice.actions;

// Api Actions
export const createRole = createAction("CREATE_NEW_ROLE");
export const updateRole = createAction("UPDATE_ROLE");
export const updateRoleStatus = createAction("UPDATE_ROLE_STATUS");
export const getAllRoles = createAction("GET_ALL_ROLES");
export const getRoleDetailById = createAction("GET_ROLE_DETAIL_BY_ID");
export const deleteRole = createAction("GET_DELETE_ROLE_BY_ID");
//permissions

export const getActivityPermissionsByRoleId = createAction(
  "GET_ACTIVITY_PERMISSIONS_BY_ROLE_ID"
);
export const createORupdateActivityPermission = createAction(
  "CREATE_UPDATE_ACTIVITY_PERMISSIONS"
);
