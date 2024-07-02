import { configureStore } from '@reduxjs/toolkit';
import radiusReducer from './radiusSlice';

const store = configureStore({
  reducer: {
    radius: radiusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
