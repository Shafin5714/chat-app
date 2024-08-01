import { useAppSelector } from '@/store';
import { Flex, Space, Avatar, Divider, Typography, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useGetMessageQuery, useSendMessageMutation } from '@/apis/messenger';
import { skipToken } from '@reduxjs/toolkit/query';
import { useRef } from 'react';
import { socket } from '../../../socket';

type Props = {
  currentFriend: {
    image: string;
    username: string;
    email: string;
    _id: string;
  } | null;
};

type TMRes = {
  senderId: string;
  senderName: string;
  receiverId: string;
  message: {
    text: string;
    image: string;
  };
  createdAt: string;
};

export default function ChatBody({ currentFriend }: Props) {
  const [message, setMessage] = useState('');
  const { userInfo } = useAppSelector((store) => store.auth);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [socketMessage, setSocketMessage] = useState<TMRes | null>(null);
  const { data } = useGetMessageQuery(
    currentFriend?._id ? currentFriend?._id : skipToken,
  );
  const [messages, setMessages] = useState<TMRes[] | []>([]);

  useEffect(() => {
    setMessages(data?.messages as TMRes[]);
  }, [data]);

  useEffect(() => {
    socket.on('getMessage', (data) => {
      setSocketMessage(data as TMRes);
    });
  }, []);

  useEffect(() => {
    if (socketMessage && currentFriend) {
      if (
        socketMessage?.senderId === currentFriend?._id &&
        socketMessage.receiverId === userInfo?._id
      ) {
        setMessages([...messages, socketMessage as TMRes]);
      }
    }
  }, [socketMessage]);

  // scroll to bottom
  const msgEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, message]);

  const handleSendMessage = async () => {
    const newMessage = {
      senderName: userInfo?.name as string,
      receiverId: currentFriend?._id as string,
      message,
    };
    const res = await sendMessage(newMessage).unwrap();

    socket.emit('sendMessage', {
      senderName: userInfo?.name as string,
      senderId: userInfo?._id as string,
      receiverId: currentFriend?._id as string,
      message: {
        text: message,
        image: '',
      },
      time: new Date(),
    });

    if (res) {
      const newMessage = {
        createdAt: res.message.createdAt,
        message: res.message.message,
        receiverId: res.message.receiverId,
        senderName: res.message.senderName,
        senderId: res.message.senderId,
      };

      setMessages((prevState) => [...prevState, newMessage]);
      setMessage('');
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <Flex justify="space-between" align="center" style={{ padding: 10 }}>
        <Space>
          <Avatar
            src={
              <img
                src={`http://localhost:5000${currentFriend?.image}`}
                alt="avatar"
              />
            }
          />
          <p>{currentFriend?.username}</p>
        </Space>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <div
        style={{
          overflowY: 'auto',
          height: `calc(100% - 100px)`,
        }}
      >
        <div style={{ padding: 10 }}>
          {messages?.length > 0
            ? messages.map((m, index) =>
                m.senderId === userInfo?._id ? (
                  <Flex
                    justify="flex-end"
                    align="center"
                    key={index}
                    style={{ margin: '10px 0px' }}
                    ref={msgEndRef}
                  >
                    <div
                      style={{
                        maxWidth: 450,
                      }}
                    >
                      <Typography
                        style={{
                          color: 'white',
                          background: '#579ffb',
                          padding: 10,
                          borderRadius: 10,
                        }}
                      >
                        {m.message.text}
                      </Typography>
                    </div>
                  </Flex>
                ) : (
                  <Flex
                    style={{
                      maxWidth: 450,
                      margin: '10px 0px',
                    }}
                    key={index}
                    ref={msgEndRef}
                  >
                    <Typography
                      style={{
                        background: '#ececec',
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      {m.message.text}
                    </Typography>
                  </Flex>
                ),
              )
            : null}
        </div>
      </div>
      <Space.Compact style={{ width: '100%' }}>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button type="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Space.Compact>
    </div>
  );
}
