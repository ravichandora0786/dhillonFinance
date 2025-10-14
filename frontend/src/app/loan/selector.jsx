/**
 * CustomerLoan selector
 * @format
 */

const customerLoanSelector = (state) => state.customerLoanReducer;

export const selectCustomerLoanPagination = (state) =>
  customerLoanSelector(state).pagination;
export const selectAllCustomerLoanList = (state) =>
  customerLoanSelector(state).allCustomerLoanList;
export const selectCustomerLoanData = (state) =>
  customerLoanSelector(state).customerLoanData;
export const selectCustomerLoanSearchData = (state) =>
  customerLoanSelector(state).customerLoanSearchData;
export const selectCustomerLoanOptions = (state) =>
  customerLoanSelector(state).customerLoanOptions;
export const selectCustomerLoanId = (state) =>
  customerLoanSelector(state).customerLoanId;
export const selectUpcommingEmiList = (state) =>
  customerLoanSelector(state).upcommingEmiList;
