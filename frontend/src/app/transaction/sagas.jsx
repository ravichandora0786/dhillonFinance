/**
 *  Transaction Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionDetailById,
  setAllTransactionList,
  setTransactionData,
  updateTransaction,
  updateTransactionStatus,
} from "./slice";

/**
 * Get All Transaction
 * @param {*}
 */
function* getAllTransactionListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Transaction, {
      params: data,
    });
    yield put(setAllTransactionList(response?.data));
    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Get Transaction Details By Transaction Id
 * @param {*}
 */
function* getTransactionDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.get,
      `${endPoints.Transaction}/${id}`
    );

    yield put(setTransactionData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Transaction By Id
 * @param {*}
 */
function* deleteTransactionByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.Transaction}/${id}`
    );

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Transaction
 * @param {*}
 */
function* createNewTransactionSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Transaction, {
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
 * Update Transaction By Id
 * @param {*}
 */
function* updateTransactionsSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Transaction}/${id}`, {
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
 * Update Transaction Status By Id
 * @param {*}
 */
function* updateTransactionStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Transaction}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* transactionSaga() {
  yield takeLatest(getAllTransactions, getAllTransactionListSaga);
  yield takeLatest(deleteTransaction, deleteTransactionByIdSaga);
  yield takeLatest(getTransactionDetailById, getTransactionDetailByIdSaga);
  yield takeLatest(createTransaction, createNewTransactionSaga);
  yield takeLatest(updateTransaction, updateTransactionsSaga);
  yield takeLatest(updateTransactionStatus, updateTransactionStatusSaga);
}
