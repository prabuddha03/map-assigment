import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Polygon, ColorRule } from '@/types/polygon';

export interface PolygonState {
  polygons: Polygon[];
  savedPolygons: Polygon[];
  selectedPolygon: string | null;
  isDrawing: boolean;
  hiddenPolygons: string[];
}

const initialState: PolygonState = {
  polygons: [],
  savedPolygons: [],
  selectedPolygon: null,
  isDrawing: false,
  hiddenPolygons: [],
};

// Load saved polygons from localStorage
const loadSavedPolygonsFromStorage = (): Polygon[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('saved-polygons');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed
          .map((polygon: any) => ({
            ...polygon,
            createdAt: polygon.createdAt,
            updatedAt: polygon.updatedAt,
          }))
          .filter((polygon: Polygon) => {
            // Filter out polygons with invalid coordinates
            return polygon.geoJson?.coordinates?.[0]?.length >= 4;
          });
      }
    } catch (error) {
      console.error('Error loading saved polygons:', error);
    }
  }
  return [];
};

// Save polygons to localStorage
const savePolygonsToStorage = (polygons: Polygon[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('saved-polygons', JSON.stringify(polygons));
    } catch (error) {
      console.error('Error saving polygons:', error);
    }
  }
};

const polygonSlice = createSlice({
  name: 'polygon',
  initialState: {
    ...initialState,
    savedPolygons: loadSavedPolygonsFromStorage(),
  },
  reducers: {
    addPolygon: (state, action: PayloadAction<Omit<Polygon, 'id' | 'createdAt' | 'updatedAt' | 'colorRules'>>) => {
      const newPolygon: Polygon = {
        ...action.payload,
        id: `polygon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        colorRules: [], // Initialize with empty rules
      };
      state.polygons.push(newPolygon);
      state.isDrawing = false;
    },

    removePolygon: (state, action: PayloadAction<string>) => {
      state.polygons = state.polygons.filter(polygon => polygon.id !== action.payload);
      state.savedPolygons = state.savedPolygons.filter(polygon => polygon.id !== action.payload);
      if (state.selectedPolygon === action.payload) {
        state.selectedPolygon = null;
      }
      state.hiddenPolygons = state.hiddenPolygons.filter(id => id !== action.payload);
      
      // Update localStorage
      savePolygonsToStorage(state.savedPolygons);
    },

    selectPolygon: (state, action: PayloadAction<string | null>) => {
      state.selectedPolygon = action.payload;
    },

    setDrawing: (state, action: PayloadAction<boolean>) => {
      state.isDrawing = action.payload;
    },

    updatePolygon: (state, action: PayloadAction<{ id: string; updates: Partial<Polygon> }>) => {
      const { id, updates } = action.payload;
      
      const update = (polygon: Polygon) => ({
        ...polygon,
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      const polygonIndex = state.polygons.findIndex(p => p.id === id);
      if (polygonIndex !== -1) {
        state.polygons[polygonIndex] = update(state.polygons[polygonIndex]);
      }

      const savedIndex = state.savedPolygons.findIndex(p => p.id === id);
      if (savedIndex !== -1) {
        state.savedPolygons[savedIndex] = update(state.savedPolygons[savedIndex]);
        savePolygonsToStorage(state.savedPolygons);
      }
    },

    addColorRule: (state, action: PayloadAction<{ polygonId: string; rule: Omit<ColorRule, 'id'> }>) => {
      const { polygonId, rule } = action.payload;
      const newRule: ColorRule = { ...rule, id: `rule_${Date.now()}` };
      
      const polygon = state.polygons.find(p => p.id === polygonId);
      if (polygon) {
        polygon.colorRules.push(newRule);
      }
      const savedPolygon = state.savedPolygons.find(p => p.id === polygonId);
      if (savedPolygon) {
        savedPolygon.colorRules.push(newRule);
        savePolygonsToStorage(state.savedPolygons);
      }
    },

    removeColorRule: (state, action: PayloadAction<{ polygonId: string; ruleId: string }>) => {
      const { polygonId, ruleId } = action.payload;

      const filterRules = (polygon: Polygon) => {
        polygon.colorRules = polygon.colorRules.filter(r => r.id !== ruleId);
      };

      const polygon = state.polygons.find(p => p.id === polygonId);
      if (polygon) filterRules(polygon);
      
      const savedPolygon = state.savedPolygons.find(p => p.id === polygonId);
      if (savedPolygon) {
        filterRules(savedPolygon);
        savePolygonsToStorage(state.savedPolygons);
      }
    },

    togglePolygonVisibility: (state, action: PayloadAction<string>) => {
      const polygonId = action.payload;
      if (state.hiddenPolygons.includes(polygonId)) {
        state.hiddenPolygons = state.hiddenPolygons.filter(id => id !== polygonId);
      } else {
        state.hiddenPolygons.push(polygonId);
      }
    },

    savePolygon: (state, action: PayloadAction<string>) => {
      const polygonId = action.payload;
      const polygon = state.polygons.find(p => p.id === polygonId);
      
      if (polygon) {
        // Check if already saved
        const existingIndex = state.savedPolygons.findIndex(p => p.id === polygonId);
        if (existingIndex !== -1) {
          // Update existing saved polygon
          state.savedPolygons[existingIndex] = { ...polygon, updatedAt: new Date().toISOString() };
        } else {
          // Add new saved polygon
          state.savedPolygons.push({ ...polygon, updatedAt: new Date().toISOString() });
        }
        
        savePolygonsToStorage(state.savedPolygons);
      }
    },

    saveAllPolygons: (state) => {
      // Save all current polygons that aren't already saved
      state.polygons.forEach(polygon => {
        const existingIndex = state.savedPolygons.findIndex(p => p.id === polygon.id);
        if (existingIndex !== -1) {
          state.savedPolygons[existingIndex] = { ...polygon, updatedAt: new Date().toISOString() };
        } else {
          state.savedPolygons.push({ ...polygon, updatedAt: new Date().toISOString() });
        }
      });
      
      savePolygonsToStorage(state.savedPolygons);
    },

    loadSavedPolygons: (state) => {
      const saved = loadSavedPolygonsFromStorage();
      state.savedPolygons = saved;
      // Also add to current polygons if not already there
      saved.forEach(savedPolygon => {
        const exists = state.polygons.find(p => p.id === savedPolygon.id);
        if (!exists) {
          state.polygons.push(savedPolygon);
        }
      });
    },

    clearUnsavedPolygons: (state) => {
      state.polygons = state.polygons.filter(p => state.savedPolygons.some(sp => sp.id === p.id));
    },

    clearAllPolygons: (state) => {
      state.polygons = [];
      state.savedPolygons = [];
      state.selectedPolygon = null;
      state.hiddenPolygons = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('saved-polygons');
      }
    },
  },
  
});

export const {
  addPolygon,
  removePolygon,
  selectPolygon,
  setDrawing,
  updatePolygon,
  togglePolygonVisibility,
  savePolygon,
  saveAllPolygons,
  loadSavedPolygons,
  clearUnsavedPolygons,
  clearAllPolygons,
  addColorRule,
  removeColorRule,
} = polygonSlice.actions;

export default polygonSlice.reducer;