import { ReactNode } from 'react';
import { Flex, Layout } from 'antd';

type Props = {
  children: ReactNode;
};

const containerStyles: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
};

export default function AuthContainer({ children }: Props) {
  return (
    <Layout>
      <Flex align="center" justify="center" style={containerStyles}>
        {children}
      </Flex>
    </Layout>
  );
}
