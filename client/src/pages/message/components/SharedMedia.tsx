import { Col, Row, Divider, Typography, Empty, Flex } from 'antd';

type Props = {
  sharedImages: string[];
};

export default function SharedMedia({ sharedImages }: Props) {
  const { Title } = Typography;
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 10,
        border: '1px solid #d3d3d3',
        height: '97.5vh',
      }}
    >
      <Flex
        align="center"
        style={{ paddingTop: 15, paddingLeft: 20, paddingBottom: 5 }}
      >
        <Title level={5}>Media</Title>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <Row gutter={[10, 10]} style={{ padding: 10 }}>
        {sharedImages.length
          ? sharedImages.map((image, index) => (
              <Col span={8} key={index}>
                <img
                  src={`http://localhost:5000${image}`}
                  alt="Image"
                  height="100%"
                  width="100%"
                />
              </Col>
            ))
          : null}
      </Row>
      {sharedImages.length === 0 ? (
        <div style={{ paddingTop: 200 }}>
          <Empty
            description={<Typography.Text>No Images Found</Typography.Text>}
          />
        </div>
      ) : null}
    </div>
  );
}
