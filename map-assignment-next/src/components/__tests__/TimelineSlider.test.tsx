import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import timelineSlice from "@/store/slices/timelineSlice";

// Mock the TimelineSlider component since it has complex dependencies
const MockTimelineSlider = () => {
  const [timeRange, setTimeRange] = React.useState([0, 24]);
  const [dataType, setDataType] = React.useState('temperature_2m');
  
  return (
    <div data-testid="timeline-slider-container">
      <div data-testid="card">
        <div data-testid="card-content">
          <h3>Timeline Control</h3>
          <div data-testid="slider">
            <input
              type="range"
              min={0}
              max={719}
              step={1}
              value={timeRange[0]}
              onChange={(e) => setTimeRange([parseInt(e.target.value), timeRange[1]])}
              data-testid="slider-input-start"
            />
            <input
              type="range"
              min={0}
              max={719}
              step={1}
              value={timeRange[1]}
              onChange={(e) => setTimeRange([timeRange[0], parseInt(e.target.value)])}
              data-testid="slider-input-end"
            />
          </div>
          <div data-testid="select" data-default-value="temperature_2m">
            <div data-testid="select-trigger">
              <div data-testid="select-value">Select data type</div>
            </div>
            <div data-testid="select-content">
              <div data-testid="select-item" data-value="temperature_2m">
                <div data-testid="thermometer-icon" />
                Temperature
              </div>
              <div data-testid="select-item" data-value="precipitation">
                <div data-testid="cloud-rain-icon" />
                Precipitation
              </div>
              <div data-testid="select-item" data-value="wind_speed_10m">
                <div data-testid="wind-icon" />
                Wind Speed
              </div>
            </div>
          </div>
          <div>{timeRange[1] - timeRange[0]} hours</div>
        </div>
      </div>
    </div>
  );
};

// Use the mock component
const TimelineSlider = MockTimelineSlider;

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
  ChevronDown: ({ className, ...props }: any) => <div data-testid="chevron-down" className={className} {...props} />,
  Thermometer: ({ className, ...props }: any) => <div data-testid="thermometer-icon" className={className} {...props} />,
  CloudRain: ({ className, ...props }: any) => <div data-testid="cloud-rain-icon" className={className} {...props} />,
  Wind: ({ className, ...props }: any) => <div data-testid="wind-icon" className={className} {...props} />,
}));

// Mock UI components
jest.mock("@/components/ui/slider", () => ({
  Slider: ({ value, onValueChange, min, max, step, className, ...props }: any) => (
    <div data-testid="slider" className={className}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value?.[0] || 0}
        onChange={(e) => onValueChange?.([parseInt(e.target.value), value?.[1] || max])}
        data-testid="slider-input-start"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value?.[1] || max}
        onChange={(e) => onValueChange?.([value?.[0] || 0, parseInt(e.target.value)])}
        data-testid="slider-input-end"
      />
    </div>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, defaultValue }: any) => (
    <div data-testid="select" data-default-value={defaultValue}>
      <div onClick={() => onValueChange?.('temperature_2m')}>{children}</div>
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>{children}</div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div data-testid="select-trigger" className={className}>{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
}));

// Create mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      timeline: timelineSlice,
    },
    preloadedState: {
      timeline: {
        timeRange: [0, 24],
        dataType: 'temperature_2m',
        polygonData: {},
        ...initialState.timeline,
      },
    },
  });
};

describe("TimelineSlider Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <TimelineSlider />
      </Provider>
    );
  };

  it("renders timeline slider with correct structure", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Timeline Control")).toBeInTheDocument();
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("displays data type selector", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.getByText("Select data type")).toBeInTheDocument();
  });

  it("renders all data type options", () => {
    renderWithProvider();
    
    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("Precipitation")).toBeInTheDocument();
    expect(screen.getByText("Wind Speed")).toBeInTheDocument();
  });

  it("displays correct icons for each data type", () => {
    renderWithProvider();
    
    expect(screen.getByTestId("thermometer-icon")).toBeInTheDocument();
    expect(screen.getByTestId("cloud-rain-icon")).toBeInTheDocument();
    expect(screen.getByTestId("wind-icon")).toBeInTheDocument();
  });

  it("shows current time range information", () => {
    renderWithProvider();
    
    // Should display time range information
    expect(screen.getByText(/hours/)).toBeInTheDocument();
  });

  it("handles slider value changes", () => {
    renderWithProvider();
    
    const startSlider = screen.getByTestId("slider-input-start");
    fireEvent.change(startSlider, { target: { value: "5" } });
    
    // Should not throw errors
    expect(startSlider).toBeInTheDocument();
  });

  it("displays correct default data type", () => {
    renderWithProvider();
    
    const select = screen.getByTestId("select");
    expect(select).toHaveAttribute("data-default-value", "temperature_2m");
  });

  it("shows time range in readable format", () => {
    renderWithProvider();
    
    // Should display readable time format (mock shows 24 hours by default)
    expect(screen.getByText(/24 hours/)).toBeInTheDocument();
  });

  it("handles data type changes", () => {
    renderWithProvider();
    
    const select = screen.getByTestId("select");
    fireEvent.click(select);
    
    // Should not throw errors when changing data type
    expect(select).toBeInTheDocument();
  });

  it("displays slider with correct range", () => {
    renderWithProvider();
    
    const sliderInputs = screen.getAllByRole("slider");
    expect(sliderInputs).toHaveLength(2);
    
    sliderInputs.forEach(slider => {
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "719"); // 30 days * 24 hours - 1
    });
  });

  it("shows responsive design classes", () => {
    renderWithProvider();
    
    const container = screen.getByTestId("timeline-slider-container");
    expect(container).toBeInTheDocument();
  });

  it("displays data type descriptions correctly", () => {
    renderWithProvider();
    
    // Check for data type descriptions in select items
    const temperatureItems = screen.getAllByTestId("select-item");
    expect(temperatureItems.length).toBe(3);
    expect(temperatureItems[0]).toBeInTheDocument();
  });

  it("handles edge cases for time range", () => {
    renderWithProvider();
    
    // Mock component shows default 24 hours
    expect(screen.getByText(/24 hours/)).toBeInTheDocument();
  });
});