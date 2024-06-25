// types.ts
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

export interface MarkerData {
  id: string;
  name: string;
  position: L.LatLngExpression;
  category: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface LocateUserProps {
  setUserLocation: (position: UserLocation) => void;
}

export interface MarkerPopupProps {
  name: string;
  position: LatLngExpression;
  buildRoute: (
    position: LatLngExpression,
    callback: (distance: number, duration: number) => void,
  ) => void;
  distance?: number;
  xid: string;
  duration?: number;
  clearRoute: () => void;
}

export interface MapProps {
  category: string;
  radius: number;
}
export interface MapPropsWithSearch extends MapProps {
  searchResult: MarkerData | null;
}

export interface FeatureProperties {
  id: string;
  name: string;
  kinds: string;
}

export interface FeatureGeometry {
  coordinates: [number, number];
}

export interface Feature {
  id: string;
  properties: FeatureProperties;
  geometry: FeatureGeometry;
}

export interface ApiResponse {
  features: Feature[];
}
export interface DetailedPlaceInfo {
  name: string;
  description?: string;
  image?: string;
  wikipedia?: string;
  address?: string;
}
export interface DetailedPlaceInfoProps {
  xid: string;
  onClose: () => void;
}
