/**
 * Customer selector
 * @format
 */

const customerSelector = (customer) => customer.customerReducer;

export const selectCustomerPagination = (customer) =>
  customerSelector(customer).pagination;
export const selectAllCustomerList = (customer) =>
  customerSelector(customer).allCustomerList;
export const selectCustomerData = (customer) =>
  customerSelector(customer).customerData;
export const selectCustomerSearchData = (customer) =>
  customerSelector(customer).customerSearchData;
export const selectCustomerOptions = (customer) =>
  customerSelector(customer).customerOptions;
export const selectCustomerId = (customer) =>
  customerSelector(customer).customerId;
