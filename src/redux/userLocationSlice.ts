import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserLocation } from '../types';

interface UserLocationState {
  location: UserLocation | null;
}

const initialState: UserLocationState = {
  location: null,
};

const userLocationSlice = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<UserLocation>) => {
      state.location = action.payload;
    },
  },
});

export const { setUserLocation } = userLocationSlice.actions;
export default userLocationSlice.reducer;
