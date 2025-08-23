import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const defectMasterSlice = createSlice({
  name: 'defectMaster',
  initialState: {
    size: "",
    operations: [],
  },
  reducers: {
    setSize: (state, action) => {
      state.size = action.payload;
    },
    addOperation: (state, action) => {
      const operationToAdd = action.payload;
      const existingIndex = state.operations.findIndex(op => op.id === operationToAdd.id);
      if (existingIndex !== -1) {
        state.operations[existingIndex] = operationToAdd;
      } else {
        state.operations.push(operationToAdd);
      }
    },
    addFrontCoordinates: (state, action) => {
      const { id, x, y, canvas, dfId } = action.payload;
      const operation = state.operations.find(op => op.id === id);
      if (operation) {
        operation.frontCoordinates.push({ x, y, dfId });
      }
    },

    addBackCoordinates: (state, action) => {
      const { id, x, y, canvas, dfId } = action.payload;
      const operation = state.operations.find(op => op.id === id);
      if (operation) {
        operation.backCoordinates.push({ x, y, dfId });
      }
    },

    resetOperations: (state) => {
      state.operations = [];
    },
  },
});

export const { setSize, addOperation, resetOperations, addFrontCoordinates, addBackCoordinates } = defectMasterSlice.actions;
export default defectMasterSlice.reducer;
