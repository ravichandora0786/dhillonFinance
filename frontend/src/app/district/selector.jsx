/**
 * District selector
 * @format
 */

const districtSelector = (district) => district.districtReducer;

export const selectDistrictPagination = (district) => districtSelector(district).pagination;
export const selectAllDistrictList = (district) => districtSelector(district).allDistrictList;
export const selectDistrictData = (district) => districtSelector(district).districtData;
export const selectDistrictSearchData = (district) =>
  districtSelector(district).districtSearchData;
export const selectDistrictOptions = (district) => districtSelector(district).districtOptions;
export const selectDistrictId = (district) => districtSelector(district).districtId;
