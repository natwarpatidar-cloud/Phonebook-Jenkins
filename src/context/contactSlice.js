import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  contacts: [],
  searchQuery: '',
  label: '',
  refreshKey: 0
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact(state, action) {
      const newContact = { id: uuidv4(), bookmarked: false, ...action.payload };
      state.contacts.push(newContact);
    },
    removeContact(state, action) {
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
    },
    editContact(state, action) {
      const { id, updatedData } = action.payload;
      const index = state.contacts.findIndex(contact => contact.id === id);
      if (index !== -1) {
        state.contacts[index] = { ...state.contacts[index], ...updatedData };
      }
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setLabel(state, action) {
      state.label = action.payload;
    },
    toggleBookmark(state, action) {
      const contact = state.contacts.find(contact => contact.id === action.payload);
      if (contact) {
        contact.bookmarked = !contact.bookmarked;
      }
    },
    setRefreshKey(state, action) {
      state.refreshKey += action.payload
    }
  }
});

export const { addContact, removeContact, editContact, setSearchQuery, setLabel, toggleBookmark, setRefreshKey } = contactSlice.actions;
export default contactSlice.reducer;