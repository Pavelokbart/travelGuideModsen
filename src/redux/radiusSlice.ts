import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RadiusState {
  radius: number;
}

const initialState: RadiusState = {
  radius: 2000,
};

const radiusSlice = createSlice({
  name: 'radius',
  initialState,
  reducers: {
    setRadius: (state, action: PayloadAction<number>) => {
      state.radius = action.payload;
    },
  },
});

export const { setRadius } = radiusSlice.actions;
export default radiusSlice.reducer;
