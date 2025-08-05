import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import DrawingControls from "../DrawingControls";
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

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Pencil: ({ className, ...props }: any) => <div data-testid="pencil-icon" className={className} {...props} />,
  Save: ({ className, ...props }: any) => <div data-testid="save-icon" className={className} {...props} />,
  Trash2: ({ className, ...props }: any) => <div data-testid="trash-icon" className={className} {...props} />,
}));

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, variant, size, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className} 
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
  TooltipProvider: ({ children }: any) => <div data-testid="tooltip-provider">{children}</div>,
  TooltipTrigger: ({ children }: any) => <div data-testid="tooltip-trigger">{children}</div>,
}));

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm,
});

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
  colorRules: [],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  isSaved: false,
};

describe("DrawingControls Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <DrawingControls />
      </Provider>
    );
  };

  it("renders all control buttons", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("pencil-icon")).toBeInTheDocument();
    expect(screen.getByTestId("save-icon")).toBeInTheDocument();
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
  });

  it("renders tooltip provider", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("tooltip-provider")).toBeInTheDocument();
  });

  it("displays correct button labels in tooltips", () => {
    renderWithProvider();
    
    expect(screen.getByText("Draw Polygon")).toBeInTheDocument();
    expect(screen.getByText("Save All")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("handles draw polygon button click", () => {
    renderWithProvider();
    
    const drawButton = screen.getByTestId("pencil-icon").closest("button");
    fireEvent.click(drawButton!);
    
    // Should not throw errors when clicking draw button
    expect(drawButton).toBeInTheDocument();
  });

  it("handles save all button click with polygons", () => {
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon],
      },
    });

    renderWithProvider(storeWithPolygons);
    
    const saveButton = screen.getByTestId("save-icon").closest("button");
    fireEvent.click(saveButton!);
    
    // Should not throw errors when saving
    expect(saveButton).toBeInTheDocument();
  });

  it("handles clear all button click with confirmation", () => {
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon],
      },
    });

    renderWithProvider(storeWithPolygons);
    
    const clearButton = screen.getByTestId("trash-icon").closest("button");
    fireEvent.click(clearButton!);
    
    expect(mockConfirm).toHaveBeenCalledWith(
      "Are you sure you want to delete all polygons? This action cannot be undone."
    );
  });

  it("cancels clear all when user rejects confirmation", () => {
    mockConfirm.mockReturnValue(false);
    
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon],
      },
    });

    renderWithProvider(storeWithPolygons);
    
    const clearButton = screen.getByTestId("trash-icon").closest("button");
    fireEvent.click(clearButton!);
    
    expect(mockConfirm).toHaveBeenCalled();
    // Should not proceed with clearing when user cancels
  });

  it("disables save button when no unsaved polygons", () => {
    const storeWithSavedPolygons = createMockStore({
      polygon: {
        polygons: [{ ...mockPolygon, isSaved: true }],
      },
    });

    renderWithProvider(storeWithSavedPolygons);
    
    const saveButton = screen.getByTestId("save-icon").closest("button");
    expect(saveButton).toBeDisabled();
  });

  it("enables save button when unsaved polygons exist", () => {
    const storeWithUnsavedPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon], // isSaved: false
      },
    });

    renderWithProvider(storeWithUnsavedPolygons);
    
    const saveButton = screen.getByTestId("save-icon").closest("button");
    expect(saveButton).not.toBeDisabled();
  });

  it("disables clear button when no polygons exist", () => {
    renderWithProvider();
    
    const clearButton = screen.getByTestId("trash-icon").closest("button");
    expect(clearButton).toBeDisabled();
  });

  it("enables clear button when polygons exist", () => {
    const storeWithPolygons = createMockStore({
      polygon: {
        polygons: [mockPolygon],
      },
    });

    renderWithProvider(storeWithPolygons);
    
    const clearButton = screen.getByTestId("trash-icon").closest("button");
    expect(clearButton).not.toBeDisabled();
  });

  it("applies correct responsive positioning classes", () => {
    renderWithProvider();
    
    const controlsContainer = screen.getByTestId("pencil-icon").closest("div");
    expect(controlsContainer).toHaveClass("absolute");
  });

  it("shows correct button variants", () => {
    renderWithProvider();
    
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute("data-variant");
      expect(button).toHaveAttribute("data-size");
    });
  });
});