/**
 * Transaction selector
 * @format
 */

const transactionSelector = (transaction) => transaction.transactionReducer;

export const selectTransactionPagination = (transaction) => transactionSelector(transaction).pagination;
export const selectAllTransactionList = (transaction) => transactionSelector(transaction).allTransactionList;
export const selectTransactionData = (transaction) => transactionSelector(transaction).transactionData;
export const selectTransactionSearchData = (transaction) =>
  transactionSelector(transaction).transactionSearchData;
export const selectTransactionOptions = (transaction) => transactionSelector(transaction).transactionOptions;
export const selectTransactionId = (transaction) => transactionSelector(transaction).transactionId;
