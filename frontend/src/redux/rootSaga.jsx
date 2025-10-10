/**
 * Root Saga
 * Combine all sagas to create root saga
 * @format
 */

import { spawn } from "redux-saga/effects";

import { commonSagas } from "@/app/common/sagas";
import { userSaga } from "@/app/user/sagas";
import { activityMasterSaga } from "@/app/activityMaster/sagas";
import { roleSaga } from "@/app/role/sagas";
import { permissionSaga } from "@/app/permissions/sagas";
import { customerSaga } from "@/app/customer/sagas";
import { customerLoanSaga } from "@/app/loan/sagas";
import { transactionSaga } from "@/app/transaction/sagas";
import { dashboardSagas } from "@/app/dashboard/sagas";

function* rootSaga() {
  yield spawn(commonSagas);
  yield spawn(userSaga);
  yield spawn(roleSaga);
  yield spawn(activityMasterSaga);
  yield spawn(permissionSaga);
  yield spawn(customerSaga);
  yield spawn(customerLoanSaga);
  yield spawn(transactionSaga);
  yield spawn(dashboardSagas);
}

export default rootSaga;
