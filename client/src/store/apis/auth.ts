import { emptySplitApi } from './emptySplitApi';

type Req = FormData;

type Res = {
  status: string;
  message: string;
  data: {
    _id: string;
    username: string;
    email: string;
    image: string;
  };
  token: string;
};

export const authApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<Res, Req>({
      query: (credentials) => ({
        url: '/user/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<Res, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation } = authApi;
