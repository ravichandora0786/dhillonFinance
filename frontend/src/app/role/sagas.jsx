/**
 *  Role Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createORupdateActivityPermission,
  createRole,
  deleteRole,
  getActivityPermissionsByRoleId,
  getAllRoles,
  getRoleDetailById,
  setRoleData,
  updateRole,
  updateRoleStatus,
} from "./slice";

/**
 * Get All Role
 * @param {*}
 */
function* getAllRoleListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Role, {
      params: data,
    });
    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Get Role Details By Role Id
 * @param {*}
 */
function* getRoleDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.Role}/${id}`);

    yield put(setRoleData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Role By Id
 * @param {*}
 */
function* deleteRoleByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.Role}/${id}`);

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Role
 * @param {*}
 */
function* createNewRoleSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Role, {
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
 * Update Role By Id
 * @param {*}
 */
function* updateRolesSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Role}/${id}`, {
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
 * Update Role Status By Id
 * @param {*}
 */
function* updateRoleStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Role}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * get activity And Permission By Role Id
 */
function* getActivityPermissionsByRoleIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(
      `${endPoints.ActivityPermission}/${id}`
    );

    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Fetch failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Assign or Update Role Permissions Saga
 */
export function* createORupdateActivityPermissionSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.post,
      `${endPoints.ActivityPermission}`,
      { ...data }
    );

    if (onSuccess) yield onSuccess(response);
  } catch (error) {
    const errorMessage = error?.message || "Failed to update permissions";
    toast.error(errorMessage);

    if (onFailure) yield onFailure({ message: errorMessage });
  }
}

export function* roleSaga() {
  yield takeLatest(getAllRoles, getAllRoleListSaga);
  yield takeLatest(deleteRole, deleteRoleByIdSaga);
  yield takeLatest(getRoleDetailById, getRoleDetailByIdSaga);
  yield takeLatest(createRole, createNewRoleSaga);
  yield takeLatest(updateRole, updateRolesSaga);
  yield takeLatest(updateRoleStatus, updateRoleStatusSaga);
  // activity Permission
  yield takeLatest(
    createORupdateActivityPermission,
    createORupdateActivityPermissionSaga
  );
  yield takeLatest(
    getActivityPermissionsByRoleId,
    getActivityPermissionsByRoleIdSaga
  );
}
