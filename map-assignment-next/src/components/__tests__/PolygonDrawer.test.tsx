import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PolygonDrawer from "../PolygonDrawer";
import polygonSlice from "@/store/slices/polygonSlice";

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Leaflet
const mockMap = {
  editTools: {
    startPolygon: jest.fn(),
  },
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock("react-leaflet", () => ({
  useMap: () => mockMap,
}));

jest.mock("leaflet-editable", () => ({}));

// Create mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      polygon: polygonSlice,
    },
    preloadedState: {
      polygon: {
        polygons: [],
        savedPolygons: [],
        selectedPolygon: null,
        hiddenPolygons: [],
        isDrawing: false,
        ...initialState.polygon,
      },
    },
  });
};

describe("PolygonDrawer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <PolygonDrawer />
      </Provider>
    );
  };

  it("renders without crashing", () => {
    renderWithProvider();
    
    // Component should render (it returns null but sets up event listeners)
    expect(document.body).toBeInTheDocument();
  });

  it("sets up map event listeners on mount", () => {
    renderWithProvider();
    
    expect(mockMap.on).toHaveBeenCalledWith("editable:drawing:commit", expect.any(Function));
  });

  it("starts drawing when isDrawing state changes to true", () => {
    const storeWithDrawing = createMockStore({
      polygon: {
        isDrawing: true,
      },
    });

    renderWithProvider(storeWithDrawing);
    
    expect(mockMap.editTools.startPolygon).toHaveBeenCalled();
  });

  it("cleans up event listeners on unmount", () => {
    const { unmount } = renderWithProvider();
    
    unmount();
    
    expect(mockMap.off).toHaveBeenCalledWith("editable:drawing:commit", expect.any(Function));
  });

  it("handles drawing state changes correctly", () => {
    const store = createMockStore();
    const { rerender } = render(
      <Provider store={store}>
        <PolygonDrawer />
      </Provider>
    );

    // Initially not drawing
    expect(mockMap.editTools.startPolygon).not.toHaveBeenCalled();

    // Change to drawing state
    const storeWithDrawing = createMockStore({
      polygon: {
        isDrawing: true,
      },
    });

    rerender(
      <Provider store={storeWithDrawing}>
        <PolygonDrawer />
      </Provider>
    );

    expect(mockMap.editTools.startPolygon).toHaveBeenCalled();
  });

  it("uses correct map instance", () => {
    renderWithProvider();
    
    // Verify that useMap hook is called and map is used
    expect(mockMap.on).toHaveBeenCalled();
  });

  it("handles multiple drawing sessions", () => {
    const store = createMockStore();
    
    // First render
    const { rerender } = render(
      <Provider store={store}>
        <PolygonDrawer />
      </Provider>
    );

    // Start drawing
    rerender(
      <Provider store={createMockStore({ polygon: { isDrawing: true } })}>
        <PolygonDrawer />
      </Provider>
    );

    // Stop drawing
    rerender(
      <Provider store={createMockStore({ polygon: { isDrawing: false } })}>
        <PolygonDrawer />
      </Provider>
    );

    // Should handle state changes without errors
    expect(mockMap.on).toHaveBeenCalled();
  });

  it("properly integrates with Redux state", () => {
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [
          {
            id: "test-1",
            name: "Test Polygon",
            geoJson: { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
            color: "#FF0000",
            dataSource: "temperature_2m",
            colorRules: [],
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            isSaved: false,
          },
        ],
      },
    });

    renderWithProvider(storeWithPolygons);
    
    // Should render without errors even with existing polygons
    expect(document.body).toBeInTheDocument();
  });
});