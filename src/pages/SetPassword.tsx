
// pages/SetPassword.tsx
import React from 'react'
import { Button, Form, Input, message, Typography } from 'antd'
import axiosInstance from '../services/axiosInstance'
import { useAppSelector } from '../store/hooks'

const { Title } = Typography

const SetPassword: React.FC = () => {
  const [form] = Form.useForm()
  const userEmail = useAppSelector(state => state.user.email)

  const handleSubmit = async (values: { newPassword: string }) => {
    try {
      const userId = localStorage.getItem("userId") // or decode from token if you're storing userId in JWT
      const res = await axiosInstance.post("/auth/set-password", {
        userId,
        newPassword: values.newPassword
      })
      message.success(res.data.message)
      form.resetFields()
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Error setting password")
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <Title level={3}>Set Your Password</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Set Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SetPassword
