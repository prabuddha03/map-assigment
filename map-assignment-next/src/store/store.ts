import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./slices/dateSlice";
import alertReducer from "./slices/alertSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    alerts: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;