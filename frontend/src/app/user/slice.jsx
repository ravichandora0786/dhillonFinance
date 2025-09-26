/**
 * User slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { pageIndex: 0, pageSize: 10 },
  userData: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserPagination(state, action) {
      state.pagination = action.payload;
    },
    setUserDetailData(state, action) {
      state.userData = action.payload;
    },
  },
});

// Reducer
export const userReducer = userSlice.reducer;

// states Actions
export const { setUserPagination, setUserDetailData } = userSlice.actions;

// Api Actions
export const createUser = createAction("CREATE_NEW_USER");
export const updateUser = createAction("UPDATE_USER");
export const updateUserStatus = createAction("UPDATE_USER_STATUS");
export const getAllUsers = createAction("GET_ALL_USERS");
export const getUserDetailById = createAction("GET_USER_DETAIL_BY_ID");
export const deleteUser = createAction("GET_DELETE_USER_BY_ID");
