import { Button, Form, Input, Card } from 'antd';
import type { FormProps } from 'antd';
import AuthContainer from '@/components/AuthContainer';
import { useLoginMutation } from '@/apis/auth';

type FieldType = {
  email?: string;
  password?: string;
};

export default function Index() {
  // hooks
  const [login, { isLoading }] = useLoginMutation();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    const { email, password } = values;
    try {
      const res = await login({
        email: email as string,
        password: password as string,
      }).unwrap();
      console.log(res);

      // dispatch(setCredentials({ ...res }));
      // navigate(redirect);
    } catch (err) {
      // toast.error(err?.data?.message || err.error);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <AuthContainer>
      <Card title="Login" bordered>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthContainer>
  );
}
