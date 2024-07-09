import { Button, Form, Input, Card, Upload } from 'antd';
import type { FormProps } from 'antd';
import AuthContainer from '@/components/AuthContainer';
import { UploadOutlined } from '@ant-design/icons';
import { useRegisterMutation } from '../../store/apis/auth';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
  upload: File[];
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function Register() {
  // apis
  const [registerUser] = useRegisterMutation();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const { username, email, password, upload } = values;
    const formData = new FormData();
    formData.append('username', username ? username : '');
    formData.append('email', email ? email : '');
    formData.append('password', password ? password : '');
    const image = new File([upload[0]], upload[0].name, {
      type: upload[0].type,
    });

    console.log(image);
    

    formData.append('image', image);

    registerUser(formData);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
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
            name="upload"
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Profile picture required' }]}
          >
            <Upload name="upload" beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
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
