/**
 * Root Reducer
 * Combine all reducer to create root reducer
 * @format
 */

import { combineReducers } from "@reduxjs/toolkit";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { commonReducer } from "@/app/common/slice";
import { userReducer } from "@/app/user/slice";
import { roleReducer } from "@/app/role/slice";
import { activityMasterReducer } from "@/app/activityMaster/slice";
import { permissionReducer } from "@/app/permissions/slice";
import { customerReducer } from "@/app/customer/slice";
import { customerLoanReducer } from "@/app/loan/slice";
import { transactionReducer } from "@/app/transaction/slice";
import { dashboardReducer } from "@/app/dashboard/slice";

const dummyReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Configuration for persisting the root reducer
const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: [],
  blacklist: [],
};

// Configuration for persisting the common reducer
const commonPersistConfig = {
  key: "common",
  storage,
  blacklist: [],
};

// Combine your reducers here
const appReducer = combineReducers({
  dummy: dummyReducer,
  common: persistReducer(commonPersistConfig, commonReducer),
  userReducer,
  roleReducer,
  activityMasterReducer,
  permissionReducer,
  customerReducer,
  customerLoanReducer,
  transactionReducer,
  dashboardReducer,
  // Add other reducers here
});

// Root reducer with optional state and action parameters
const rootReducer = (state, action) => {
  if (action.type === "COMMON/LOGOUT") {
    storage.removeItem("persist:common");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

// Create a persisted version of the root reducer
const persistRootReducer = persistReducer(rootPersistConfig, rootReducer);

// TypeScript type for RootState, only needed if using TypeScript
// export type RootState = ReturnType<typeof appReducer>;

export default persistRootReducer;
