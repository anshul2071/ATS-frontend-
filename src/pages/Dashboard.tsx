"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Space,
  Spin,
  Tooltip,
  message,
  theme,
  Divider,
  Badge,
  Skeleton,
} from "antd"
import {
  ReloadOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import AnalyticsCharts from "../components/AnalyticsCharts"
import { fetchStats, type StatsResponse } from "../services/statsService"

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const { token } = theme.useToken()
  const {
    colorBgContainer,
    borderRadius,
    colorText,
    colorTextSecondary,
    colorPrimary,
    colorSuccess,
    colorWarning,
    colorInfo,
  } = token

  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchStats()
      setStats(data)
    } catch {
      message.error("Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
    message.success("Dashboard refreshed")
  }

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

  // Card configurations for better organization
  const statCards = [
    {
      title: "Total Candidates",
      value: stats?.totalCandidates || 0,
      prefix: <UserOutlined />,
      color: colorPrimary,
      suffix: "",
      trend: "up",
      description: "Total candidates in the system",
      icon: <UserOutlined style={{ fontSize: 24, color: colorPrimary }} />,
      backgroundColor: "rgba(24, 144, 255, 0.1)",
    },
    {
      title: "Interviews Today",
      value: stats?.interviewsToday || 0,
      prefix: <CalendarOutlined />,
      color: colorSuccess,
      suffix: "",
      trend: "neutral",
      description: "Scheduled for today",
      icon: <CalendarOutlined style={{ fontSize: 24, color: colorSuccess }} />,
      backgroundColor: "rgba(82, 196, 26, 0.1)",
    },
    {
      title: "Offers Pending",
      value: stats?.offersPending || 0,
      prefix: <FileTextOutlined />,
      color: colorWarning,
      suffix: "",
      trend: "down",
      description: "Awaiting response",
      icon: <FileTextOutlined style={{ fontSize: 24, color: colorWarning }} />,
      backgroundColor: "rgba(250, 173, 20, 0.1)",
    },
    {
      title: "Avg Time to Hire",
      value: stats?.avgTimeToHire || 0,
      prefix: <ClockCircleOutlined />,
      color: colorInfo,
      suffix: "days",
      trend: "neutral",
      description: "Average hiring cycle",
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: colorInfo }} />,
      backgroundColor: "rgba(22, 119, 255, 0.1)",
    },
  ]

  if (loading && !stats) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 200px)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Spin size="large" />
        <Text type="secondary">Loading dashboard data...</Text>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <motion.div variants={itemVariants}>
          <Card
            className="dashboard-header-card"
            bordered={false}
            style={{
              borderRadius: borderRadius + 4,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "30%",
                  height: "100%",
                  background: `linear-gradient(135deg, transparent 0%, ${colorPrimary}15 100%)`,
                  borderRadius: "50% 0 0 50%",
                  zIndex: 0,
                }}
              />

              <Row justify="space-between" align="middle" style={{ position: "relative", zIndex: 1 }}>
                <Col>
                  <Space align="center">
                    <DashboardOutlined style={{ fontSize: 24, color: colorPrimary }} />
                    <Title level={2} style={{ margin: 0 }}>
                      Recruitment Dashboard
                    </Title>
                  </Space>
                  <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
                    Overview of your recruitment pipeline and key metrics
                  </Text>
                </Col>
                <Col>
                  <Tooltip title="Refresh dashboard data">
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={onRefresh}
                      loading={refreshing}
                      aria-label="Refresh statistics"
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Row gutter={[24, 24]}>
            {statCards.map((card, index) => (
              <Col xs={24} sm={12} md={12} lg={6} key={index}>
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="stat-card"
                    variant="borderless"
                    style={{
                      borderRadius: borderRadius + 4,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      height: "100%",
                      padding: "24px",
                    }}
                     
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          {card.title}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            marginTop: 8,
                            gap: 8,
                          }}
                        >
                          <Title level={2} style={{ margin: 0, color: card.color }}>
                            {loading ? <Skeleton.Button active size="small" /> : card.value}
                          </Title>
                          {card.suffix && (
                            <Text type="secondary" style={{ fontSize: 16 }}>
                              {card.suffix}
                            </Text>
                          )}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                          {card.description}
                        </Text>
                      </div>

                      <div
                        style={{
                          background: card.backgroundColor,
                          borderRadius: "50%",
                          width: 48,
                          height: 48,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {card.icon}
                      </div>
                    </div>

                    <Divider style={{ margin: "16px 0 12px" }} />

                    <div style={{ display: "flex", alignItems: "center" }}>
                      {card.trend === "up" && (
                        <Badge
                          status="success"
                          text={
                            <Text type="success" style={{ fontSize: 12 }}>
                              Trending up
                            </Text>
                          }
                        />
                      )}
                      {card.trend === "down" && (
                        <Badge
                          status="warning"
                          text={
                            <Text type="warning" style={{ fontSize: 12 }}>
                              Needs attention
                            </Text>
                          }
                        />
                      )}
                      {card.trend === "neutral" && (
                        <Badge
                          status="processing"
                          text={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Stable
                            </Text>
                          }
                        />
                      )}
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            className="analytics-card"
            variant="borderless"
            title={
              <Space>
                <span>Recruitment Analytics</span>
                <Badge count="Live" style={{ backgroundColor: colorSuccess }} />
              </Space>
            }
            style={{
              borderRadius: borderRadius + 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {loading ? (
              <div style={{ padding: "20px 0" }}>
                <Skeleton active paragraph={{ rows: 10 }} />
              </div>
            ) : (
              <AnalyticsCharts
                pipeline={stats?.pipeline || []}
                timeToHire={stats?.timeToHire || []}
                byTech={stats?.byTech || []}
              />
            )}
          </Card>
        </motion.div>
      </Space>
    </motion.div>
  )
}

export default Dashboard
