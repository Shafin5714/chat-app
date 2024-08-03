import { emptySplitApi } from './emptySplitApi';

type Res = {
  friends: {
    _id: string;
    username: string;
    email: string;
    image: string;
  }[];
};

type TMRes = {
  success: true;
  messages: {
    senderId: string;
    senderName: string;
    receiverId: string;
    message: {
      text: string;
      image: string;
    };
  }[];
};

export const messengerApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<Res, void>({
      query: () => ({ url: '/messenger/friends' }),
      providesTags: ['Friends'],
    }),
    sendMessage: builder.mutation<
      {
        success: true;
        message: {
          senderId: string;
          senderName: string;
          receiverId: string;
          message: {
            text: string;
            image: string;
          };
          createdAt: string;
        };
      },
      { senderName: string; receiverId: string; message: string }
    >({
      query: (data) => ({
        url: '/messenger/send-message',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message'],
    }),
    getMessage: builder.query<TMRes, string>({
      query: (id) => ({ url: `/messenger/message/${id}` }),
      providesTags: ['Message'],
    }),
    sendImage: builder.mutation<
      {
        success: true;
        message: {
          senderId: string;
          senderName: string;
          receiverId: string;
          message: {
            text: string;
            image: string;
          };
          createdAt: string;
        };
      },
      FormData
    >({
      query: (data) => ({
        url: '/messenger/send-image',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useSendMessageMutation,
  useGetMessageQuery,
  useSendImageMutation,
} = messengerApi;

export default messengerApi;
