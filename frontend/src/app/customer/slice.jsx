/**
 * Customer slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCustomerList: {},
  customerData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  customerSearchData: { search: "" },
  customerOptions: [],
  customerId: "",
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerPagination(customer, action) {
      customer.pagination = action.payload;
    },
    setAllCustomerList(customer, action) {
      customer.allCustomerList = action.payload;
    },
    setCustomerData(customer, action) {
      customer.customerData = action.payload;
    },
    setCustomerSearchData(customer, action) {
      customer.customerSearchData = action.payload;
    },
    setCustomerOptions(customer, action) {
      customer.customerOptions = action.payload;
    },
    setCustomerId(customer, action) {
      customer.customerId = action.payload;
    },
  },
});

// Reducer
export const customerReducer = customerSlice.reducer;

// customers Actions
export const {
  setCustomerPagination,
  setAllCustomerList,
  setCustomerData,
  setCustomerSearchData,
  setCustomerId,
  setCustomerOptions,
} = customerSlice.actions;

// Api Actions
export const createCustomer = createAction("CREATE_NEW_CUSTOMER");
export const updateCustomer = createAction("UPDATE_CUSTOMER");
export const updateCustomerStatus = createAction("UPDATE_CUSTOMER_STATUS");
export const getAllCustomers = createAction("GET_ALL_CUSTOMERS");
export const getCustomerDetailById = createAction("GET_CUSTOMER_DETAIL_BY_ID");
export const deleteCustomer = createAction("GET_DELETE_CUSTOMER_BY_ID");
export const getCustomerListForOptions = createAction(
  "GET_ALL_CUSTOMER_LIST_FOR_OPTIONS"
);
