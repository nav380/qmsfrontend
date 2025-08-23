import { createSlice } from '@reduxjs/toolkit';

const passMasterSlice = createSlice({
  name: 'passMaster',
  initialState: {
    items1: [],
    items2: [],
  },
  reducers: {
    passOrder: (state, action) => {
      const { size, quantity, entry_time, entry_date } = action.payload;
      state.items1.push({ size, quantity, entry_time, entry_date });
      state.items2.push({ size, quantity, entry_time, entry_date });
    },
    passResetProduct1: (state) => {
      state.items1 = [];
    },
    passResetProduct2: (state) => {
      state.items2 = [];
    },
    passUndo: (state, action) => {
      state.items1.pop();
      state.items2.pop();
    },
  },
});

export const { passOrder, passResetProduct1, passResetProduct2, passUndo } = passMasterSlice.actions;
export default passMasterSlice.reducer;
