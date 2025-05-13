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
  Badge,
  Skeleton,
  Statistic,
  Progress,
  Empty,
  Tag,
  Avatar,
  List,
  Table,
  Modal,
} from "antd"
import {
  ReloadOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BellOutlined,
  MailOutlined,
  ScheduleOutlined,
  DownloadOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import AnalyticsCharts from "../components/AnalyticsCharts"
import { fetchStats, type StatsResponse } from "../services/statsService"
import axiosInstance from "../services/axiosInstance"
import dayjs from "dayjs"
import type { InterviewPipelineStage } from "../constants/pipelineStages"

const { Title, Text } = Typography

// Interface definitions
interface CandidateRef {
  _id: string
  name: string
  email: string
}

interface Interview {
  _id: string
  candidate: CandidateRef | null
  pipelineStage: InterviewPipelineStage
  interviewerEmail: string
  date: string
  meetLink?: string
  feedback?: string
  status?: "Scheduled" | "Completed" | "Cancelled" | "No Show"
}

// Helper functions
const getStageColor = (stageLabel: string) => {
  switch (stageLabel) {
    case "HR Screening":
      return "#4361ee"
    case "Technical Interview":
      return "#7209b7"
    case "Managerial Interview":
      return "#f72585"
    default:
      return "#718096"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "processing"
    case "Completed":
      return "success"
    case "Cancelled":
      return "error"
    case "No Show":
      return "warning"
    default:
      return "default"
  }
}

const Dashboard: React.FC = () => {
  const { token } = theme.useToken()
  const { borderRadius, colorPrimary, colorSuccess, colorWarning, colorInfo, colorError } = token

  // State variables
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [interviewsLoading, setInterviewsLoading] = useState<boolean>(false)
  const [viewInterviewModal, setViewInterviewModal] = useState<boolean>(false)
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null)

  // Fetch dashboard data
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

  // Fetch interviews
  const fetchInterviews = async () => {
    setInterviewsLoading(true)
    try {
      const res = await axiosInstance.get<Interview[]>("/interviews")
      setInterviews(res.data)
    } catch (err) {
      message.error("Failed to load interviews")
    } finally {
      setInterviewsLoading(false)
    }
  }

  useEffect(() => {
    load()
    fetchInterviews()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([load(), fetchInterviews()])
    setRefreshing(false)
    message.success("Dashboard refreshed")
  }

  // Get upcoming interviews (today and future)
  const upcomingInterviews = interviews
    .filter((interview) => dayjs(interview.date).isAfter(dayjs()) || dayjs(interview.date).isSame(dayjs(), "day"))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
    .slice(0, 5)

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

  // Get trend indicator for stat cards
  const getTrendIndicator = (trend: string) => {
    if (trend === "up") {
      return {
        icon: <RiseOutlined />,
        color: colorSuccess,
        text: "Trending up",
      }
    } else if (trend === "down") {
      return {
        icon: <FallOutlined />,
        color: colorWarning,
        text: "Needs attention",
      }
    } else {
      return {
        icon: <MinusOutlined />,
        color: colorInfo,
        text: "Stable",
      }
    }
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
      progressValue: 75,
      progressColor: colorPrimary,
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
      progressValue: 40,
      progressColor: colorSuccess,
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
      progressValue: 60,
      progressColor: colorWarning,
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
      progressValue: 30,
      progressColor: colorInfo,
    },
  ]

  // View interview details
  const viewInterview = (interview: Interview) => {
    setCurrentInterview(interview)
    setViewInterviewModal(true)
  }

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
        {/* Header Card */}
        <motion.div variants={itemVariants}>
          <Card
            className="dashboard-header-card"
            bordered={false}
            style={{
              borderRadius: borderRadius + 4,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "12px 0",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "40%",
                  height: "100%",
                  background: `linear-gradient(135deg, transparent 0%, ${colorPrimary}15 100%)`,
                  borderRadius: "50% 0 0 50%",
                  zIndex: 0,
                }}
              />

              <Row justify="space-between" align="middle" style={{ position: "relative", zIndex: 1 }}>
                <Col>
                  <Space align="center" size="middle">
                    <Avatar
                      size={64}
                      icon={<DashboardOutlined />}
                      style={{
                        backgroundColor: colorPrimary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                    <div>
                      <Title level={2} style={{ margin: 0 }}>
                        Recruitment Dashboard
                      </Title>
                      <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
                        Overview of your recruitment pipeline and key metrics
                      </Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Badge count={3} dot>
                      <Button icon={<BellOutlined />} shape="circle" size="large" />
                    </Badge>
                    <Tooltip title="Refresh dashboard data">
                      <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={onRefresh}
                        loading={refreshing}
                        aria-label="Refresh statistics"
                        size="large"
                      >
                        Refresh
                      </Button>
                    </Tooltip>
                  </Space>
                </Col>
              </Row>
            </div>
          </Card>
        </motion.div>

        {/* Stat Cards */}
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
                    bordered={false}
                    style={{
                      borderRadius: borderRadius + 4,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      height: "100%",
                    }}
                    bodyStyle={{ padding: "24px" }}
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
                          <Statistic
                            value={card.value}
                            suffix={card.suffix}
                            valueStyle={{ color: card.color, fontSize: 28, fontWeight: "bold" }}
                            loading={loading}
                          />
                        </div>
                        <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                          {card.description}
                        </Text>
                      </div>

                      <div
                        style={{
                          background: card.backgroundColor,
                          borderRadius: "50%",
                          width: 56,
                          height: 56,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {card.icon}
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <Progress
                        percent={card.progressValue}
                        showInfo={false}
                        strokeColor={card.progressColor}
                        size="small"
                        style={{ marginBottom: 8 }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                      <Tag
                        icon={getTrendIndicator(card.trend).icon}
                        color={card.trend === "up" ? "success" : card.trend === "down" ? "warning" : "processing"}
                      >
                        {getTrendIndicator(card.trend).text}
                      </Tag>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Analytics Section */}
        <motion.div variants={itemVariants}>
          <Card
            className="analytics-card"
            bordered={false}
            title={
              <Space>
                <BarChartOutlined />
                <span>Recruitment Analytics</span>
                <Badge count="Live" style={{ backgroundColor: colorSuccess }} />
              </Space>
            }
            extra={
              <Space>
                <Button type="text" icon={<LineChartOutlined />}>
                  Trends
                </Button>
                <Button type="text" icon={<PieChartOutlined />}>
                  Distribution
                </Button>
              </Space>
            }
            style={{
              borderRadius: borderRadius + 4,
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              marginBottom: 24,
            }}
          >
            {loading ? (
              <div style={{ padding: "40px 0" }}>
                <Skeleton active paragraph={{ rows: 10 }} />
              </div>
            ) : stats ? (
              <div style={{ padding: "20px 0" }}>
                <AnalyticsCharts
                  pipeline={stats?.pipeline || []}
                  timeToHire={stats?.timeToHire || []}
                  byTech={stats?.byTech || []}
                />
              </div>
            ) : (
              <Empty description="No analytics data available" style={{ padding: "60px 0" }} />
            )}
          </Card>
        </motion.div>

        {/* Upcoming Interviews */}
        <motion.div variants={itemVariants}>
          <Card
            className="interviews-card"
            variant="borderless"
            title={
              <Space>
                <CalendarOutlined />
                <span>Upcoming Interviews</span>
              </Space>
            }
            extra={
              <Button
                type="primary"
                icon={<ScheduleOutlined />}
                onClick={() => (window.location.href = "/schedule")}
              >
                Schedule New
              </Button>
            }
            style={{
              borderRadius: borderRadius + 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {interviewsLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : upcomingInterviews.length === 0 ? (
              <Empty description="No upcoming interviews scheduled" style={{ padding: "40px 0" }} />
            ) : (
              <Table
                dataSource={upcomingInterviews}
                rowKey="_id"
                pagination={false}
                columns={[
                  {
                    title: "Candidate",
                    dataIndex: ["candidate", "name"],
                    key: "candidate",
                    render: (text: string, record: Interview) => (
                      <a onClick={() => viewInterview(record)}>{record.candidate?.name}</a>
                    ),
                  },
                  {
                    title: "Position",
                    dataIndex: "position",
                    key: "position",
                    render: () => "Frontend Developer", // This would come from the API in a real implementation
                  },
                  {
                    title: "Time",
                    dataIndex: "date",
                    key: "time",
                    render: (date: string) => {
                      const dt = dayjs(date)
                      return `${dt.format("YYYY-MM-DD")}, ${dt.format("HH:mm")}`
                    },
                  },
                  {
                    title: "Interviewer",
                    dataIndex: "interviewerEmail",
                    key: "interviewer",
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status = "Scheduled") => (
                      <Tag color={status === "Confirmed" ? "success" : "warning"}>{status}</Tag>
                    ),
                  },
                  {
                    title: "Action",
                    key: "action",
                    render: (_: any, record: Interview) => (
                      <Space size="small">
                        <Button type="link" size="small" onClick={() => viewInterview(record)}>
                          View
                        </Button>
                        <Button type="link" size="small">
                          Reschedule
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            )}
          </Card>
        </motion.div>
      </Space>

      {/* Interview Detail Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>Interview Details</span>
          </Space>
        }
        open={viewInterviewModal}
        onCancel={() => setViewInterviewModal(false)}
        footer={[
          <Button key="close" onClick={() => setViewInterviewModal(false)}>
            Close
          </Button>,
          <Button
            key="join"
            type="primary"
            href={currentInterview?.meetLink}
            target="_blank"
            disabled={!currentInterview?.meetLink}
          >
            Join Meeting
          </Button>,
        ]}
        width={700}
      >
        {currentInterview && (
          <div>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Card bordered={false} style={{ marginBottom: 16 }}>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: "#4361ee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>
                        {currentInterview.candidate?.name}
                      </Title>
                      <Space size={4} style={{ marginTop: 4 }}>
                        <MailOutlined style={{ color: "#718096" }} />
                        <Text type="secondary">{currentInterview.candidate?.email}</Text>
                      </Space>
                    </div>
                  </div>

                  <Row gutter={[24, 16]}>
                    <Col span={12}>
                      <Space align="center">
                        <Tag color={getStageColor(currentInterview.pipelineStage)} style={{ padding: "4px 8px" }}>
                          {currentInterview.pipelineStage}
                        </Tag>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <Badge
                          status={getStatusColor(currentInterview.status || "Scheduled")}
                          text={currentInterview.status || "Scheduled"}
                        />
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <TeamOutlined style={{ color: "#4361ee" }} />
                        <Text strong>Interviewer:</Text>
                        <Text>{currentInterview.interviewerEmail}</Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <CalendarOutlined style={{ color: "#10b981" }} />
                        <Text strong>Date & Time:</Text>
                        <Text>{dayjs(currentInterview.date).format("YYYY-MM-DD HH:mm")}</Text>
                      </Space>
                    </Col>
                    {currentInterview.meetLink && (
                      <Col span={24}>
                        <Space>
                          <Text strong>Meeting Link:</Text>
                          <a href={currentInterview.meetLink} target="_blank" rel="noopener noreferrer">
                            {currentInterview.meetLink}
                          </a>
                        </Space>
                      </Col>
                    )}
                  </Row>
                </Space>
              </Card>

              <Card
                title="Suggested Questions"
                variant="borderless"
                style={{ marginBottom: 16 }}
                headStyle={{ borderBottom: "1px solid #f0f0f0", padding: "12px 24px" }}
              >
                <List
                  size="small"
                  dataSource={[
                    "Tell me about your experience with React and TypeScript",
                    "How do you handle state management in large applications?",
                    "Describe a challenging project you worked on recently",
                    "How do you approach debugging complex issues?",
                    "What's your experience with CI/CD pipelines?",
                  ]}
                  renderItem={(item) => (
                    <List.Item style={{ padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>{item}</List.Item>
                  )}
                />
              </Card>

              <Card
                title="Candidate Resume"
                variant="borderless"
                headStyle={{ borderBottom: "1px solid #f0f0f0", padding: "12px 24px" }}
              >
                <Button type="primary" icon={<DownloadOutlined />}>
                  Download Resume
                </Button>
              </Card>
            </Space>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default Dashboard
