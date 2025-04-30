import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Alert, Spin, Typography } from 'antd'
import axiosInstance from '../services/axiosInstance'

const { Title } = Typography

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const token = params.get('token') || ''

  const [otp, setOtp] = useState<string>('')
  const [status, setStatus] = useState<
    'idle' | 'info' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Verification token missing. Please register again.')
    } else {
      setStatus('info')
      setMessage(
        'An OTP has been sent to your email. Please enter it below to verify your account.'
      )
    }
  }, [token])

  const onFinish = () => {
    if (!token) return
    setStatus('loading')
    setMessage('')

    axiosInstance
      .post('/auth/verify-otp', { token, otp })
      .then((res) => {
        setStatus('success')
        setMessage(res.data.message || 'Your email has been verified!')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(
          err.response?.data?.message || 'OTP verification failed.'
        )
      })
  }

  return (
    <div style={{ maxWidth: 400, margin: '5rem auto', textAlign: 'center' }}>
      <Title level={3}>Verify Your Account</Title>

      {status === 'info' && (
        <Alert
          type="info"
          message={message}
          showIcon
          style={{ marginBottom: 24, textAlign: 'left' }}
        />
      )}

      {status === 'loading' && (
        <Spin tip="Verifying OTP..." style={{ marginBottom: 24 }} />
      )}

      {status === 'error' && (
        <Alert
          type="error"
          message={message}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {status === 'success' && (
        <Alert
          type="success"
          message={message}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {status !== 'success' && (
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="One-Time Password"
            rules={[
              {
                required: true,
                message: 'Please enter the OTP sent to your email',
              },
            ]}
          >
            <Input
              size="large"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={status === 'loading'}
              placeholder="Enter OTP"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={status === 'loading'}
              disabled={!token}
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
    </div>
  )
}

export default VerifyOtp
