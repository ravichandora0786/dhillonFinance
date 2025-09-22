/**
 *  Permission Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermissionDetailById,
  setAllPermissionList,
  setPermissionData,
  updatePermission,
  updatePermissionStatus,
} from "./slice";

/**
 * Get All Permission
 * @param {*}
 */
function* getAllPermissionListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Permission, {
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
 * Get Permission Details By Permission Id
 * @param {*}
 */
function* getPermissionDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.get,
      `${endPoints.Permission}/${id}`
    );

    yield put(setPermissionData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Permission By Id
 * @param {*}
 */
function* deletePermissionByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.Permission}/${id}`
    );

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Permission
 * @param {*}
 */
function* createNewPermissionSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Permission, {
      ...data,
      name: data?.name?.toUpperCase(),
    });

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Create failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Update Permission By Id
 * @param {*}
 */
function* updatePermissionsSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Permission}/${id}`, {
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
 * Update Permission Status By Id
 * @param {*}
 */
function* updatePermissionStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Permission}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* permissionSaga() {
  yield takeLatest(getAllPermissions, getAllPermissionListSaga);
  yield takeLatest(deletePermission, deletePermissionByIdSaga);
  yield takeLatest(getPermissionDetailById, getPermissionDetailByIdSaga);
  yield takeLatest(createPermission, createNewPermissionSaga);
  yield takeLatest(updatePermission, updatePermissionsSaga);
  yield takeLatest(updatePermissionStatus, updatePermissionStatusSaga);
}
