import "@testing-library/jest-dom";

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

describe("Map Utility Functions", () => {
  describe("Coordinate Calculations", () => {
    it("should calculate polygon centroid correctly", () => {
      const calculateCentroid = (coordinates: number[][]) => {
        const latSum = coordinates.reduce((sum, coord) => sum + coord[1], 0);
        const lngSum = coordinates.reduce((sum, coord) => sum + coord[0], 0);
        return [latSum / coordinates.length, lngSum / coordinates.length];
      };

      const testCoordinates = [
        [88.4653, 22.6924],
        [88.4700, 22.6924],
        [88.4700, 22.6970],
        [88.4653, 22.6970],
        [88.4653, 22.6924], // Closing point
      ];

      const centroid = calculateCentroid(testCoordinates);
      expect(centroid[0]).toBeCloseTo(22.694, 2); // Latitude
      expect(centroid[1]).toBeCloseTo(88.467, 2); // Longitude
    });

    it("should handle edge cases in coordinate calculation", () => {
      const calculateCentroid = (coordinates: number[][]) => {
        if (!coordinates || coordinates.length === 0) {
          return [0, 0];
        }
        const latSum = coordinates.reduce((sum, coord) => sum + coord[1], 0);
        const lngSum = coordinates.reduce((sum, coord) => sum + coord[0], 0);
        return [latSum / coordinates.length, lngSum / coordinates.length];
      };

      expect(calculateCentroid([])).toEqual([0, 0]);
      expect(calculateCentroid([[0, 0]])).toEqual([0, 0]);
    });

    it("should calculate area from zoom level and latitude", () => {
      const getApproximateArea = (zoom: number, latitude: number) => {
        const metersPerPixel = (156543.03 * Math.cos(latitude * Math.PI / 180)) / (2 ** zoom);
        const mapWidthInMeters = metersPerPixel * 1024;
        const mapHeightInMeters = metersPerPixel * 768;
        const areaInSqMeters = mapWidthInMeters * mapHeightInMeters;
        const areaInSqKm = areaInSqMeters / 1000000;
        return parseFloat(areaInSqKm.toFixed(2));
      };

      // Test at different zoom levels
      const area12 = getApproximateArea(12, 22.6924);
      const area14 = getApproximateArea(14, 22.6924);
      const area16 = getApproximateArea(16, 22.6924);

      expect(area12).toBeGreaterThan(area14);
      expect(area14).toBeGreaterThan(area16);
      expect(area16).toBeGreaterThan(0);
    });

    it("should handle latitude variations in area calculation", () => {
      const getApproximateArea = (zoom: number, latitude: number) => {
        const metersPerPixel = (156543.03 * Math.cos(latitude * Math.PI / 180)) / (2 ** zoom);
        const mapWidthInMeters = metersPerPixel * 1024;
        const mapHeightInMeters = metersPerPixel * 768;
        const areaInSqMeters = mapWidthInMeters * mapHeightInMeters;
        const areaInSqKm = areaInSqMeters / 1000000;
        return parseFloat(areaInSqKm.toFixed(2));
      };

      const equatorArea = getApproximateArea(14, 0); // Equator
      const madhyamgramArea = getApproximateArea(14, 22.6924); // Madhyamgram
      const arcticArea = getApproximateArea(14, 70); // Arctic

      // Areas should decrease as we move away from equator
      expect(equatorArea).toBeGreaterThan(madhyamgramArea);
      expect(madhyamgramArea).toBeGreaterThan(arcticArea);
    });
  });

  describe("Color Rule Processing", () => {
    it("should apply color rules correctly", () => {
      const getPolygonColor = (value: number, rules: Array<{value: number, operator: string, color: string}>) => {
        for (const rule of rules) {
          switch (rule.operator) {
            case '>':
              if (value > rule.value) return rule.color;
              break;
            case '<':
              if (value < rule.value) return rule.color;
              break;
            case '>=':
              if (value >= rule.value) return rule.color;
              break;
            case '<=':
              if (value <= rule.value) return rule.color;
              break;
            case '=':
              if (value === rule.value) return rule.color;
              break;
          }
        }
        return '#808080'; // Default gray
      };

      const rules = [
        { value: 20, operator: '>', color: '#FF0000' }, // Red for > 20
        { value: 10, operator: '<', color: '#0000FF' }, // Blue for < 10
      ];

      expect(getPolygonColor(25, rules)).toBe('#FF0000'); // Should be red
      expect(getPolygonColor(5, rules)).toBe('#0000FF');  // Should be blue
      expect(getPolygonColor(15, rules)).toBe('#808080'); // Should be default gray
    });

    it("should handle empty color rules", () => {
      const getPolygonColor = (value: number, rules: Array<{value: number, operator: string, color: string}>) => {
        if (!rules || rules.length === 0) {
          return '#808080'; // Default color
        }
        // ... rule processing logic
        return '#808080';
      };

      expect(getPolygonColor(20, [])).toBe('#808080');
      expect(getPolygonColor(20, undefined as any)).toBe('#808080');
    });

    it("should validate color hex format", () => {
      const isValidHexColor = (color: string) => {
        return /^#[0-9A-F]{6}$/i.test(color);
      };

      expect(isValidHexColor('#FF0000')).toBe(true);
      expect(isValidHexColor('#ff0000')).toBe(true);
      expect(isValidHexColor('#FFF')).toBe(false);
      expect(isValidHexColor('red')).toBe(false);
      expect(isValidHexColor('#GGGGGG')).toBe(false);
    });
  });

  describe("Data Type Handling", () => {
    it("should format different data types correctly", () => {
      const formatWeatherValue = (value: number, dataType: string) => {
        switch (dataType) {
          case 'temperature_2m':
            return `${value.toFixed(1)}°C`;
          case 'precipitation':
            return `${value.toFixed(1)}mm`;
          case 'wind_speed_10m':
            return `${value.toFixed(1)}m/s`;
          default:
            return `${value}`;
        }
      };

      expect(formatWeatherValue(20.5, 'temperature_2m')).toBe('20.5°C');
      expect(formatWeatherValue(1.2, 'precipitation')).toBe('1.2mm');
      expect(formatWeatherValue(8.7, 'wind_speed_10m')).toBe('8.7m/s');
      expect(formatWeatherValue(100, 'unknown')).toBe('100');
    });

    it("should get data type labels correctly", () => {
      const getDataTypeLabel = (dataType: string) => {
        switch (dataType) {
          case 'temperature_2m':
            return 'Temperature';
          case 'precipitation':
            return 'Precipitation';
          case 'wind_speed_10m':
            return 'Wind Speed';
          default:
            return 'Unknown';
        }
      };

      expect(getDataTypeLabel('temperature_2m')).toBe('Temperature');
      expect(getDataTypeLabel('precipitation')).toBe('Precipitation');
      expect(getDataTypeLabel('wind_speed_10m')).toBe('Wind Speed');
      expect(getDataTypeLabel('invalid')).toBe('Unknown');
    });
  });

  describe("Local Storage Integration", () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it("should save and load polygon data", () => {
      const savePolygonsToStorage = (polygons: any[]) => {
        localStorage.setItem('saved_polygons', JSON.stringify(polygons));
      };

      const loadPolygonsFromStorage = () => {
        const saved = localStorage.getItem('saved_polygons');
        return saved ? JSON.parse(saved) : [];
      };

      const testPolygons = [
        { id: '1', name: 'Polygon 1', isSaved: true },
        { id: '2', name: 'Polygon 2', isSaved: true },
      ];

      savePolygonsToStorage(testPolygons);
      const loaded = loadPolygonsFromStorage();

      expect(loaded).toHaveLength(2);
      expect(loaded[0].name).toBe('Polygon 1');
      expect(loaded[1].name).toBe('Polygon 2');
    });

    it("should handle localStorage errors gracefully", () => {
      const safeLoadFromStorage = () => {
        try {
          const saved = localStorage.getItem('saved_polygons');
          return saved ? JSON.parse(saved) : [];
        } catch (error) {
          console.warn('Failed to load from localStorage:', error);
          return [];
        }
      };

      // Mock localStorage to throw an error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const result = safeLoadFromStorage();
      expect(result).toEqual([]);

      // Restore original
      localStorage.getItem = originalGetItem;
    });
  });

  describe("Responsive Design Logic", () => {
    it("should handle mobile breakpoint detection", () => {
      const isMobile = (width: number) => width < 768;

      expect(isMobile(320)).toBe(true);  // Mobile
      expect(isMobile(768)).toBe(false); // Desktop
      expect(isMobile(1024)).toBe(false); // Desktop
    });

    it("should calculate responsive dimensions", () => {
      const getResponsiveDimensions = (screenWidth: number) => {
        if (screenWidth < 768) {
          return {
            mapHeight: '60vh',
            sidebarWidth: '100%',
            showMobileControls: true,
          };
        }
        return {
          mapHeight: '100%',
          sidebarWidth: '384px',
          showMobileControls: false,
        };
      };

      const mobile = getResponsiveDimensions(320);
      const desktop = getResponsiveDimensions(1024);

      expect(mobile.mapHeight).toBe('60vh');
      expect(mobile.showMobileControls).toBe(true);
      expect(desktop.mapHeight).toBe('100%');
      expect(desktop.showMobileControls).toBe(false);
    });
  });
});