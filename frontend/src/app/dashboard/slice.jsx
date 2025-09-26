/**
 * Dashboard slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: {},
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData(state, action) {
      state.dashboardData = action.payload;
    },
  },
});

// Reducer
export const dashboardReducer = dashboardSlice.reducer;

// Actions
export const { setDashboardData } = dashboardSlice.actions;

// Other Actions
export const getDashboardData = createAction("GET_ALL_DASHBOARD_DATA");
