import { Col, Row } from 'antd';
import ChatList from './components/ChatList';
import ChatBody from './components/ChatBody';

export default function Messenger() {
  return (
    <Row>
      <Col span={6}>
        <ChatList />
      </Col>
      <Col span={12}>
        <ChatBody />
      </Col>
      <Col span={6}>Coming Soon</Col>
    </Row>
  );
}
