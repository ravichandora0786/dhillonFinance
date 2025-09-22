/**
 * Staff saga
 *  @format
 */

import { put, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import { httpRequest, endPoints } from "@/request";
import {
  getAllStaffDataList,
  updateStaffStatus,
  updateStaff,
  deleteStaff,
  getStaffDetailById,
  createStaff,
} from "./slice";

/**
 * get All Staff data list
 */
function* getAllStaffDataListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Staff, {
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
 * Get Staff Details By Staff Id
 * @param {*}
 */
function* getStaffDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.Staff}/${id}`);

    yield put(setStaffData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Staff By Id
 * @param {*}
 */
function* deleteStaffByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.Staff}/${id}`);

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Staff
 * @param {*}
 */
function* createNewStaffSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Staff, {
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
 * Update Staff By Id
 * @param {*}
 */
function* updateStaffsSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Staff}/${id}`, {
      ...data,
      name: data?.name?.toUpperCase(),
    });

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Update Staff Status By Id
 * @param {*}
 */
function* updateStaffStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Staff}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* staffSaga() {
  yield takeLatest(getAllStaffDataList, getAllStaffDataListSaga);
  yield takeLatest(deleteStaff, deleteStaffByIdSaga);
  yield takeLatest(getStaffDetailById, getStaffDetailByIdSaga);
  yield takeLatest(createStaff, createNewStaffSaga);
  yield takeLatest(updateStaff, updateStaffsSaga);
  yield takeLatest(updateStaffStatus, updateStaffStatusSaga);
}
