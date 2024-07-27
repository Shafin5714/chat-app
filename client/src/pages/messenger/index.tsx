import { Col, Row } from 'antd';
import ChatList from './components/ChatList';
import ChatBody from './components/ChatBody';
import { useState } from 'react';

type TFriend = {
  image: string;
  username: string;
  email: string;
  _id: string;
};

export default function Messenger() {
  const [currentFriend, setCurrentFriend] = useState<TFriend | null>(null);

  return (
    <Row>
      <Col span={6}>
        <ChatList
          setCurrentFriend={setCurrentFriend}
          currentFriend={currentFriend}
        />
      </Col>
      <Col span={12}>
        <ChatBody currentFriend={currentFriend} />
      </Col>
      <Col span={6}>Coming Soon</Col>
    </Row>
  );
}
