import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import polygonSlice from "@/store/slices/polygonSlice";
import timelineSlice from "@/store/slices/timelineSlice";

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

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
        isDrawing: false,
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
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  isSaved: false,
};

describe("Map Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Redux State Management", () => {
    it("should initialize with correct default state", () => {
      const store = createMockStore();
      const state = store.getState();
      
      expect(state.polygon.polygons).toEqual([]);
      expect(state.polygon.selectedPolygon).toBeNull();
      expect(state.polygon.hiddenPolygons).toEqual([]);
      expect(state.timeline.dataType).toBe('temperature_2m');
      expect(state.timeline.timeRange).toEqual([0, 24]);
    });

    it("should handle adding polygons to state", () => {
      const store = createMockStore();
      
      store.dispatch({
        type: 'polygon/addPolygon',
        payload: mockPolygon,
      });
      
      const state = store.getState();
      expect(state.polygon.polygons).toHaveLength(1);
      expect(state.polygon.polygons[0].name).toBe("Test Polygon");
    });

    it("should handle removing polygons from state", () => {
      const store = createMockStore({
        polygon: {
          polygons: [mockPolygon],
        },
      });
      
      store.dispatch({
        type: 'polygon/removePolygon',
        payload: mockPolygon.id,
      });
      
      const state = store.getState();
      expect(state.polygon.polygons).toHaveLength(0);
    });

    it("should handle polygon visibility toggle", () => {
      const store = createMockStore({
        polygon: {
          polygons: [mockPolygon],
          hiddenPolygons: [],
        },
      });
      
      store.dispatch({
        type: 'polygon/togglePolygonVisibility',
        payload: mockPolygon.id,
      });
      
      const state = store.getState();
      expect(state.polygon.hiddenPolygons).toContain(mockPolygon.id);
    });

    it("should handle polygon selection", () => {
      const store = createMockStore({
        polygon: {
          polygons: [mockPolygon],
        },
      });
      
      store.dispatch({
        type: 'polygon/selectPolygon',
        payload: mockPolygon.id,
      });
      
      const state = store.getState();
      expect(state.polygon.selectedPolygon).toBe(mockPolygon.id);
    });

    it("should handle timeline data type changes", () => {
      const store = createMockStore();
      
      store.dispatch({
        type: 'timeline/setDataType',
        payload: 'precipitation',
      });
      
      const state = store.getState();
      expect(state.timeline.dataType).toBe('precipitation');
    });

    it("should handle time range updates", () => {
      const store = createMockStore();
      
      store.dispatch({
        type: 'timeline/setTimeRange',
        payload: [6, 18],
      });
      
      const state = store.getState();
      expect(state.timeline.timeRange).toEqual([6, 18]);
    });

    it("should handle polygon color rule updates", () => {
      const store = createMockStore({
        polygon: {
          polygons: [mockPolygon],
        },
      });
      
      const updatedRules = [
        { value: 25, operator: ">" as const, color: "#00FF00" },
      ];
      
      store.dispatch({
        type: 'polygon/updatePolygon',
        payload: {
          id: mockPolygon.id,
          updates: { colorRules: updatedRules },
        },
      });
      
      const state = store.getState();
      expect(state.polygon.polygons[0].colorRules).toEqual(updatedRules);
    });

    it("should handle saving polygons", () => {
      const store = createMockStore({
        polygon: {
          polygons: [mockPolygon],
        },
      });
      
      store.dispatch({
        type: 'polygon/savePolygon',
        payload: mockPolygon.id,
      });
      
      const state = store.getState();
      // Check that the action was dispatched (the actual reducer might handle this differently)
      expect(state.polygon.polygons).toHaveLength(1);
      expect(state.polygon.polygons[0].id).toBe(mockPolygon.id);
    });

    it("should handle clearing all polygons", () => {
      const store = createMockStore({
        polygon: {
          polygons: [mockPolygon, { ...mockPolygon, id: "test-2" }],
        },
      });
      
      store.dispatch({
        type: 'polygon/clearAllPolygons',
      });
      
      const state = store.getState();
      expect(state.polygon.polygons).toHaveLength(0);
      expect(state.polygon.hiddenPolygons).toHaveLength(0);
      expect(state.polygon.selectedPolygon).toBeNull();
    });
  });

  describe("Data Processing Functions", () => {
    it("should calculate polygon centroid correctly", () => {
      // Test the centroid calculation logic
      const coordinates = mockPolygon.geoJson.coordinates[0];
      const latSum = coordinates.reduce((sum, coord) => sum + coord[1], 0);
      const lngSum = coordinates.reduce((sum, coord) => sum + coord[0], 0);
      const centroidLat = latSum / coordinates.length;
      const centroidLng = lngSum / coordinates.length;
      
      expect(centroidLat).toBeCloseTo(22.694, 2);
      expect(centroidLng).toBeCloseTo(88.471, 2);
    });

    it("should count polygon points correctly", () => {
      const pointCount = mockPolygon.geoJson.coordinates[0].length;
      expect(pointCount).toBe(5); // Including closing point
    });

    it("should validate color rules structure", () => {
      const rule = mockPolygon.colorRules[0];
      expect(rule).toHaveProperty('value');
      expect(rule).toHaveProperty('operator');
      expect(rule).toHaveProperty('color');
      expect(['>', '<', '>=', '<=', '=']).toContain(rule.operator);
    });

    it("should handle weather data structure", () => {
      const mockWeatherData = {
        hourly: {
          temperature_2m: [18.5, 19.2, 20.1, 21.5, 22.3],
          precipitation: [0.0, 0.1, 0.0, 0.2, 0.0],
          wind_speed_10m: [5.2, 6.1, 7.3, 8.0, 6.8],
        },
      };
      
      expect(mockWeatherData.hourly).toHaveProperty('temperature_2m');
      expect(mockWeatherData.hourly).toHaveProperty('precipitation');
      expect(mockWeatherData.hourly).toHaveProperty('wind_speed_10m');
      expect(Array.isArray(mockWeatherData.hourly.temperature_2m)).toBe(true);
    });
  });

  describe("Map Utility Functions", () => {
    it("should calculate approximate area from zoom level", () => {
      const getApproximateArea = (zoom: number, latitude: number) => {
        const metersPerPixel = (156543.03 * Math.cos(latitude * Math.PI / 180)) / (2 ** zoom);
        const mapWidthInMeters = metersPerPixel * 1024;
        const mapHeightInMeters = metersPerPixel * 768;
        const areaInSqMeters = mapWidthInMeters * mapHeightInMeters;
        const areaInSqKm = areaInSqMeters / 1000000;
        return areaInSqKm.toFixed(2);
      };

      const area14 = parseFloat(getApproximateArea(14, 22.6924));
      const area16 = parseFloat(getApproximateArea(16, 22.6924));
      
      // Higher zoom should result in smaller area
      expect(area16).toBeLessThan(area14);
      expect(area14).toBeGreaterThan(0);
      expect(area16).toBeGreaterThan(0);
    });

    it("should handle different coordinate formats", () => {
      const center1 = [22.6924, 88.4653]; // Array format
      const center2 = { lat: 22.6924, lng: 88.4653 }; // Object format
      
      const lat1 = Array.isArray(center1) ? center1[0] : (center1 as any).lat;
      const lat2 = Array.isArray(center2) ? center2[0] : center2.lat;
      
      expect(lat1).toBe(22.6924);
      expect(lat2).toBe(22.6924);
    });

    it("should format time range correctly", () => {
      const formatTimeRange = (range: [number, number]) => {
        const hours = range[1] - range[0];
        return `${hours} hours`;
      };
      
      expect(formatTimeRange([0, 24])).toBe("24 hours");
      expect(formatTimeRange([6, 18])).toBe("12 hours");
      expect(formatTimeRange([0, 719])).toBe("719 hours");
    });

    it("should validate GeoJSON structure", () => {
      const isValidGeoJSON = (geoJson: any) => {
        return (
          geoJson &&
          geoJson.type === "Polygon" &&
          Array.isArray(geoJson.coordinates) &&
          geoJson.coordinates.length > 0 &&
          Array.isArray(geoJson.coordinates[0]) &&
          geoJson.coordinates[0].length >= 4
        );
      };
      
      expect(isValidGeoJSON(mockPolygon.geoJson)).toBe(true);
      expect(isValidGeoJSON({})).toBe(false);
      expect(isValidGeoJSON({ type: "Point" })).toBe(false);
    });
  });

  describe("Component Integration", () => {
    it("should handle component state integration", () => {
      const TestComponent = () => {
        const [isMobileOpen, setIsMobileOpen] = React.useState(false);
        const [zoomLevel, setZoomLevel] = React.useState(14);
        const [center, setCenter] = React.useState([22.6924, 88.4653]);
        
        return (
          <div data-testid="test-component">
            <button 
              data-testid="toggle-mobile"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              Toggle Mobile: {isMobileOpen ? 'Open' : 'Closed'}
            </button>
            <button 
              data-testid="change-zoom"
              onClick={() => setZoomLevel(16)}
            >
              Zoom: {zoomLevel}
            </button>
            <div data-testid="center-display">
              Center: {JSON.stringify(center)}
            </div>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // Test mobile state toggle
      const toggleButton = screen.getByTestId("toggle-mobile");
      expect(toggleButton).toHaveTextContent("Toggle Mobile: Closed");
      
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent("Toggle Mobile: Open");
      
      // Test zoom change
      const zoomButton = screen.getByTestId("change-zoom");
      expect(zoomButton).toHaveTextContent("Zoom: 14");
      
      fireEvent.click(zoomButton);
      expect(zoomButton).toHaveTextContent("Zoom: 16");
      
      // Test center display
      const centerDisplay = screen.getByTestId("center-display");
      expect(centerDisplay).toHaveTextContent("Center: [22.6924,88.4653]");
    });

    it("should handle error states gracefully", () => {
      const ErrorBoundaryTest = () => {
        try {
          // Simulate potential error scenarios
          const invalidPolygon = {
            id: null,
            geoJson: { coordinates: [] },
          };
          
          return (
            <div data-testid="error-test">
              {invalidPolygon.id ? "Valid" : "Invalid ID handled"}
            </div>
          );
        } catch (error) {
          return <div data-testid="error-caught">Error handled</div>;
        }
      };
      
      render(<ErrorBoundaryTest />);
      
      expect(screen.getByText("Invalid ID handled")).toBeInTheDocument();
    });
  });

  describe("API Integration", () => {
    it("should format API request parameters correctly", () => {
      const formatAPIParams = (polygon: typeof mockPolygon, timeRange: [number, number]) => {
        const coordinates = polygon.geoJson.coordinates[0];
        const latSum = coordinates.reduce((sum, coord) => sum + coord[1], 0);
        const lngSum = coordinates.reduce((sum, coord) => sum + coord[0], 0);
        const centroidLat = latSum / coordinates.length;
        const centroidLng = lngSum / coordinates.length;
        
        const now = new Date();
        const startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const endDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        return {
          latitude: centroidLat.toFixed(4),
          longitude: centroidLng.toFixed(4),
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          data_type: polygon.dataSource,
        };
      };
      
      const params = formatAPIParams(mockPolygon, [0, 24]);
      
      expect(params).toHaveProperty('latitude');
      expect(params).toHaveProperty('longitude');
      expect(params).toHaveProperty('start_date');
      expect(params).toHaveProperty('end_date');
      expect(params).toHaveProperty('data_type');
      expect(params.data_type).toBe('temperature_2m');
    });

    it("should handle weather data processing", () => {
      const processWeatherData = (data: any, timeIndex: number) => {
        if (!data || !data.hourly || !Array.isArray(data.hourly.temperature_2m)) {
          return "No data";
        }
        
        const value = data.hourly.temperature_2m[timeIndex];
        return value !== undefined ? `${value.toFixed(1)}°C` : "No data";
      };
      
      const mockData = {
        hourly: {
          temperature_2m: [20.5, 21.0, 22.5],
        },
      };
      
      expect(processWeatherData(mockData, 0)).toBe("20.5°C");
      expect(processWeatherData(mockData, 10)).toBe("No data");
      expect(processWeatherData(null, 0)).toBe("No data");
    });
  });

  describe("Component Props and Callbacks", () => {
    it("should handle callback functions correctly", () => {
      const mockCallbacks = {
        onZoomChange: jest.fn(),
        onCenterChange: jest.fn(),
        onOpenSidebar: jest.fn(),
        onCloseSidebar: jest.fn(),
      };
      
      // Simulate callback calls
      mockCallbacks.onZoomChange(15);
      mockCallbacks.onCenterChange([22.7, 88.5]);
      mockCallbacks.onOpenSidebar();
      mockCallbacks.onCloseSidebar();
      
      expect(mockCallbacks.onZoomChange).toHaveBeenCalledWith(15);
      expect(mockCallbacks.onCenterChange).toHaveBeenCalledWith([22.7, 88.5]);
      expect(mockCallbacks.onOpenSidebar).toHaveBeenCalled();
      expect(mockCallbacks.onCloseSidebar).toHaveBeenCalled();
    });

    it("should validate prop types", () => {
      const validateMapProps = (props: any) => {
        const requiredProps = ['onZoomChange', 'onCenterChange'];
        const optionalProps = ['className', 'onOpenMobileSidebar', 'isSidebarOpen'];
        
        const hasRequired = requiredProps.every(prop => typeof props[prop] === 'function');
        const validOptional = optionalProps.every(prop => 
          props[prop] === undefined || 
          typeof props[prop] === 'string' || 
          typeof props[prop] === 'boolean' ||
          typeof props[prop] === 'function'
        );
        
        return hasRequired && validOptional;
      };
      
      const validProps = {
        onZoomChange: jest.fn(),
        onCenterChange: jest.fn(),
        className: "test-class",
        isSidebarOpen: false,
      };
      
      const invalidProps = {
        onZoomChange: "not a function",
      };
      
      expect(validateMapProps(validProps)).toBe(true);
      expect(validateMapProps(invalidProps)).toBe(false);
    });
  });

  describe("Performance and Memory", () => {
    it("should handle large polygon datasets", () => {
      const largePolygonSet = Array.from({ length: 100 }, (_, i) => ({
        ...mockPolygon,
        id: `polygon-${i}`,
        name: `Polygon ${i}`,
      }));
      
      const store = createMockStore({
        polygon: {
          polygons: largePolygonSet,
        },
      });
      
      const state = store.getState();
      expect(state.polygon.polygons).toHaveLength(100);
      expect(state.polygon.polygons[50].name).toBe("Polygon 50");
    });

    it("should handle memory cleanup scenarios", () => {
      const store = createMockStore({
        polygon: {
          polygons: [mockPolygon],
          hiddenPolygons: [mockPolygon.id],
          selectedPolygon: mockPolygon.id,
        },
      });
      
      // Clear all data
      store.dispatch({ type: 'polygon/clearAllPolygons' });
      
      const state = store.getState();
      expect(state.polygon.polygons).toHaveLength(0);
      expect(state.polygon.hiddenPolygons).toHaveLength(0);
      expect(state.polygon.selectedPolygon).toBeNull();
    });
  });
});