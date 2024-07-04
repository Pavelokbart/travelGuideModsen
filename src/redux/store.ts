import { configureStore } from '@reduxjs/toolkit';
import radiusReducer from './radiusSlice';
import userLocationReducer from './userLocationSlice';
import routeReducer from './routeSlice';

const store = configureStore({
  reducer: {
    radius: radiusReducer,
    userLocation: userLocationReducer,
    route: routeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
