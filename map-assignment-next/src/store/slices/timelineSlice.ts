import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ColorRule, Polygon } from '@/types/polygon';


interface WeatherData {
  hourly: {
    time: string[];
    [key: string]: string[] | (number | null)[];
  };
}

interface PolygonWeatherData {
  [polygonId: string]: WeatherData;
}

interface TimelineState {
  dataType: string;
  timeRange: [number, number];
  polygonData: PolygonWeatherData;
  loading: boolean;
  error: string | null;
}

const initialState: TimelineState = {
  dataType: 'temperature_2m',
  timeRange: [0, 30 * 24],
  polygonData: {},
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
      return { polygonId: polygon.id, data };
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
      .addCase(fetchWeatherData.fulfilled, (state, action: PayloadAction<{ polygonId: string; data: WeatherData }>) => {
        state.loading = false;
        state.polygonData[action.payload.polygonId] = action.payload.data;
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
export const getPolygonColor = (polygon: Polygon, polygonData: PolygonWeatherData, dataType: string, timeIndex: number): string => {
  if (!polygon.colorRules.length) {
    return polygon.color; // Default color
  }

  const data = polygonData[polygon.id];
  if (!data) {
    return polygon.color; // Default color if no data for this polygon
  }

  const value = data.hourly[dataType]?.[timeIndex];

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
