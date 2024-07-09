import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
// import {
//   getLocalStorageItem,
//   LocalStorageName,
// } from '@/services/local-storage';

const baseQuery = fetchBaseQuery({
  //   baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    // const token = getLocalStorageItem(LocalStorageName.accessToken);

    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    // const refreshResult = await baseQuery('/refreshToken', api, extraOptions);
    // if (refreshResult.data) {
    //   // store the new token
    //   api.dispatch(tokenReceived(refreshResult.data));
    //   // retry the initial query
    //   result = await baseQuery(args, api, extraOptions);
    // } else {
    //   api.dispatch(loggedOut());
    // }
  }

  if (result.error) {
    console.log(result.error);
  }
  return result;
};

export const emptySplitApi = createApi({
  reducerPath: 'chat-app',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Login'],
  endpoints: () => ({}),
});
