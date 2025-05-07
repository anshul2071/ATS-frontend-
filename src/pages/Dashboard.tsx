"use client"

import type React from "react"

import { Input } from "antd"

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
  Statistic,
  Progress,
  Empty,
  Alert,
  Tag,
  Avatar,
  List,
  Table,
  Tabs,
  Modal,
  Select,
  DatePicker,
  Descriptions,
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
  CheckCircleOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BellOutlined,
  AuditOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  MailOutlined,
  ScheduleOutlined,
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import AnalyticsCharts from "../components/AnalyticsCharts"
import { fetchStats, type StatsResponse } from "../services/statsService"
import axiosInstance from "../services/axiosInstance"
import dayjs from "dayjs"
import { INTERVIEW_PIPELINE_STAGES, type InterviewPipelineStage } from "../constants/pipelineStages"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Search } = Input
const { RangePicker } = DatePicker

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

interface RecentActivity {
  id: string
  type: "application" | "interview" | "offer" | "rejection"
  title: string
  description: string
  time: string
  icon: React.ReactNode
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
  const {
    colorBgContainer,
    borderRadius,
    colorText,
    colorTextSecondary,
    colorPrimary,
    colorSuccess,
    colorWarning,
    colorInfo,
    colorError,
  } = token

  // State variables
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [interviewsLoading, setInterviewsLoading] = useState<boolean>(false)
  const [searchName, setSearchName] = useState("")
  const [stageFilter, setStageFilter] = useState<InterviewPipelineStage | "">("")
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [activeFilters, setActiveFilters] = useState(0)
  const [viewInterviewModal, setViewInterviewModal] = useState<boolean>(false)
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(false)

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

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    setActivitiesLoading(true)
    try {
      const res = await axiosInstance.get<any[]>("/activities")

      // Transform API data to our RecentActivity interface
      const activities: RecentActivity[] = res.data.map((activity) => {
        let icon
        switch (activity.type) {
          case "application":
            icon = <UserOutlined style={{ color: colorPrimary }} />
            break
          case "interview":
            icon = <CalendarOutlined style={{ color: colorSuccess }} />
            break
          case "offer":
            icon = <CheckCircleOutlined style={{ color: colorSuccess }} />
            break
          case "rejection":
            icon = <FileTextOutlined style={{ color: colorError }} />
            break
          default:
            icon = <UserOutlined style={{ color: colorPrimary }} />
        }

        return {
          id: activity._id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          time: activity.createdAt,
          icon,
        }
      })

      setRecentActivities(activities)
    } catch (err) {
      console.error("Failed to load activities", err)
      // Use fallback data if API fails
      setRecentActivities([
        {
          id: "1",
          type: "application",
          title: "New candidate applied",
          description: "John Doe applied for Senior Developer position",
          time: "10 minutes ago",
          icon: <UserOutlined style={{ color: colorPrimary }} />,
        },
        {
          id: "2",
          type: "interview",
          title: "Interview scheduled",
          description: "Technical interview with Sarah Smith at 2:00 PM",
          time: "1 hour ago",
          icon: <CalendarOutlined style={{ color: colorSuccess }} />,
        },
        {
          id: "3",
          type: "offer",
          title: "Offer accepted",
          description: "Michael Johnson accepted the job offer",
          time: "3 hours ago",
          icon: <CheckCircleOutlined style={{ color: colorSuccess }} />,
        },
        {
          id: "4",
          type: "rejection",
          title: "Candidate rejected",
          description: "Emily Brown declined the interview invitation",
          time: "Yesterday",
          icon: <FileTextOutlined style={{ color: colorError }} />,
        },
      ])
    } finally {
      setActivitiesLoading(false)
    }
  }

  useEffect(() => {
    load()
    fetchInterviews()
    fetchRecentActivities()
  }, [])

  useEffect(() => {
    let cnt = 0
    if (searchName) cnt++
    if (stageFilter !== "") cnt++
    if (dateRange) cnt++
    setActiveFilters(cnt)
  }, [searchName, stageFilter, dateRange])

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([load(), fetchInterviews(), fetchRecentActivities()])
    setRefreshing(false)
    message.success("Dashboard refreshed")
  }

  // Filter interviews based on search criteria
  const filteredInterviews = interviews.filter((i) => {
    if (!i.candidate || !i.candidate.name.toLowerCase().includes(searchName.toLowerCase())) {
      return false
    }
    if (stageFilter !== "" && i.pipelineStage !== stageFilter) {
      return false
    }
    if (dateRange) {
      const d = dayjs(i.date)
      if (d.isBefore(dateRange[0], "day") || d.isAfter(dateRange[1], "day")) {
        return false
      }
    }
    return true
  })

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

  // Clear all filters
  const clearFilters = () => {
    setSearchName("")
    setStageFilter("")
    setDateRange(null)
  }

  // View interview details
  const viewInterview = (interview: Interview) => {
    setCurrentInterview(interview)
    setViewInterviewModal(true)
  }

  // Interview table columns
  const interviewColumns = [
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Candidate</span>
        </Space>
      ),
      dataIndex: ["candidate", "name"],
      key: "candidate",
      sorter: (a: Interview, b: Interview) => {
        return (a.candidate?.name || "").localeCompare(b.candidate?.name || "")
      },
      render: (_: any, record: Interview) =>
        record.candidate ? (
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 14 }}>
              {record.candidate.name}
            </Text>
            <Space size={4} style={{ marginTop: 4 }}>
              <MailOutlined style={{ fontSize: 12, color: "#718096" }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.candidate.email}
              </Text>
            </Space>
          </Space>
        ) : (
          <Text type="warning">No candidate data</Text>
        ),
    },
    {
      title: (
        <Space>
          <AuditOutlined />
          <span>Stage</span>
        </Space>
      ),
      dataIndex: "pipelineStage",
      key: "pipelineStage",
      filters: INTERVIEW_PIPELINE_STAGES.map((label) => ({ text: label, value: label })),
      onFilter: (value: any, record: Interview) => record.pipelineStage === value.toString(),
      render: (stage: InterviewPipelineStage) => (
        <Tag
          color={getStageColor(stage)}
          style={{ borderRadius: 4, padding: "4px 8px", fontSize: 12, fontWeight: 500 }}
        >
          {stage}
        </Tag>
      ),
    },
    {
      title: (
        <Space>
          <TeamOutlined />
          <span>Interviewer</span>
        </Space>
      ),
      dataIndex: "interviewerEmail",
      key: "interviewerEmail",
      sorter: (a: Interview, b: Interview) => a.interviewerEmail.localeCompare(b.interviewerEmail),
      render: (email: string) => (
        <Space>
          <TeamOutlined style={{ color: "#4361ee" }} />
          <Text>{email}</Text>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <ClockCircleOutlined />
          <span>Scheduled At</span>
        </Space>
      ),
      dataIndex: "date",
      key: "date",
      sorter: (a: Interview, b: Interview) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: (d: string) => {
        const dt = dayjs(d)
        const isToday = dt.isSame(dayjs(), "day")
        const isPast = dt.isBefore(dayjs(), "day")
        return (
          <Space direction="vertical" size={0}>
            <Space>
              <CalendarOutlined style={{ color: isPast ? "#ef4444" : isToday ? "#f59e0b" : "#10b981" }} />
              <Text strong style={{ fontSize: 14 }}>
                {dt.format("YYYY-MM-DD")}
              </Text>
              {isToday && <Badge status="processing" color="#f59e0b" text="Today" />}
              {isPast && <Badge status="error" text="Past" />}
            </Space>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 20 }}>
              {dt.format("HH:mm")}
            </Text>
          </Space>
        )
      },
    },
    {
      title: (
        <Space>
          <span>Status</span>
        </Space>
      ),
      dataIndex: "status",
      key: "status",
      render: (status = "Scheduled") => <Badge status={getStatusColor(status)} text={status} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Interview) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => viewInterview(record)}>
            View
          </Button>
          <Button type="default" size="small" icon={<EditOutlined />}>
            Edit
          </Button>
        </Space>
      ),
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

        <motion.div variants={itemVariants}>
          <Tabs defaultActiveKey="interviews" onChange={setActiveTab} type="card">
            <TabPane
              tab={
                <span>
                  <CalendarOutlined /> Interviews
                </span>
              }
              key="interviews"
            >
              <Card
                bordered={false}
                style={{
                  borderRadius: borderRadius + 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space align="center" style={{ marginBottom: 8 }}>
                      <FilterOutlined />
                      <Text strong>Filter Interviews</Text>
                      {activeFilters > 0 && (
                        <Badge count={activeFilters} size="small" style={{ backgroundColor: "#4361ee" }} />
                      )}
                      <div style={{ flex: 1 }} />
                      {activeFilters > 0 && (
                        <Button
                          type="text"
                          size="small"
                          icon={<ClearOutlined />}
                          onClick={clearFilters}
                          style={{ color: "#4361ee" }}
                        >
                          Clear All
                        </Button>
                      )}
                    </Space>

                    <Space wrap style={{ width: "100%" }}>
                      <Search
                        placeholder="Search by candidate name"
                        onSearch={setSearchName}
                        value={searchName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                        allowClear
                        enterButton={<SearchOutlined />}
                        style={{ width: 240 }}
                      />

                      <Select<InterviewPipelineStage | "">
                        placeholder="Filter by stage"
                        allowClear
                        style={{ width: 200 }}
                        value={stageFilter}
                        onChange={setStageFilter}
                        suffixIcon={<AuditOutlined style={{ color: "#a0aec0" }} />}
                      >
                        {INTERVIEW_PIPELINE_STAGES.map((label) => (
                          <Select.Option key={label} value={label}>
                            <Tag color={getStageColor(label)} style={{ marginRight: 8 }}>
                              {label}
                            </Tag>
                          </Select.Option>
                        ))}
                      </Select>

                      <RangePicker
                        format="YYYY-MM-DD"
                        onChange={(dates) =>
                          dates && dates[0] && dates[1] ? setDateRange([dates[0], dates[1]]) : setDateRange(null)
                        }
                        allowClear
                        style={{ width: 280 }}
                        placeholder={["Start date", "End date"]}
                      />

                      <Button
                        type="primary"
                        icon={<ScheduleOutlined />}
                        onClick={() => (window.location.href = "/schedule-interview")}
                      >
                        Schedule New
                      </Button>
                    </Space>
                  </Space>
                </div>

                {interviewsLoading ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16, color: "#718096" }}>Loading interviews...</div>
                  </div>
                ) : filteredInterviews.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Text style={{ color: "#718096" }}>
                        {interviews.length === 0
                          ? "No interviews scheduled yet"
                          : "No interviews match the current filters"}
                      </Text>
                    }
                    style={{ margin: "40px 0" }}
                  />
                ) : (
                  <div
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <Table
                      rowKey="_id"
                      dataSource={filteredInterviews}
                      columns={interviewColumns}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} interviews`,
                        style: { marginBottom: 0, padding: "16px" },
                      }}
                      scroll={{ x: "max-content" }}
                      rowClassName={(record) =>
                        dayjs(record.date).isBefore(dayjs(), "day") ? "past-interview-row" : ""
                      }
                    />
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <BarChartOutlined /> Analytics
                </span>
              }
              key="analytics"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
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
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      height: "100%",
                    }}
                  >
                    {loading ? (
                      <div style={{ padding: "20px 0" }}>
                        <Skeleton active paragraph={{ rows: 10 }} />
                      </div>
                    ) : stats ? (
                      <AnalyticsCharts
                        pipeline={stats?.pipeline || []}
                        timeToHire={stats?.timeToHire || []}
                        byTech={stats?.byTech || []}
                      />
                    ) : (
                      <Empty description="No analytics data available" />
                    )}
                  </Card>
                </Col>

                <Col xs={24} lg={8}>
                  <Card
                    className="activity-card"
                    bordered={false}
                    title={
                      <Space>
                        <TeamOutlined />
                        <span>Recent Activities</span>
                      </Space>
                    }
                    extra={<Button type="link">View All</Button>}
                    style={{
                      borderRadius: borderRadius + 4,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      height: "100%",
                    }}
                  >
                    {activitiesLoading ? (
                      <Skeleton active avatar paragraph={{ rows: 4 }} />
                    ) : (
                      <List
                        itemLayout="horizontal"
                        dataSource={recentActivities}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar icon={item.icon} style={{ backgroundColor: "transparent" }} />}
                              title={item.title}
                              description={
                                <div>
                                  <div>{item.description}</div>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {item.time}
                                  </Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    )}
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            className="interviews-card"
            bordered={false}
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
                onClick={() => (window.location.href = "/schedule-interview")}
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
              <Empty description="No upcoming interviews scheduled" />
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

        <motion.div variants={itemVariants}>
          <Alert
            message="System Notification"
            description="The recruitment system will be undergoing maintenance on Saturday, May 10th from 2:00 AM to 4:00 AM UTC. Please plan accordingly."
            type="info"
            showIcon
            closable
            style={{
              borderRadius: borderRadius + 4,
            }}
          />
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
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Candidate">
                <Space>
                  <UserOutlined />
                  <Text strong>{currentInterview.candidate?.name}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  <Text>{currentInterview.candidate?.email}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Interview Stage">
                <Tag color={getStageColor(currentInterview.pipelineStage)}>{currentInterview.pipelineStage}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Interviewer">
                <Space>
                  <TeamOutlined />
                  <Text>{currentInterview.interviewerEmail}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Date & Time">
                <Space>
                  <CalendarOutlined />
                  <Text>{dayjs(currentInterview.date).format("YYYY-MM-DD HH:mm")}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={getStatusColor(currentInterview.status || "Scheduled")}
                  text={currentInterview.status || "Scheduled"}
                />
              </Descriptions.Item>
              {currentInterview.meetLink && (
                <Descriptions.Item label="Meeting Link">
                  <a href={currentInterview.meetLink} target="_blank" rel="noopener noreferrer">
                    {currentInterview.meetLink}
                  </a>
                </Descriptions.Item>
              )}
              {currentInterview.feedback && (
                <Descriptions.Item label="Feedback">
                  <Text>{currentInterview.feedback}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">Interview Preparation</Divider>

            <Card size="small" title="Suggested Questions" style={{ marginBottom: 16 }}>
              <List
                size="small"
                dataSource={[
                  "Tell me about your experience with React and TypeScript",
                  "How do you handle state management in large applications?",
                  "Describe a challenging project you worked on recently",
                  "How do you approach debugging complex issues?",
                  "What's your experience with CI/CD pipelines?",
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>

            <Card size="small" title="Candidate Resume">
              <Button type="primary" icon={<DownloadOutlined />}>
                Download Resume
              </Button>
            </Card>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default Dashboard
