/**
 * Parent saga
 *  @format
 */

import { put, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import { httpRequest, endPoints } from "@/request";
import {
  getAllParentDataList,
  updateParentStatus,
  updateParent,
  deleteParent,
  getParentDetailById,
  createParent,
} from "./slice";

/**
 * get All Parent data list
 */
function* getAllParentDataListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Parent, {
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
 * Get Parent Details By Parent Id
 * @param {*}
 */
function* getParentDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.Parent}/${id}`);

    yield put(setParentData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Parent By Id
 * @param {*}
 */
function* deleteParentByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.Parent}/${id}`
    );

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Parent
 * @param {*}
 */
function* createNewParentSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Parent, {
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
 * Update Parent By Id
 * @param {*}
 */
function* updateParentsSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Parent}/${id}`, {
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
 * Update Parent Status By Id
 * @param {*}
 */
function* updateParentStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Parent}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* parentSaga() {
  yield takeLatest(getAllParentDataList, getAllParentDataListSaga);
  yield takeLatest(deleteParent, deleteParentByIdSaga);
  yield takeLatest(getParentDetailById, getParentDetailByIdSaga);
  yield takeLatest(createParent, createNewParentSaga);
  yield takeLatest(updateParent, updateParentsSaga);
  yield takeLatest(updateParentStatus, updateParentStatusSaga);
}
