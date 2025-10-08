/**
 *  CustomerLoan Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  closeCustomerLoanWithTransaction,
  createCustomerLoan,
  deleteCustomerLoan,
  getAllCustomerLoans,
  getCustomerLoanDetailById,
  setCustomerLoanData,
  updateCustomerLoan,
  updateCustomerLoanStatus,
} from "./slice";

/**
 * Get All CustomerLoan
 * @param {*}
 */
function* getAllCustomerLoanListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.CustomerLoan, {
      params: data,
    });
    yield onSuccess({ message: response?.data?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Get CustomerLoan Details By CustomerLoan Id
 * @param {*}
 */
function* getCustomerLoanDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.get,
      `${endPoints.CustomerLoan}/${id}`
    );

    yield put(setCustomerLoanData(response?.data));
    yield onSuccess({ message: response?.data?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete CustomerLoan By Id
 * @param {*}
 */
function* deleteCustomerLoanByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.CustomerLoan}/${id}`
    );

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New CustomerLoan
 * @param {*}
 */
function* createNewCustomerLoanSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.CustomerLoan, {
      ...data,
    });

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Create failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Update CustomerLoan By Id
 * @param {*}
 */
function* updateCustomerLoansSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.CustomerLoan}/${id}`, {
      ...data,
    });

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * close Customer Loan With Transaction By customerId and loanId
 * @param {*}
 */
function* closeCustomerLoanWithTransactionSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(
      `${endPoints.CustomerLoan}/closeWithTransaction`,
      {
        ...data,
      }
    );

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Update CustomerLoan Status By Id
 * @param {*}
 */
function* updateCustomerLoanStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.CustomerLoan}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* customerLoanSaga() {
  yield takeLatest(getAllCustomerLoans, getAllCustomerLoanListSaga);
  yield takeLatest(deleteCustomerLoan, deleteCustomerLoanByIdSaga);
  yield takeLatest(getCustomerLoanDetailById, getCustomerLoanDetailByIdSaga);
  yield takeLatest(createCustomerLoan, createNewCustomerLoanSaga);
  yield takeLatest(updateCustomerLoan, updateCustomerLoansSaga);
  yield takeLatest(updateCustomerLoanStatus, updateCustomerLoanStatusSaga);
  yield takeLatest(
    closeCustomerLoanWithTransaction,
    closeCustomerLoanWithTransactionSaga
  );
}
