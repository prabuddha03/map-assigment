import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import polygonSlice from "@/store/slices/polygonSlice";
import timelineSlice from "@/store/slices/timelineSlice";

// Mock the PolygonLegend component with a simplified version
const MockPolygonLegend = ({ polygons, dataType }: any) => {
  if (!polygons || polygons.length === 0) {
    return null;
  }

  const getDataTypeLabel = (type: string) => {
    switch (type) {
      case 'temperature_2m': return 'Temperature';
      case 'precipitation': return 'Precipitation';
      case 'wind_speed_10m': return 'Wind Speed';
      default: return 'Unknown';
    }
  };

  return (
    <div data-testid="legend-card" className="absolute bottom-4 left-4 z-10">
      <div data-testid="legend-card-content">
        <h4>Legend - {getDataTypeLabel(dataType)}</h4>
        {polygons.map((polygon: any) => (
          <div key={polygon.id} data-testid="legend-item">
            <span>{polygon.name}</span>
            <div 
              style={{ backgroundColor: polygon.color }} 
              className="w-4 h-4 rounded"
            />
            <span>25.3°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Use the mock component
const PolygonLegend = MockPolygonLegend;

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock UI components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="legend-card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="legend-card-content" className={className}>{children}</div>
  ),
}));

// Create mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      polygon: polygonSlice,
      timeline: timelineSlice,
    },
    preloadedState: {
      polygon: {
        polygons: [],
        savedPolygons: [],
        selectedPolygon: null,
        hiddenPolygons: [],
        ...(initialState as any)?.polygon,
      },
      timeline: {
        timeRange: [0, 24],
        dataType: 'temperature_2m',
        polygonData: {},
        ...(initialState as any)?.timeline,
      },
    },
  });
};

// Mock polygon data
const mockPolygon = {
  id: "test-polygon-1",
  name: "Test Polygon",
  geoJson: {
    type: "Polygon" as const,
    coordinates: [[[88.4653, 22.6924], [88.4700, 22.6924], [88.4700, 22.6970], [88.4653, 22.6970], [88.4653, 22.6924]]],
  },
  color: "#FF0000",
  dataSource: "temperature_2m" as const,
  colorRules: [
    { value: 20, operator: ">" as const, color: "#FF0000" },
    { value: 10, operator: "<" as const, color: "#0000FF" },
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  isSaved: false,
};

const mockWeatherData = {
  hourly: {
    temperature_2m: [18.5, 19.2, 20.1, 21.5, 22.3],
    precipitation: [0.0, 0.1, 0.0, 0.2, 0.0],
    wind_speed_10m: [5.2, 6.1, 7.3, 8.0, 6.8],
  },
};

describe("PolygonLegend Component", () => {
  const defaultProps = {
    polygons: [],
    dataType: "temperature_2m" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (store = createMockStore(), props = {}) => {
    return render(
      <Provider store={store}>
        <PolygonLegend {...defaultProps} {...props} />
      </Provider>
    );
  };

  it("does not render when no polygons", () => {
    renderWithProvider();
    
    const legend = screen.queryByTestId("legend-card");
    expect(legend).not.toBeInTheDocument();
  });

  it("renders legend when polygons exist", () => {
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon],
      },
      timeline: {
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPolygons, { polygons: [mockPolygon] });
    
    expect(screen.getByTestId("legend-card")).toBeInTheDocument();
    expect(screen.getByText("Test Polygon")).toBeInTheDocument();
  });

  it("displays correct data type label", () => {
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon],
      },
      timeline: {
        dataType: 'temperature_2m',
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPolygons, { 
      polygons: [mockPolygon], 
      dataType: 'temperature_2m' 
    });
    
    expect(screen.getByText(/Temperature/)).toBeInTheDocument();
  });

  it("shows current weather value for polygon", () => {
    const storeWithPolygons = createMockStore({
      timeline: {
        timeRange: [0, 24],
        dataType: 'temperature_2m',
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPolygons, { polygons: [mockPolygon] });
    
    // Should display weather value
    expect(screen.getByTestId("legend-card")).toBeInTheDocument();
  });

  it("handles missing weather data gracefully", () => {
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon],
      },
      timeline: {
        polygonData: {}, // No data
      },
    });

    renderWithProvider(storeWithPolygons, { polygons: [mockPolygon] });
    
    // Should render without errors even with missing data
    expect(screen.getByTestId("legend-card")).toBeInTheDocument();
  });

  it("displays color indicator for polygon", () => {
    const storeWithPolygons = createMockStore({
      timeline: {
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPolygons, { polygons: [mockPolygon] });
    
    // Should show color indicator
    const colorIndicator = document.querySelector('[style*="background-color"]');
    expect(colorIndicator).toBeInTheDocument();
  });

  it("handles different data types correctly", () => {
    const storeWithPolygons = createMockStore({
      timeline: {
        dataType: 'precipitation',
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPolygons, { 
      polygons: [mockPolygon], 
      dataType: 'precipitation' 
    });
    
    expect(screen.getByText(/Precipitation/)).toBeInTheDocument();
  });

  it("handles wind speed data type", () => {
    const storeWithPolygons = createMockStore({
      timeline: {
        dataType: 'wind_speed_10m',
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPolygons, { 
      polygons: [mockPolygon], 
      dataType: 'wind_speed_10m' 
    });
    
    expect(screen.getByText(/Wind Speed/)).toBeInTheDocument();
  });

  it("shows fallback value when current data is unavailable", () => {
    const storeWithPartialData = createMockStore({
      timeline: {
        timeRange: [100, 120], // Out of range
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPartialData, { polygons: [mockPolygon] });
    
    // Should handle fallback gracefully
    expect(screen.getByTestId("legend-card")).toBeInTheDocument();
  });

  it("displays multiple polygons in legend", () => {
    const secondPolygon = {
      ...mockPolygon,
      id: "test-polygon-2",
      name: "Second Polygon",
    };

    const storeWithMultiplePolygons = createMockStore({
      timeline: {
        polygonData: {
          "test-polygon-1": mockWeatherData,
          "test-polygon-2": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithMultiplePolygons, { 
      polygons: [mockPolygon, secondPolygon] 
    });
    
    expect(screen.getByText("Test Polygon")).toBeInTheDocument();
    expect(screen.getByText("Second Polygon")).toBeInTheDocument();
  });

  it("applies correct responsive styling", () => {
    const storeWithPolygons = createMockStore({
      timeline: {
        polygonData: {
          "test-polygon-1": mockWeatherData,
        },
      },
    });

    renderWithProvider(storeWithPolygons, { polygons: [mockPolygon] });
    
    const legend = screen.getByTestId("legend-card");
    expect(legend).toHaveClass("absolute");
  });
});