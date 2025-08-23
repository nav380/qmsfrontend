import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const rejectMasterSlice = createSlice({
  name: 'rejectMaster',
  initialState: {
    size: "",
    operations: [],
  },
  reducers: {
    setRejectSize: (state, action) => {
      state.size = action.payload;
    },
    addRejectOperation: (state, action) => {
      const operationToAdd = action.payload;
      const existingIndex = state.operations.findIndex(op => op.id === operationToAdd.id);
      if (existingIndex !== -1) {
        state.operations[existingIndex] = operationToAdd;
      } else {
        state.operations.push(operationToAdd);
      }
    },
    addRejectFrontImageCord: (state, action) => {
      const { id, x, y, canvas, dfId } = action.payload;
      const operation = state.operations.find(op => op.id === id);
      if (operation) {
          operation.frontCoordinates.push({ x, y, dfId });
      }
  },
    
      addRejectBackImageCord(state, action) {
        const { id, x, y, canvas, dfId } = action.payload;
        const operation = state.operations.find(op => op.id === id);
        if (operation) {
            operation.backCoordinates.push({ x, y, dfId });
        }
    },
    
    resetRejectOperations: (state) => {
      state.operations = [];
    },
  },
});

export const { setRejectSize, addRejectOperation, resetRejectOperations,addRejectFrontImageCord,addRejectBackImageCord } = rejectMasterSlice.actions;
export default rejectMasterSlice.reducer;
