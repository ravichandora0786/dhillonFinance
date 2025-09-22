/**
 * Staff slice
 * @format
 */

const { createSlice, createAction } = require("@reduxjs/toolkit");

const initialState = {
  allStaffList: {},
  staffData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  staffSearchData: { search: "" },
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setAllStaffList(state, action) {
      state.allStaffList = action.payload;
    },
    setStaffData(state, action) {
      state.staffData = action.payload;
    },
    setStaffPagination(state, action) {
      state.pagination = action.payload;
    },
    setStaffSearchData(state, action) {
      state.staffSearchData = action.payload;
    },
  },
});

// Reducer
export const staffReducer = staffSlice.reducer;

// state Actions
export const {
  setAllStaffList,
  setStaffData,
  setStaffPagination,
  setStaffSearchData,
} = staffSlice.actions;

// Apis Actions
export const getAllStaffDataList = createAction("GET_ALL_STAFF_DATA_LIST");
export const createStaff = createAction("CREATE_NEW_STAFF");
export const updateStaff = createAction("UPDATE_STAFF");
export const updateStaffStatus = createAction("UPDATE_STAFF_STATUS");
export const getStaffDetailById = createAction("GET_STAFF_DETAIL_BY_ID");
export const deleteStaff = createAction("DELETE_STAFF_BY_ID");
