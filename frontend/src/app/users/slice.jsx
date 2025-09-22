/**
 * User slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: { pageIndex: 0, pageSize: 10 },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserPagination(state, action) {
      state.pagination = action.payload;
    },
  },
});

// Reducer
export const userReducer = userSlice.reducer;

// states Actions
export const { setUserPagination } = userSlice.actions;

// Api Actions
// export const createB2BMeeting = createAction("CREATE_NEW_B2B_MEETING");
