import { Flex, Space, Avatar, Divider, Input, Card, Button } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import messengerApi, { useGetFriendsQuery } from '@/apis/messenger';
import { LogoutOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { authSlice } from '@/slices';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

type TFriend = {
  image: string;
  username: string;
  email: string;
  _id: string;
};

type Props = {
  setCurrentFriend: React.Dispatch<React.SetStateAction<TFriend | null>>;
  currentFriend: TFriend | null;
};

export default function ChatList({ setCurrentFriend, currentFriend }: Props) {
  // hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // state
  const { userInfo } = useAppSelector((state) => state.auth);
  const { Search } = Input;

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  const { data } = useGetFriendsQuery();

  useEffect(() => {
    if (data?.friends.length) {
      setCurrentFriend(data?.friends[0]);
    }
  }, [data]);

  const activeStyle = {
    background: '#13c2c2',
    color: 'white',
  };
  const inactiveStyle = {
    background: 'white',
    color: 'black',
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Flex justify="space-between" align="center" style={{ padding: 10 }}>
          <Space>
            <Avatar src={`http://localhost:5000${userInfo?.image}`} />
            <p>{userInfo?.name}</p>
          </Space>
          <Button
            shape="circle"
            icon={
              <LogoutOutlined
                style={{ color: 'red' }}
                onClick={() => {
                  dispatch(authSlice.actions.logout());
                  dispatch(messengerApi.util.resetApiState());
                  navigate('/login');
                }}
              />
            }
          />
        </Flex>
        <Divider style={{ margin: 0 }} />
      </div>
      <div style={{ padding: '10px 15px' }}>
        <Search placeholder="input search text" onSearch={onSearch} />
      </div>

      <Space direction="vertical" style={{ width: '100%' }}>
        {data?.friends.map((friend) => (
          <Card
            size="small"
            hoverable
            key={friend._id}
            onClick={() => setCurrentFriend(friend)}
            style={
              friend._id === currentFriend?._id ? activeStyle : inactiveStyle
            }
          >
            <Space>
              <Avatar src={`http://localhost:5000${friend.image}`} />
              <p>{friend.username}</p>
            </Space>
          </Card>
        ))}
      </Space>
    </Space>
  );
}
