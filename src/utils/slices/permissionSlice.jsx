// src/redux/permissionSlice.jsx
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import DjangoConfig from '../../config/Config';

const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    menuItems: [],
    status: 'idle', // Can be 'idle', 'loading', 'succeeded', 'failed'
    error: null
  },
  reducers: {
    fetchMenuStart(state) {
      state.status = 'loading';
    },
    fetchMenuSuccess(state, action) {
      state.status = 'succeeded';
      state.menuItems = action.payload; 
    },
    fetchMenuFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
  }
});

export const { fetchMenuStart, fetchMenuSuccess, fetchMenuFailure } = permissionSlice.actions;

export const fetchMenuData = () => async (dispatch) => {
  dispatch(fetchMenuStart());
  try {
    const response = await axios.get(`${DjangoConfig.apiUrl}/access-armor/user-menu/`, { withCredentials: true });
    // const response = await axios.get('http://103.190.95.164:11004/compliance/api/audit/');//, { withCredentials: true });
    // console.log(response2)

    dispatch(fetchMenuSuccess(response.data)); // Pass the entire data structure
  } catch (error) {
    dispatch(fetchMenuFailure(error.toString()));
  }
};

export default permissionSlice.reducer;
