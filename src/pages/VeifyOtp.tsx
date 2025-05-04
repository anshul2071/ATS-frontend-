import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Alert, Spin, Typography, Card } from 'antd'
import axiosInstance from '../services/axiosInstance'

const { Title } = Typography

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const token = params.get('token') || ''

  const [form] = Form.useForm<{ otp: string }>()
  const [status, setStatus] = useState<'idle' | 'info' | 'loading' | 'success' | 'error'>('idle')
  const [messageText, setMessageText] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessageText('Verification token missing. Please register again.')
    } else {
      setStatus('info')
      setMessageText('An OTP has been sent to your email. Please enter it below to verify your account.')
    }
  }, [token])

  const onFinish = async ({ otp }: { otp: string }) => {
    if (!token) return
    setStatus('loading')
    setMessageText('')
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { token, otp })
      setStatus('success')
      setMessageText(res.data.message || 'Your email has been verified!')
    } catch (err: any) {
      setStatus('error')
      setMessageText(err.response?.data?.message || 'OTP verification failed.')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '5rem auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>
          Verify Your Account
        </Title>

        {status === 'info' && (
          <Alert type="info" message={messageText} showIcon style={{ marginBottom: 24 }} />
        )}

        {status === 'loading' && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Spin tip="Verifying OTP..." />
          </div>
        )}

        {status === 'error' && (
          <Alert type="error" message={messageText} showIcon style={{ marginBottom: 24 }} />
        )}

        {status === 'success' && (
          <Alert type="success" message={messageText} showIcon style={{ marginBottom: 24 }} />
        )}

        {status !== 'success' && (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="otp"
              label="One-Time Password"
              rules={[
                { required: true, message: 'Please enter the OTP sent to your email' },
                { len: 6, message: 'OTP must be 6 digits' },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter OTP"
                disabled={status === 'loading'}
                maxLength={6}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={status === 'loading'}
                disabled={status === 'loading' || !token}
              >
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        )}

        {status === 'success' && (
          <Button type="primary" block onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        )}
      </Card>
    </div>
  )
}

export default VerifyOtp
