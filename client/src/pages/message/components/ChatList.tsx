import {
  Flex,
  Space,
  Avatar,
  Divider,
  Input,
  Card,
  Button,
  Badge,
  Typography,
} from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { useGetFriendsQuery } from '@/apis/message';
import { LogoutOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/store';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuthContext, useSocketContext } from '@/contexts';

type TFriend = {
  image: string;
  username: string;
  email: string;
  _id: string;
};

type TFriends = {
  friend: {
    _id: string;
    username: string;
    email: string;
    image: string;
  };
  lastMessage: {
    senderId: string;
    senderName: string;
    receiverId: string;
    message: {
      text: string;
      image: string;
    };
    createdAt: string;
  };
};

type Props = {
  setCurrentFriend: React.Dispatch<React.SetStateAction<TFriend | null>>;
  currentFriend: TFriend | null;
  activeIds: string[];
  socketLastMessage: {
    senderId: string;
    senderName: string;
    receiverId: string;
    message: {
      text: string;
      image: string;
    };
    createdAt: string;
  } | null;
};

export default function ChatList({
  setCurrentFriend,
  currentFriend,
  activeIds,
  socketLastMessage,
}: Props) {
  // hooks
  const { Title } = Typography;
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  // state
  const { userInfo } = useAppSelector((state) => state.auth);
  const [friends, setFriends] = useState<TFriends[]>([]);
  const { Search } = Input;

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  const { data } = useGetFriendsQuery();

  useEffect(() => {
    if (data?.length) {
      setFriends(data);

      if (!currentFriend) {
        setCurrentFriend(data[0]?.friend);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const activeStyle = {
    background: '#13c2c2',
    color: 'white',
  };
  const inactiveStyle = {
    background: 'white',
    color: 'black',
  };

  useEffect(() => {
    if (socketLastMessage) {
      const update = friends.map((friend) => {
        if (socketLastMessage.senderId === friend.friend._id) {
          return { ...friend, lastMessage: socketLastMessage };
        } else {
          return friend;
        }
      });

      setFriends(update as TFriends[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketLastMessage]);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 10,
        border: '1px solid #d3d3d3',
        height: '97.5vh',
      }}
    >
      <div>
        <Flex justify="space-between" align="center" style={{ padding: 10 }}>
          <Space>
            <Avatar src={`http://localhost:5000${userInfo?.image}`} />
            <Title level={5}>{userInfo?.username}</Title>
          </Space>
          <Button
            shape="circle"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            icon={<LogoutOutlined style={{ color: 'red' }} />}
          />
        </Flex>
        <Divider style={{ margin: 0 }} />
      </div>
      <div style={{ padding: '10px 15px' }}>
        <Search placeholder="input search text" onSearch={onSearch} />
      </div>

      <Space direction="vertical" style={{ width: '100%', padding: '0 15px' }}>
        {friends.map(({ friend, lastMessage }) => (
          <Card
            size="small"
            hoverable
            key={friend._id}
            onClick={() => setCurrentFriend(friend)}
            style={
              friend._id === currentFriend?._id ? activeStyle : inactiveStyle
            }
          >
            <Space size="middle">
              <Badge dot={activeIds.includes(friend._id)} status="success">
                <Avatar src={`http://localhost:5000${friend.image}`} />
              </Badge>
              <Space direction="vertical" size={2}>
                <Typography style={{ fontSize: 15 }}>
                  {friend.username}
                </Typography>
                {lastMessage ? (
                  <p style={{ fontSize: 12, color: 'gray' }}>
                    {lastMessage?.senderId === userInfo?._id ? 'You: ' : ''}
                    {lastMessage?.message.text
                      ? `${lastMessage.message.text.slice(0, 10)}${
                          lastMessage.message.text.length > 10 ? '...' : ''
                        }`
                      : ' Sent an image'}
                  </p>
                ) : null}
              </Space>
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
}
