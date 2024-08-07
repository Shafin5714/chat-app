import { Col, Row } from 'antd';
import ChatList from './components/ChatList';
import ChatBody from './components/ChatBody';
import SharedMedia from './components/SharedMedia';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { socket } from '../../socket';

type TFriend = {
  image: string;
  username: string;
  email: string;
  _id: string;
};

export default function Messenger() {
  // store
  const { userInfo } = useAppSelector((store) => store.auth);

  // state
  const [currentFriend, setCurrentFriend] = useState<TFriend | null>(null);
  const [activeUsers, setActiveUsers] = useState<
    { userId: string; socketId: string; userInfo: TFriend }[]
  >([]);
  const [sharedImages, setSharedImages] = useState<string[]>([]);

  // effects
  useEffect(() => {
    if (userInfo) {
      socket.emit('addUser', userInfo._id, userInfo);
      socket.on('getUser', (users) => {
        setActiveUsers(users);
      });
    }
  }, [userInfo]);

  const activeIds = activeUsers.map((user) => user.userId);

  return (
    <Row>
      <Col span={6}>
        <ChatList
          setCurrentFriend={setCurrentFriend}
          currentFriend={currentFriend}
          activeIds={activeIds}
        />
      </Col>
      <Col span={12}>
        <ChatBody
          currentFriend={currentFriend}
          setSharedImages={setSharedImages}
        />
      </Col>
      <Col span={6}>
        <SharedMedia sharedImages={sharedImages} />
      </Col>
    </Row>
  );
}
