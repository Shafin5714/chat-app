import { emptySplitApi } from './emptySplitApi';

type Friend = {
  _id: string;
  username: string;
  email: string;
  image: string;
};

type Message = {
  senderId: string;
  senderName: string;
  receiverId: string;
  message: {
    text: string;
    image: string;
  };
  createdAt: string;
};

type FriendsResponse = {
  friend: Friend;
  lastMessage: Message;
};

type SendMessageResponse = {
  status: string;
  data: Message;
};

type SendMessageRequest = {
  senderName: string;
  receiverId: string;
  message: string;
};

type GetMessagesResponse = {
  status: string;
  messages: Message[];
};

type SendImageResponse = {
  status: string;
  data: Message;
};

export const messageApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<FriendsResponse[], void>({
      query: () => ({ url: '/message/friends' }),
      providesTags: ['Friends'],
      transformResponse: (response: { data: FriendsResponse[] }) =>
        response.data,
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (data) => ({
        url: '/message/send-message',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message', 'Friends'],
    }),
    getMessage: builder.query<
      GetMessagesResponse,
      { id: string; page: number }
    >({
      query: ({ id, page }) => ({
        url: `/message/message/${id as string}?page=${page}`,
      }),
      providesTags: ['Message'],
    }),
    sendImage: builder.mutation<SendImageResponse, FormData>({
      query: (data) => ({
        url: '/message/send-image',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message', 'Friends'],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useSendMessageMutation,
  useGetMessageQuery,
  useSendImageMutation,
} = messageApi;

export default messageApi;
