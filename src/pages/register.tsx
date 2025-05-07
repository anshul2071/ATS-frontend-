// src/pages/Register.tsx
"use client"

import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  Card,
  Input,
  Button,
  Typography,
  Checkbox,
  Divider,
  Alert,
  Space,
  message,
} from "antd"
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowRightOutlined,
} from "@ant-design/icons"
import { GoogleLogin, type CredentialResponse, useGoogleLogin } from "@react-oauth/google"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../services/axiosInstance"
import { useAppDispatch } from "../store/hooks"
import { setCredentials } from "../store/userSlice"
import auth from "../assests/auth.jpg"

const { Title, Text, Paragraph } = Typography

interface RegisterForm {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreement: boolean
}

const colors = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  white: "#ffffff",
  borderGray: "#e0e0e0",
  textMuted: "#666",
  textLabel: "#555",
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1, duration: 0.6, ease: "easeInOut" },
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

const Register: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { control, handleSubmit, getValues, formState: { errors, isSubmitting } } =
    useForm<RegisterForm>({ defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", agreement: false } })

  const [registrationState, setRegistrationState] = useState<"idle"|"sending"|"sent"|"error">("idle")
  const [registeredToken, setRegisteredToken] = useState("")
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const onSubmit = async (data: RegisterForm) => {
    const { fullName, email, password, confirmPassword } = data
    if (password !== confirmPassword) {
      message.error("Passwords do not match")
      return
    }
    setRegistrationState("sending")
    try {
      const res = await axiosInstance.post<{ message: string; token: string }>(
        "/auth/register",
        { name: fullName.trim(), email: email.trim().toLowerCase(), password }
      )
      setRegisteredToken(res.data.token)
      setRegisteredEmail(email.trim().toLowerCase())
      setRegistrationState("sent")
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Registration failed")
      setRegistrationState("error")
    }
  }

  const handleGoogle = async (resp: CredentialResponse) => {
    const credential = resp.credential
    if (!credential) {
      message.error("Google sign-up failed")
      return
    }
  
    try {
      const apiRes = await axiosInstance.post<{
        token: string
        email: string
        name: string
        userId: string
      }>("/auth/google", { credential })
  
      dispatch(
        setCredentials({
          token: apiRes.data.token,
          email: apiRes.data.email,
          userId: apiRes.data.userId,
          name: apiRes.data.name,

        })
      )
      navigate("/dashboard")
    } catch (err: any) {
      message.error(err.response?.data?.message || "Google sign-up failed")
    }
  }

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: (resp: any) => handleGoogle(resp as CredentialResponse),
    onError: () => message.error("Google sign-up failed"),
  })

  // After registration succeeded
  if (registrationState === "sent") {
    return (
      <div style={{ maxWidth: 400, margin: "5rem auto", textAlign: "center" }}>
        <Title level={3}>Verify Your Email</Title>
        <Alert
          type="info"
          message={`A verification link and OTP have been sent to ${registeredEmail}.`}
          showIcon
          style={{ marginBottom: 24, textAlign: "left" }}
        />
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Button
            type="primary"
            block
            onClick={() => navigate(`/verify-otp?token=${encodeURIComponent(registeredToken)}`)}
          >
            Verify via OTP
          </Button>
          <Button block onClick={() => navigate(`/verify-link?token=${encodeURIComponent(registeredToken)}`)}>
            Verify via Link
          </Button>
        </Space>
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundImage: `url(${auth})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* dark overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "black",
            backdropFilter: "blur(5px)",
          }}
        />

        <div
          style={{
            zIndex: 1,
            width: "100%",
            maxWidth: 1200,
            display: "flex",
            justifyContent: "center",
            padding: "0 20px",
          }}
        >
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
              {/* header */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  padding: 32,
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background:
                      "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
                  }}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                  style={{ display: "inline-block" }}
                >
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: "50%",
                      width: 72,
                      height: 72,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <UserOutlined style={{ fontSize: 36, color: "white" }} />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Title level={3} style={{ color: "white", margin: 0, fontWeight: 600 }}>
                    Create Your Account
                  </Title>
                  <Paragraph style={{ color: "rgba(255,255,255,0.9)", marginTop: 8, marginBottom: 0 }}>
                    Join thousands of recruiters using ATS Pro
                  </Paragraph>
                </motion.div>
              </div>

              {/* form body */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ padding: "32px 40px" }}
              >
                {registrationState === "error" && (
                  <Alert
                    type="error"
                    message={errorMessage}
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                )}

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    {/* Full Name */}
                    <motion.div variants={itemVariants}>
                      <Text style={{ fontSize: 14, fontWeight: 500, color: colors.textLabel }}>
                        Full Name
                      </Text>
                      <Controller
                        name="fullName"
                        control={control}
                        rules={{ required: "Full name is required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            size="large"
                            prefix={<UserOutlined style={{ color: colors.primary }} />}
                            placeholder="Enter your full name"
                            style={{
                              borderRadius: 12,
                              height: 50,
                              border: `1px solid ${colors.borderGray}`,
                            }}
                          />
                        )}
                      />
                      {errors.fullName && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <Text type="danger" style={{ fontSize: 13, marginTop: 6 }}>
                            {errors.fullName.message}
                          </Text>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={itemVariants}>
                      <Text style={{ fontSize: 14, fontWeight: 500, color: colors.textLabel }}>
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
                            prefix={<MailOutlined style={{ color: colors.primary }} />}
                            placeholder="Enter your email"
                            style={{
                              borderRadius: 12,
                              height: 50,
                              border: `1px solid ${colors.borderGray}`,
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

                    {/* Password */}
                    <motion.div variants={itemVariants}>
                      <Text style={{ fontSize: 14, fontWeight: 500, color: colors.textLabel }}>
                        Password
                      </Text>
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "Password required",
                          minLength: { value: 8, message: "At least 8 characters" },
                        }}
                        render={({ field }) => (
                          <Input.Password
                            {...field}
                            size="large"
                            prefix={<LockOutlined style={{ color: colors.primary }} />}
                            placeholder="Enter a password"
                            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            style={{
                              borderRadius: 12,
                              height: 50,
                              border: `1px solid ${colors.borderGray}`,
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

                    {/* Confirm Password */}
                    <motion.div variants={itemVariants}>
                      <Text style={{ fontSize: 14, fontWeight: 500, color: colors.textLabel }}>
                        Confirm Password
                      </Text>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                          required: "Please confirm your password",
                          validate: val => val === getValues("password") || "Passwords do not match",
                        }}
                        render={({ field }) => (
                          <Input.Password
                            {...field}
                            size="large"
                            prefix={<LockOutlined style={{ color: colors.primary }} />}
                            placeholder="Re-enter your password"
                            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            style={{
                              borderRadius: 12,
                              height: 50,
                              border: `1px solid ${colors.borderGray}`,
                            }}
                          />
                        )}
                      />
                      {errors.confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <Text type="danger" style={{ fontSize: 13, marginTop: 6 }}>
                            {errors.confirmPassword.message}
                          </Text>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Agreement */}
                    <motion.div variants={itemVariants} style={{marginBottom: 12}}>
                      <Controller
                        name="agreement"
                        control={control}
                        rules={{ validate: v => v || "You must accept the terms" }}
                        render={({ field }) => (
                          <Checkbox {...field} checked={field.value}>
                            I agree to the <a href="#">Terms of Service</a> and{" "}
                            <a href="#">Privacy Policy</a>
                          </Checkbox>
                        )}
                      />
                      {errors.agreement && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <Text type="danger" style={{ fontSize: 13, marginTop: 6 }}>
                            {errors.agreement.message}
                          </Text>
                        </motion.div>
                      )}
                    </motion.div>
                  </Space>

                  {/* Submit */}
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
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                          border: "none",
                          fontSize: 16,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
                        }}
                      >
                        Create Account
                        <ArrowRightOutlined style={{ marginLeft: 8 }} />
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div variants={itemVariants} style={{ margin: "32px 0" }}>
                  <Divider style={{ color: "#999" }}>Or register with</Divider>
                </motion.div>

                {/* Google login */}
                <motion.div variants={itemVariants} style={{ textAlign: "center", marginBottom: 8 , marginLeft: 85}}>
                  <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() => message.error("Google sign-up failed")}
                    theme="filled_blue"
                    shape="pill"
                    size="large"
                    text="continue_with"
                    width="100%"
                  />
                </motion.div>

                {/* Already have account */}
                <motion.div variants={itemVariants} style={{ textAlign: "center", marginTop: 24 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 14 }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: colors.primary, fontWeight: 600 }}>
                      Sign In
                    </Link>
                  </Text>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Register