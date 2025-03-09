import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUsersQuery } from '../services/api';
import { Favorite, FavoriteBorder } from '@mui/icons-material'; 
import { IconButton } from '@mui/material';
import {List, ListItem, ListItemText, ListItemAvatar, Avatar,TextField, CircularProgress,} from '@mui/material';
import { addToFavorites, removeFromFavorites, setSearchQuery } from '../features/usersSlice';

const UserList = () => {

  const { data: users, isLoading, isError } = useGetUsersQuery();
  const { favorites, searchQuery } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
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

  return (
    <div className='pt-[200px]'>

      <TextField label="Search users" variant="outlined" className="mb-8 w-full max-w-md mx-auto" fullWidth value={searchQuery} onChange={handleSearch} style={{ margin: '30px', width: "400px" }}/>
      <List>
        {filteredUsers?.map((user) => (
            <ListItem key={user.id}>
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
    </div>
  );
};

export default UserList;