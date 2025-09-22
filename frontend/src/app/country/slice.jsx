/**
 * Country slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCountryList: {},
  countryData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  countrySearchData: { name: "" },
  countryId: "",
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setCountryPagination(state, action) {
      state.pagination = action.payload;
    },
    setAllCountryList(state, action) {
      state.allCountryList = action.payload;
    },
    setCountryData(state, action) {
      state.countryData = action.payload;
    },
    setCountrySearchData(state, action) {
      state.countrySearchData = action.payload;
    },
    setCountryId(state, action) {
      state.countryId = action.payload;
    },
  },
});

// Reducer
export const countryReducer = countrySlice.reducer;

// states Actions
export const {
  setCountryPagination,
  setAllCountryList,
  setCountryData,
  setCountrySearchData,
  setCountryId,
} = countrySlice.actions;

// Api Actions
export const createCountry = createAction("CREATE_NEW_COUNTRY");
export const updateCountry = createAction("UPDATE_COUNTRY");
export const updateCountryStatus = createAction("UPDATE_COUNTRY_STATUS");
export const getAllCountrys = createAction("GET_ALL_COUNTRYS");
export const getCountryDetailById = createAction("GET_COUNTRY_DETAIL_BY_ID");
export const deleteCountry = createAction("GET_DELETE_COUNTRY_BY_ID");
