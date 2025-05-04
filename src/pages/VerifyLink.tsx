import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Card, Alert, Button, Spin, Typography, message } from 'antd'
import axiosInstance from '../services/axiosInstance'

const { Title } = Typography

const VerifyLink: React.FC = () => {
  const { search } = useLocation()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(search)
    const token = params.get('token')?.trim() || ''
    if (!token) {
      setStatus('error')
      setFeedback('Verification token is missing. Please register again.')
      message.error('Verification failed: no token provided')
      return
    }
    message.loading({ content: 'Verifying your email…', key: 'verify' })
    axiosInstance
      .get(`/auth/verify-link?token=${encodeURIComponent(token)}`)
      .then((res) => {
        const msg = res.data.message || 'Your email has been verified successfully!'
        setStatus('success')
        setFeedback(msg)
        message.success({ content: msg, key: 'verify', duration: 3 })
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || 'Verification failed. Please try again.'
        setStatus('error')
        setFeedback(errMsg)
        message.error({ content: errMsg, key: 'verify', duration: 3 })
      })
  }, [search])

  return (
    <div style={{ maxWidth: 400, margin: '5rem auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>
          Email Verification
        </Title>

        {status === 'loading' && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Spin tip="Verifying your email, please wait…" />
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <Alert
            type={status === 'success' ? 'success' : 'error'}
            message={status === 'success' ? 'Success' : 'Error'}
            description={feedback}
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {status === 'success' ? (
          <Link to="/login">
            <Button type="primary" block>
              Go to Login
            </Button>
          </Link>
        ) : (
          <Link to="/register">
            <Button block>Back to Register</Button>
          </Link>
        )}
      </Card>
    </div>
  )
}

export default VerifyLink
