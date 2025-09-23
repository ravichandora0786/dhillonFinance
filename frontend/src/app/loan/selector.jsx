/**
 * CustomerLoan selector
 * @format
 */

const customerLoanSelector = (customerLoan) => customerLoan.customerLoanReducer;

export const selectCustomerLoanPagination = (customerLoan) =>
  customerLoanSelector(customerLoan).pagination;
export const selectAllCustomerLoanList = (customerLoan) =>
  customerLoanSelector(customerLoan).allCustomerLoanList;
export const selectCustomerLoanData = (customerLoan) =>
  customerLoanSelector(customerLoan).customerLoanData;
export const selectCustomerLoanSearchData = (customerLoan) =>
  customerLoanSelector(customerLoan).customerLoanSearchData;
export const selectCustomerLoanOptions = (customerLoan) =>
  customerLoanSelector(customerLoan).customerLoanOptions;
export const selectCustomerLoanId = (customerLoan) =>
  customerLoanSelector(customerLoan).customerLoanId;
