export interface Polygon {
  id: string;
  name: string;
  geoJson: GeoJSON.Polygon;
  color: string;
  dataSource?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolygonState {
  polygons: Polygon[];
  selectedPolygon: string | null;
  isDrawing: boolean;
}

export interface PolygonContextType {
  state: PolygonState;
  addPolygon: (polygon: Omit<Polygon, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removePolygon: (id: string) => void;
  selectPolygon: (id: string | null) => void;
  setDrawing: (isDrawing: boolean) => void;
  updatePolygon: (id: string, updates: Partial<Polygon>) => void;
}