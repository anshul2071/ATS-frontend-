"use client"

import { useEffect, useState } from "react"
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Typography,
  Space,
  Divider,
  Empty,
  Badge,
} from "antd"
import {
  CalendarOutlined,
  UserOutlined,
  AuditOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
} from "@ant-design/icons"
import axiosInstance from "../services/axiosInstance"
import type { Moment } from "moment"
import dayjs from "dayjs"
import {
  INTERVIEW_PIPELINE_STAGES,
  type InterviewPipelineStage,
} from "../constants/pipelineStages"

const { Title, Text } = Typography
const { Option } = Select

interface Candidate {
  _id: string
  name: string
  email: string
}

interface FormValues {
  candidateId: string
  pipelineStage: InterviewPipelineStage
  date: Moment
}

const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  margin: "32px auto",
  maxWidth: 650,
  border: "none",
  overflow: "hidden",
}

const cardHeadStyle = {
  background: "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
  borderBottom: "none",
  padding: "20px 24px",
}

const cardBodyStyle = {
  padding: "32px",
}

const formItemStyle = {
  marginBottom: "24px",
}

const inputStyle = {
  borderRadius: "8px",
  padding: "10px 12px",
  height: "auto",
  boxShadow: "none",
  border: "1px solid #e2e8f0",
}

const buttonStyle = {
  height: "46px",
  borderRadius: "8px",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(67, 97, 238, 0.2)",
  background: "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
  border: "none",
}

const loadingContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column" as const,
  padding: "60px 0",
}

export default function InterviewSchedule() {
  const [form] = Form.useForm<FormValues>()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [meetLink,   setMeetLink]   = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get<Candidate[]>("/candidates", { params: { status: "Shortlisted" } })
      .then((res) => setCandidates(res.data))
      .catch(() => message.error("Failed to load shortlisted candidates."))
      .finally(() => setLoading(false))
  }, [])

  const onFinish = async (vals: FormValues) => {
    setSubmitting(true)
    setMeetLink(null)
    try {
      const res = await axiosInstance.post<{
        meetLink: string
        _id: string
        pipelineStage: string
        interviewerEmail: string
        date: string
        candidate: { name: string; email: string }
      }>("/interviews", {
        candidate: vals.candidateId,
        pipelineStage: vals.pipelineStage,
        date: vals.date.toISOString(),
      })
      message.success("Interview scheduled successfully")
      const link = res.data.meetLink
      setMeetLink(link)
      form.resetFields()
    } catch (err: any) {
      message.error(err.response?.data?.message || "Interview scheduling failed")
    } finally {
      setSubmitting(false)
    }
  }

  const getPipelineStageColor = (stage: InterviewPipelineStage) => {
    switch (stage) {
      case "HR Screening":
        return "blue"
      case "Technical Interview":
        return "purple"
      case "Managerial Interview":
        return "orange"
      default:
        return "default"
    }
  }

  const filterOption = (input: string, option: any) => {
    const text = option?.children ? String(option.children).toLowerCase() : ""
    return text.includes(input.toLowerCase())
  }

  const disabledDate = (current: any) => {
    return current && current.isBefore(dayjs().startOf("day"))
  }

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <Spin size="large" />
        <Text style={{ marginTop: 16, color: "#718096" }}>
          Loading candidates...
        </Text>
      </div>
    )
  }

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined style={{ color: "white" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Schedule Interview
          </Title>
        </Space>
      }
      style={cardStyle}
      headStyle={cardHeadStyle}
      bodyStyle={cardBodyStyle}
      extra={
        <Badge
          count={candidates.length}
          style={{ backgroundColor: "#10B981" }}
        />
      }
    >
      {candidates.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text style={{ color: "#718096" }}>
              No shortlisted candidates available for scheduling
            </Text>
          }
        />
      ) : (
        <>
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: 24 }}
          >
            Schedule interviews for shortlisted candidates by selecting the
            details below.
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark="optional"
            size="large"
          >
            <Form.Item
              name="candidateId"
              label={<Text strong>Select Candidate</Text>}
              rules={[{ required: true, message: "Please select a candidate" }]}
              style={formItemStyle}
            >
              <Select
                placeholder="Select a shortlisted candidate"
                suffixIcon={<UserOutlined style={{ color: "#a0aec0" }} />}
                style={inputStyle}
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
              >
                {candidates.map((c) => (
                  <Option key={c._id} value={c._id}>
                    <Space>
                      <UserOutlined />
                      <span>{c.name}</span>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ({c.email})
                      </Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider style={{ margin: "16px 0" }} />

            <Form.Item
              name="pipelineStage"
              label={<Text strong>Interview Stage</Text>}
              rules={[{ required: true, message: "Please select a pipeline stage" }]}
              style={formItemStyle}
            >
              <Select<InterviewPipelineStage>
                placeholder="Select interview stage"
                suffixIcon={<AuditOutlined style={{ color: "#a0aec0" }} />}
                style={inputStyle}
              >
                {INTERVIEW_PIPELINE_STAGES.map((stage) => (
                  <Option key={stage} value={stage}>
                    <Badge
                      color={getPipelineStageColor(stage)}
                      text={stage}
                    />
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label={<Text strong>Interview Date & Time</Text>}
              rules={[{ required: true, message: "Please select date & time" }]}
              style={formItemStyle}
            >
              <DatePicker
                showTime
                style={{ width: "100%", ...inputStyle }}
                format="YYYY-MM-DD HH:mm"
                placeholder="Select date and time"
                suffixIcon={<ClockCircleOutlined style={{ color: "#a0aec0" }} />}
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                icon={<ScheduleOutlined />}
                style={buttonStyle}
              >
                Schedule Interview
              </Button>
            </Form.Item>
          </Form>

          {meetLink && (
            <Space direction="vertical" style={{ marginTop: 24, width: "100%" }}>
              <Divider />
              <Text strong>Your Google Meet link:</Text>
              <a href={meetLink} target="_blank" rel="noopener noreferrer">
                {meetLink}
              </a>
            </Space>
          )}
        </>
      )}
    </Card>
  )
}
