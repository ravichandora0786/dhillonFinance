/**
 *  User Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserDetailById,
  setUserDetailData,
  updateUser,
  updateUserStatus,
} from "./slice";

/**
 * Get All User
 * @param {*}
 */
function* getAllUserListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.User, {
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
 * Get User Details By User Id
 * @param {*}
 */
function* getUserDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.User}/${id}`);

    yield put(setUserDetailData(response?.data));
    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete User By Id
 * @param {*}
 */
function* deleteUserByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.User}/${id}`);

    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New User
 * @param {*}
 */
function* createNewUserSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.User, {
      ...data,
    });

    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Create failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Update User By Id
 * @param {*}
 */
function* updateUsersSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.User}/${id}`, {
      ...data,
    });

    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Update User Status By Id
 * @param {*}
 */
function* updateUserStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.User}/${id}`);

    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* userSaga() {
  yield takeLatest(getAllUsers, getAllUserListSaga);
  yield takeLatest(deleteUser, deleteUserByIdSaga);
  yield takeLatest(getUserDetailById, getUserDetailByIdSaga);
  yield takeLatest(createUser, createNewUserSaga);
  yield takeLatest(updateUser, updateUsersSaga);
  yield takeLatest(updateUserStatus, updateUserStatusSaga);
}
