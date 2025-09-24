/**
 * Transaction slice
 * @format
 */

import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  allTransactionList: {},
  transactionData: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  transactionSearchData: { name: "" },
  transactionOptions: [],
  transactionId: "",
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionPagination(transaction, action) {
      transaction.pagination = action.payload;
    },
    setAllTransactionList(transaction, action) {
      transaction.allTransactionList = action.payload;
    },
    setTransactionData(transaction, action) {
      transaction.transactionData = action.payload;
    },
    setTransactionSearchData(transaction, action) {
      transaction.transactionSearchData = action.payload;
    },
    setTransactionOptions(transaction, action) {
      transaction.transactionOptions = action.payload;
    },
    setTransactionId(transaction, action) {
      transaction.transactionId = action.payload;
    },
  },
});

// Reducer
export const transactionReducer = transactionSlice.reducer;

// transactions Actions
export const {
  setTransactionPagination,
  setAllTransactionList,
  setTransactionData,
  setTransactionSearchData,
  setTransactionId,
  setTransactionOptions,
} = transactionSlice.actions;

// Api Actions
export const createTransaction = createAction("CREATE_NEW_TRANSACTION");
export const updateTransaction = createAction("UPDATE_TRANSACTION");
export const updateTransactionStatus = createAction(
  "UPDATE_TRANSACTION_STATUS"
);
export const getAllTransactions = createAction("GET_ALL_TRANSACTIONS");
export const getTransactionDetailById = createAction(
  "GET_TRANSACTION_DETAIL_BY_ID"
);
export const deleteTransaction = createAction("GET_DELETE_TRANSACTION_BY_ID");
