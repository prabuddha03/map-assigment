import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./slices/dateSlice";
import alertReducer from "./slices/alertSlice";
import polygonReducer from "./slices/polygonSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    alerts: alertReducer,
    polygon: polygonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;