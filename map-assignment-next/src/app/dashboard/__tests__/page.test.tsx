import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import DashboardPage from "../page";
import { useTimeSeriesData } from "@/hooks/useTimeSeriesData";
import dateSlice from "@/store/slices/dateSlice";

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
  return function mockDynamic(loader: () => Promise<any>) {
    const MockedComponent = (props: any) => {
      const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null);
      
      React.useEffect(() => {
        loader().then((module) => {
          setComponent(() => module.default || module);
        });
      }, []);

      if (!Component) {
        return <div data-testid="loading-fallback">Loading...</div>;
      }

      return <Component {...props} />;
    };
    
    MockedComponent.displayName = "MockedDynamicComponent";
    return MockedComponent;
  };
});

// Mock the useTimeSeriesData hook
jest.mock("@/hooks/useTimeSeriesData");
const mockUseTimeSeriesData = useTimeSeriesData as jest.MockedFunction<typeof useTimeSeriesData>;

// Mock Lucide icons with simple divs
jest.mock("lucide-react", () => ({
  DollarSign: ({ className, ...props }: any) => <div data-testid="dollar-sign-icon" className={className} {...props} />,
  Package: ({ className, ...props }: any) => <div data-testid="package-icon" className={className} {...props} />,
  AlertTriangle: ({ className, ...props }: any) => <div data-testid="alert-triangle-icon" className={className} {...props} />,
  Cpu: ({ className, ...props }: any) => <div data-testid="cpu-icon" className={className} {...props} />,
  Play: ({ className, ...props }: any) => <div data-testid="play-icon" className={className} {...props} />,
  Pause: ({ className, ...props }: any) => <div data-testid="pause-icon" className={className} {...props} />,
}));

// Mock components
jest.mock("@/components/slider-control", () => {
  return function MockSliderControl() {
    return <div data-testid="slider-control">Slider Control</div>;
  };
});

jest.mock("@/components/playback-controls", () => {
  return function MockPlaybackControls() {
    return <div data-testid="playback-controls">Playback Controls</div>;
  };
});

jest.mock("@/components/theme-toggle", () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle">Theme Toggle</button>;
  };
});

jest.mock("@/components/overall-details", () => {
  return function MockOverallDetails() {
    return <div data-testid="overall-details">Overall Details</div>;
  };
});

jest.mock("@/components/factory-analytics", () => {
  return function MockFactoryAnalytics({ factoryId, onBack }: { factoryId: number; onBack: () => void }) {
    return (
      <div data-testid="factory-analytics">
        <div>Factory Analytics for {factoryId}</div>
        <button onClick={onBack} data-testid="back-button">Back</button>
      </div>
    );
  };
});

// Mock all chart components to render in their respective tabs
jest.mock("@/components/combined-production-chart", () => {
  return function MockCombinedProductionChart() {
    return <div data-testid="combined-production-chart">Production Chart</div>;
  };
});

jest.mock("@/components/machine-health-chart", () => {
  return function MockMachineHealthChart() {
    return <div data-testid="machine-health-chart">Machine Health Chart</div>;
  };
});

jest.mock("@/components/environmental-heatmap", () => {
  return function MockEnvironmentalHeatmap() {
    return <div data-testid="environmental-heatmap">Environmental Heatmap</div>;
  };
});

jest.mock("@/components/efficiency-gauge", () => {
  return function MockEfficiencyGauge() {
    return <div data-testid="efficiency-gauge">Efficiency Gauge</div>;
  };
});

jest.mock("@/components/sales-bar-chart", () => {
  return function MockSalesBarChart() {
    return <div data-testid="sales-bar-chart">Sales Bar Chart</div>;
  };
});

