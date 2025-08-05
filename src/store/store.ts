import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./slices/dateSlice";
import alertReducer from "./slices/alertSlice";
import polygonReducer from "./slices/polygonSlice";
import timelineReducer from "./slices/timelineSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    alerts: alertReducer,
    polygon: polygonReducer,
    timeline: timelineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To allow non-serializable values in Redux state
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;