import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DateState {
  selectedDate: string;
  selectedDateRange: [string, string] | null;
  isRange: boolean;
  isPlaying: boolean;
  playbackSpeed: 1 | 2 | 4;
  minDate: string;
  maxDate: string;
}

// Helper function to round to nearest hour
const roundToNearestHour = (date: Date) => {
  const rounded = new Date(date);
  rounded.setMinutes(0, 0, 0);
  return rounded;
};

const now = roundToNearestHour(new Date());
const minDate = roundToNearestHour(new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)); // 15 days ago
const maxDate = roundToNearestHour(new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)); // 15 days future

const initialState: DateState = {
  selectedDate: now.toISOString(),
  selectedDateRange: null,
  isRange: false,
  isPlaying: false,
  playbackSpeed: 1,
  minDate: minDate.toISOString(),
  maxDate: maxDate.toISOString(),
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setDateRange: (state, action: PayloadAction<[string, string] | null>) => {
      state.selectedDateRange = action.payload;
    },
    setIsRange: (state, action: PayloadAction<boolean>) => {
      state.isRange = action.payload;
      if (!action.payload) {
        state.selectedDateRange = null;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlaybackSpeed: (state, action: PayloadAction<1 | 2 | 4>) => {
      state.playbackSpeed = action.payload;
    },
    advanceTime: (state) => {
      const currentDate = new Date(state.selectedDate);
      const newDate = roundToNearestHour(new Date(currentDate.getTime() + 60 * 60 * 1000)); // Advance by 1 hour
      
      if (newDate <= new Date(state.maxDate)) {
        state.selectedDate = newDate.toISOString();
      } else {
        // Stop at the end instead of looping
        state.isPlaying = false;
      }
    },
  },
});

export const {
  setDate,
  setDateRange,
  setIsRange,
  setIsPlaying,
  setPlaybackSpeed,
  advanceTime,
} = dateSlice.actions;

export default dateSlice.reducer;