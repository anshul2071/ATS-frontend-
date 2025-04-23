// src/pages/Login.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  Input,
  Button,
  Typography,
  message,
  Divider,
  Space,
  theme,
  Modal,
  Form,
} from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/userSlice';
import auth from '../assests/auth.jpg'

const { Title, Text } = Typography;

interface FormInputs {
  email: string;
  password: string;
}

interface ForgotInputs {
  email: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();

 
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ defaultValues: { email: '', password: '' } });

  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotForm] = Form.useForm<ForgotInputs>();

  const onSubmit = async (data: FormInputs) => {
    try {
      const res = await axiosInstance.post('/auth/login', data);
      dispatch(setCredentials({ token: res.data.token, email: res.data.email }));
      message.success('Logged in successfully');
      navigate('/');
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 404) message.error('Email not registered');
      else if (status === 401) message.error('Incorrect password');
      else message.error('Login failed');
    }
  };

  const handleGoogle = async (resp: any) => {
    try {
      const res = await axiosInstance.post('/auth/google', { credential: resp.credential });
      dispatch(setCredentials({ token: res.data.token, email: res.data.email }));
      message.success(`Logged in as ${res.data.email}`);
      navigate('/');
    } catch {
      message.error('Google login failed');
    }
  };

  const handleForgot = async (vals: ForgotInputs) => {
    setForgotLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email: vals.email });
      message.success('If that email exists, a reset link has been sent.');
      setForgotVisible(false);
      forgotForm.resetFields();
    } catch {
      message.error('Failed to send reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: `url(${auth})`,
          backgroundSize: 'cover',
          padding: 16,
        }}
      >
        <Card
          style={{
            backgroundColor: '#e8f9fd',
            width: 360,
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            padding: '24px',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={3} style={{ textAlign: 'center', margin: 0 }}>
              Welcome Back
            </Title>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '1rem' }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                     {...field}
                      size="large"
                      prefix={<MailOutlined />}
                      placeholder="Email"
                    />
                  )}
                />
                {errors.email && <Text type="danger">{errors.email.message}</Text>}

                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Password required' }}
                  render={({ field }) => (
                    <Input.Password
                    {...field}
                      size="large"
                      prefix={<LockOutlined />}
                      placeholder="Password"
                    />
                  )}
                />
                {errors.password && <Text type="danger">{errors.password.message}</Text>}

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'right', marginTop: -8 }}>
                  <a
                    onClick={() => setForgotVisible(true)}
                    style={{ color: token.colorPrimary, cursor: 'pointer', fontSize: 12 }}
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isSubmitting}
                  style={{
                    padding: '20px',
                    background: '#1890ff',
                    borderRadius: '15px',
                  }}
                >
                  Log In
                </Button>
              </Space>
            </form>

            <Divider>Or login with</Divider>

            <div style={{ textAlign: 'center' }}>
              <GoogleLogin onSuccess={handleGoogle} onError={() => message.error('Google login failed')} />
            </div>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Text>
                Don’t have an account?{' '}
                <Link style={{ transition: 'color 0.3s', color: token.colorPrimary }} to="/register">
                  Register
                </Link>
              </Text>
            </div>
          </Space>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        title="Reset Password"
        open={forgotVisible}
        onCancel={() => setForgotVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={forgotForm} onFinish={handleForgot} layout="vertical">
          <Form.Item
            label="Enter your email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={forgotLoading}
              style={{ borderRadius: '8px' }}
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Login;
