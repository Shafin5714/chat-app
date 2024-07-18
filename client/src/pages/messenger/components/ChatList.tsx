import { Flex, Space, Avatar, Divider, Input, Card, Button } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { useGetFriendsQuery } from '@/apis/messenger';
import { LogoutOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { authSlice } from '@/slices';
import { useNavigate } from 'react-router-dom';

export default function ChatList() {
  // hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // state
  const { userInfo } = useAppSelector((state) => state.auth);
  const { Search } = Input;

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  const { data } = useGetFriendsQuery();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Flex justify="space-between" align="center" style={{ padding: 10 }}>
          <Space>
            <Avatar>S</Avatar>
            <p>{userInfo?.name}</p>
          </Space>
          <Button
            shape="circle"
            icon={
              <LogoutOutlined
                style={{ color: 'red' }}
                onClick={() => {
                  dispatch(authSlice.actions.logout());
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
        {data?.friends.map(({ image, username, email, _id }) => (
          <Card size="small" hoverable key={_id}>
            <Space>
              <Avatar>S</Avatar>
              <p>{username}</p>
            </Space>
          </Card>
        ))}
      </Space>
    </Space>
  );
}
