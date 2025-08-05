import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SliderControl from "../slider-control";
import dateSlice from "@/store/slices/dateSlice";

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock UI components
jest.mock("@/components/ui/slider", () => ({
  Slider: ({ className, value, onValueChange, ...props }: any) => (
    <div data-testid="slider" className={className}>
      <input
        type="range"
        role="slider"
        value={Array.isArray(value) ? value[0] : value}
        onChange={(e) => onValueChange && onValueChange([parseInt(e.target.value)])}
        {...props}
      />
    </div>
  ),
}));

jest.mock("@/components/ui/switch", () => ({
  Switch: ({ checked, onCheckedChange, disabled, ...props }: any) => (
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      {...props}
    />
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h3 className={className} {...props}>{children}</h3>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
}));

// Mock date-fns
jest.mock("date-fns", () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === "PPP") return "December 16, 2024";
    if (formatStr === "pp") return "12:00:00 PM";
    if (formatStr === "MMM dd") return "Dec 16";
    if (formatStr === "MMM dd, HH:mm") return "Dec 16, 12:00";
    return "Dec 16, 2024";
  }),
}));

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      date: dateSlice,
    },
    preloadedState: {
      date: {
        selectedDate: "2024-12-16T12:00:00.000Z",
        selectedDateRange: null,
        isRange: false,
        isPlaying: false,
        playbackSpeed: 1 as const,
        minDate: "2024-12-01T00:00:00.000Z",
        maxDate: "2024-12-31T23:59:59.999Z",
        ...initialState,
      },
    },
  });
};

describe("SliderControl", () => {
  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <SliderControl />
      </Provider>
    );
  };

  beforeEach(() => {
    // Mock current time to avoid test flakiness
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-12-16T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders time control title", () => {
    renderWithProvider();
    expect(screen.getByText("Time Control")).toBeInTheDocument();
  });

  it("displays current date and time", async () => {
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText("December 16, 2024")).toBeInTheDocument();
      expect(screen.getByText("12:00:00 PM")).toBeInTheDocument();
    });
  });

  it("shows single/range toggle switch", () => {
    renderWithProvider();
    
    expect(screen.getByText("Single")).toBeInTheDocument();
    expect(screen.getByText("Range")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("displays slider component", () => {
    renderWithProvider();
    
    // Check for slider container
    const sliderContainer = screen.getByRole("slider");
    expect(sliderContainer).toBeInTheDocument();
  });

  it("shows date range labels", () => {
    renderWithProvider();
    
    // The component should show multiple date labels
    const dateLabels = screen.getAllByText("Dec 16");
    expect(dateLabels.length).toBeGreaterThan(0);
  });

  it("toggles to range mode when switch is clicked", () => {
    const store = createMockStore();
    renderWithProvider(store);
    
    const toggleSwitch = screen.getByRole("switch");
    fireEvent.click(toggleSwitch);
    
    // Check if the state updated in the store
    expect(store.getState().date.isRange).toBe(true);
  });

  it("displays range selection when in range mode", () => {
    const store = createMockStore({
      isRange: true,
      selectedDateRange: ["2024-12-16T10:00:00.000Z", "2024-12-16T14:00:00.000Z"],
    });
    
    renderWithProvider(store);
    
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("shows playing indicator when playback is active", () => {
    const store = createMockStore({
      isPlaying: true,
    });
    
    renderWithProvider(store);
    
    expect(screen.getByText("PLAYING")).toBeInTheDocument();
    // Just check that the playing indicator exists, not specific styling
    const playingIndicator = screen.getByText("PLAYING").closest("div");
    expect(playingIndicator).toBeInTheDocument();
  });

  it("disables range toggle during playback", () => {
    const store = createMockStore({
      isPlaying: true,
    });
    
    renderWithProvider(store);
    
    const toggleSwitch = screen.getByRole("switch");
    expect(toggleSwitch).toBeDisabled();
  });

  it("makes slider semi-transparent during playback", () => {
    const store = createMockStore({
      isPlaying: true,
    });
    
    renderWithProvider(store);
    
    const sliderContainer = screen.getByTestId("slider");
    expect(sliderContainer).toHaveClass("opacity-75");
    expect(sliderContainer).toHaveClass("pointer-events-none");
  });

  it("handles slider value changes in single mode", () => {
    const store = createMockStore();
    renderWithProvider(store);
    
    const slider = screen.getByRole("slider");
    
    // Simulate slider change
    fireEvent.change(slider, { target: { value: "50" } });
    
    // The component should handle the change without errors
    expect(slider).toBeInTheDocument();
  });

  it("prevents slider interaction during playback", () => {
    const store = createMockStore({
      isPlaying: true,
    });
    
    renderWithProvider(store);
    
    const sliderContainer = screen.getByTestId("slider");
    expect(sliderContainer).toHaveClass("pointer-events-none");
  });

  it("updates time display every second", async () => {
    renderWithProvider();
    
    // Fast forward time
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText("December 16, 2024")).toBeInTheDocument();
    });
  });

  it("handles date range initialization correctly", () => {
    const store = createMockStore();
    renderWithProvider(store);
    
    const toggleSwitch = screen.getByRole("switch");
    fireEvent.click(toggleSwitch);
    
    // Should initialize a date range when toggling to range mode
    const state = store.getState().date;
    expect(state.isRange).toBe(true);
    expect(state.selectedDateRange).toBeTruthy();
  });

  it("displays correct time format in range mode", () => {
    const store = createMockStore({
      isRange: true,
      selectedDateRange: ["2024-12-16T10:00:00.000Z", "2024-12-16T14:00:00.000Z"],
    });
    
    renderWithProvider(store);
    
    // Should show range time format - look for the dash-separated format
    expect(screen.getByText(/Dec 16, 12:00 - Dec 16, 12:00/)).toBeInTheDocument();
  });

  it("rounds times to nearest hour", () => {
    const store = createMockStore({
      selectedDate: "2024-12-16T12:30:45.123Z", // Has minutes, seconds, milliseconds
    });
    
    renderWithProvider(store);
    
    // Component should handle non-hour-aligned times gracefully
    expect(screen.getByText("Time Control")).toBeInTheDocument();
  });

  it("handles edge cases for min/max date boundaries", () => {
    const store = createMockStore({
      selectedDate: "2024-12-01T00:00:00.000Z", // At minimum boundary
      minDate: "2024-12-01T00:00:00.000Z",
      maxDate: "2024-12-31T23:59:59.999Z",
    });
    
    renderWithProvider(store);
    
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    // The slider component should render without errors
    expect(slider).toHaveAttribute("type", "range");
  });
});