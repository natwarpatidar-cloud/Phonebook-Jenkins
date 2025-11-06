import { configureStore } from '@reduxjs/toolkit';
import contactReducer from './contactSlice';
import authSlice from './authSlice';

const store = configureStore({
  reducer: {
    contacts: contactReducer,
    auth: authSlice
  }
});

export default store;