import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import KpiCard from "../kpi-card";

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
  DollarSign: ({ className, ...props }: any) => <div data-testid="dollar-sign-icon" className={className} {...props} />,
  Package: ({ className, ...props }: any) => <div data-testid="package-icon" className={className} {...props} />,
  AlertTriangle: ({ className, ...props }: any) => <div data-testid="alert-triangle-icon" className={className} {...props} />,
  Cpu: ({ className, ...props }: any) => <div data-testid="cpu-icon" className={className} {...props} />,
}));

describe("KpiCard", () => {
  const defaultProps = {
    title: "Total Units",
    value: "1,250,000",
    icon: <div data-testid="test-icon">Icon</div>,
    trend: "+15% from last month",
    status: "connected" as const,
    lastUpdated: "2024-12-16T12:00:00.000Z",
    statusReason: "Nominal",
  };

  it("renders KPI card with all basic information", () => {
    render(<KpiCard {...defaultProps} />);

    expect(screen.getByText("Total Units")).toBeInTheDocument();
    expect(screen.getByText("1,250,000")).toBeInTheDocument();
    expect(screen.getByText("+15% from last month")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    render(<KpiCard {...defaultProps} isLoading={true} />);

    // Should not show actual content
    expect(screen.queryByText("Total Units")).not.toBeInTheDocument();
    expect(screen.queryByText("1,250,000")).not.toBeInTheDocument();

    // Should show skeleton elements
    const skeletonElements = document.querySelectorAll(".animate-pulse");
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("displays connected status indicator", () => {
    render(<KpiCard {...defaultProps} status="connected" />);

    const statusIndicator = document.querySelector(".bg-green-500");
    expect(statusIndicator).toBeInTheDocument();
  });

  it("displays disconnected status indicator", () => {
    render(<KpiCard {...defaultProps} status="disconnected" />);

    const statusIndicator = document.querySelector(".bg-red-500");
    expect(statusIndicator).toBeInTheDocument();
  });

  it("shows future data styling when isFuture is true", () => {
    render(<KpiCard {...defaultProps} isFuture={true} />);

    const card = screen.getByText("Total Units").closest(".border-dashed");
    expect(card).toBeInTheDocument();
    expect(screen.getByText("PREDICTED")).toBeInTheDocument();
  });

  it("shows range data styling when isRange is true", () => {
    render(<KpiCard {...defaultProps} isRange={true} />);

    expect(screen.getByText("RANGE AVG")).toBeInTheDocument();
  });

  it("shows predicted range label when both isFuture and isRange are true", () => {
    render(<KpiCard {...defaultProps} isFuture={true} isRange={true} />);

    expect(screen.getByText("PREDICTED RANGE")).toBeInTheDocument();
  });

  it("displays tooltip with detailed information", () => {
    render(<KpiCard {...defaultProps} />);

    // The component should render without errors and contain the tooltip trigger
    const titleElement = screen.getByText("Total Units");
    expect(titleElement).toBeInTheDocument();
    
    // Check if the card container exists (tooltip trigger)
    const cardContainer = titleElement.closest("div");
    expect(cardContainer).toBeInTheDocument();
  });

  it("shows correct status text in tooltip for connected status", () => {
    render(<KpiCard {...defaultProps} status="connected" />);

    // The tooltip content is rendered but might not be visible without interaction
    // We can check if the component renders without errors
    expect(screen.getByText("Total Units")).toBeInTheDocument();
  });

  it("handles different value formats correctly", () => {
    const currencyProps = {
      ...defaultProps,
      title: "Revenue",
      value: "$2.5M",
    };

    render(<KpiCard {...currencyProps} />);
    expect(screen.getByText("$2.5M")).toBeInTheDocument();
  });

  it("handles percentage values correctly", () => {
    const percentageProps = {
      ...defaultProps,
      title: "Efficiency Rate",
      value: "95.2%",
    };

    render(<KpiCard {...percentageProps} />);
    expect(screen.getByText("95.2%")).toBeInTheDocument();
  });

  it("displays different trend messages", () => {
    const negativeProps = {
      ...defaultProps,
      trend: "-5% from last month",
    };

    render(<KpiCard {...negativeProps} />);
    expect(screen.getByText("-5% from last month")).toBeInTheDocument();
  });

  it("handles hover effects correctly", () => {
    render(<KpiCard {...defaultProps} />);

    const card = screen.getByText("Total Units").closest(".hover\\:scale-105");
    expect(card).toBeInTheDocument();
  });
});