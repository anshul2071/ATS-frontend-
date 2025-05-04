import React from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/userSlice'
import axiosInstance from '../services/axiosInstance'

const { Title } = Typography

const Settings: React.FC = () => {
  const dispatch = useAppDispatch()
  const name  = useAppSelector((s) => s.user.name  ?? '')
  const email = useAppSelector((s) => s.user.email ?? '')

  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    try {
      const res = await axiosInstance.put('/api/auth/update-profile', {
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,        // if non‐empty
      })
      // server should respond { token, email, name }
      dispatch(setCredentials({
        token: res.data.token,
        email: res.data.email,
        name:  res.data.name,
      }))
      message.success('Settings updated. Check your email to re-verify if you changed address.')
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Update failed.')
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '3rem auto' }}>
      <Title level={3}>Account Settings</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name, email }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email',   message: 'Enter a valid email' },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="New Password"
          rules={[
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password size="large" placeholder="Leave blank to keep unchanged" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Settings
