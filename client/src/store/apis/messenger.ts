import { emptySplitApi } from './emptySplitApi';

type Res = {
  friends: {
    _id: string;
    username: string;
    email: string;
    image: string;
  }[];
};

export const messengerApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<Res, void>({
      query: () => ({ url: '/messenger/friends' }),
      providesTags: ['Friends'],
    }),
  }),
});

export const { useGetFriendsQuery } = messengerApi;
