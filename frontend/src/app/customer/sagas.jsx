/**
 *  Customer Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerDetailById,
  getCustomerListForOptions,
  setCustomerData,
  updateCustomer,
  updateCustomerStatus,
} from "./slice";

/**
 * Get All Customer
 * @param {*}
 */
function* getAllCustomerListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Customer, {
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
 * Get Customer Details By Customer Id
 * @param {*}
 */
function* getCustomerDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.Customer}/${id}`);

    yield put(setCustomerData(response?.data));
    yield onSuccess({ message: response?.data?.message, data: response.data });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Customer By Id
 * @param {*}
 */
function* deleteCustomerByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.Customer}/${id}`
    );

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Customer
 * @param {*}
 */
function* createNewCustomerSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Customer, {
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
 * Update Customer By Id
 * @param {*}
 */
function* updateCustomersSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Customer}/${id}`, {
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
 * Update Customer Status By Id
 * @param {*}
 */
function* updateCustomerStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Customer}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Get All Customer List for Options
 * @param {*}
 */
function* getCustomerListForOptionsSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(`${endPoints.Customer}/options`, {
      params: data,
    });
    yield onSuccess({ message: response?.data?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* customerSaga() {
  yield takeLatest(getAllCustomers, getAllCustomerListSaga);
  yield takeLatest(deleteCustomer, deleteCustomerByIdSaga);
  yield takeLatest(getCustomerDetailById, getCustomerDetailByIdSaga);
  yield takeLatest(createCustomer, createNewCustomerSaga);
  yield takeLatest(updateCustomer, updateCustomersSaga);
  yield takeLatest(updateCustomerStatus, updateCustomerStatusSaga);
  yield takeLatest(getCustomerListForOptions, getCustomerListForOptionsSaga);
}
