"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Card,
  Table,
  Input,
  Select,
  Space,
  Button,
  message,
  Spin,
  Typography,
  DatePicker,
  Tag,
  Badge,
  Tooltip,
  Empty,
} from "antd"
import {
  ReloadOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  AuditOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  ClearOutlined,
  MailOutlined,
} from "@ant-design/icons"
import dayjs, { type Dayjs } from "dayjs"
import type { ColumnsType } from "antd/es/table"
import axiosInstance from "../services/axiosInstance"
import {
  INTERVIEW_PIPELINE_STAGES,
  type InterviewPipelineStage,
} from "../constants/pipelineStages"

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

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
}

const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  margin: "24px",
  border: "none",
  overflow: "hidden",
}
const cardHeadStyle = {
  background: "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
  borderBottom: "none",
  padding: "16px 24px",
}
const cardBodyStyle = { padding: "24px" }
const tableStyle = {
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
}
const filterContainerStyle = {
  background: "#f8fafc",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "24px",
}
const buttonStyle = {
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "40px",
}
const primaryButtonStyle = {
  ...buttonStyle,
  background: "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
  border: "none",
  boxShadow: "0 4px 12px rgba(67, 97, 238, 0.2)",
}

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

export default function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [stageFilter, setStageFilter] = useState<InterviewPipelineStage | "">("")
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)
  const [activeFilters, setActiveFilters] = useState(0)

  const fetchInterviews = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get<Interview[]>("/interviews")
      setInterviews(res.data)
    } catch (err) {
      message.error("Failed to load interviews")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviews()
  }, [])

  useEffect(() => {
    let cnt = 0
    if (searchName) cnt++
    if (stageFilter !== "") cnt++
    if (dateRange) cnt++
    setActiveFilters(cnt)
  }, [searchName, stageFilter, dateRange])

  const filtered = useMemo(() => {
    return interviews.filter((i) => {
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
  }, [interviews, searchName, stageFilter, dateRange])

  const columns: ColumnsType<Interview> = [
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Candidate</span>
        </Space>
      ),
      dataIndex: ["candidate", "name"],
      key: "candidate",
      sorter: (a, b) => {
        return (a.candidate?.name || "").localeCompare(b.candidate?.name || "")
      },
      render: (_, record) =>
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
      onFilter: (value, record) => record.pipelineStage === value,
      render: (stage: InterviewPipelineStage) => (
        <Tag color={getStageColor(stage)} style={{ borderRadius: 4, padding: "4px 8px", fontSize: 12, fontWeight: 500 }}>
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
      sorter: (a, b) => a.interviewerEmail.localeCompare(b.interviewerEmail),
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
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
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
  ]

  const clearFilters = () => {
    setSearchName("")
    setStageFilter("")
    setDateRange(null)
  }

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined style={{ color: "white" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Scheduled Interviews
          </Title>
        </Space>
      }
      extra={
        <Space>
          <Badge count={filtered.length} style={{ backgroundColor: "#10B981" }} />
          <Tooltip title="Refresh interviews">
            <Button
              type="text"
              icon={<ReloadOutlined style={{ color: "white" }} />}
              onClick={fetchInterviews}
              loading={loading}
              style={{ color: "white" }}
            />
          </Tooltip>
        </Space>
      }
      style={cardStyle}
      headStyle={cardHeadStyle}
      bodyStyle={cardBodyStyle}
    >
      <div style={filterContainerStyle}>
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
              onChange={(e) => setSearchName(e.target.value)}
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
          </Space>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: "#718096" }}>Loading interviews...</div>
        </div>
      ) : filtered.length === 0 ? (
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
        <div style={tableStyle}>
          <Table
            rowKey="_id"
            dataSource={filtered}
            columns={columns}
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
  )
}
