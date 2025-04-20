// src/pages/Register.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  Input,
  Button,
  Typography,
  message,
  Space,
  Divider,
  theme,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/userSlice';
import auth from '../assests/auth.jpg';

const { Title, Text } = Typography;

interface FormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = theme.useToken();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onManualRegister = async (data: FormInputs) => {
    if (data.password !== data.confirmPassword) {
      return message.error('Passwords do not match');
    }
    try {
      await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      message.success(
        'Registration successful! 🎉 Check your email for a verification link before logging in.'
      );
      navigate('/login');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const onGoogleRegister = async (resp: any) => {
    try {
      const res = await axiosInstance.post('/auth/google', {
        credential: resp.credential,
      });
      dispatch(setCredentials({ token: res.data.token, email: res.data.email }));
      message.success(`Logged in as ${res.data.email}`);
      navigate('/');
    } catch (err) {
      console.error(err);
      message.error('Google sign‑up failed');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${auth})`,
      }}
    >
      <Card
        
        style={{
          backgroundColor: ' #e8f9fd',
          width: 400,
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3} style={{ textAlign: 'center' }}>
            Create Your Account
          </Title>

          {/* Manual Registration */}
          <form onSubmit={handleSubmit(onManualRegister)} autoComplete='off'>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* Name */}
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete='off'
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Full Name"
                  />
                )}
              />
              {errors.name && (
                <Text type="danger">{errors.name.message}</Text>
              )}

              {/* Email */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <Input
                   
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="Email"
                  />
                )}
              />
              {errors.email && (
                <Text type="danger">{errors.email.message}</Text>
              )}

              {/* Password */}
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                }}
                render={({ field }) => (
                  <Input.Password
                    
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                )}
              />
              {errors.password && (
                <Text type="danger">{errors.password.message}</Text>
              )}

            
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Please confirm password',
                  validate: (val) =>
                    val === watch('password') || 'Passwords do not match',
                }}
                render={({ field }) => (
                  <Input.Password
                
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text type="danger">{errors.confirmPassword.message}</Text>
              )}

              <Button style={{padding: '20px', borderRadius: '15px'}}
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
              >
                Register
              </Button>
            </Space>
          </form>

          {/* Google Registration */}
          <Divider>Or Sign up with Google</Divider>
          <div style={{ textAlign: 'center' }}>
            <GoogleLogin
              onSuccess={onGoogleRegister}
              onError={() => message.error('Google sign‑up failed')}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Text>
              Already have an account? <Link to="/login">Log In</Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Register;
