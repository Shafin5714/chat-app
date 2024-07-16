import { Button, Form, Input, Card } from 'antd';
import { useEffect } from 'react';
import type { FormProps } from 'antd';
import AuthContainer from '@/components/AuthContainer';
import { useLoginMutation } from '@/apis/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { authSlice } from '@/slices';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type FieldType = {
  email?: string;
  password?: string;
};

export default function Index() {
  // hooks
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const { email, password } = values;
    try {
      const res = await login({
        email: email as string,
        password: password as string,
      }).unwrap();

      if (res) {
        dispatch(authSlice.actions.setData({ ...res }));
        navigate(redirect);
      }
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
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthContainer>
  );
}
