import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { authSlice } from '@/slices';

const baseQuery = fetchBaseQuery({
  //   baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    if (userInfo) {
      const { token } = userInfo;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(authSlice.actions.logout());
  }

  if (result.error) {
    console.error(result.error);
  }
  return result;
};

export const emptySplitApi = createApi({
  reducerPath: 'chat-app',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Login', 'Friends', 'Message'],
  endpoints: () => ({}),
});
