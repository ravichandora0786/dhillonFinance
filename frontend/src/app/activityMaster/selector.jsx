/**
 * ActivityMaster selector
 * @format
 */

const activityMasterSelector = (state) => state.activityMasterReducer;

export const selectActivityMasterPagination = (state) => activityMasterSelector(state).pagination;
export const selectAllActivityMasterList = (state) => activityMasterSelector(state).allActivityMasterList;
export const selectActivityMasterData = (state) => activityMasterSelector(state).activityMasterData;
export const selectActivityMasterSearchData = (state) => activityMasterSelector(state).activityMasterSearchData;
