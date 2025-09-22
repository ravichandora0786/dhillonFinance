/**
 * User selector
 * @format
 */

const userSelector = (state) => state.userReducer;

export const selectUserPagination = (state) => userSelector(state).pagination;
