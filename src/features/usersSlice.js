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
      state.favorites.push(action.payload);
    },

    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setSearchQuery } = usersSlice.actions;
export default usersSlice.reducer;