// Mock factory map with factory selection
jest.mock("@/components/factory-map", () => {
  return function MockFactoryMap({ onSelectFactory }: { onSelectFactory: (id: number) => void }) {
    return (
      <div data-testid="factory-map">
        <div>Factory Map</div>
        <button onClick={() => onSelectFactory(1)} data-testid="select-factory-1">
          Select Factory 1
        </button>
        <button onClick={() => onSelectFactory(2)} data-testid="select-factory-2">
          Select Factory 2
        </button>
      </div>
    );
  };
});

jest.mock("@/components/userbase-split-map", () => {
  return function MockUserbaseSplitMap() {
    return <div data-testid="userbase-split-map">Userbase Split Map</div>;
  };
});

// Mock skeleton components
jest.mock("@/components/kpi-card-skeleton", () => {
  return function MockKpiCardSkeleton() {
    return <div data-testid="kpi-card-skeleton">Loading KPI...</div>;
  };
});

jest.mock("@/components/map-skeleton", () => {
  return function MockMapSkeleton() {
    return <div data-testid="map-skeleton">Loading Map...</div>;
  };
});

jest.mock("@/components/chart-skeleton", () => {
  return function MockChartSkeleton() {
    return <div data-testid="chart-skeleton">Loading Chart...</div>;
  };
});

// Mock KPI Card component
jest.mock("@/components/kpi-card", () => {
  return function MockKpiCard({
    title,
    value,
    trend,
    status,
    lastUpdated,
    statusReason,
    isLoading,
    isFuture,
    isRange,
  }: any) {
    if (isLoading) {
      return <div data-testid="kpi-card-loading">Loading...</div>;
    }
    
    return (
      <div data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div data-testid="kpi-title">{title}</div>
        <div data-testid="kpi-value">{value}</div>
        <div data-testid="kpi-trend">{trend}</div>
        <div data-testid="kpi-status">{status}</div>
        {isFuture && <div data-testid="kpi-future-indicator">Future Data</div>}
        {isRange && <div data-testid="kpi-range-indicator">Range Data</div>}
      </div>
    );
  };
});

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

// Mock time series data
const mockTimeSeriesData = {
  timestamp: "2024-12-16T12:00:00.000Z",
  kpis: {
    totalUnits: 1250000,
    defectRate: 0.8,
    energyUse: 210,
    alerts: 5,
  },
  networkStatus: {
    uptime: 99.8,
    avgLatency: 125,
    energyUsage: 820,
    avgTemp: 42,
  },
  financialMetrics: {
    revenueYTD: 25.4,
    monthlyRevenue: 2.1,
    profitGrowth: 12.5,
  },
  operationalMetrics: {
    activeFactories: 4,
    totalWorkers: 1250,
    efficiencyRate: 95.2,
  },
  shareholding: {
    institutional: 68.5,
    retail: 24.2,
    promoter: 7.3,
  },
};

