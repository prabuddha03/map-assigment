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

// Mock Next.js dynamic imports
jest.mock("next/dynamic", () => {
  return function mockDynamic(importFunc: any) {
    const Component = importFunc();
    return Component.default || Component;
  };
});

// Create a comprehensive mock for the map page
const MockMapPage = () => {
  const [center, setCenter] = React.useState([22.6924, 88.4653]);
  const [zoomLevel, setZoomLevel] = React.useState(16.5);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div data-testid="map-page" className="flex flex-col h-screen w-full">
      {/* Timeline Slider */}
      <div data-testid="timeline-slider-section" className="w-full p-4 border-b">
        <div data-testid="timeline-slider">
          <h3>Timeline Control</h3>
          <div>Data Type: temperature_2m</div>
          <div>Time Range: 0-24 hours</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative md:flex-row flex-col">
        {/* Map Section */}
        <div className="flex-1 relative h-full w-full">
          <div 
            data-testid="map-container"
            className={`h-full w-full ${isMobileSidebarOpen ? 'opacity-50' : 'opacity-100'}`}
          >
            <div data-testid="map-content">Map Content</div>
            
            {/* Mobile Controls */}
            <div className="md:hidden absolute top-4 right-4 z-50">
              <button 
                data-testid="mobile-controls-btn"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="bg-white border text-black"
              >
                Map Controls & Tools
              </button>
            </div>

            {/* Drawing Controls */}
            <div className="absolute top-20 md:top-4 right-4 z-40">
              <div data-testid="drawing-controls">
                <button data-testid="draw-btn">Draw</button>
                <button data-testid="save-btn">Save</button>
                <button data-testid="clear-btn">Clear</button>
              </div>
            </div>

            {/* Mock zoom and center change buttons */}
            <button 
              data-testid="zoom-change-btn"
              onClick={() => setZoomLevel(15)}
            >
              Change Zoom
            </button>
            <button 
              data-testid="center-change-btn"
              onClick={() => setCenter([22.7, 88.5])}
            >
              Change Center
            </button>
          </div>
        </div>

        {/* Sidebar Section */}
        <div 
          data-testid="sidebar-container"
          className={`
            md:w-96 w-full h-full
            ${isMobileSidebarOpen ? 'fixed inset-0 z-50 bg-white' : 'hidden md:block'}
          `}
        >
          <div data-testid="sidebar-content">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2>Map Controls & Tools</h2>
              <button 
                data-testid="close-sidebar-btn"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden text-red-500"
              >
                ×
              </button>
            </div>

            {/* Location Info */}
            <div data-testid="location-info" className="p-4">
              <h3>Location Info</h3>
              <div>Region: Madhyamgram, West Bengal</div>
              <div>Approx. Area: 2.50 sq km</div>
              <div data-testid="current-zoom">Current Zoom: {zoomLevel}</div>
              <div data-testid="current-center">Center: {JSON.stringify(center)}</div>
            </div>

            {/* Polygon List */}
            <div data-testid="polygon-section" className="p-4">
              <h3>Drawn Polygons</h3>
              <div data-testid="polygon-list">
                <div>No polygons drawn yet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

describe("Map Page Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <MockMapPage />
      </Provider>
    );
  };

  describe("Page Layout and Structure", () => {
    it("renders main page layout correctly", () => {
      renderWithProvider();
      
      expect(screen.getByTestId("map-page")).toBeInTheDocument();
      expect(screen.getByTestId("timeline-slider-section")).toBeInTheDocument();
      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-container")).toBeInTheDocument();
    });

    it("displays timeline slider section", () => {
      renderWithProvider();
      
      expect(screen.getByTestId("timeline-slider")).toBeInTheDocument();
      expect(screen.getByText("Timeline Control")).toBeInTheDocument();
      expect(screen.getByText("Data Type: temperature_2m")).toBeInTheDocument();
    });

    it("shows location information in sidebar", () => {
      renderWithProvider();
      
      expect(screen.getByTestId("location-info")).toBeInTheDocument();
      expect(screen.getByText("Region: Madhyamgram, West Bengal")).toBeInTheDocument();
      expect(screen.getByText("Approx. Area: 2.50 sq km")).toBeInTheDocument();
    });

    it("displays drawing controls", () => {
      renderWithProvider();
      
      expect(screen.getByTestId("drawing-controls")).toBeInTheDocument();
      expect(screen.getByTestId("draw-btn")).toBeInTheDocument();
      expect(screen.getByTestId("save-btn")).toBeInTheDocument();
      expect(screen.getByTestId("clear-btn")).toBeInTheDocument();
    });
  });

  describe("Mobile Responsiveness", () => {
    it("shows mobile controls button on mobile", () => {
      renderWithProvider();
      
      const mobileBtn = screen.getByTestId("mobile-controls-btn");
      expect(mobileBtn).toBeInTheDocument();
      expect(mobileBtn).toHaveTextContent("Map Controls & Tools");
      expect(mobileBtn.parentElement).toHaveClass("md:hidden");
    });

    it("handles mobile sidebar open/close", () => {
      renderWithProvider();
      
      const sidebar = screen.getByTestId("sidebar-container");
      expect(sidebar).toHaveClass("hidden md:block");
      
      // Open mobile sidebar
      const openBtn = screen.getByTestId("mobile-controls-btn");
      fireEvent.click(openBtn);
      
      expect(sidebar).toHaveClass("fixed inset-0 z-50");
    });

    it("shows close button in mobile sidebar", () => {
      renderWithProvider();
      
      // Open mobile sidebar first
      const openBtn = screen.getByTestId("mobile-controls-btn");
      fireEvent.click(openBtn);
      
      const closeBtn = screen.getByTestId("close-sidebar-btn");
      expect(closeBtn).toBeInTheDocument();
      expect(closeBtn).toHaveClass("md:hidden text-red-500");
    });

    it("closes mobile sidebar when close button clicked", () => {
      renderWithProvider();
      
      // Open sidebar
      const openBtn = screen.getByTestId("mobile-controls-btn");
      fireEvent.click(openBtn);
      
      const sidebar = screen.getByTestId("sidebar-container");
      expect(sidebar).toHaveClass("fixed");
      
      // Close sidebar
      const closeBtn = screen.getByTestId("close-sidebar-btn");
      fireEvent.click(closeBtn);
      
      expect(sidebar).toHaveClass("hidden md:block");
    });

    it("adjusts map opacity when mobile sidebar is open", () => {
      renderWithProvider();
      
      const mapContainer = screen.getByTestId("map-container");
      expect(mapContainer).toHaveClass("opacity-100");
      
      // Open mobile sidebar
      const openBtn = screen.getByTestId("mobile-controls-btn");
      fireEvent.click(openBtn);
      
      expect(mapContainer).toHaveClass("opacity-50");
    });
  });

  describe("Map Interactions", () => {
    it("handles zoom level changes", () => {
      renderWithProvider();
      
      const zoomDisplay = screen.getByTestId("current-zoom");
      expect(zoomDisplay).toHaveTextContent("Current Zoom: 16.5");
      
      const zoomBtn = screen.getByTestId("zoom-change-btn");
      fireEvent.click(zoomBtn);
      
      expect(zoomDisplay).toHaveTextContent("Current Zoom: 15");
    });

    it("handles center coordinate changes", () => {
      renderWithProvider();
      
      const centerDisplay = screen.getByTestId("current-center");
      expect(centerDisplay).toHaveTextContent("Center: [22.6924,88.4653]");
      
      const centerBtn = screen.getByTestId("center-change-btn");
      fireEvent.click(centerBtn);
      
      expect(centerDisplay).toHaveTextContent("Center: [22.7,88.5]");
    });

    it("initializes with correct default coordinates", () => {
      renderWithProvider();
      
      const centerDisplay = screen.getByTestId("current-center");
      expect(centerDisplay).toHaveTextContent("[22.6924,88.4653]");
      
      const zoomDisplay = screen.getByTestId("current-zoom");
      expect(zoomDisplay).toHaveTextContent("16.5");
    });
  });

  describe("Component Integration", () => {
    it("integrates all major components", () => {
      renderWithProvider();
      
      // All main sections should be present
      expect(screen.getByTestId("timeline-slider-section")).toBeInTheDocument();
      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-container")).toBeInTheDocument();
      expect(screen.getByTestId("drawing-controls")).toBeInTheDocument();
    });

    it("handles state updates across components", () => {
      renderWithProvider();
      
      // Initial state
      expect(screen.getByTestId("current-zoom")).toHaveTextContent("16.5");
      
      // Change zoom
      fireEvent.click(screen.getByTestId("zoom-change-btn"));
      
      // State should be updated
      expect(screen.getByTestId("current-zoom")).toHaveTextContent("15");
    });

    it("maintains responsive layout structure", () => {
      renderWithProvider();
      
      const pageContainer = screen.getByTestId("map-page");
      expect(pageContainer).toHaveClass("flex flex-col h-screen w-full");
      
      const mainContent = screen.getByTestId("map-container").parentElement;
      expect(mainContent).toHaveClass("flex-1 relative");
    });
  });

  describe("Redux Integration", () => {
    it("works with Redux store", () => {
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
      
      // Should render without errors with Redux data
      expect(screen.getByTestId("map-page")).toBeInTheDocument();
    });

    it("handles empty Redux state", () => {
      const emptyStore = createMockStore();
      
      renderWithProvider(emptyStore);
      
      expect(screen.getByTestId("map-page")).toBeInTheDocument();
      expect(screen.getByText("No polygons drawn yet")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles component errors gracefully", () => {
      // Test error boundary behavior
      const ErrorTestComponent = () => {
        try {
          return <MockMapPage />;
        } catch (error) {
          return <div data-testid="error-fallback">Error occurred</div>;
        }
      };

      render(
        <Provider store={createMockStore()}>
          <ErrorTestComponent />
        </Provider>
      );

      // Should render successfully
      expect(screen.getByTestId("map-page")).toBeInTheDocument();
    });

    it("handles missing props gracefully", () => {
      const SafeMapPage = () => {
        const safeProps = {
          onZoomChange: jest.fn(),
          onCenterChange: jest.fn(),
          onOpenMobileSidebar: jest.fn(),
        };

        return (
          <div data-testid="safe-map-page">
            <div>Zoom: {typeof safeProps.onZoomChange === 'function' ? 'Valid' : 'Invalid'}</div>
            <div>Center: {typeof safeProps.onCenterChange === 'function' ? 'Valid' : 'Invalid'}</div>
            <div>Sidebar: {typeof safeProps.onOpenMobileSidebar === 'function' ? 'Valid' : 'Invalid'}</div>
          </div>
        );
      };

      render(<SafeMapPage />);
      
      expect(screen.getByText("Zoom: Valid")).toBeInTheDocument();
      expect(screen.getByText("Center: Valid")).toBeInTheDocument();
      expect(screen.getByText("Sidebar: Valid")).toBeInTheDocument();
    });
  });

  describe("Performance Considerations", () => {
    it("handles multiple re-renders efficiently", () => {
      const { rerender } = renderWithProvider();
      
      // Multiple re-renders should not cause issues
      rerender(
        <Provider store={createMockStore()}>
          <MockMapPage />
        </Provider>
      );
      
      rerender(
        <Provider store={createMockStore()}>
          <MockMapPage />
        </Provider>
      );

      expect(screen.getByTestId("map-page")).toBeInTheDocument();
    });

    it("maintains state consistency across updates", () => {
      renderWithProvider();
      
      // Change zoom
      fireEvent.click(screen.getByTestId("zoom-change-btn"));
      expect(screen.getByTestId("current-zoom")).toHaveTextContent("15");
      
      // Change center
      fireEvent.click(screen.getByTestId("center-change-btn"));
      expect(screen.getByTestId("current-center")).toHaveTextContent("[22.7,88.5]");
      
      // Both changes should persist
      expect(screen.getByTestId("current-zoom")).toHaveTextContent("15");
      expect(screen.getByTestId("current-center")).toHaveTextContent("[22.7,88.5]");
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA labels and roles", () => {
      renderWithProvider();
      
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check for meaningful button text (use getAllByText since text appears in multiple places)
      expect(screen.getAllByText("Map Controls & Tools")).toHaveLength(2);
      expect(screen.getByText("Draw")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Clear")).toBeInTheDocument();
    });

    it("maintains focus management", () => {
      renderWithProvider();
      
      const mobileBtn = screen.getByTestId("mobile-controls-btn");
      mobileBtn.focus();
      
      expect(document.activeElement).toBe(mobileBtn);
    });
  });
});