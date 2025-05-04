import React from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Form, Input, Button, Typography, message, Card } from "antd"
import { LockOutlined } from "@ant-design/icons"
import { motion } from "framer-motion"
import axiosInstance from "../services/axiosInstance"

const { Title, Text } = Typography

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm()

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get("token") || ""

  const handleReset = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match")
      return
    }

    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: values.newPassword,
      })

      message.success(res.data.message || "Password changed successfully")
      navigate("/login")
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to reset password"
      message.error(msg)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <Card
          style={{
            borderRadius: 12,
            padding: "32px 40px",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
            Set New Password
          </Title>

          <Text style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
            Enter and confirm your new password
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleReset}
            requiredMark={false}
            autoComplete="off"
          >
            <Form.Item
              label={<Text strong>New Password</Text>}
              name="newPassword"
              rules={[{ required: true, message: "Please enter your new password" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#2563EB" }} />}
                placeholder="Enter new password"
                size="large"
                style={{
                  borderRadius: 10,
                  height: 50,
                  border: "1px solid #e0e0e0",
                }}
              />
            </Form.Item>

            <Form.Item
              label={<Text strong>Confirm Password</Text>}
              name="confirmPassword"
              rules={[{ required: true, message: "Please confirm your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#2563EB" }} />}
                placeholder="Confirm new password"
                size="large"
                style={{
                  borderRadius: 10,
                  height: 50,
                  border: "1px solid #e0e0e0",
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{
                  height: 50,
                  borderRadius: 12,
                  background: "linear-gradient(90deg, #2563EB 0%, #1E40AF 100%)",
                  fontWeight: 500,
                }}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  )
}

export default ResetPassword