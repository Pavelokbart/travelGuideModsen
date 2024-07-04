// src/redux/routeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLngExpression } from 'leaflet';

interface RouteInfo {
  distance: number;
  duration: number;
}

interface RouteState {
  route: LatLngExpression[];
  routeInfo: RouteInfo | null;
}

const initialState: RouteState = {
  route: [],
  routeInfo: null,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRoute: (state, action: PayloadAction<LatLngExpression[]>) => {
      state.route = action.payload;
    },
    setRouteInfo: (state, action: PayloadAction<RouteInfo>) => {
      state.routeInfo = action.payload;
    },
    clearRoute: (state) => {
      state.route = [];
      state.routeInfo = null;
    },
  },
});

export const { setRoute, setRouteInfo, clearRoute } = routeSlice.actions;
export default routeSlice.reducer;
