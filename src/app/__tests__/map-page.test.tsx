import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MapPage from "../map/page";
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

// Mock dynamic imports
jest.mock("next/dynamic", () => {
  return function mockDynamic(importFunc: any) {
    const Component = importFunc();
    return Component.default || Component;
  };
});

// Mock child components
jest.mock("../../components/TimelineSlider", () => {
  return function MockTimelineSlider() {
    return <div data-testid="timeline-slider">Timeline Slider</div>;
  };
});

jest.mock("../../components/Map", () => {
  return function MockMap({ onOpenMobileSidebar, onZoomChange, onCenterChange, isSidebarOpen }: any) {
    return (
      <div data-testid="map" data-sidebar-open={isSidebarOpen}>
        <button data-testid="mock-zoom-change" onClick={() => onZoomChange(15)}>
          Change Zoom
        </button>
        <button data-testid="mock-center-change" onClick={() => onCenterChange([22.7, 88.5])}>
          Change Center
        </button>
        <button data-testid="mock-open-sidebar" onClick={onOpenMobileSidebar}>
          Open Mobile Sidebar
        </button>
        Map Component
      </div>
    );
  };
});

jest.mock("../../components/MapSidebar", () => {
  return function MockMapSidebar({ isMobileOpen, onMobileClose, zoomLevel, center }: any) {
    return (
      <div data-testid="map-sidebar" data-mobile-open={isMobileOpen}>
        <button data-testid="mock-close-sidebar" onClick={onMobileClose}>
          Close Sidebar
        </button>
        <div data-testid="zoom-level">Zoom: {zoomLevel}</div>
        <div data-testid="center-coords">Center: {JSON.stringify(center)}</div>
        Map Sidebar
      </div>
    );
  };
});

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

describe("MapPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <MapPage />
      </Provider>
    );
  };

  it("renders all main components", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("timeline-slider")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("map-sidebar")).toBeInTheDocument();
  });

  it("manages mobile sidebar state correctly", () => {
    renderWithProvider();
    
    const sidebar = screen.getByTestId("map-sidebar");
    expect(sidebar).toHaveAttribute("data-mobile-open", "false");
    
    // Open mobile sidebar
    const openButton = screen.getByTestId("mock-open-sidebar");
    fireEvent.click(openButton);
    
    // Should update mobile sidebar state
    expect(sidebar).toHaveAttribute("data-mobile-open", "true");
  });

  it("handles mobile sidebar close", () => {
    renderWithProvider();
    
    // Open sidebar first
    const openButton = screen.getByTestId("mock-open-sidebar");
    fireEvent.click(openButton);
    
    // Then close it
    const closeButton = screen.getByTestId("mock-close-sidebar");
    fireEvent.click(closeButton);
    
    const sidebar = screen.getByTestId("map-sidebar");
    expect(sidebar).toHaveAttribute("data-mobile-open", "false");
  });

  it("tracks zoom level changes", () => {
    renderWithProvider();
    
    const zoomButton = screen.getByTestId("mock-zoom-change");
    fireEvent.click(zoomButton);
    
    const zoomDisplay = screen.getByTestId("zoom-level");
    expect(zoomDisplay).toHaveTextContent("Zoom: 15");
  });

  it("tracks center changes", () => {
    renderWithProvider();
    
    const centerButton = screen.getByTestId("mock-center-change");
    fireEvent.click(centerButton);
    
    const centerDisplay = screen.getByTestId("center-coords");
    expect(centerDisplay).toHaveTextContent("[22.7,88.5]");
  });

  it("passes sidebar state to map component", () => {
    renderWithProvider();
    
    const map = screen.getByTestId("map");
    expect(map).toHaveAttribute("data-sidebar-open", "false");
    
    // Open sidebar
    const openButton = screen.getByTestId("mock-open-sidebar");
    fireEvent.click(openButton);
    
    expect(map).toHaveAttribute("data-sidebar-open", "true");
  });

  it("initializes with correct default values", () => {
    renderWithProvider();
    
    const zoomDisplay = screen.getByTestId("zoom-level");
    const centerDisplay = screen.getByTestId("center-coords");
    
    expect(zoomDisplay).toHaveTextContent("Zoom: 16.5");
    expect(centerDisplay).toHaveTextContent("[22.6924,88.4653]");
  });

  it("applies correct layout classes", () => {
    renderWithProvider();
    
    const pageContainer = screen.getByTestId("timeline-slider").parentElement;
    expect(pageContainer).toHaveClass("flex flex-col h-screen w-full");
  });

  it("handles responsive layout correctly", () => {
    renderWithProvider();
    
    const mapContainer = screen.getByTestId("map").parentElement;
    expect(mapContainer).toHaveClass("flex-1 relative h-full w-full");
  });

  it("integrates with Redux state correctly", () => {
    const storeWithData = createMockStore({
      timeline: {
        dataType: 'precipitation',
        timeRange: [6, 18],
      },
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

    renderWithProvider(storeWithData);
    
    // Should render all components with state
    expect(screen.getByTestId("timeline-slider")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("map-sidebar")).toBeInTheDocument();
  });

  it("handles multiple state updates correctly", () => {
    renderWithProvider();
    
    // Change zoom
    const zoomButton = screen.getByTestId("mock-zoom-change");
    fireEvent.click(zoomButton);
    
    // Change center
    const centerButton = screen.getByTestId("mock-center-change");
    fireEvent.click(centerButton);
    
    // Open sidebar
    const openButton = screen.getByTestId("mock-open-sidebar");
    fireEvent.click(openButton);
    
    // All state should be updated correctly
    expect(screen.getByTestId("zoom-level")).toHaveTextContent("Zoom: 15");
    expect(screen.getByTestId("center-coords")).toHaveTextContent("[22.7,88.5]");
    expect(screen.getByTestId("map-sidebar")).toHaveAttribute("data-mobile-open", "true");
  });
});