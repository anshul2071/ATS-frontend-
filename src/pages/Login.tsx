// src/pages/Login.tsx
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Card,
  Input,
  Button,
  Typography,
  message,
  Divider,
  Space,
  Modal,
  Form,
} from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../services/axiosInstance'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/userSlice'
import GoogleOneTap from '../components/GoogleOneTap'
import auth from '../assests/auth.jpg'

const { Title, Text } = Typography

interface FormInputs {
  email: string
  password: string
}

interface ForgotInputs {
  email: string
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [forgotVisible, setForgotVisible] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotForm] = Form.useForm<ForgotInputs>()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ defaultValues: { email: '', password: '' } })

  // email/password login
  const onSubmit = async (data: FormInputs) => {
    try {
      const res = await axiosInstance.post('/auth/login', data)
      dispatch(setCredentials({ token: res.data.token, email: res.data.email }))
      message.success('Logged in successfully')
      navigate('/')
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Login failed, please try again')
    }
  }

  // Google “Sign in with Google” button
  const handleGoogle = async (resp: CredentialResponse) => {
    try {
      const res = await axiosInstance.post('/auth/google', { credential: resp.credential })
      dispatch(setCredentials({ token: res.data.token, email: res.data.email }))
      message.success(`Logged in as ${res.data.email}`)
      navigate('/')
    } catch {
      message.error('Google login failed')
    }
  }

  // Google One-Tap callback
  const handleGoogleOneTap = async (resp: CredentialResponse) => {
    try {
      const res = await axiosInstance.post('/auth/google-onetap', { credential: resp.credential })
      dispatch(setCredentials({ token: res.data.token, email: res.data.email }))
      message.success(`Logged in as ${res.data.email}`)
      navigate('/')
    } catch {
      message.error('Google One-Tap login failed')
    }
  }

  // forgot-password flow
  const handleForgot = async (vals: ForgotInputs) => {
    setForgotLoading(true)
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email: vals.email })
      message.success(res.data.message)
      setForgotVisible(false)
      forgotForm.resetFields()
    } catch {
      message.error('Failed to send reset email')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <>
      {/* Inject Google One-Tap prompt */}
      <GoogleOneTap onSuccess={handleGoogleOneTap} onError={(err) => message.error(err.message)} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 16,
          backgroundImage: `url(${auth})`,
          backgroundSize: 'cover',
        }}
      >
        <Card style={{ width: 360, borderRadius: 20, padding: 24, backgroundColor: '#e8f9fd' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={3}>Welcome Back</Title>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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

                <div style={{ textAlign: 'right' }}>
                  <a onClick={() => setForgotVisible(true)}>Forgot password?</a>
                </div>

                <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
                  Log In
                </Button>
              </Space>
            </form>

            <Divider>Or login with</Divider>

            <div style={{ textAlign: 'center' }}>
              <GoogleLogin onSuccess={handleGoogle} onError={() => message.error('Google login failed')} />
            </div>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Text>Don’t have an account? <Link to="/register">Register</Link></Text>
            </div>
          </Space>
        </Card>
      </div>

      <Modal open={forgotVisible} onCancel={() => setForgotVisible(false)} footer={null} destroyOnClose>
        <Form form={forgotForm} onFinish={handleForgot} layout="vertical">
          <Form.Item
            label="Enter your email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={forgotLoading}>
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Login
