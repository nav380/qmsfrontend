import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    items: [], 
  },
  reducers: {
    addOrder: (state, action) => {
      const existingOrderIndex = state.items.findIndex(order => order.size === action.payload.size);
      if (existingOrderIndex !== -1) {
        state.items[existingOrderIndex].quantity += action.payload.quantity;
      } else {
        state.items.push({
          size: action.payload.size,
          quantity: action.payload.quantity,
        });
      }
    },
    updateQuantity: (state, action) => {
      const { size, quantity } = action.payload;
      const orderToUpdate = state.items.find(order => order.size === size);
      if (orderToUpdate) {
        orderToUpdate.quantity = quantity;
      }
    },
    resetProduct: (state) => { 
      
      return { items: [] }; 
    },
    decrementQuantity: (state, action) => {
      const { size } = action.payload;
      const item = state.items.find(item => item.size === size);
      if (item) {
          item.quantity = Math.max(item.quantity - 1, 0); // Ensure quantity does not go below 0
      }
  },
  },
});

export const { addOrder, updateQuantity ,resetProduct,decrementQuantity} = orderSlice.actions;
export default orderSlice.reducer;
