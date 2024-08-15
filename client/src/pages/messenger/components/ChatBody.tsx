import { useAppSelector } from '@/store';
import {
  Flex,
  Space,
  Avatar,
  Divider,
  Typography,
  Input,
  Button,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  useGetMessageQuery,
  useSendMessageMutation,
  useSendImageMutation,
} from '@/apis/messenger';
import { skipToken } from '@reduxjs/toolkit/query';
import { useRef } from 'react';
import { socket } from '../../../socket';
import { FileImageOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

type Props = {
  currentFriend: {
    image: string;
    username: string;
    email: string;
    _id: string;
  } | null;
  setSharedImages: React.Dispatch<React.SetStateAction<string[]>>;
  setSocketLastMessage: React.Dispatch<
    React.SetStateAction<{
      senderId: string;
      senderName: string;
      receiverId: string;
      message: {
        text: string;
        image: string;
      };
      createdAt: string;
    } | null>
  >;
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

export default function ChatBody({
  currentFriend,
  setSharedImages,
  setSocketLastMessage,
}: Props) {
  const [message, setMessage] = useState('');
  const { userInfo } = useAppSelector((store) => store.auth);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [sendImage, { isLoading: sendImageLoading }] = useSendImageMutation();
  const [socketMessage, setSocketMessage] = useState<Message | null>(null);
  const { data } = useGetMessageQuery(
    currentFriend?._id ? currentFriend?._id : skipToken,
  );
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [socketTypingData, setSocketTypingData] = useState<{
    senderId: string;
    isTyping: boolean;
  }>({
    senderId: '',
    isTyping: false,
  });

  useEffect(() => {
    setMessages(data?.messages as Message[]);
  }, [data]);

  useEffect(() => {
    socket.on('getMessage', (data) => {
      setSocketMessage(data as Message);
      setSocketLastMessage(data);
    });
    socket.on('typingMessageGet', (data) => {
      setSocketTypingData((prevState) => ({
        ...prevState,
        senderId: data.senderId,
        isTyping: data.isTyping,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketTypingData.senderId === currentFriend?._id) {
      setIsTyping(socketTypingData.isTyping);
    } else {
      setIsTyping(false);
    }
  }, [currentFriend?._id, socketTypingData]);

  useEffect(() => {
    if (socketMessage && currentFriend) {
      if (
        socketMessage?.senderId === currentFriend?._id &&
        socketMessage.receiverId === userInfo?._id
      ) {
        setMessages([...messages, socketMessage as Message]);
      }

      // notification
      if (
        socketMessage?.senderId !== currentFriend?._id &&
        socketMessage.receiverId === userInfo?._id
      ) {
        notification.open({
          message: `${socketMessage?.senderName} send you a message`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketMessage]);

  useEffect(() => {
    socket.emit('typingMessage', {
      senderId: userInfo?._id,
      receiverId: currentFriend?._id,
      isTyping: message.length > 0 ? true : false,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  // scroll to bottom
  const msgEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, message, socketTypingData]);

  useEffect(() => {
    if (messages?.length) {
      const images = messages
        .filter((message) => message.message.image)
        .map((message) => message.message.image);
      setSharedImages(images);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleSendMessage = async () => {
    const newMessage = {
      senderName: userInfo?.username as string,
      receiverId: currentFriend?._id as string,
      message,
    };
    const res = await sendMessage(newMessage).unwrap();

    socket.emit('sendMessage', {
      senderName: userInfo?.username as string,
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
        createdAt: res.data.createdAt,
        message: res.data.message,
        receiverId: res.data.receiverId,
        senderName: res.data.senderName,
        senderId: res.data.senderId,
      };

      setMessages((prevState) => [...prevState, newMessage]);
      setMessage('');
    }
  };

  const handleInput = (value: string) => {
    setMessage(value);
  };

  const handleImage = async (e: any) => {
    const formData = new FormData();
    formData.append('senderName', userInfo?.username as string);
    formData.append('senderId', userInfo?._id as string);
    formData.append('receiverId', currentFriend?._id as string);
    formData.append('image', e.target.files[0]);
    const res = await sendImage(formData).unwrap();

    const newMessage = {
      createdAt: res.data.createdAt,
      message: res.data.message,
      receiverId: res.data.receiverId,
      senderName: res.data.senderName,
      senderId: res.data.senderId,
    };

    socket.emit('sendMessage', {
      senderName: userInfo?.username as string,
      senderId: userInfo?._id as string,
      receiverId: currentFriend?._id as string,
      message: {
        text: '',
        image: res.data.message.image,
      },
      time: new Date(),
    });

    setMessages((prevState) => [...prevState, newMessage]);
    setMessage('');
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
                      {m.message.text ? (
                        <>
                          <Flex justify="flex-end">
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
                          </Flex>
                          <Flex justify="flex-end">
                            <Typography style={{ fontSize: 10 }}>
                              {dayjs(m.createdAt).format('DD/MM/YYYY h:mm A')}
                            </Typography>
                          </Flex>
                        </>
                      ) : (
                        <div>
                          <div
                            style={{
                              padding: 10,
                              border: '1px solid gray',
                              borderRadius: 5,
                            }}
                            ref={msgEndRef}
                          >
                            <img
                              src={`http://localhost:5000${m.message.image}`}
                              alt=""
                              width={300}
                            />
                          </div>
                          <Flex justify="flex-end">
                            <Typography style={{ fontSize: 10 }}>
                              {dayjs(m.createdAt).format('DD/MM/YYYY h:mm A')}
                            </Typography>
                          </Flex>
                        </div>
                      )}
                    </div>
                  </Flex>
                ) : (
                  <div
                    style={{
                      maxWidth: 450,
                      margin: '10px 0px',
                    }}
                    key={index}
                    ref={msgEndRef}
                  >
                    {m.message.text ? (
                      <>
                        <Flex>
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

                        <Flex justify="flex-start">
                          <Typography style={{ fontSize: 10 }}>
                            {dayjs(m.createdAt).format('DD/MM/YYYY h:mm A')}
                          </Typography>
                        </Flex>
                      </>
                    ) : (
                      <>
                        <Flex ref={msgEndRef}>
                          <div
                            style={{
                              padding: 10,
                              border: '1px solid gray',
                              borderRadius: 5,
                            }}
                          >
                            <img
                              src={`http://localhost:5000${m.message.image}`}
                              alt=""
                              width={300}
                            />
                          </div>
                        </Flex>
                        <Flex justify="flex-start">
                          <Typography style={{ fontSize: 10 }}>
                            {dayjs(m.createdAt).format('DD/MM/YYYY h:mm A')}
                          </Typography>
                        </Flex>
                      </>
                    )}
                  </div>
                ),
              )
            : null}
          {isTyping ? (
            <Flex align="center" style={{ margin: '10px 0px' }} ref={msgEndRef}>
              <Typography
                style={{
                  padding: 10,
                  borderRadius: 10,
                  background: '#ececec',
                }}
              >
                Typing...
              </Typography>
            </Flex>
          ) : null}
        </div>
      </div>
      <Space.Compact style={{ width: '100%' }}>
        <Button icon={<FileImageOutlined />} loading={sendImageLoading}>
          <label htmlFor="file">Choose File</label>
          <input
            id="file"
            type="file"
            onChange={handleImage}
            style={{ display: 'none' }}
            hidden
          />
        </Button>

        <Input value={message} onChange={(e) => handleInput(e.target.value)} />
        <Button type="primary" onClick={handleSendMessage} loading={isLoading}>
          Send
        </Button>
      </Space.Compact>
    </div>
  );
}
