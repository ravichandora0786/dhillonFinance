/**
 * ActivityMaster slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allActivityMasterList: {},
  activityMasterData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  activityMasterSearchData: { name: "" },
};

const activityMasterSlice = createSlice({
  name: "activityMaster",
  initialState,
  reducers: {
    setActivityMasterPagination(state, action) {
      state.pagination = action.payload;
    },
    setAllActivityMasterList(state, action) {
      state.allActivityMasterList = action.payload;
    },
    setActivityMasterData(state, action) {
      state.activityMasterData = action.payload;
    },
    setActivityMasterSearchData(state, action) {
      state.activityMasterSearchData = action.payload;
    },
  },
});

// Reducer
export const activityMasterReducer = activityMasterSlice.reducer;

// states Actions
export const {
  setActivityMasterPagination,
  setAllActivityMasterList,
  setActivityMasterData,
  setActivityMasterSearchData,
} = activityMasterSlice.actions;

// Api Actions
export const createActivityMaster = createAction("CREATE_NEW_ACTIVITY");
export const updateActivityMaster = createAction("UPDATE_ACTIVITY");
export const updateActivityMasterStatus = createAction(
  "UPDATE_ACTIVITY_STATUS"
);
export const getAllActivityMasters = createAction("GET_ALL_ACTIVITYS");
export const getActivityMasterDetailById = createAction(
  "GET_ACTIVITY_DETAIL_BY_ID"
);
export const deleteActivityMaster = createAction("GET_DELETE_ACTIVITY_BY_ID");
