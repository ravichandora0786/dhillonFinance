/**
 * District slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDistrictList: {},
  districtData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  districtSearchData: { name: "" },
  districtOptions: [],
  districtId: "",
};

const districtSlice = createSlice({
  name: "district",
  initialState,
  reducers: {
    setDistrictPagination(district, action) {
      district.pagination = action.payload;
    },
    setAllDistrictList(district, action) {
      district.allDistrictList = action.payload;
    },
    setDistrictData(district, action) {
      district.districtData = action.payload;
    },
    setDistrictSearchData(district, action) {
      district.districtSearchData = action.payload;
    },
    setDistrictOptions(district, action) {
      district.districtOptions = action.payload;
    },
    setDistrictId(district, action) {
      district.districtId = action.payload;
    },
  },
});

// Reducer
export const districtReducer = districtSlice.reducer;

// districts Actions
export const {
  setDistrictPagination,
  setAllDistrictList,
  setDistrictData,
  setDistrictSearchData,
  setDistrictId,
  setDistrictOptions,
} = districtSlice.actions;

// Api Actions
export const createDistrict = createAction("CREATE_NEW_DISTRICT");
export const updateDistrict = createAction("UPDATE_DISTRICT");
export const updateDistrictStatus = createAction("UPDATE_DISTRICT_STATUS");
export const getAllDistricts = createAction("GET_ALL_DISTRICTS");
export const getDistrictDetailById = createAction("GET_DISTRICT_DETAIL_BY_ID");
export const deleteDistrict = createAction("GET_DELETE_DISTRICT_BY_ID");
