import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rowData: null, 
    error: null,
};

const sewingInputSlice = createSlice({
    name: 'sewingInput',
    initialState,
    reducers: {
        saveRows: (state, action) => {
            state.rowData = action.payload;
            state.error = null;
        },
        clearRows: (state) => {
            state.rowData = null; 
            state.error = null;
        },
        errorSavingRows: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { saveRows, clearRows, errorSavingRows } = sewingInputSlice.actions;
export default sewingInputSlice.reducer;
