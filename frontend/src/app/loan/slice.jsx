/**
 * CustomerLoan slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCustomerLoanList: {},
  customerLoanData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  customerLoanSearchData: { name: "" },
  customerLoanOptions: [],
  customerLoanId: "",
};

const customerLoanSlice = createSlice({
  name: "customerLoan",
  initialState,
  reducers: {
    setCustomerLoanPagination(customerLoan, action) {
      customerLoan.pagination = action.payload;
    },
    setAllCustomerLoanList(customerLoan, action) {
      customerLoan.allCustomerLoanList = action.payload;
    },
    setCustomerLoanData(customerLoan, action) {
      customerLoan.customerLoanData = action.payload;
    },
    setCustomerLoanSearchData(customerLoan, action) {
      customerLoan.customerLoanSearchData = action.payload;
    },
    setCustomerLoanOptions(customerLoan, action) {
      customerLoan.customerLoanOptions = action.payload;
    },
    setCustomerLoanId(customerLoan, action) {
      customerLoan.customerLoanId = action.payload;
    },
  },
});

// Reducer
export const customerLoanReducer = customerLoanSlice.reducer;

// customerLoans Actions
export const {
  setCustomerLoanPagination,
  setAllCustomerLoanList,
  setCustomerLoanData,
  setCustomerLoanSearchData,
  setCustomerLoanId,
  setCustomerLoanOptions,
} = customerLoanSlice.actions;

// Api Actions
export const createCustomerLoan = createAction("CREATE_NEW_LOAN");
export const updateCustomerLoan = createAction("UPDATE_LOAN");
export const updateCustomerLoanStatus = createAction("UPDATE_LOAN_STATUS");
export const getAllCustomerLoans = createAction("GET_ALL_LOANS");
export const getCustomerLoanDetailById = createAction("GET_LOAN_DETAIL_BY_ID");
export const deleteCustomerLoan = createAction("GET_DELETE_LOAN_BY_ID");
export const closeCustomerLoanWithTransaction = createAction(
  "CLOSE_LOAN_WITH_TRANSACTION"
);
