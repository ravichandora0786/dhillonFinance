/**
 *  Country Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createCountry,
  deleteCountry,
  getAllCountrys,
  getCountryDetailById,
  setCountryData,
  updateCountry,
  updateCountryStatus,
} from "./slice";

/**
 * Get All Country
 * @param {*}
 */
function* getAllCountryListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Country, {
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
 * Get Country Details By Country Id
 * @param {*}
 */
function* getCountryDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.Country}/${id}`);

    yield put(setCountryData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Country By Id
 * @param {*}
 */
function* deleteCountryByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.Country}/${id}`
    );

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Country
 * @param {*}
 */
function* createNewCountrySaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Country, {
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
 * Update Country By Id
 * @param {*}
 */
function* updateCountrysSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Country}/${id}`, {
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
 * Update Country Status By Id
 * @param {*}
 */
function* updateCountryStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Country}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* countrySaga() {
  yield takeLatest(getAllCountrys, getAllCountryListSaga);
  yield takeLatest(deleteCountry, deleteCountryByIdSaga);
  yield takeLatest(getCountryDetailById, getCountryDetailByIdSaga);
  yield takeLatest(createCountry, createNewCountrySaga);
  yield takeLatest(updateCountry, updateCountrysSaga);
  yield takeLatest(updateCountryStatus, updateCountryStatusSaga);
}
