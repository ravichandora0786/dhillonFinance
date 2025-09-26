/**
 * User selector
 * @format
 */

const userSelector = (state) => state.userReducer;

export const selectUserDetailData = (state) => userSelector(state).userData;
