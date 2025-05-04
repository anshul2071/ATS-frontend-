"use client"

import type React from "react"
import { Button, Typography, Space } from "antd"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const { Title, Text } = Typography

// Simple color palette
const colors = {
  primary: "#4361ee",
  white: "#ffffff",
  dark: "#1a1a2e",
  light: "#f8f9fa",
  lightBlue: "rgba(67, 97, 238, 0.1)",
}

const Home: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1950&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ color: colors.white, margin: 0 }}>
          ATS Pro
        </Title>

        <Space size={16}>
          <Link to="/login">
            <Button
              type="text"
              style={{
                color: colors.white,
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Login
            </Button>
          </Link>

          <Link to="/signup">
            <Button
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: colors.white,
                fontWeight: 500,
                fontSize: "16px",
                borderRadius: "6px",
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Space>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(67, 97, 238, 0.15)",
            borderRadius: "20px",
            padding: "6px 16px",
            marginBottom: "24px",
          }}
        >
          <Text style={{ color: colors.white, fontWeight: 600, fontSize: "16px" }}>#1 Recruitment Solution</Text>
        </div>

        <Title
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: colors.white,
            marginBottom: "24px",
            letterSpacing: "-0.5px",
          }}
        >
          Transform Your <span style={{ color: colors.primary }}>Hiring Process</span> With Our ATS
        </Title>

        <Text
          style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "40px",
            display: "block",
            lineHeight: "1.6",
          }}
        >
          Streamline your recruitment workflow, track candidates effortlessly, and make data-driven hiring decisions.
        </Text>

        <Space size={16} direction="horizontal">
          <Link to="/register">
            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: "8px",
                padding: "0 32px",
                height: "50px",
                fontSize: "18px",
                fontWeight: 600,
                background: colors.primary,
                border: "none",
              }}
            >
              Get Started
            </Button>
          </Link>

          <Link to="/signup">
            <Button
              size="large"
              style={{
                borderRadius: "8px",
                padding: "0 32px",
                height: "50px",
                fontSize: "18px",
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: colors.white,
              }}
            >
              Log In
            </Button>
          </Link>
        </Space>
      </motion.div>

      {/* Floating UI Elements */}
      <div style={{ position: "absolute", right: "10%", top: "30%" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            background: colors.white,
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            width: "180px",
            marginBottom: "20px",
          }}
        >
          <Text strong style={{ fontSize: "16px", display: "block", marginBottom: "12px" }}>
            Analytics
          </Text>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: colors.lightBlue,
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 20V10"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20V4"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 20V14"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <Text style={{ display: "block", fontSize: "12px", color: "#666" }}>Data:</Text>
              <Text strong style={{ fontSize: "14px" }}>
                03/12/23
              </Text>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            background: colors.white,
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            width: "180px",
          }}
        >
          <Text strong style={{ fontSize: "16px", display: "block", marginBottom: "12px" }}>
            Smart Search
          </Text>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: colors.lightBlue,
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <Text style={{ display: "block", fontSize: "12px", color: "#666" }}>Find:</Text>
              <Text strong style={{ fontSize: "14px" }}>
                Candidates
              </Text>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
