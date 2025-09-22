/**
 * Common selectors
 * @format
 */

const common = (state) => state.common;

export const selectUser = (state) => common(state).user;
export const selectAccessToken = (state) => common(state).accessToken;
export const selectRolePermissionsMap = (state) =>
  common(state).rolePermissionsMap;
export const selectClassOptions = (state) => common(state).classOptions;
export const selectSectionOptions = (state) => common(state).sectionOptions;
export const selectSubjectOptions = (state) => common(state).subjectOptions;
export const selectRoomOptions = (state) => common(state).roomOptions;
export const selectSchoolYearOptions = (state) =>
  common(state).schoolYearOptions;
export const selectCountryOptions = (state) => common(state).countryOptions;
