"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, Typography, Space, Avatar, Button, message, Divider, Row, Col, Skeleton, Tag } from "antd"
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EditOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import axiosInstance from "../services/axiosInstance"
import NameEditor from "../Settings/Name"
import EmailEditor from "../Settings/Email"
import PasswordEditor from "../Settings/Password"

const { Title, Text, Paragraph } = Typography

interface ProfileData {
  name: string
  email: string
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showName, setShowName] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    axiosInstance
      .get<ProfileData>("/auth/profile")
      .then((res) => setProfile(res.data))
      .catch(() => message.error("Could not load profile"))
      .finally(() => setLoading(false))
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "3rem auto", padding: "0 20px" }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Skeleton avatar={{ size: 80, shape: "circle" }} active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <Card
        style={{
          maxWidth: 800,
          margin: "3rem auto",
          textAlign: "center",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Space direction="vertical" align="center">
          <Text type="danger" style={{ fontSize: 16 }}>
            Failed to load profile.
          </Text>
          <Button type="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Space>
      </Card>
    )
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  // Get random color for avatar based on name
  const getAvatarColor = (name: string) => {
    const colors = ["#1677ff", "#52c41a", "#faad14", "#eb2f96", "#722ed1", "#13c2c2", "#fa541c"]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    hash = Math.abs(hash)
    return colors[hash % colors.length]
  }

  const avatarColor = getAvatarColor(profile.name)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ maxWidth: 800, margin: "3rem auto", padding: "0 20px" }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <motion.div variants={itemVariants}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)",
                  margin: -24,
                  marginBottom: 24,
                  padding: "40px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
                  }}
                />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Avatar
                    size={100}
                    style={{
                      backgroundColor: avatarColor,
                      fontSize: 36,
                      fontWeight: "bold",
                      border: "4px solid rgba(255,255,255,0.2)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    }}
                  >
                    {initials || <UserOutlined />}
                  </Avatar>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{ textAlign: "center", marginTop: 16 }}
                >
                  <Title level={2} style={{ color: "white", margin: 0, marginBottom: 4 }}>
                    {profile.name}
                  </Title>
                  <Space>
                    <Tag color="blue" icon={<CheckCircleOutlined />}>
                      Verified Account
                    </Tag>
                    <Tag color="green">Admin</Tag>
                  </Space>
                </motion.div>
              </div>

              <Title level={4} style={{ marginBottom: 24 }}>
                Account Information
              </Title>

              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <motion.div variants={itemVariants}>
                  <Card
                    bordered={false}
                    style={{
                      background: "#f9f9f9",
                      borderRadius: 8,
                    }}
                  >
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Space align="start">
                          <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1677ff" }} />
                          <div>
                            <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>
                              Name
                            </Text>
                            <Paragraph style={{ margin: 0 }}>{profile.name}</Paragraph>
                          </div>
                        </Space>
                      </Col>
                      <Col>
                        <Button type="primary" ghost icon={<EditOutlined />} onClick={() => setShowName(true)}>
                          Edit
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card
                    bordered={false}
                    style={{
                      background: "#f9f9f9",
                      borderRadius: 8,
                    }}
                  >
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Space align="start">
                          <Avatar icon={<MailOutlined />} style={{ backgroundColor: "#52c41a" }} />
                          <div>
                            <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>
                              Email Address
                            </Text>
                            <Paragraph style={{ margin: 0 }} copyable>
                              {profile.email}
                            </Paragraph>
                          </div>
                        </Space>
                      </Col>
                      <Col>
                        <Button type="primary" ghost icon={<EditOutlined />} onClick={() => setShowEmail(true)}>
                          Change
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card
                    bordered={false}
                    style={{
                      background: "#f9f9f9",
                      borderRadius: 8,
                    }}
                  >
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Space align="start">
                          <Avatar icon={<LockOutlined />} style={{ backgroundColor: "#fa541c" }} />
                          <div>
                            <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>
                              Password
                            </Text>
                            <Text>••••••••••</Text>
                            <div style={{ marginTop: 4 }}>
                              <Tag icon={<SafetyOutlined />} color="default">
                                Last changed 30 days ago
                              </Tag>
                            </div>
                          </div>
                        </Space>
                      </Col>
                      <Col>
                        <Button type="primary" ghost danger icon={<EditOutlined />} onClick={() => setShowPass(true)}>
                          Change
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              </Space>

              <Divider style={{ margin: "32px 0 24px" }} />

            
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Keep the existing modal components unchanged */}
      <NameEditor
        visible={showName}
        initialName={profile.name}
        onClose={() => setShowName(false)}
        onUpdated={(newName, newToken) => {
          setProfile((p) => p && { ...p, name: newName })
        }}
      />

      <EmailEditor
        visible={showEmail}
        onClose={() => setShowEmail(false)}
        onUpdated={(newEmail) => {
          setProfile((p) => p && { ...p, email: newEmail })
        }}
      />

      <PasswordEditor
        visible={showPass}
        onClose={() => setShowPass(false)}
        onUpdated={() => {
          // Original empty callback preserved
        }}
      />
    </motion.div>
  )
}

export default Profile
