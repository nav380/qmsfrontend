import { createSlice } from '@reduxjs/toolkit';

const kajButtonSlice = createSlice({
  name: 'kajButton',
  initialState: {
    items1: [],
    items2: [],
  },
  reducers: {
    kajOrder: (state, action) => {
      const { size, quantity, entry_time, entry_date } = action.payload;
      state.items1.push({ size, quantity, entry_time, entry_date });
      state.items2.push({ size, quantity, entry_time, entry_date });
    },
    kajResetProduct1: (state) => {
      state.items1 = [];
    },
    kajResetProduct2: (state) => {
      state.items2 = [];
    },
    kajUndo: (state, action) => {
      state.items1.pop();
      state.items2.pop();
    },
  },
});

export const { kajOrder, kajResetProduct1, kajResetProduct2, kajUndo } = kajButtonSlice.actions;
export default kajButtonSlice.reducer;
