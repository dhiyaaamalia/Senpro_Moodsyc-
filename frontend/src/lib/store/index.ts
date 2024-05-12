import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { dataReducer } from "../features/data/dataSlice";
import { authReducer } from "../features/auth/authSlice";

const dataPersistConfig = {
  key: "data",
  storage: storage,
  whitelist: ["input", "result"],
};

const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["user"],
};

const appReducer = combineReducers({
  data: persistReducer(dataPersistConfig, dataReducer),
  auth: persistReducer(authPersistConfig, authReducer),
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
