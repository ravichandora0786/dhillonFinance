/**
 *  ActivityMaster Saga
 * @format
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "@/request";
import {
  createActivityMaster,
  deleteActivityMaster,
  getAllActivityMasters,
  getActivityMasterDetailById,
  setAllActivityMasterList,
  setActivityMasterData,
  updateActivityMaster,
  updateActivityMasterStatus,
} from "./slice";

/**
 * Get All ActivityMaster
 * @param {*}
 */
function* getAllActivityMasterListSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.ActivityMaster, {
      params: data,
    });
    yield put(setAllActivityMasterList(response?.data));
    yield onSuccess({ message: response?.data?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Get ActivityMaster Details By ActivityMaster Id
 * @param {*}
 */
function* getActivityMasterDetailByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.get,
      `${endPoints.ActivityMaster}/${id}`
    );

    yield put(setActivityMasterData(response?.data));
    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Delete ActivityMaster By Id
 * @param {*}
 */
function* deleteActivityMasterByIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(
      httpRequest.delete,
      `${endPoints.ActivityMaster}/${id}`
    );

    yield onSuccess({ resp: response });
  } catch (error) {
    const errorMessage = error?.message || "Delete failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Add New ActivityMaster
 * @param {*}
 */
function* createNewActivityMasterSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.post(endPoints.ActivityMaster, {
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
 * Update ActivityMaster By Id
 * @param {*}
 */
function* updateActivityMastersSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(
      `${endPoints.ActivityMaster}/${id}`,
      {
        ...data,
        name: data?.name?.toUpperCase(),
      }
    );

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Update ActivityMaster Status By Id
 * @param {*}
 */
function* updateActivityMasterStatusSaga(action) {
  const { id, data, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.put(`${endPoints.ActivityMaster}/${id}`);

    yield onSuccess({ message: response?.message });
  } catch (error) {
    const errorMessage = error?.message || "Update failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* activityMasterSaga() {
  yield takeLatest(getAllActivityMasters, getAllActivityMasterListSaga);
  yield takeLatest(deleteActivityMaster, deleteActivityMasterByIdSaga);
  yield takeLatest(
    getActivityMasterDetailById,
    getActivityMasterDetailByIdSaga
  );
  yield takeLatest(createActivityMaster, createNewActivityMasterSaga);
  yield takeLatest(updateActivityMaster, updateActivityMastersSaga);
  yield takeLatest(updateActivityMasterStatus, updateActivityMasterStatusSaga);
}
