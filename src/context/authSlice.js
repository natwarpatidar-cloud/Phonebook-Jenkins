import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: JSON.parse(localStorage.getItem('token')) || "",
  user: JSON.parse(localStorage.getItem('user')) || "",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth(state, action) {
      const token = localStorage.getItem('token');
      state.token = JSON.parse(token);
    },
    setToken(state, action) {
      localStorage.setItem('token', JSON.stringify(action.payload.token));
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout(state, action) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.token = ""
      state.user = ""
    }
  }
});

export const { initializeAuth, setToken, logout } = authSlice.actions;
export default authSlice.reducer;