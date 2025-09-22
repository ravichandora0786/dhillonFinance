/**
 * Root Saga
 * Combine all sagas to create root saga
 * @format
 */

import { spawn } from "redux-saga/effects";

import { commonSagas } from "@/app/common/sagas";
import { userSaga } from "@/app/users/sagas";
import { activityMasterSaga } from "@/app/activityMaster/sagas";
import { roleSaga } from "@/app/role/sagas";
import { permissionSaga } from "@/app/permissions/sagas";
import { countrySaga } from "@/app/country/sagas";
import { stateSaga } from "@/app/state/sagas";
import { districtSaga } from "@/app/district/sagas";

function* rootSaga() {
  yield spawn(commonSagas);
  yield spawn(userSaga);
  yield spawn(roleSaga);
  yield spawn(activityMasterSaga);
  yield spawn(permissionSaga);
  yield spawn(countrySaga);
  yield spawn(stateSaga);
  yield spawn(districtSaga);
}

export default rootSaga;
