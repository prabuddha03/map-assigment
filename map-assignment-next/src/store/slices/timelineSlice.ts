import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ColorRule, Polygon } from '@/types/polygon';


interface WeatherData {
  hourly: {
    time: string[] ;
    [key: string]: (number | null)[];
  };
}

interface TimelineState {
  dataType: string;
  timeRange: [number, number];
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TimelineState = {
  dataType: 'temperature_2m',
  timeRange: [0, 30 * 24],
  data: null,
  loading: false,
  error: null,
};

// Async thunk for fetching weather data
export const fetchWeatherData = createAsyncThunk(
  'timeline/fetchWeatherData',
  async ({ polygon, dataType, startDate, endDate }: { polygon: Polygon, dataType: string, startDate: string, endDate: string }, { rejectWithValue }) => {
    // Get the center of the polygon for the API call
    const center = polygon.geoJson.coordinates[0].reduce(
      (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
      [0, 0]
    );
    const avgLongitude = center[0] / polygon.geoJson.coordinates[0].length;
    const avgLatitude = center[1] / polygon.geoJson.coordinates[0].length;

    try {
      const response = await fetch(`/api/weather-data?latitude=${avgLatitude}&longitude=${avgLongitude}&start_date=${startDate}&end_date=${endDate}&data_type=${dataType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setDataType: (state, action: PayloadAction<string>) => {
      state.dataType = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<[number, number]>) => {
      state.timeRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      ;
  },
});

export const { setDataType, setTimeRange } = timelineSlice.actions;

// Utility function to determine polygon color based on rules and data
export const getPolygonColor = (polygon: Polygon, data: WeatherData | null, timeIndex: number): string => {
  if (!data || !polygon.colorRules.length) {
    return polygon.color; // Default color
  }

  const value = data.hourly[polygon.dataSource]?.[timeIndex];

  if (value === null || typeof value === 'undefined') {
    return '#808080'; // Gray for no data
  }

  for (const rule of polygon.colorRules) {
    if (rule.operator === '>' && value > rule.value) {
      return rule.color;
    }
    if (rule.operator === '<' && value < rule.value) {
      return rule.color;
    }
  }

  return polygon.color; // Default if no rules match
};

export default timelineSlice.reducer;
