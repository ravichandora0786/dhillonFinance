/**
 * Common selectors
 * @format
 */

const common = (state) => state.common;

export const selectUser = (state) => common(state).user;
export const selectAccessToken = (state) => common(state).accessToken;
export const selectRefreshToken = (state) => common(state).refreshToken;
export const selectRolePermissionsMap = (state) =>
  common(state).rolePermissionsMap;
export const selectCountryOptions = (state) => common(state).countryOptions;
export const selectAllImages = (state) => common(state).allImages;
