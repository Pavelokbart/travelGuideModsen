import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LatLngExpression } from 'leaflet';

interface RouteContextProps {
  route: LatLngExpression[];
  setRoute: (route: LatLngExpression[]) => void;
  routeInfo: { distance: number; duration: number } | undefined;
  setRouteInfo: (
    info: { distance: number; duration: number } | undefined,
  ) => void;
}

interface RouteProviderProps {
  children: ReactNode;
}

const RouteContext = createContext<RouteContextProps | undefined>(undefined);

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [routeInfo, setRouteInfo] = useState<
    | {
        distance: number;
        duration: number;
      }
    | undefined
  >(undefined);

  return (
    <RouteContext.Provider value={{ route, setRoute, routeInfo, setRouteInfo }}>
      {children}
    </RouteContext.Provider>
  );
};
