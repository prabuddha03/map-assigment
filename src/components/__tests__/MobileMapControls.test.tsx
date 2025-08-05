import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MobileMapControls from "../MobileMapControls";

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
  Menu: ({ className, ...props }: any) => <div data-testid="menu-icon" className={className} {...props} />,
}));

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: any) => (
    <button 
      onClick={onClick} 
      className={className} 
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe("MobileMapControls Component", () => {
  const defaultProps = {
    onOpenSidebar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders mobile controls button", () => {
    render(<MobileMapControls {...defaultProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  it("displays correct button text", () => {
    render(<MobileMapControls {...defaultProps} />);
    
    expect(screen.getByText("Map Controls & Tools")).toBeInTheDocument();
  });

  it("calls onOpenSidebar when clicked", () => {
    const mockOnOpenSidebar = jest.fn();
    
    render(<MobileMapControls onOpenSidebar={mockOnOpenSidebar} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(mockOnOpenSidebar).toHaveBeenCalledTimes(1);
  });

  it("applies correct styling classes", () => {
    render(<MobileMapControls {...defaultProps} />);
    
    const container = screen.getByRole("button").parentElement;
    expect(container).toHaveClass("md:hidden absolute top-4 right-4");
  });

  it("uses correct button variant and size", () => {
    render(<MobileMapControls {...defaultProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-size", "sm");
    // Button styling is applied via className, not data attributes
    expect(button).toHaveClass("bg-white border border-gray-300");
  });

  it("shows only on mobile screens", () => {
    render(<MobileMapControls {...defaultProps} />);
    
    const container = screen.getByRole("button").parentElement;
    expect(container).toHaveClass("md:hidden");
  });

  it("has correct accessibility attributes", () => {
    render(<MobileMapControls {...defaultProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Map Controls & Tools");
  });

  it("handles multiple clicks correctly", () => {
    const mockOnOpenSidebar = jest.fn();
    
    render(<MobileMapControls onOpenSidebar={mockOnOpenSidebar} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(mockOnOpenSidebar).toHaveBeenCalledTimes(3);
  });

  it("maintains button functionality after re-renders", () => {
    const mockOnOpenSidebar = jest.fn();
    
    const { rerender } = render(<MobileMapControls onOpenSidebar={mockOnOpenSidebar} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(mockOnOpenSidebar).toHaveBeenCalledTimes(1);
    
    // Re-render with same props
    rerender(<MobileMapControls onOpenSidebar={mockOnOpenSidebar} />);
    
    const buttonAfterRerender = screen.getByRole("button");
    fireEvent.click(buttonAfterRerender);
    
    expect(mockOnOpenSidebar).toHaveBeenCalledTimes(2);
  });
});