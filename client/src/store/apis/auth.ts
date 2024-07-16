import { emptySplitApi } from './emptySplitApi';

type Req = FormData;

type Res = {
  _id: string;
  token: string;
  name: string;
  email: string;
  image: string;
};

export const authApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<Res, Req>({
      query: (credentials) => ({
        url: '/user/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { data: Res }) => response.data,
    }),
    login: builder.mutation<Res, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
      // transformResponse: (response: { data: Res }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation } = authApi;
