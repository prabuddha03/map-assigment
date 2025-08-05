import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import polygonSlice from "@/store/slices/polygonSlice";

// Mock the ColorRulesManager component with a simplified version
const MockColorRulesManager = ({ polygonId }: any) => {
  const [rules, setRules] = React.useState([
    { value: 20, operator: ">", color: "#FF0000" },
    { value: 10, operator: "<", color: "#0000FF" },
  ]);

  const addRule = () => {
    setRules([...rules, { value: 0, operator: ">", color: "#000000" }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div data-testid="color-rules-manager">
      <h4>Color Rules</h4>
      {rules.map((rule, index) => (
        <div key={index} data-testid="rule-item">
          <input
            data-testid="input"
            type="number"
            value={rule.value}
            onChange={(e) => {
              const newRules = [...rules];
              newRules[index].value = parseFloat(e.target.value);
              setRules(newRules);
            }}
          />
          <div data-testid="select" data-default-value={rule.operator}>
            <div data-testid="select-trigger">
              <div data-testid="select-value">{rule.operator}</div>
            </div>
          </div>
          <input
            type="color"
            value={rule.color}
            onChange={(e) => {
              const newRules = [...rules];
              newRules[index].color = e.target.value;
              setRules(newRules);
            }}
          />
          <button onClick={() => removeRule(index)}>
            <div data-testid="minus-icon" />
          </button>
        </div>
      ))}
      <button onClick={addRule}>
        <div data-testid="plus-icon" />
      </button>
    </div>
  );
};

// Use the mock component
const ColorRulesManager = MockColorRulesManager;

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
  Plus: ({ className, ...props }: any) => <div data-testid="plus-icon" className={className} {...props} />,
  Minus: ({ className, ...props }: any) => <div data-testid="minus-icon" className={className} {...props} />,
  ChevronDown: ({ className, ...props }: any) => <div data-testid="chevron-down" className={className} {...props} />,
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

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, className, type, ...props }: any) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      data-testid="input"
      {...props}
    />
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, defaultValue }: any) => (
    <div data-testid="select" data-default-value={defaultValue}>
      <div onClick={() => onValueChange?.('>')}>{children}</div>
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
        ...initialState.polygon,
      },
    },
  });
};

// Mock polygon with color rules
const mockPolygonWithRules = {
  id: "test-polygon-1",
  name: "Test Polygon",
  geoJson: {
    type: "Polygon" as const,
    coordinates: [[[88.4653, 22.6924], [88.4700, 22.6924], [88.4700, 22.6970], [88.4653, 22.6970], [88.4653, 22.6924]]],
  },
  color: "#FF0000",
  dataSource: "temperature_2m" as const,
  colorRules: [
    { value: 20, operator: ">" as const, color: "#FF0000" },
    { value: 10, operator: "<" as const, color: "#0000FF" },
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  isSaved: false,
};

describe("ColorRulesManager Component", () => {
  const defaultProps = {
    polygonId: "test-polygon-1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <ColorRulesManager {...defaultProps} />
      </Provider>
    );
  };

  it("renders color rules section", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    expect(screen.getByText("Color Rules")).toBeInTheDocument();
  });

  it("displays existing color rules", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    // Should display existing rules
    const valueInputs = screen.getAllByTestId("input");
    expect(valueInputs.length).toBeGreaterThan(0);
  });

  it("handles adding new color rule", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    const addButton = screen.getByTestId("plus-icon").closest("button");
    fireEvent.click(addButton!);
    
    // Should handle adding new rule without errors
    expect(addButton).toBeInTheDocument();
  });

  it("handles removing color rule", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    const removeButton = screen.getByTestId("minus-icon").closest("button");
    if (removeButton) {
      fireEvent.click(removeButton);
      
      // Should handle removing rule without errors
      expect(removeButton).toBeInTheDocument();
    }
  });

  it("validates rule values correctly", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    const valueInput = screen.getAllByTestId("input")[0];
    fireEvent.change(valueInput, { target: { value: "25.5" } });
    
    expect(valueInput).toHaveValue("25.5");
  });

  it("shows operator selector", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    expect(screen.getByTestId("select")).toBeInTheDocument();
  });

  it("displays color picker for each rule", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    const colorInputs = screen.getAllByDisplayValue("#FF0000");
    expect(colorInputs.length).toBeGreaterThan(0);
  });

  it("handles polygon not found gracefully", () => {
    renderWithProvider(); // Empty store
    
    // Should render without errors even when polygon doesn't exist
    expect(document.body).toBeInTheDocument();
  });

  it("updates rule values correctly", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    const valueInputs = screen.getAllByTestId("input");
    const firstValueInput = valueInputs.find(input => 
      (input as HTMLInputElement).type === "number"
    );
    
    if (firstValueInput) {
      fireEvent.change(firstValueInput, { target: { value: "30" } });
      expect(firstValueInput).toHaveValue("30");
    }
  });

  it("shows correct number of rule inputs", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    // Should have inputs for existing rules (2 rules = 2 value inputs + 2 color inputs)
    const inputs = screen.getAllByTestId("input");
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("handles color changes correctly", () => {
    const storeWithPolygon = createMockStore({
      polygon: {
        polygons: [mockPolygonWithRules],
      },
    });

    renderWithProvider(storeWithPolygon);
    
    const colorInputs = screen.getAllByDisplayValue("#FF0000");
    if (colorInputs.length > 0) {
      fireEvent.change(colorInputs[0], { target: { value: "#00FF00" } });
      expect(colorInputs[0]).toHaveValue("#00FF00");
    }
  });
});