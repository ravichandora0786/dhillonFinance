/**
 * State slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allStateList: {},
  stateData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  stateSearchData: { name: "" },
  stateOptions: [],
  stateId: "",
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setStatePagination(state, action) {
      state.pagination = action.payload;
    },
    setAllStateList(state, action) {
      state.allStateList = action.payload;
    },
    setStateData(state, action) {
      state.stateData = action.payload;
    },
    setStateSearchData(state, action) {
      state.stateSearchData = action.payload;
    },
    setStateOptions(state, action) {
      state.stateOptions = action.payload;
    },
    setStateId(state, action) {
      state.stateId = action.payload;
    },
  },
});

// Reducer
export const stateReducer = stateSlice.reducer;

// states Actions
export const {
  setStatePagination,
  setAllStateList,
  setStateData,
  setStateSearchData,
  setStateId,
  setStateOptions,
} = stateSlice.actions;

// Api Actions
export const createState = createAction("CREATE_NEW_STATE");
export const updateState = createAction("UPDATE_STATE");
export const updateStateStatus = createAction("UPDATE_STATE_STATUS");
export const getAllStates = createAction("GET_ALL_STATES");
export const getStateDetailById = createAction("GET_STATE_DETAIL_BY_ID");
export const deleteState = createAction("GET_DELETE_STATE_BY_ID");
