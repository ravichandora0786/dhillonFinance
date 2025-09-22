/**
 * Staff Selector
 * @format
 */

const staffSelector = (state) => state.staffReducer;

export const selectAllStaffDataList = (state) =>
  staffSelector(state).allStaffList;

export const selectStaffData = (state) =>
  staffSelector(state).staffData;

export const selectStaffPagination = (state) =>
  staffSelector(state).pagination;

export const selectStaffSearchData = (state) =>
  staffSelector(state).staffSearchData;
