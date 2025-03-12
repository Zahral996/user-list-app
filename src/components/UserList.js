import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUsersQuery, useGetFavoritesQuery, useDeleteUserMutation } from '../services/api';
import { Search, Favorite, FavoriteBorder, Refresh, Remove } from '@mui/icons-material';
import { IconButton, InputAdornment, Pagination, Button } from '@mui/material';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, CircularProgress } from '@mui/material';
import { addToFavorites, removeFromFavorites, setSearchQuery, deleteUser } from '../features/usersSlice';

const UserList = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const { data: favoritesData, refetch: refetchFavorites } = useGetFavoritesQuery();
  const [deleteUserApi] = useDeleteUserMutation();
  const { favorites, searchQuery } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [backupUsers, setBackupUsers] = useState([]);

  useEffect(() => {
    if (users) {
      setVisibleUsers(users);
      setBackupUsers(users);
    }
  }, [users]);

 
  useEffect(() => {
    if (favoritesData) {
      console.log("Favorites data fetched:", favoritesData); 
      const favoriteIds = favoritesData.map((fav) => fav.id);
      dispatch(addToFavorites(favoriteIds)); 
    } else {
      console.log("No favorites data found.");
    }
  }, [favoritesData, dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
    setCurrentPage(1);
  };

  const handleFavorite = async (user) => {
    try {
      if (favorites.includes(user.id)) {
        await fetch(`/api/favorites/${user.id}`, { method: 'DELETE' });
        dispatch(removeFromFavorites(user.id));
      } else {

        await fetch(`/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, name: user.name, avatar: user.avatar }),
        });
        dispatch(addToFavorites(user.id));
      }


      await refetchFavorites();
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };


  const handleDelete = async (userId) => {
    try {
      await deleteUserApi(userId).unwrap();
      setVisibleUsers((prev) => prev.filter((user) => user.id !== userId));
      dispatch(deleteUser(userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };


  const handleReset = () => {
    setVisibleUsers(backupUsers);
    setCurrentPage(1);
  };

  const handleShowFavorites = async () => {
    try {
      if (favoritesData) {
        console.log("Favorites Data when 'Favorite List' is clicked:", favoritesData);  
        setVisibleUsers(favoritesData);  
        setCurrentPage(1);
      } else {
        console.log('No favorites found!');
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) return <div>Error loading users!</div>;

  const filteredUsers = visibleUsers?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-[30px]">
      <TextField
        label="Search Users"
        variant="outlined"
        className="shadow-sm"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <div className="flex justify-between items-center py-4">
        <h3 className="text-3xl font-semibold">User's List</h3>
        <div className="flex gap-2">
          <Button variant="contained" color="secondary" onClick={handleShowFavorites}>
            Favorite List
          </Button>
          <Button variant="contained" color="primary" startIcon={<Refresh />} onClick={handleReset}>
            Reset List
          </Button>
        </div>
      </div>

      <List className="rounded-md shadow-sm border border-gray-200">
        {currentUsers?.map((user) => (
          <ListItem key={user.id} className="odd:bg-gray-50 even:bg-white">
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.avatar} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />

            <IconButton onClick={() => handleFavorite(user)}>
              {favorites.includes(user.id) ? (
                <Favorite color="error" />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>

            <IconButton onClick={() => handleDelete(user.id)}>
              <Remove color="primary" />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <div className="flex justify-center mt-4">
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </div>
    </div>
  );
};

export default UserList;
