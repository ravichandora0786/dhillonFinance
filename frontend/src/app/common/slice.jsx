/**
 * Common slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  accessToken: null,
  refreshToken: null,
  rolePermissionsMap: [],
  countryOptions: [],
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },

    setRolePermissionsMap(state, action) {
      state.rolePermissionsMap = action.payload;
    },
    setCountryOptions(state, action) {
      state.countryOptions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutApp, () => {
      return initialState;
    });
  },
});

// Reducer
export const commonReducer = commonSlice.reducer;

// Actions
export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setRolePermissionsMap,
  setCountryOptions,
} = commonSlice.actions;

// Other Actions
export const loginApp = createAction("COMMON/LOGIN");
export const logoutApp = createAction("COMMON/LOGOUT");
export const getAllDistrict = createAction("COMMON/GETALLDISTRICT");
export const getAllState = createAction("COMMON/GETALLSTATE");

export const imageUpload = createAction("COMMON/IMAGE_UPLOAD");
export const getUploadedFile = createAction("COMMON/GET_UPLOADED_FILE");
export const getPermissionsByRoleId = createAction(
  "COMMON/GET_PERMISSIONS_BY_ROLE_ID"
);
