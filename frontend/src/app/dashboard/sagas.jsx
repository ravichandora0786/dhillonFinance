/**
 * Dashboard sagas
 * @format
 */

import { put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { getDashboardData, setDashboardData } from "./slice";
import { endPoints, httpRequest } from "@/request";

/**
 * Get all data of dashboard
 * @param {*}
 */
function* getDashboardDataSaga(action) {
  const { onSuccess, onFailure } = action.payload;
  try {
    const response = yield httpRequest.get(endPoints.DashboardData);
    if (response.statusCode == 200) {
      yield put(setDashboardData(response?.data));
      yield onSuccess({ message: response?.message, data: response?.data });
    }
  } catch (error) {
    const errorMessage = error?.message || "Something went wrong!";
    toast.error(errorMessage);
    yield onFailure({ message: errorMessage });
  }
}

export function* dashboardSagas() {
  yield takeLatest(getDashboardData, getDashboardDataSaga);
}
