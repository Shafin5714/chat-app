import { Col, Row } from 'antd';

type Props = {
  sharedImages: string[];
};

export default function SharedMedia({ sharedImages }: Props) {
  return (
    <div style={{ padding: 10 }}>
      <Row gutter={[16, 16]}>
        {sharedImages.length &&
          sharedImages.map((image, index) => (
            <Col span={8} key={index}>
              <img
                src={`http://localhost:5000${image}`}
                alt="Image"
                height="100%"
                width="100%"
              />
            </Col>
          ))}
      </Row>
    </div>
  );
}
