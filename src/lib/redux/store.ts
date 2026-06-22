import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import schoolReducer from "./schoolSlice";

// --- VITE COMPATIBILITY FIX: Custom Storage Wrapper ---
const customStorage = {
  getItem: (_key: string) => {
    return Promise.resolve(localStorage.getItem(_key));
  },
  setItem: (_key: string, value: string) => {
    return Promise.resolve(localStorage.setItem(_key, value));
  },
  removeItem: (_key: string) => {
    return Promise.resolve(localStorage.removeItem(_key));
  },
};

const rootReducer = combineReducers({
  school: schoolReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage: customStorage, // <--- Purane import ki jagah customStorage use karein
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
