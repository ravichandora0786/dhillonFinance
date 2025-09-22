/**
 * Country selector
 * @format
 */

const countrySelector = (state) => state.countryReducer;

export const selectCountryPagination = (state) =>
  countrySelector(state).pagination;
export const selectAllCountryList = (state) =>
  countrySelector(state).allCountryList;
export const selectCountryData = (state) => countrySelector(state).countryData;
export const selectCountrySearchData = (state) =>
  countrySelector(state).countrySearchData;
export const selectCountryId = (state) => countrySelector(state).countryId;
