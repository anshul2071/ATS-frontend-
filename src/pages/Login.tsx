"use client"
import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  Card, Input, Button, Typography, message, Divider, Space, Modal, Form,
} from "antd"
import {
  MailOutlined, LockOutlined, ArrowRightOutlined, UserOutlined,
} from "@ant-design/icons"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../services/axiosInstance"
import { useAppDispatch } from "../store/hooks"
import { setCredentials } from "../store/userSlice"
import GoogleOneTap from "../components/GoogleOneTap"
import auth from "../assests/auth.jpg"

const { Title, Text } = Typography

interface LoginInputs { email: string; password: string }
interface ForgotInputs { email: string }

const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [forgotVisible, setForgotVisible] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotForm] = Form.useForm<ForgotInputs>()

  const { control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInputs>({ defaultValues: { email: "", password: "" } })

  const onSubmit = async (data: LoginInputs) => {
    try {
      const res = await axiosInstance.post("/auth/login", data)
      dispatch(setCredentials({
        token:  res.data.token,
        userId: res.data.userId,
        email:  res.data.email,
        name:   res.data.name,
      }))
      message.success("Logged in successfully")
      navigate("/dashboard")
    } catch (err: any) {
      message.error(err.response?.data?.message || "Login failed")
    }
  }

  const handleGoogle = async (resp: CredentialResponse) => {
    if (!resp.credential) {
      message.error("Google login failed"); return
    }
    try {
      const res = await axiosInstance.post("/auth/google", { credential: resp.credential })
      localStorage.setItem('token', res.data.token)

      dispatch(setCredentials({
        token:  res.data.token,
        userId: res.data.userId,
        email:  res.data.email,
        name:   res.data.name,
      }))
      message.success(`Logged in as ${res.data.email}`)
      navigate("/dashboard")
    } catch {
      message.error("Google login failed")
    }
  }

  const handleOneTap = async ({ credential }: { credential: string }) => {
    try {
      const res = await axiosInstance.post("/auth/google-onetap", { credential })
      localStorage.setItem('token', res.data.token)
      dispatch(setCredentials({
        token:  res.data.token,
        userId: res.data.userId,
        email:  res.data.email,
        name:   res.data.name,
      }))
      message.success(`One‑tap login as ${res.data.email}`)
      navigate("/dashboard")
    } catch {
      message.error("One‑tap login failed")
    }
  }

  const handleForgot = async (vals: ForgotInputs) => {
    setForgotLoading(true)
    try {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email: vals.email.trim().toLowerCase(),
      })
      message.success(res.data.message)
      setForgotVisible(false)
      forgotForm.resetFields()
    } catch {
      message.error("Reset email failed")
    } finally {
      setForgotLoading(false)
    }
  }
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  }
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.2 } },
  }

  return (
    <>
      <GoogleOneTap onSuccess={handleOneTap} onError={err => message.error(err.message || "One‑tap error")} />

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${auth})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
          }}
        />

        <div style={{
          zIndex: 1,
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          justifyContent: "center",
          padding: "0 20px",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ width: "100%", maxWidth: 480 }}
          >
            <Card
              style={{
                width: "100%",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                border: "none",
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                padding: 32,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
                }} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                  style={{ display: "inline-block" }}
                >
                  <div style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: "50%",
                    width: 80, height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                    <UserOutlined style={{ fontSize: 36, color: "white" }} />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Title level={2} style={{
                    color: "white",
                    margin: 0,
                    marginBottom: 8,
                    fontWeight: 600,
                  }}>
                    Welcome Back
                  </Title>
                  <Text style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 16,
                  }}>
                    Sign in to continue to your account
                  </Text>
                </motion.div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ padding: "32px 40px" }}
              >
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    <motion.div variants={itemVariants}>
                      <Text style={{ fontSize: 14, fontWeight: 500, color: "#555" }}>
                        Email Address
                      </Text>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "Email required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            size="large"
                            prefix={<MailOutlined style={{ color: "#2563EB" }} />}
                            placeholder="Enter your email"
                            style={{
                              borderRadius: 12,
                              height: 50,
                              border: "1px solid #e0e0e0",
                            }}
                          />
                        )}
                      />
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <Text type="danger" style={{ fontSize: 13, marginTop: 6 }}>
                            {errors.email.message}
                          </Text>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Text style={{ fontSize: 14, fontWeight: 500, color: "#555" }}>
                        Password
                      </Text>
                      <Controller
                        name="password"
                        control={control}
                        rules={{ required: "Password required" }}
                        render={({ field }) => (
                          <Input.Password
                            {...field}
                            size="large"
                            prefix={<LockOutlined style={{ color: "#2563EB" }} />}
                            placeholder="Enter your password"
                            style={{
                              borderRadius: 12,
                              height: 50,
                              border: "1px solid #e0e0e0",
                            }}
                          />
                        )}
                      />
                      {errors.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <Text type="danger" style={{ fontSize: 13, marginTop: 6 }}>
                            {errors.password.message}
                          </Text>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants} style={{ textAlign: "right" }}>
                      <a
                        onClick={() => setForgotVisible(true)}
                        style={{
                          color: "#2563EB",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Forgot password?
                      </a>
                    </motion.div>

                    <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
                      <motion.div variants={buttonVariants}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          size="large"
                          loading={isSubmitting}
                          style={{
                            height: 50,
                            borderRadius: 12,
                            background: "linear-gradient(90deg, #2563EB 0%, #1E40AF 100%)",
                            border: "none",
                            fontSize: 16,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
                          }}
                        >
                          Log In
                          <ArrowRightOutlined style={{ marginLeft: 8 }} />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </Space>
                </form>

                <motion.div variants={itemVariants}>
                  <Divider style={{ margin: "32px 0", color: "#999" }}>
                    Or login with
                  </Divider>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  style={{ textAlign: "center", marginBottom: 8, marginLeft: 85 }}
                >
                  <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() => message.error("Google login failed")}
                    theme="filled_blue"
                    shape="pill"
                    size="large"
                    text="continue_with"
                    width="100%"
                  />
                </motion.div>

                <motion.div variants={itemVariants} style={{ textAlign: "center", marginTop: 32 }}>
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    Don’t have an account?{" "}
                    <Link to="/register" style={{ color: "#2563EB", fontWeight: 600 }}>
                      Register
                    </Link>
                  </Text>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {forgotVisible && (
          <Modal
            open={forgotVisible}
            onCancel={() => setForgotVisible(false)}
            footer={null}
            destroyOnClose
            title={null}
            width={400}
            style={{ top: 20 }}
            bodyStyle={{ padding: 0 }}
            maskStyle={{ backdropFilter: "blur(5px)", background: "rgba(0,0,0,0.5)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                padding: 24,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}>
                <Title level={4} style={{ margin: 0, color: "white" }}>Reset Password</Title>
              </div>
              <div style={{ padding: 24 }}>
                <Form
                  form={forgotForm}
                  onFinish={handleForgot}
                  layout="vertical"
                >
                  <Text style={{ marginBottom: 24, display: "block" }}>
                    Enter your email address and we’ll send you a link to reset your password.
                  </Text>
                  <Form.Item
                    name="email"
                    label={<span style={{ fontSize: 14, fontWeight: 500 }}>Email Address</span>}
                    rules={[
                      { required: true, message: "Please input your email" },
                      { type: "email", message: "Invalid email format" },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<MailOutlined style={{ color: "#2563EB" }} />}
                      placeholder="Enter your email"
                      style={{ borderRadius: 12, height: 50, border: "1px solid #e0e0e0" }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        loading={forgotLoading}
                        style={{
                          height: 50,
                          borderRadius: 12,
                          background: "linear-gradient(90deg, #2563EB 0%, #1E40AF 100%)",
                          border: "none",
                          fontSize: 16,
                          fontWeight: 500,
                          boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
                        }}
                      >
                        Send Reset Link
                      </Button>
                    </motion.div>
                  </Form.Item>
                </Form>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

export default Login
