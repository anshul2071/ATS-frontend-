// src/Settings/Password.tsx
import React from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import axiosInstance from '../services/axiosInstance'

interface Props {
  visible: boolean
  onClose: () => void
  onUpdated?: () => void
}

const PasswordEditor: React.FC<Props> = ({ visible, onClose, onUpdated }) => {
  const [form] = Form.useForm<{ password: string; confirm: string }>()

  const handleSave = async (vals: { password: string; confirm: string }) => {
    if (vals.password !== vals.confirm) {
      message.error('Passwords do not match')
      return
    }
    try {
      await axiosInstance.put('/auth/update-profile', { newPassword: vals.password })
      message.success('Password changed')
      onClose()
      onUpdated?.()
    } catch (e: any) {
      message.error(e.response?.data?.message || 'Update failed')
    }
  }

  return (
    <Modal
      title="Change Password"
      open={visible}
      footer={null}
      onCancel={onClose}
      destroyOnClose
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          name="password"
          label="New Password"
          rules={[{ required: true, message: 'Enter new password' }]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                return !value || getFieldValue('password') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Passwords do not match'))
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PasswordEditor
