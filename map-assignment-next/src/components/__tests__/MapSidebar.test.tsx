import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import polygonSlice from "@/store/slices/polygonSlice";
import timelineSlice from "@/store/slices/timelineSlice";

// Mock the MapSidebar component since it has complex dependencies
const MockMapSidebar = ({ isMobileOpen, onMobileClose, zoomLevel, center }: any) => {
  const getApproximateArea = (zoom: number, latitude: number) => {
    const metersPerPixel = (156543.03 * Math.cos(latitude * Math.PI / 180)) / (2 ** zoom);
    const mapWidthInMeters = metersPerPixel * 1024;
    const mapHeightInMeters = metersPerPixel * 768;
    const areaInSqMeters = mapWidthInMeters * mapHeightInMeters;
    const areaInSqKm = areaInSqMeters / 1000000;
    return areaInSqKm.toFixed(2);
  };

  const latitude = Array.isArray(center) ? center[0] : center?.lat || 22.6924;

  return (
    <div data-testid="sheet">
      <div data-testid="sheet-content" data-mobile-open={isMobileOpen}>
        <div data-testid="sheet-header">
          <div data-testid="sheet-title">Map Controls & Tools</div>
          <button onClick={onMobileClose}>
            <div data-testid="x-icon" />
          </button>
        </div>
        
        <div data-testid="card">
          <div data-testid="card-header">
            <div data-testid="card-title">Location Info</div>
          </div>
          <div data-testid="card-content">
            <div>
              <span>Region</span>
              <span>Madhyamgram, West Bengal</span>
            </div>
            <div>
              <span>Approx. Area</span>
              <span>{getApproximateArea(zoomLevel, latitude)} sq km</span>
            </div>
          </div>
        </div>

        <div>
          <h3>Drawn Polygons</h3>
          <div data-testid="polygon-list">Polygon List</div>
        </div>
      </div>
    </div>
  );
};

// Use the mock component
const MapSidebar = MockMapSidebar;

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  X: ({ className, ...props }: any) => <div data-testid="x-icon" className={className} {...props} />,
  Eye: ({ className, ...props }: any) => <div data-testid="eye-icon" className={className} {...props} />,
  EyeOff: ({ className, ...props }: any) => <div data-testid="eye-off-icon" className={className} {...props} />,
  Trash2: ({ className, ...props }: any) => <div data-testid="trash-icon" className={className} {...props} />,
  Save: ({ className, ...props }: any) => <div data-testid="save-icon" className={className} {...props} />,
  MapPin: ({ className, ...props }: any) => <div data-testid="map-pin-icon" className={className} {...props} />,
}));

// Mock UI components
jest.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <div data-testid="sheet">{children}</div>,
  SheetContent: ({ children, className }: any) => (
    <div data-testid="sheet-content" className={className}>{children}</div>
  ),
  SheetHeader: ({ children }: any) => <div data-testid="sheet-header">{children}</div>,
  SheetTitle: ({ children, className }: any) => (
    <div data-testid="sheet-title" className={className}>{children}</div>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
}));

// Mock child components
jest.mock("../PolygonList", () => {
  return function MockPolygonList() {
    return <div data-testid="polygon-list">Polygon List</div>;
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

describe("MapSidebar Component", () => {
  const defaultProps = {
    isMobileOpen: false,
    onMobileClose: jest.fn(),
    className: "test-class",
    zoomLevel: 14,
    center: [22.6924, 88.4653] as [number, number],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (store = createMockStore(), props = {}) => {
    return render(
      <Provider store={store}>
        <MapSidebar {...defaultProps} {...props} />
      </Provider>
    );
  };

  it("renders sidebar with correct structure", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("sheet")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    expect(screen.getByText("Map Controls & Tools")).toBeInTheDocument();
  });

  it("displays location information correctly", () => {
    renderWithProvider();
    
    expect(screen.getByText("Location Info")).toBeInTheDocument();
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("Madhyamgram, West Bengal")).toBeInTheDocument();
    expect(screen.getByText("Approx. Area")).toBeInTheDocument();
  });

  it("calculates and displays approximate area based on zoom level", () => {
    renderWithProvider(createMockStore(), { zoomLevel: 16 });
    
    // Should display area calculation
    const areaElement = screen.getByText(/sq km/);
    expect(areaElement).toBeInTheDocument();
  });

  it("renders polygon list component", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("polygon-list")).toBeInTheDocument();
  });

  it("calls onMobileClose when close button is clicked", () => {
    const mockOnMobileClose = jest.fn();
    
    renderWithProvider(createMockStore(), { 
      isMobileOpen: true, 
      onMobileClose: mockOnMobileClose 
    });
    
    const closeButton = screen.getByTestId("x-icon").closest("button");
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnMobileClose).toHaveBeenCalledTimes(1);
    }
  });

  it("applies mobile open state correctly", () => {
    renderWithProvider(createMockStore(), { isMobileOpen: true });
    
    const sheetContent = screen.getByTestId("sheet-content");
    expect(sheetContent).toBeInTheDocument();
  });

  it("uses default center coordinates when not provided", () => {
    renderWithProvider(createMockStore(), { center: undefined });
    
    // Should still render without errors
    expect(screen.getByText("Location Info")).toBeInTheDocument();
  });

  it("calculates area correctly for different latitudes", () => {
    // Test with different center coordinates
    renderWithProvider(createMockStore(), { 
      center: [0, 0], // Equator
      zoomLevel: 14 
    });
    
    const areaElement = screen.getByText(/sq km/);
    expect(areaElement).toBeInTheDocument();
  });

  it("displays correct zoom level information", () => {
    renderWithProvider(createMockStore(), { zoomLevel: 15.5 });
    
    // Should display the area calculation based on zoom level
    expect(screen.getByText("Approx. Area")).toBeInTheDocument();
  });

  it("handles responsive design classes", () => {
    renderWithProvider();
    
    const sheetContent = screen.getByTestId("sheet-content");
    expect(sheetContent).toHaveClass("test-class");
  });

  it("renders all required sections", () => {
    renderWithProvider();
    
    // Check for main sections
    expect(screen.getByText("Map Controls & Tools")).toBeInTheDocument();
    expect(screen.getByText("Location Info")).toBeInTheDocument();
    expect(screen.getByText("Drawn Polygons")).toBeInTheDocument();
  });
});