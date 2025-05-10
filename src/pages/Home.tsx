"use client"

import type React from "react"
import { Button, Typography, Space, Card, Divider, Tag } from "antd"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  BarChartOutlined,
  SearchOutlined,
  RightOutlined,
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  AreaChartOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

// Enhanced color palette
const colors = {
  primary: "#4361ee",
  secondary: "#3a0ca3",
  white: "#ffffff",
  dark: "#1a1a2e",
  light: "#f8f9fa",
  lightBlue: "rgba(67, 97, 238, 0.1)",
}

const Home: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const floatingCardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.5 } },
  }

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom right, rgba(67, 97, 238, 0.2), rgba(58, 12, 163, 0.2))",
          zIndex: 0,
        }}
      />

      {/* Animated particles */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

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
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ position: "relative", width: 44, height: 44, marginRight: 12 }}>
            <motion.svg
              width="100%"
              height="100%"
              viewBox="0 0 50 50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Glowing background circle */}
              <motion.circle
                cx="25"
                cy="25"
                r="20"
                fill="url(#logoGradient)"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: [0.7, 0.9, 0.7] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Outer ring */}
              <motion.circle
                cx="25"
                cy="25"
                r="22"
                fill="none"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* N letter */}
              <motion.path
                d="M18 16L18 34L22 34L22 22L32 34L32 16L28 16L28 28L18 16Z"
                fill="white"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4361ee" />
                  <stop offset="100%" stopColor="#3a0ca3" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Subtle particle effects */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "white",
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 30],
                  y: [0, (Math.random() - 0.5) * 30],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title level={3} style={{ color: colors.white, margin: 0 }}>
              Nexcruit
            </Title>
          </motion.div>
        </div>

        <Space size={16}>
          <Link to="/login">
            <Button
              type="text"
              style={{
                color: colors.white,
                fontWeight: 500,
                fontSize: "16px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.3s ease",
              }}
              className="hover-effect"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
              }}
            >
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: colors.white,
                fontWeight: 500,
                fontSize: "16px",
                borderRadius: "8px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Space>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          textAlign: "center",
          maxWidth: 800,
          zIndex: 10,
        }}
      >
        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
          <Tag
            icon={<StarOutlined />}
            style={{
              background: "rgba(67, 97, 238, 0.15)",
              borderColor: "rgba(67, 97, 238, 0.3)",
              color: colors.white,
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 16,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            #1 Recruitment Solution
          </Tag>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Title
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: colors.white,
              marginBottom: 24,
              letterSpacing: "-0.5px",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            Transform Your <span style={{ color: colors.primary }}>Hiring Process</span> With Our ATS
          </Title>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Text
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: 40,
              display: "block",
              lineHeight: 1.6,
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            Streamline your recruitment workflow, track candidates effortlessly, and make data-driven hiring decisions.
          </Text>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Space size={16} direction="horizontal">
            <Link to="/register">
              <Button
                type="primary"
                size="large"
                style={{
                  borderRadius: 8,
                  padding: "0 32px",
                  height: 50,
                  fontSize: 18,
                  fontWeight: 600,
                  background: colors.primary,
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(67, 97, 238, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.secondary
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.primary
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.3)"
                }}
              >
                Get Started
                <RightOutlined />
              </Button>
            </Link>

            <Link to="/signup">
              <Button
                size="large"
                style={{
                  borderRadius: 8,
                  padding: "0 32px",
                  height: 50,
                  fontSize: 18,
                  fontWeight: 600,
                  background: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: colors.white,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
                }}
              >
                Log In
              </Button>
            </Link>
          </Space>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: colors.primary,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              98%
            </Text>
            <Text
              style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.8)", textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)" }}
            >
              Time Saved
            </Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: colors.primary,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              10k+
            </Text>
            <Text
              style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.8)", textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)" }}
            >
              Recruiters
            </Text>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: colors.primary,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              24/7
            </Text>
            <Text
              style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.8)", textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)" }}
            >
              Support
            </Text>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating UI Elements */}
      <div style={{ position: "absolute", right: "10%", top: "30%", zIndex: 10 }}>
        <motion.div variants={floatingCardVariants} initial="hidden" animate="visible" style={{ marginBottom: 24 }}>
          <Card
            style={{
              width: 250,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              borderRadius: 12,
              overflow: "hidden",
              border: "none",
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #f0f0f0",
                padding: "12px 16px",
                background: "white",
              }}
            >
              <BarChartOutlined style={{ color: colors.primary, marginRight: 8 }} />
              <Text strong style={{ fontSize: 16, margin: 0 }}>
                Analytics Dashboard
              </Text>
            </div>
            <div style={{ padding: 16, background: "white" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: colors.lightBlue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <BarChartOutlined style={{ color: colors.primary, fontSize: 20 }} />
                </div>
                <div>
                  <Text style={{ display: "block", fontSize: 12, color: "#666", margin: 0 }}>Latest Data:</Text>
                  <Text strong style={{ fontSize: 14, margin: 0 }}>
                    March 12, 2023
                  </Text>
                </div>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  textAlign: "center",
                }}
              >
                <div>
                  <Text style={{ display: "block", fontSize: 12, color: "#666", margin: 0 }}>Candidates</Text>
                  <Text strong style={{ fontSize: 14, margin: 0 }}>
                    1,245
                  </Text>
                </div>
                <div>
                  <Text style={{ display: "block", fontSize: 12, color: "#666", margin: 0 }}>Interviews</Text>
                  <Text strong style={{ fontSize: 14, margin: 0 }}>
                    287
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={floatingCardVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
          <Card
            style={{
              width: 250,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              borderRadius: 12,
              overflow: "hidden",
              border: "none",
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #f0f0f0",
                padding: "12px 16px",
                background: "white",
              }}
            >
              <SearchOutlined style={{ color: colors.primary, marginRight: 8 }} />
              <Text strong style={{ fontSize: 16, margin: 0 }}>
                Smart Search
              </Text>
            </div>
            <div style={{ padding: 16, background: "white" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: colors.lightBlue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <SearchOutlined style={{ color: colors.primary, fontSize: 20 }} />
                </div>
                <div>
                  <Text style={{ display: "block", fontSize: 12, color: "#666", margin: 0 }}>Find:</Text>
                  <Text strong style={{ fontSize: 14, margin: 0 }}>
                    Candidates
                  </Text>
                </div>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserOutlined style={{ color: "#666", fontSize: 12, marginRight: 4 }} />
                    <Text style={{ fontSize: 12, margin: 0 }}>React Developers</Text>
                  </div>
                  <Tag style={{ fontSize: 12, margin: 0 }}>125</Tag>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CalendarOutlined style={{ color: "#666", fontSize: 12, marginRight: 4 }} />
                    <Text style={{ fontSize: 12, margin: 0 }}>This Week</Text>
                  </div>
                  <Tag style={{ fontSize: 12, margin: 0 }}>42</Tag>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              icon: <UserOutlined style={{ color: colors.primary, fontSize: 18 }} />,
              title: "Candidate Tracking",
              description: "Organize and track candidates through your hiring pipeline",
            },
            {
              icon: <CalendarOutlined style={{ color: colors.primary, fontSize: 18 }} />,
              title: "Interview Scheduling",
              description: "Seamlessly schedule and manage all your interviews",
            },
            {
              icon: <AreaChartOutlined style={{ color: colors.primary, fontSize: 18 }} />,
              title: "Analytics & Insights",
              description: "Make data-driven decisions with powerful analytics",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                borderRadius: 12,
                overflow: "hidden",
                border: "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              bodyStyle={{ padding: 20 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                {feature.icon}
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: colors.white,
                    margin: 0,
                    marginLeft: 8,
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {feature.title}
                </Text>
              </div>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: 0,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                {feature.description}
              </Text>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Home
