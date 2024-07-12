import React from 'react';
import { Flex, Space, Avatar, Divider, Typography, Input, Button } from 'antd';
import { calc } from 'antd/es/theme/internal';

export default function ChatBody() {
  return (
    <div style={{ height: '100vh' }}>
      <Flex justify="space-between" align="center" style={{ padding: 10 }}>
        <Space>
          <Avatar>S</Avatar>
          <p>Shafin</p>
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
          <div
            style={{
              maxWidth: 450,
              background: '#ececec',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis
              repellat aspernatur, placeat laboriosam, perspiciatis illo,
              architecto expedita quaerat maiores voluptatem beatae at magni?
              Possimus necessitatibus beatae exercitationem voluptates
              perferendis. Facilis.
            </Typography>
          </div>
          <Flex justify="flex-end" align="center">
            <div
              style={{
                maxWidth: 450,
                background: '#579ffb',
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Typography style={{ color: 'white' }}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis
                repellat aspernatur, placeat laboriosam, perspiciatis illo,
                architecto expedita quaerat maiores voluptatem beatae at magni?
                Possimus necessitatibus beatae exercitationem voluptates
                perferendis. Facilis.
              </Typography>
            </div>
          </Flex>
        </div>
      </div>
      <Space.Compact style={{ width: '100%' }}>
        <Input />
        <Button type="primary">Send</Button>
      </Space.Compact>
    </div>
  );
}
