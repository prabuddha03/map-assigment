import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Alert {
  id: string;
  severity: "High" | "Medium" | "Low";
  timestamp: string;
  description: string;
  isNew?: boolean;
}

interface AlertState {
  alerts: Alert[];
  lastAlertId: number;
}

const initialState: AlertState = {
  alerts: [
    {
      id: "1",
      severity: "High",
      timestamp: new Date().toISOString(),
      description: "Machine 3A temperature exceeds critical threshold of 85°C, immediate attention required",
    },
    {
      id: "2",
      severity: "Medium", 
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      description: "Pressure anomaly detected in pipeline 2 - monitoring closely",
    },
    {
      id: "3",
      severity: "Low",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      description: "Conveyor belt speed slightly below optimal performance parameters",
    },
    {
      id: "4",
      severity: "High",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      description: "Critical failure in cooling system for Unit 7 - production halted",
    },
    {
      id: "5",
      severity: "Medium",
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      description: "Network connectivity issues detected in Sector B monitoring systems",
    },
  ],
  lastAlertId: 5,
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<Alert, "id" | "timestamp">>) => {
      const newAlert: Alert = {
        ...action.payload,
        id: (state.lastAlertId + 1).toString(),
        timestamp: new Date().toISOString(),
        isNew: true,
      };
      state.alerts.unshift(newAlert);
      state.lastAlertId += 1;
      
      // Keep only the latest 20 alerts
      if (state.alerts.length > 20) {
        state.alerts = state.alerts.slice(0, 20);
      }
    },
    markAlertAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.isNew = false;
      }
    },
    clearAllAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { addAlert, markAlertAsRead, clearAllAlerts } = alertSlice.actions;
export default alertSlice.reducer;