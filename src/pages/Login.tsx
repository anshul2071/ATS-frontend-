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
import { GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../services/axiosInstance'
import { useAppDispatch } from '../store/hooks'
import auth from '../assests/auth.jpg'
import { setCredentials } from '../store/userSlice'

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
  } = useForm<FormInputs>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormInputs) => {
    try {
      const res = await axiosInstance.post('/auth/login', data)
      dispatch(
        setCredentials({ token: res.data.token, email: res.data.email })
      )
      message.success('Logged in successfully')
      navigate('/')
    } catch (err: any) {
      // Always show the server-returned message (fallback if missing)
      const serverMsg =
        err.response?.data?.message || 'Login failed, please try again'
      message.error(serverMsg)
    }
  }

  const handleGoogle = async (resp: any) => {
    try {
      const res = await axiosInstance.post('/auth/google', {
        credential: resp.credential,
      })
      dispatch(
        setCredentials({ token: res.data.token, email: res.data.email })
      )
      message.success(`Logged in as ${res.data.email}`)
      navigate('/')
    } catch (err: any) {
      const serverMsg =
        err.response?.data?.message || 'Google login failed'
      message.error(serverMsg)
    }
  }

  const handleForgot = async (vals: ForgotInputs) => {
    setForgotLoading(true)
    try {
      const res = await axiosInstance.post('/auth/forgot-password', {
        email: vals.email,
      })
      message.success(res.data.message)
      setForgotVisible(false)
      forgotForm.resetFields()
    } catch (err: any) {
      const serverMsg =
        err.response?.data?.message || 'Failed to send reset email'
      message.error(serverMsg)
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <>
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
        <Card
          style={{
            width: 360,
            borderRadius: '20px',
            padding: '24px',
            backgroundColor: '#e8f9fd',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={3} style={{ textAlign: 'center', margin: 0 }}>
              Welcome Back
            </Title>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Space
                direction="vertical"
                size="middle"
                style={{ width: '100%' }}
              >
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
                {errors.email && (
                  <Text type="danger">{errors.email.message}</Text>
                )}

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
                {errors.password && (
                  <Text type="danger">{errors.password.message}</Text>
                )}

                <div style={{ textAlign: 'right' }}>
                  <a onClick={() => setForgotVisible(true)}>
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isSubmitting}
                  style={{ borderRadius: '15px', padding: '20px' }}
                >
                  Log In
                </Button>
              </Space>
            </form>

            <Divider>Or login with</Divider>

            <div style={{ textAlign: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => message.error('Google login failed')}
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Text>
                Don’t have an account? <Link to="/register">Register</Link>
              </Text>
            </div>
          </Space>
        </Card>
      </div>

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
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="Email"
            />
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
  )
}

export default Login
