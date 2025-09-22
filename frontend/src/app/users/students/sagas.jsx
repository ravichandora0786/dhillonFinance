/**
 * Student saga
 *  @format
 */

import { put, takeLatest, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import { httpRequest, endPoints } from "@/request";
import {
  getAllStudentDataList,
  updateStudentStatus,
  updateStudent,
  deleteStudent,
  getStudentDetailById,
  createStudent,
  setStudentData,
} from "./slice";

/**
 * get All Student data list
 */
function* getAllStudentDataListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.Student, {
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
 * Get Student Details By Student Id
 * @param {*}
 */
function* getStudentDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.Student}/${id}`);

    yield put(setStudentData(response?.data));
    yield onSuccess({ data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete Student By Id
 * @param {*}
 */
function* deleteStudentByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.Student}/${id}`
    );

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New Student
 * @param {*}
 */
function* createNewStudentSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.Student, {
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
 * Update Student By Id
 * @param {*}
 */
function* updateStudentsSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Student}/${id}`, {
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
 * Update Student Status By Id
 * @param {*}
 */
function* updateStudentStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.Student}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* studentSaga() {
  yield takeLatest(getAllStudentDataList, getAllStudentDataListSaga);
  yield takeLatest(deleteStudent, deleteStudentByIdSaga);
  yield takeLatest(getStudentDetailById, getStudentDetailByIdSaga);
  yield takeLatest(createStudent, createNewStudentSaga);
  yield takeLatest(updateStudent, updateStudentsSaga);
  yield takeLatest(updateStudentStatus, updateStudentStatusSaga);
}
