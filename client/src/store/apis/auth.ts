import { emptySplitApi } from './emptySplitApi';

type Req = FormData;

type Res = {
  id: string;
  name: string;
  email: string;
  status: number;
  phone: string;
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
      transformResponse: (response: { data: Res }) => response.data,
    }),
  }),

  overrideExisting: false,
});

export const { useRegisterMutation } = authApi;
