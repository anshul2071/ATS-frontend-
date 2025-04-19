// src/pages/Login.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card, Input, Button, Typography, message, Divider, Space, theme,
} from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface FormInputs { email: string; password: string; }

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormInputs) => {
    try {
      const res = await axiosInstance.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      message.success('Logged in successfully');
      navigate('/');
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 404) message.error('Email not registered');
      else if (status === 401) message.error('Incorrect password');
      else message.error('Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: 'linear-gradient(135deg,#e6f7ff,#bae7ff)',
    }}>
      <Card
        bordered={false}
        style={{
          width: 360, borderRadius: token.borderRadius, boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3} style={{ textAlign: 'center' }}>Welcome Back</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                }}
                render={({ field }) => (
                  <Input {...field} size="large" prefix={<MailOutlined />} placeholder="Email" />
                )}
              />
              {errors.email && <Text type="danger">{errors.email.message}</Text>}

              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password required' }}
                render={({ field }) => (
                  <Input.Password {...field} size="large" prefix={<LockOutlined />} placeholder="Password" />
                )}
              />
              {errors.password && <Text type="danger">{errors.password.message}</Text>}

              <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                Log In
              </Button>
            </Space>
          </form>

          <Divider>Or login with</Divider>
          <div style={{ textAlign: 'center' }}>
            <GoogleLogin onSuccess={() => {/* same handleGoogle logic */}} onError={() => message.error('Google login failed')} />
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
