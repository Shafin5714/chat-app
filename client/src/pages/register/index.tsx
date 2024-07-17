import { Button, Form, Input, Card, Upload } from 'antd';
import type { FormProps } from 'antd';
import AuthContainer from '@/components/AuthContainer';

import { useRegisterMutation } from '../../store/apis/auth';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
  upload: File[];
};

export default function Register() {
  // hooks
  const navigate = useNavigate();

  // apis
  const [registerUser] = useRegisterMutation();

  // state
  const [file, setFile] = useState<File | null>(null);
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const { username, email, password } = values;
    const formData = new FormData();
    formData.append('username', username ? username : '');
    formData.append('email', email ? email : '');
    formData.append('password', password ? password : '');

    formData.append('image', file as File);

    registerUser(formData);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  const handleImage = (event: any) => {
    setFile(event.target.files[0]);
  };

  return (
    <AuthContainer>
      <Card title="Register" bordered>
        <Form
          name="basic"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The new password that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Profile picture required' }]}
          >
            <input type="file" onChange={handleImage} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ marginTop: 10 }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthContainer>
  );
}
