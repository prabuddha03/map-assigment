import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Sidebar from "../sidebar";
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

// Mock the useTimeSeriesData hook
jest.mock("@/hooks/useTimeSeriesData");
const mockUseTimeSeriesData = useTimeSeriesData as jest.MockedFunction<typeof useTimeSeriesData>;

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Package2: ({ className, ...props }: any) => <div data-testid="package-icon" className={className} {...props} />,
  DollarSign: ({ className, ...props }: any) => <div data-testid="dollar-sign-icon" className={className} {...props} />,
  BarChart3: ({ className, ...props }: any) => <div data-testid="bar-chart-icon" className={className} {...props} />,
  PieChart: ({ className, ...props }: any) => <div data-testid="pie-chart-icon" className={className} {...props} />,
  TrendingUp: ({ className, ...props }: any) => <div data-testid="trending-up-icon" className={className} {...props} />,
  TrendingDown: ({ className, ...props }: any) => <div data-testid="trending-down-icon" className={className} {...props} />,
  Users: ({ className, ...props }: any) => <div data-testid="users-icon" className={className} {...props} />,
}));

// Mock AlertTable component
jest.mock("../alert-table", () => {
  return function MockAlertTable() {
    return <div data-testid="alert-table">Alert Table</div>;
  };
});

// Mock skeleton components
jest.mock("../sidebar-skeleton", () => ({
  SidebarMetricsSkeleton: () => <div data-testid="sidebar-metrics-skeleton">Loading Metrics...</div>,
  AlertTableSkeleton: () => <div data-testid="alert-table-skeleton">Loading Alerts...</div>,
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

describe("Sidebar Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
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
        <Sidebar />
      </Provider>
    );
  };

  it("renders the company name in header", () => {
    renderWithProvider();
    const companyName = screen.getByText(/Industrial IoT/i);
    expect(companyName).toBeInTheDocument();
  });

  it("renders the package icon in header", () => {
    renderWithProvider();
    const packageIcon = screen.getByTestId("package-icon");
    expect(packageIcon).toBeInTheDocument();
  });

  it("has correct link to home page", () => {
    renderWithProvider();
    const homeLink = screen.getByRole("link");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("displays recent alerts section", () => {
    renderWithProvider();
    expect(screen.getByText("Recent Alerts")).toBeInTheDocument();
  });

  it("displays alert table skeleton initially", () => {
    renderWithProvider();
    expect(screen.getByTestId("alert-table-skeleton")).toBeInTheDocument();
  });

  it("shows loading state when data is loading", () => {
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
    expect(screen.getByTestId("sidebar-metrics-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("alert-table-skeleton")).toBeInTheDocument();
  });
});
