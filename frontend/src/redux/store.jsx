/**
 * Redux Store
 * Create redux store with middleware, enhancers & root reducer
 * Configure redux persist
 * @format
 */

import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";
import persistRootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

// Custom storage wrapper (fixes SSR warning)
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Replace in your rootReducer file also (important!)
// import storage from "redux-persist/lib/storage";
// ⬆ isko replace karke ⬇ use karo
export { storage };

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
export { persistor };
