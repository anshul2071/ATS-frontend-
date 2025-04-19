import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  Input,
  Button,
  Typography,
  message,
  Space,
  theme,
  Tooltip,
} from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadius, colorPrimary, colorTextSecondary },
  } = theme.useToken();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      return message.error('Passwords do not match');
    }
    try {
      await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      message.success('Registration successful! Check your email to verify.');
      navigate('/login');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f5ff, #d6e4ff)',
        padding: 16,
      }}
    >
      <Card
       variant={'borderless'}
        style={{
          width: 380,
          borderRadius,
          background: colorBgContainer,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Visual Hierarchy: Clear, large heading */}
          <Title level={3} style={{ textAlign: 'center', color: colorPrimary }}>
            Create Account
          </Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Simplicity & Clarity: minimal, well‑labeled fields */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Full Name"
                    prefix={<UserOutlined />}
                    aria-label="Full name"
                  />
                )}
              />
              {errors.name && <Text type="danger">{errors.name.message}</Text>}

              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@yourcompany\.com$/,
                    message: 'Use yourcompany.com email',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="name@yourcompany.com"
                    prefix={<MailOutlined />}
                    aria-label="Work email"
                  />
                )}
              />
              {errors.email && <Text type="danger">{errors.email.message}</Text>}

              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Min 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
                    message:
                      'Include uppercase, lowercase, number & special char',
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="Password"
                    prefix={<LockOutlined />}
                    aria-label="Password"
                  />
                )}
              />
              {errors.password && <Text type="danger">{errors.password.message}</Text>}

              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Please confirm password',
                  validate: (v) =>
                    v === watch('password') || 'Passwords do not match',
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="Confirm Password"
                    prefix={<LockOutlined />}
                    aria-label="Confirm password"
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text type="danger">{errors.confirmPassword.message}</Text>
              )}
            </Space>

            {/* User Control: clear Cancel button; Feedback: loading state */}
            <Space style={{ marginTop: 24, width: '100%' }}>
              <Button
                htmlType="button"
                onClick={() => navigate('/login')}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
                style={{ flex: 2 }}
              >
                Register
              </Button>
            </Space>
          </form>
        </Space>
      </Card>
    </div>
  );
};

export default Register;
