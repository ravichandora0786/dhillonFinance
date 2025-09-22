/**
 *  District Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createDistrict,
  deleteDistrict,
  getAllDistricts,
  getDistrictDetailById,
  setDistrictData,
  updateDistrict,
  updateDistrictStatus,
} from "./slice";

/**
 * Get All District
 * @param {*}
 */
function* getAllDistrictListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.District, {
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
 * Get District Details By District Id
 * @param {*}
 */
function* getDistrictDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.District}/${id}`);

    yield put(setDistrictData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete District By Id
 * @param {*}
 */
function* deleteDistrictByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.District}/${id}`);

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New District
 * @param {*}
 */
function* createNewDistrictSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.District, {
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
 * Update District By Id
 * @param {*}
 */
function* updateDistrictsSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.District}/${id}`, {
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
 * Update District Status By Id
 * @param {*}
 */
function* updateDistrictStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.District}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* districtSaga() {
  yield takeLatest(getAllDistricts, getAllDistrictListSaga);
  yield takeLatest(deleteDistrict, deleteDistrictByIdSaga);
  yield takeLatest(getDistrictDetailById, getDistrictDetailByIdSaga);
  yield takeLatest(createDistrict, createNewDistrictSaga);
  yield takeLatest(updateDistrict, updateDistrictsSaga);
  yield takeLatest(updateDistrictStatus, updateDistrictStatusSaga);
}
