import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://67c82dad0acf98d070854ab8.mockapi.io/api/v1' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
    getFavorites: builder.query({
      query: () => '/favorites', 
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`, 
        method: 'DELETE',
      }),
    }),
  }),
});

export const {  useGetUsersQuery,  useGetFavoritesQuery,  useDeleteUserMutation } = api;
