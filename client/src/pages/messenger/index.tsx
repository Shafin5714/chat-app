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
  const [socketLastMessage, setSocketLastMessage] = useState<{
    senderId: string;
    senderName: string;
    receiverId: string;
    message: {
      text: string;
      image: string;
    };
    createdAt: string;
  } | null>(null);

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
    <Row style={{ marginTop: 10, padding: '0 10px' }}>
      <Col span={6}>
        <ChatList
          setCurrentFriend={setCurrentFriend}
          currentFriend={currentFriend}
          activeIds={activeIds}
          socketLastMessage={socketLastMessage}
        />
      </Col>
      <Col span={12}>
        <ChatBody
          currentFriend={currentFriend}
          setSharedImages={setSharedImages}
          setSocketLastMessage={setSocketLastMessage}
        />
      </Col>
      <Col span={6}>
        <SharedMedia sharedImages={sharedImages} />
      </Col>
    </Row>
  );
}
