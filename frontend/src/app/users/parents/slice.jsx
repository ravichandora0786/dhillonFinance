/**
 * Parent slice
 * @format
 */

const { createSlice, createAction } = require("@reduxjs/toolkit");

const initialState = {
  allParentList: {},
  parentData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  parentSearchData: { search: "" },
};

const parentSlice = createSlice({
  name: "parent",
  initialState,
  reducers: {
    setAllParentList(state, action) {
      state.allParentList = action.payload;
    },
    setParentData(state, action) {
      state.parentData = action.payload;
    },
    setParentPagination(state, action) {
      state.pagination = action.payload;
    },
    setParentSearchData(state, action) {
      state.parentSearchData = action.payload;
    },
  },
});

// Reducer
export const parentReducer = parentSlice.reducer;

// state Actions
export const {
  setAllParentList,
  setParentData,
  setParentPagination,
  setParentSearchData,
} = parentSlice.actions;

// Apis Actions
export const getAllParentDataList = createAction("GET_ALL_STAFF_DATA_LIST");
export const createParent = createAction("CREATE_NEW_STAFF");
export const updateParent = createAction("UPDATE_STAFF");
export const updateParentStatus = createAction("UPDATE_STAFF_STATUS");
export const getParentDetailById = createAction("GET_STAFF_DETAIL_BY_ID");
export const deleteParent = createAction("DELETE_STAFF_BY_ID");
