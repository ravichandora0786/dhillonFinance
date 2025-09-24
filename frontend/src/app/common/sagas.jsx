/**
 * Common sagas
 * @format
 */

import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { persistor } from "@/redux/store";
import {
  getPermissionsByRoleId,
  getUploadedFile,
  imageUpload,
  loginApp,
  setAccessToken,
  setRefreshToken,
  setRolePermissionsMap,
  setUser,
} from "./slice";
import { endPoints, httpRequest } from "@/request";
import { decryptData, encryptData } from "@/Services/encryptDecrypt";

/**
 * User Login
 * @param {*}
 */
function* loginAppSaga(action) {
  const { data, onSuccess, onFailure } = action.payload;
  try {
    const encryptedData = encryptData(data);
    const response = yield httpRequest.post(endPoints.Login, {
      data: encryptedData,
    });
    const responseData = decryptData(response?.data);
    if (response.statusCode == 200) {
      yield put(setAccessToken(responseData?.token?.accessToken));
      yield put(setRefreshToken(responseData?.token?.refreshToken));
      yield put(setUser(responseData?.user));
      yield put(setRolePermissionsMap(responseData?.permissions));
      yield call([persistor, persistor.persist]);
      yield onSuccess({
        message: responseData?.message,
        data: responseData,
      });
    }
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * Upload Image
 * @param {*}
 */
function* imageUploadSaga(action) {
  const { file, type, onSuccess, onFailure } = action.payload;
  try {
    let formData = new FormData();
    formData.append("file", file);
    // formData.append("type", type);

    // Make the API request with custom headers
    const response = yield httpRequest.post(
      endPoints.CommonImageUpload,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

/**
 * get Uploaded file
 * @param {*}
 */
function* getUploadedFileSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(
      `${endPoints.CommonImageUpload}/${id}`
      // {
      //   responseType: "blob",
      // }
    );

    yield call(onSuccess, { data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield call(onFailure, { message: errorMessage });
  }
}

/**
 * get activity And Permission By Role Id
 */
function* getPermissionsByRoleIdSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(
      `${endPoints.ActivityPermission}/permission/${id}`
    );
    yield put(setRolePermissionsMap(response?.data));
    yield onSuccess({ message: response?.message, data: response?.data });
  } catch (error) {
    const errorMessage = error?.message || "Fetch failed";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* commonSagas() {
  yield takeLatest(loginApp, loginAppSaga);
  yield takeLatest(imageUpload, imageUploadSaga);
  yield takeEvery(getUploadedFile, getUploadedFileSaga);
  yield takeLatest(getPermissionsByRoleId, getPermissionsByRoleIdSaga);
}
