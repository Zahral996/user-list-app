import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUsersQuery } from '../services/api';
import { Favorite, FavoriteBorder, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, Button, Pagination } from '@mui/material';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  CircularProgress,
} from '@mui/material';
import { addToFavorites, removeFromFavorites, setSearchQuery } from '../features/usersSlice';

const UserList = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const { favorites, searchQuery } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleFavorite = (userId) => {
    if (favorites.includes(userId)) {
      dispatch(removeFromFavorites(userId));
    } else {
      dispatch(addToFavorites(userId));
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading users!</div>;

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the users to display on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className='py-[30px]'>
      <TextField label="Search Users" variant="outlined" className="shadow-sm" fullWidth value={searchQuery} onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment> ),
        }}
      />
      <h3 className='text-3xl font-semibold pt-4 pb-1'>User's List</h3>
      <p className='pb-4'>Select your favorite people from the list below by clicking the heart icon. </p>
      <List className='rounded-md shadow-sm border border-gray-200 shadow-sm'>
        {currentUsers?.map((user) => (
          <ListItem key={user.id} className={`odd:bg-gray-50 even:bg-white`}>
            <IconButton onClick={() => handleFavorite(user.id)}>
              {favorites.includes(user.id) ? (<Favorite color="error" />) : (<FavoriteBorder />)}
            </IconButton>
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.avatar} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default UserList;