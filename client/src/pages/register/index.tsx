import { Button, Form, Input, Card, Upload, Flex } from 'antd';
import type { FormProps } from 'antd';
import AuthContainer from '@/components/AuthContainer';
import { useRegisterMutation } from '../../store/apis/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GetProp, UploadFile, UploadProps, notification } from 'antd';
import ImgCrop from 'antd-img-crop';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
  upload: UploadFile[];
};

type CustomError = {
  status: number;
  data: {
    message: string;
  };
};

export default function Register() {
  // hooks
  const navigate = useNavigate();

  // apis
  const [registerUser] = useRegisterMutation();

  // state
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    const { username, email, password } = values;
    const formData = new FormData();
    formData.append('username', username ? username : '');
    formData.append('email', email ? email : '');
    formData.append('password', password ? password : '');
    formData.append('image', file as File);

    try {
      const res = await registerUser(formData).unwrap();

      if (res.status === 'success') {
        notification.open({
          message: res.message,
        });

        navigate('/login');
      }
    } catch (error) {
      notification.error({
        message: (error as CustomError).data.message,
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      setFile(file);
      return false;
    },
    fileList,
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <AuthContainer>
      <Card title="Register" bordered>
        <Form
          name="basic"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 700, width: 400 }}
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

          <Flex justify="flex-end">
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                {...props}
                fileList={fileList}
                onPreview={onPreview}
                maxCount={1}
                onChange={onChange}
              >
                {fileList.length < 5 && '+ Upload'}
              </Upload>
            </ImgCrop>
          </Flex>

          <Form.Item
            style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </AuthContainer>
  );
}
