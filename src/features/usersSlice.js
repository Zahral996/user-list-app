import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  favorites: [],
  searchQuery: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      state.favorites = [...new Set([...state.favorites, action.payload])]; 
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetList: (state) => {
      state.favorites = [];
      state.searchQuery = '';
    },
  },
});

export const { addToFavorites, removeFromFavorites, setSearchQuery, deleteUser, resetList } = usersSlice.actions;
export default usersSlice.reducer;