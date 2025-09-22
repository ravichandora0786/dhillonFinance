/**
 * Permission slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPermissionList: {},
  permissionData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  permissionSearchData: { name: "" },
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissionPagination(state, action) {
      state.pagination = action.payload;
    },
    setAllPermissionList(state, action) {
      state.allPermissionList = action.payload;
    },
    setPermissionData(state, action) {
      state.permissionData = action.payload;
    },
    setPermissionSearchData(state, action) {
      state.permissionSearchData = action.payload;
    },
  },
});

// Reducer
export const permissionReducer = permissionSlice.reducer;

// states Actions
export const {
  setPermissionPagination,
  setAllPermissionList,
  setPermissionData,
  setPermissionSearchData,
} = permissionSlice.actions;

// Api Actions
export const createPermission = createAction("CREATE_NEW_PERMISSION");
export const updatePermission = createAction("UPDATE_PERMISSION");
export const updatePermissionStatus = createAction("UPDATE_PERMISSION_STATUS");
export const getAllPermissions = createAction("GET_ALL_PERMISSIONS");
export const getPermissionDetailById = createAction(
  "GET_PERMISSION_DETAIL_BY_ID"
);
export const deletePermission = createAction("GET_DELETE_PERMISSION_BY_ID");
