/**
 * Student Selector
 * @format
 */

const studentSelector = (state) => state.studentReducer;

export const selectAllStudentDataList = (state) =>
  studentSelector(state).allStudentList;

export const selectStudentData = (state) =>
  studentSelector(state).studentData;

export const selectStudentPagination = (state) =>
  studentSelector(state).pagination;

export const selectStudentSearchData = (state) =>
  studentSelector(state).studentSearchData;