describe("DashboardPage", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    mockUseTimeSeriesData.mockReturnValue({
      currentDataPoint: mockTimeSeriesData,
      loading: false,
      isFutureData: false,
      isRange: false,
      data: [mockTimeSeriesData],
      error: null,
      selectedDateRange: null,
    });
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <DashboardPage />
      </Provider>
    );
  };

  describe("Basic Rendering", () => {
    it("should render the dashboard page with all main components", () => {
      renderWithProvider();

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("slider-control")).toBeInTheDocument();
      expect(screen.getByTestId("playback-controls")).toBeInTheDocument();
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("should display factory count and revenue in header", () => {
      renderWithProvider();

      expect(screen.getByText("Factory Count:")).toBeInTheDocument();
      expect(screen.getByText("Revenue:")).toBeInTheDocument();
      expect(screen.getByText(/\$2\.1M/)).toBeInTheDocument();
    });

    it("should render all tab triggers", () => {
      renderWithProvider();

      expect(screen.getByText("Production")).toBeInTheDocument();
      expect(screen.getByText("Machine Health")).toBeInTheDocument();
      expect(screen.getByText("Environment")).toBeInTheDocument();
      expect(screen.getByText("Efficiency")).toBeInTheDocument();
      expect(screen.getByText("Sales")).toBeInTheDocument();
    });
  });

  describe("KPI Cards", () => {
    it("should render all KPI cards with correct data", () => {
      renderWithProvider();

      // Check that all KPI cards are rendered
      expect(screen.getByTestId("kpi-card-total-units")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-card-avg-defect-rate")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-card-total-energy-use")).toBeInTheDocument();
      expect(screen.getByTestId("kpi-card-total-alerts")).toBeInTheDocument();

      // Check KPI values
      expect(screen.getByText("1,250,000")).toBeInTheDocument();
      expect(screen.getByText("0.8%")).toBeInTheDocument();
      expect(screen.getByText("210 MWh")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should show correct status based on thresholds", () => {
      const highDefectData = {
        ...mockTimeSeriesData,
        kpis: {
          ...mockTimeSeriesData.kpis,
          defectRate: 1.5, // Above threshold
          energyUse: 250, // Above threshold
          alerts: 25, // Above threshold
        },
      };

      mockUseTimeSeriesData.mockReturnValue({
        currentDataPoint: highDefectData,
        loading: false,
        isFutureData: false,
        isRange: false,
        data: [highDefectData],
        error: null,
        selectedDateRange: null,
      });

      renderWithProvider();

      // Should show disconnected status for high values
      const statusElements = screen.getAllByTestId("kpi-status");
      expect(statusElements.some(el => el.textContent === "disconnected")).toBe(true);
    });

    it("should show future data indicators when isFutureData is true", () => {
      mockUseTimeSeriesData.mockReturnValue({
        currentDataPoint: mockTimeSeriesData,
        loading: false,
        isFutureData: true,
        isRange: false,
        data: [mockTimeSeriesData],
        error: null,
        selectedDateRange: null,
      });

      renderWithProvider();

      // Should show future indicators
      const futureIndicators = screen.getAllByTestId("kpi-future-indicator");
      expect(futureIndicators).toHaveLength(4);
    });

    it("should show range data indicators when isRange is true", () => {
      mockUseTimeSeriesData.mockReturnValue({
        currentDataPoint: mockTimeSeriesData,
        loading: false,
        isFutureData: false,
        isRange: true,
        data: [mockTimeSeriesData],
        error: null,
        selectedDateRange: ["2024-12-16T10:00:00.000Z", "2024-12-16T14:00:00.000Z"],
      });

      renderWithProvider();

      // Should show range indicators
      const rangeIndicators = screen.getAllByTestId("kpi-range-indicator");
      expect(rangeIndicators).toHaveLength(4);
    });
  });

  describe("Loading States", () => {
    it("should show KPI card skeletons when loading", () => {
      mockUseTimeSeriesData.mockReturnValue({
        currentDataPoint: null,
        loading: true,
        isFutureData: false,
        isRange: false,
        data: [],
        error: null,
        selectedDateRange: null,
      });

      renderWithProvider();

      // Should show 4 skeleton components
      const skeletons = screen.getAllByTestId("kpi-card-skeleton");
      expect(skeletons).toHaveLength(4);
    });

    it("should show map skeletons while dynamic imports are loading", async () => {
      renderWithProvider();

      // Initially should show loading fallbacks
      await waitFor(() => {
        const loadingElements = screen.queryAllByTestId("loading-fallback");
        expect(loadingElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Factory Selection", () => {
    it("should show overall details by default", async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("overall-details")).toBeInTheDocument();
      });
    });

    it("should show factory analytics when factory is selected", async () => {
      renderWithProvider();

      // Wait for factory map to load and click on factory selection
      await waitFor(() => {
        const selectFactoryButton = screen.getByTestId("select-factory-1");
        fireEvent.click(selectFactoryButton);
      });

      // Should show factory analytics
      await waitFor(() => {
        expect(screen.getByTestId("factory-analytics")).toBeInTheDocument();
        expect(screen.getByText("Factory Analytics for 1")).toBeInTheDocument();
      });
    });

    it("should return to overall details when back button is clicked", async () => {
      renderWithProvider();

      // Select a factory first
      await waitFor(() => {
        const selectFactoryButton = screen.getByTestId("select-factory-1");
        fireEvent.click(selectFactoryButton);
      });

      // Click back button
      await waitFor(() => {
        const backButton = screen.getByTestId("back-button");
        fireEvent.click(backButton);
      });

      // Should show overall details again
      await waitFor(() => {
        expect(screen.getByTestId("overall-details")).toBeInTheDocument();
      });
    });
  });

  describe("Tab Navigation", () => {
    it("should show production chart by default", () => {
      renderWithProvider();

      // Should find production charts (appears in both tab and bottom section)
      const productionCharts = screen.getAllByTestId("combined-production-chart");
      expect(productionCharts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Redux Integration", () => {
    it("should use selected date from Redux store", () => {
      const customStore = createMockStore({
        selectedDate: "2024-12-20T15:30:00.000Z",
      });

      renderWithProvider(customStore);

      // The component should render with the custom date from store
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing current data point gracefully", () => {
      mockUseTimeSeriesData.mockReturnValue({
        currentDataPoint: null,
        loading: false,
        isFutureData: false,
        isRange: false,
        data: [],
        error: "Failed to load data",
        selectedDateRange: null,
      });

      renderWithProvider();

      // Should show fallback values
      expect(screen.getByText(/Factory Count/)).toBeInTheDocument();
      expect(screen.getByText(/Revenue/)).toBeInTheDocument();
      expect(screen.getByText(/\$1\.2M/)).toBeInTheDocument(); // Default revenue
    });

    it("should handle empty KPI data array", () => {
      mockUseTimeSeriesData.mockReturnValue({
        currentDataPoint: null,
        loading: false,
        isFutureData: false,
        isRange: false,
        data: [],
        error: null,
        selectedDateRange: null,
      });

      renderWithProvider();

      // Should show skeleton components instead of KPI cards
      const skeletons = screen.getAllByTestId("kpi-card-skeleton");
      expect(skeletons).toHaveLength(4);
    });
  });

  describe("Responsive Layout", () => {
    it("should adjust layout when factory is selected", async () => {
      renderWithProvider();

      // Select a factory
      await waitFor(() => {
        const selectFactoryButton = screen.getByTestId("select-factory-1");
        fireEvent.click(selectFactoryButton);
      });

      // Check that factory analytics is shown
      await waitFor(() => {
        expect(screen.getByTestId("factory-analytics")).toBeInTheDocument();
      });

      // The overall details should not be visible
      expect(screen.queryByTestId("overall-details")).not.toBeInTheDocument();
    });
  });

  describe("Dynamic Content", () => {
    it("should generate different trends based on data values", () => {
      const lowValueData = {
        ...mockTimeSeriesData,
        kpis: {
          totalUnits: 1000000, // Below threshold
          defectRate: 0.5, // Below threshold
          energyUse: 150, // Below threshold
          alerts: 3, // Below threshold
        },
      };

      mockUseTimeSeriesData.mockReturnValue({
        currentDataPoint: lowValueData,
        loading: false,
        isFutureData: false,
        isRange: false,
        data: [lowValueData],
        error: null,
        selectedDateRange: null,
      });

      renderWithProvider();

      // Should show different trend texts for low values
      const trendElements = screen.getAllByTestId("kpi-trend");
      expect(trendElements.some(el => el.textContent?.includes("+8% from last month"))).toBe(true);
      expect(trendElements.some(el => el.textContent?.includes("-0.3% from last month"))).toBe(true);
      expect(trendElements.some(el => el.textContent?.includes("+3% from last month"))).toBe(true);
      expect(trendElements.some(el => el.textContent?.includes("-3 since last hour"))).toBe(true);
    });
  });
});