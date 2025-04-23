import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Alert, Button, Spin, Typography } from 'antd';
import axiosInstance from '../services/axiosInstance';

const { Title, Paragraph } = Typography;

export default function VerifyEmail() {
  const { search } = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token')?.trim();

    if (!token) {
      setStatus('error');
      setMessage('Verification token is required.');
      return;
    }

    axiosInstance
      .get(`/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      });
  }, [search]);

  return (
    <div style={{ maxWidth: 400, margin: '5rem auto', textAlign: 'center' }}>
      <Title level={3}>Email Verification</Title>

      {status === 'loading' && <Spin tip="Verifying your email…" />}

      {status === 'success' && (
        <Alert
          type="success"
          message="Success"
          description={message}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {status === 'error' && (
        <Alert
          type="error"
          message="Oops"
          description={message}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Paragraph>
        {status === 'success' ? (
          <Link to="/login">
            <Button type="primary">Go to Login</Button>
          </Link>
        ) : (
          <Link to="/register">
            <Button>Back to Register</Button>
          </Link>
        )}
      </Paragraph>
    </div>
  );
}