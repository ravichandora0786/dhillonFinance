/**
 * Student slice
 * @format
 */

const { createSlice, createAction } = require("@reduxjs/toolkit");

const initialState = {
  allStudentList: {},
  studentData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  studentSearchData: { search: "" },
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setAllStudentList(state, action) {
      state.allStudentList = action.payload;
    },
    setStudentData(state, action) {
      state.studentData = action.payload;
    },
    setStudentPagination(state, action) {
      state.pagination = action.payload;
    },
    setStudentSearchData(state, action) {
      state.studentSearchData = action.payload;
    },
  },
});

// Reducer
export const studentReducer = studentSlice.reducer;

// state Actions
export const {
  setAllStudentList,
  setStudentData,
  setStudentPagination,
  setStudentSearchData,
} = studentSlice.actions;

// Apis Actions
export const getAllStudentDataList = createAction("GET_ALL_STUDENT_DATA_LIST");
export const createStudent = createAction("CREATE_NEW_STUDENT");
export const updateStudent = createAction("UPDATE_STUDENT");
export const updateStudentStatus = createAction("UPDATE_STUDENT_STATUS");
export const getStudentDetailById = createAction("GET_STUDENT_DETAIL_BY_ID");
export const deleteStudent = createAction("DELETE_STUDENT_BY_ID");
