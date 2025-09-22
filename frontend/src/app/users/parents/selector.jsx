/**
 * Parent Selector
 * @format
 */

const parentSelector = (state) => state.parentReducer;

export const selectAllParentDataList = (state) =>
  parentSelector(state).allParentList;

export const selectParentData = (state) =>
  parentSelector(state).parentData;

export const selectParentPagination = (state) =>
  parentSelector(state).pagination;

export const selectParentSearchData = (state) =>
  parentSelector(state).parentSearchData;
