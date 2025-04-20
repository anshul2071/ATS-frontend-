// src/pages/Login.tsx
import React from 'react';
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
} from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/userSlice';
import auth from '../assests/auth.jpg';


const { Title, Text } = Typography;

interface FormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: { email: '', password: '' },
  });

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
      const res = await axiosInstance.post('/auth/google', {
        credential: resp.credential,
      });
      dispatch(setCredentials({ token: res.data.token, email: res.data.email }));
      message.success(`Logged in as ${res.data.email}`);
      navigate('/');
    } catch {
      message.error('Google login failed');
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
          width: 360,
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3} style={{ textAlign: 'center' }}>
            Welcome Back
          </Title>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='nope'>
            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '1rem'}}>
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
                   size='large' 
                    
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
                    
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                )}
              />
              {errors.password && <Text type="danger">{errors.password.message}</Text>}

              <Button
              style={{ padding: '20px',background: '#1890ff', borderRadius: "15px", width: "100%",  marginTop:'1rem' }}        
                type="primary"
                htmlType="submit"
            
                    size="large"
                loading={isSubmitting}
              >
                Log In
              </Button>
            </Space>
          </form>

          <Divider>Or login with</Divider>

          <div style={{ textAlign: 'center', borderRadius: "20px" }}>
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => message.error('Google login failed')}
            />
          </div>


          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Text>
            Don’t have an account? <Link style={{transition: 'color 0.3s ease-in-out', color: token.colorPrimary}} to="/register">Register</Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
