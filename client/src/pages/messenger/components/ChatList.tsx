import { Flex, Space, Avatar, Divider, Input, Card } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';

export default function ChatList() {
  const { Search } = Input;

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Flex justify="space-between" align="center" style={{ padding: 10 }}>
          <Space>
            <Avatar>S</Avatar>
            <p>Shafin</p>
          </Space>
        </Flex>
        <Divider style={{ margin: 0 }} />
      </div>
      <div style={{ padding: '10px 15px' }}>
        <Search placeholder="input search text" onSearch={onSearch} />
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Card size="small" hoverable>
              <Space key={index}>
                <Avatar>S</Avatar>
                <p>Shafin</p>
              </Space>
            </Card>
          ))}
      </Space>
    </Space>
  );
}
