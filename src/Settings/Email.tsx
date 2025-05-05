import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, message, Typography } from 'antd'
import axiosInstance from '../services/axiosInstance'

const { Text } = Typography

interface Props {
  visible: boolean
  onClose: () => void
  onUpdated: (newEmail: string) => void
}

export default function EmailEditor({ visible, onClose, onUpdated }: Props) {
  const [step, setStep] = useState<'enter' | 'otp'>('enter')
  const [loading, setLoading] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [requestToken, setRequestToken] = useState('')

  const [emailForm] = Form.useForm<{ email: string }>()
  const [otpForm]   = Form.useForm<{ otp: string }>()

  useEffect(() => {
    if (!visible) {
      emailForm.resetFields()
      otpForm.resetFields()
      setStep('enter')
      setNewEmail('')
      setRequestToken('')
      setLoading(false)
    }
  }, [visible, emailForm, otpForm])

  const sendChangeRequest = async (values: { email: string }) => {
    setLoading(true)
    try {
      const email = values.email.trim().toLowerCase()
      const res = await axiosInstance.post<{ token: string }>(
        '/auth/request-email-change',
        { email }
      )
      setRequestToken(res.data.token)
      setNewEmail(email)
      setStep('otp')
      message.success('OTP sent to your new email.')
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Could not send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (values: { otp: string }) => {
    if (!requestToken) {
      message.error('Missing request token.')
      return
    }
    setLoading(true)
    try {
      await axiosInstance.post(
        '/auth/verify-email-change',
        {
          token: requestToken,
          otp: values.otp.trim(),
        }
      )
      message.success('Email updated successfully.')
      onUpdated(newEmail)
      onClose()
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Invalid OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      title={step === 'enter' ? 'Change Email' : 'Verify New Email'}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {step === 'enter' ? (
        <Form form={emailForm} layout="vertical" onFinish={sendChangeRequest}>
          <Form.Item
            name="email"
            label="New Email Address"
            rules={[
              { required: true, message: 'Please input your new email.' },
              { type: 'email', message: 'Enter a valid email.' },
            ]}
          >
            <Input disabled={loading} placeholder="you@example.com" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form form={otpForm} layout="vertical" onFinish={verifyOtp}>
          <Text>
            Enter the 6‑digit code sent to <b>{newEmail}</b>.
          </Text>
          <Form.Item
            name="otp"
            label="OTP Code"
            rules={[
              { required: true, message: 'Please enter the OTP.' },
              { len: 6, message: 'OTP must be 6 digits.' },
            ]}
          >
            <Input
              maxLength={6}
              placeholder="••••••"
              style={{ letterSpacing: '8px', fontSize: '18px', textAlign: 'center' }}
              disabled={loading}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Verify & Save
            </Button>
          </Form.Item>
          <Button type="link" onClick={() => { otpForm.resetFields(); setStep('enter') }}>
            Back
          </Button>
        </Form>
      )}
    </Modal>
  )
}
