import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Card,
  Input,
  Button,
  Typography,
  Alert,
  Space,
  Divider,
  message,
  theme,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../services/axiosInstance'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/userSlice'
import auth from '../assests/auth.jpg'

const { Title, Text } = Typography

interface FormInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { token } = theme.useToken()
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
  })

  const [registrationState, setRegistrationState] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle')
  const [registeredToken, setRegisteredToken] = useState<string>('')
  const [registeredEmail, setRegisteredEmail] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onManualRegister = async (data: FormInputs) => {
    if (data.password !== data.confirmPassword) {
      message.error('Passwords do not match')
      return
    }

    setRegistrationState('sending')
    try {
      const res = await axiosInstance.post<{
        message: string
        token: string
      }>(
        '/auth/register',
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      )

      setRegisteredToken(res.data.token)
      setRegisteredEmail(data.email)
      setRegistrationState('sent')
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Registration failed'
      )
      setRegistrationState('error')
    }
  }

  const onGoogleRegister = async (response: any) => {
    try {
      const res = await axiosInstance.post<{
        token: string
        email: string
      }>(
        '/auth/google',
        {
          credential: response.credential,
        }
      )

      dispatch(
        setCredentials({
          token: res.data.token,
          email: res.data.email,
        })
      )
      navigate('/')
    } catch {
      message.error('Google sign-up failed')
    }
  }

  if (registrationState === 'sent') {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: '5rem auto',
          textAlign: 'center',
        }}
      >
        <Title level={3}>Verify Your Email</Title>
        <Alert
          type="info"
          message={`A verification link and OTP have been sent to ${registeredEmail}.`}
          showIcon
          style={{
            marginBottom: 24,
            textAlign: 'left',
          }}
        />
        <Space
          direction="vertical"
          size="middle"
          style={{ width: '100%' }}
        >
          <Button
            type="primary"
            block
            onClick={() =>
              navigate(
                `/verify-otp?token=${encodeURIComponent(
                  registeredToken
                )}`
              )
            }
          >
            Verify via OTP
          </Button>
          <Button
            block
            onClick={() =>
              navigate(
                `/verify-link?token=${encodeURIComponent(
                  registeredToken
                )}`
              )
            }
          >
            Verify via Link
          </Button>
        </Space>
      </div>
    )
  }

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
          backgroundColor: '#e8f9fd',
          width: 400,
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: '100%' }}
        >
          <Title
            level={3}
            style={{
              textAlign: 'center',
              margin: 0,
            }}
          >
            Create Your Account
          </Title>

          {registrationState === 'error' && (
            <Alert
              type="error"
              message={errorMessage}
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          <form
            onSubmit={handleSubmit(onManualRegister)}
            autoComplete="off"
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ width: '100%' }}
            >
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Name is required',
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="off"
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Full Name"
                  />
                )}
              />
              {errors.name && (
                <Text type="danger">
                  {errors.name.message}
                </Text>
              )}

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
                    {...field}
                    autoComplete="off"
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="Email"
                  />
                )}
              />
              {errors.email && (
                <Text type="danger">
                  {errors.email.message}
                </Text>
              )}

              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Minimum 8 characters',
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    autoComplete="new-password"
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                )}
              />
              {errors.password && (
                <Text type="danger">
                  {errors.password.message}
                </Text>
              )}

              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Please confirm password',
                  validate: (val) =>
                    val === watch('password') ||
                    'Passwords do not match',
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    autoComplete="new-password"
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text type="danger">
                  {errors.confirmPassword.message}
                </Text>
              )}

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
                style={{
                  padding: '20px',
                  borderRadius: '15px',
                }}
              >
                Register
              </Button>
            </Space>
          </form>

          <Divider>Or Sign up with Google</Divider>

          <div style={{ textAlign: 'center' }}>
            <GoogleLogin
              onSuccess={onGoogleRegister}
              onError={() =>
                message.error('Google sign-up failed')
              }
            />
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            <Text>
              Already have an account?{' '}
              <Link to="/login">Log In</Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default Register
