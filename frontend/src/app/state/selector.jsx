/**
 * State selector
 * @format
 */

const stateSelector = (state) => state.stateReducer;

export const selectStatePagination = (state) => stateSelector(state).pagination;
export const selectAllStateList = (state) => stateSelector(state).allStateList;
export const selectStateData = (state) => stateSelector(state).stateData;
export const selectStateSearchData = (state) =>
  stateSelector(state).stateSearchData;
export const selectStateOptions = (state) => stateSelector(state).stateOptions;
export const selectStateId = (state) => stateSelector(state).stateId;
