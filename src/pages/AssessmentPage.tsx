"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  Select,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Table,
  message,
  Spin,
  Modal,
  Typography,
  Space,
  Tag,
  Divider,
  Empty,
  Avatar,
  Badge,
  Tooltip,
  Progress,
  Row,
  Col,
  Alert,
  Tabs,
  Skeleton,
  Statistic,
} from "antd"
import {
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileSearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
  SearchOutlined,
  PlusOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import type { UploadChangeParam } from "antd/es/upload"
import dayjs from "dayjs"
import { motion } from "framer-motion"
import axiosInstance from "../services/axiosInstance"

const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface Candidate {
  _id: string
  name: string
  email: string
  technology?: string
  level?: string
  status: string
}

interface AssessmentItem {
  _id: string
  title: string
  score: number
  remarks?: string
  fileUrl: string
  createdAt: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1, duration: 0.3 },
  },
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
}

const techColors: Record<string, string> = {
  "Dot Net": "#1677ff",
  "React JS": "#61dafb",
  DevOps: "#6b4fbb",
  QA: "#13c2c2",
  Java: "#f56a00",
  Python: "#3572A5",
  "UI/UX Designer": "#eb2f96",
}
const levelColors: Record<string, string> = {
  Junior: "#52c41a",
  Mid: "#1677ff",
  Senior: "#722ed1",
}
const avatarColors = ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1", "#13c2c2", "#fa541c"]

const getTechColor = (tech = "") => techColors[tech] || "#1677ff"
const getLevelColor = (level = "") => levelColors[level] || "#8c8c8c"
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length]
const getInitials = (name: string) =>
  name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
const getFileIcon = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "pdf":
      return <FilePdfOutlined style={{ color: "#ff4d4f" }} />
    case "doc":
    case "docx":
      return <FileWordOutlined style={{ color: "#1677ff" }} />
    case "xls":
    case "xlsx":
      return <FileExcelOutlined style={{ color: "#52c41a" }} />
    default:
      return <FileUnknownOutlined />
  }
}

const AssessmentPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [loadingAssessments, setLoadingAssessments] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewData, setPreviewData] = useState<AssessmentItem | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"assign" | "history" | "stats">("assign")

  const [form] = Form.useForm()

  useEffect(() => {
    setLoadingCandidates(true)
    axiosInstance
      .get<Candidate[]>("/candidates?status=Shortlisted")
      .then(r => setCandidates(r.data))
      .catch(() => message.error("Failed to load candidates"))
      .finally(() => setLoadingCandidates(false))
  }, [])

  const fetchAssessments = (candId: string) => {
    setLoadingAssessments(true)
    axiosInstance
      .get<AssessmentItem[]>(`/candidates/${candId}/assessments`)
      .then(r => setAssessments(r.data))
      .catch(() => message.error("Failed to load assessments"))
      .finally(() => setLoadingAssessments(false))
  }

  const handleCandidateChange = (id: string) => {
    setSelectedId(id)
    setSelectedCandidate(candidates.find(c => c._id === id) || null)
    form.resetFields()
    fetchAssessments(id)
    setActiveTab("assign")
  }

  const onFinish = (vals: any) => {
    if (!selectedId) return
    setSubmitting(true)
    const fd = new FormData()
    fd.append("title", vals.title)
    fd.append("score", String(vals.score))
    if (vals.remarks) fd.append("remarks", vals.remarks)
    const fileList = vals.file as any[]
    fd.append("file", fileList[0].originFileObj)

    axiosInstance
  .post(`/candidates/${selectedId}/assessment`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  })
      .then(() => {
        message.success("Assessment assigned & email sent!")
        form.resetFields()
        fetchAssessments(selectedId)
        setActiveTab("history")
      })
      .catch(() => message.error("Failed to assign assessment"))
      .finally(() => setSubmitting(false))
  }

  const viewAssessmentDetails = (rec: AssessmentItem) => {
    setPreviewData(rec)
    setPreviewVisible(true)
    setPreviewLoading(true)
    setTimeout(() => setPreviewLoading(false), 500)
  }

  const getScoreColor = (score: number) =>
    score >= 80 ? "#52c41a" : score >= 60 ? "#faad14" : "#f5222d"

  const stats = assessments.length
    ? {
        avg: Math.round(assessments.map(a => a.score).reduce((s, x) => s + x, 0) / assessments.length),
        highest: Math.max(...assessments.map(a => a.score)),
        lowest: Math.min(...assessments.map(a => a.score)),
        total: assessments.length,
      }
    : { avg: 0, highest: 0, lowest: 0, total: 0 }

  const candidateAvatarColor = selectedCandidate
    ? getAvatarColor(selectedCandidate.name)
    : avatarColors[0]

  const columns = [
    {
      title: "Assessment",
      dataIndex: "title",
      key: "title",
      render: (title: string, rec: AssessmentItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              backgroundColor: `${candidateAvatarColor}20`,
              borderRadius: 8,
              color: candidateAvatarColor,
            }}
          >
            {getFileIcon(rec.fileUrl)}
          </div>
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(rec.createdAt).format("MMM D, YYYY")}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      width: 120,
      render: (score: number) => (
        <Tooltip title={`${score}/100`}>
          <Progress percent={score} size="small" strokeColor={getScoreColor(score)} format={p => `${p}%`} />
        </Tooltip>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      ellipsis: true,
      render: (r: string) =>
        r ? (
          <Tooltip title={r}>
            <Text ellipsis style={{ maxWidth: 200 }}>
              {r}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_: any, rec: AssessmentItem) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => viewAssessmentDetails(rec)}>
            View
          </Button>
          <Button size="small" icon={<DownloadOutlined />} href={rec.fileUrl} target="_blank">
            Download
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Space align="center" style={{ marginBottom: 24 }}>
        <FileSearchOutlined style={{ fontSize: 24, color: "#1677ff" }} />
        <Title level={2} style={{ margin: 0 }}>
          Assessment Management
        </Title>
      </Space>

      <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Space align="center" style={{ marginBottom: 16 }}>
          <TeamOutlined style={{ fontSize: 20, color: "#1677ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            Select Candidate
          </Title>
        </Space>
        <Spin spinning={loadingCandidates}>
          <Select<string>
            showSearch
            placeholder="Search shortlisted"
            onChange={handleCandidateChange}
            style={{ width: "100%" }}
            value={selectedId}
            suffixIcon={<SearchOutlined />}
            notFoundContent={<Empty description="No candidates" />}
          >
            {candidates.map(c => (
              <Option key={c._id} value={c._id}>
                <Space>
                  <Avatar size="small" style={{ backgroundColor: getAvatarColor(c.name) }}>
                    {getInitials(c.name)}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{c.email}</div>
                  </div>
                </Space>
              </Option>
            ))}
          </Select>
        </Spin>
        {!loadingCandidates && candidates.length === 0 && (
          <Alert
            type="info"
            showIcon
            message="No Shortlisted Candidates"
            description="Please shortlist candidates first."
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      {selectedCandidate && (
        <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <Space align="center" style={{ width: "100%" }}>
            <Avatar
              size={64}
              style={{
                backgroundColor: candidateAvatarColor,
                fontSize: 24,
                boxShadow: `0 4px 12px ${candidateAvatarColor}40`,
              }}
            >
              {getInitials(selectedCandidate.name)}
            </Avatar>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {selectedCandidate.name}
              </Title>
              <Space>
                <Tag color="#1677ff">Shortlisted</Tag>
                {selectedCandidate.technology && <Tag color={getTechColor(selectedCandidate.technology)}>{selectedCandidate.technology}</Tag>}
                {selectedCandidate.level && <Tag color={getLevelColor(selectedCandidate.level)}>{selectedCandidate.level}</Tag>}
              </Space>
            </div>
            <Tabs activeKey={activeTab} onChange={k => setActiveTab(k as any)} type="card" style={{ marginLeft: "auto" }}>
              <TabPane key="assign" tab={<><PlusOutlined /> Assign</>} />
              <TabPane key="history" tab={<><FileTextOutlined /> History <Badge count={assessments.length} /></>} />
              <TabPane key="stats" tab={<><BarChartOutlined /> Stats</>} />
            </Tabs>
          </Space>
        </Card>
      )}

      {selectedId && activeTab === "assign" && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Card
            title={<><PlusOutlined style={{ marginRight: 8, color: candidateAvatarColor }} /> Assign New Assessment</>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish} disabled={submitting} requiredMark="optional">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input size="large" prefix={<FileTextOutlined />} placeholder="e.g. Coding Test" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="score" label="Score (0–100)" rules={[{ required: true }]}>
                    <InputNumber min={0} max={100} style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="remarks" label="Remarks">
                <Input.TextArea rows={4} placeholder="Optional feedback" showCount maxLength={500} />
              </Form.Item>
              <Form.Item
                name="file"
                label="File"
                valuePropName="fileList"
                getValueFromEvent={({ fileList }: UploadChangeParam) => fileList}
                rules={[{ required: true }]}
              >
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting} icon={<CheckCircleOutlined />} block>
                  {submitting ? "Assigning…" : "Assign Assessment"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>
      )}

      {selectedId && activeTab === "history" && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Card
            title={<><FileTextOutlined style={{ marginRight: 8, color: candidateAvatarColor }} /> Assessment History</>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            {loadingAssessments ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : assessments.length > 0 ? (
              <Table rowKey="_id" columns={columns} dataSource={assessments} pagination={{ pageSize: 5 }} />
            ) : (
              <Empty description="No assessments yet">
                <Button type="primary" onClick={() => setActiveTab("assign")}>
                  Assign First
                </Button>
              </Empty>
            )}
          </Card>
        </motion.div>
      )}

      {selectedId && activeTab === "stats" && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Card
            title={<><BarChartOutlined style={{ marginRight: 8, color: candidateAvatarColor }} /> Statistics</>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            {assessments.length > 0 ? (
              <>
                <Row gutter={[24, 24]}>
                  <Col span={6}>
                    <Statistic title="Avg Score" value={stats.avg} suffix="/100" valueStyle={{ color: getScoreColor(stats.avg) }} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Highest" value={stats.highest} suffix="/100" valueStyle={{ color: getScoreColor(stats.highest) }} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Lowest" value={stats.lowest} suffix="/100" valueStyle={{ color: getScoreColor(stats.lowest) }} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="Total" value={stats.total} valueStyle={{ color: candidateAvatarColor }} />
                  </Col>
                </Row>
                <Divider />
                {assessments.map(a => (
                  <div key={a._id} style={{ marginBottom: 16 }}>
                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                      <Text>{a.title}</Text>
                      <Text strong style={{ color: getScoreColor(a.score) }}>
                        {a.score}/100
                      </Text>
                    </Space>
                    <Progress percent={a.score} strokeColor={getScoreColor(a.score)} showInfo={false} />
                  </div>
                ))}
              </>
            ) : (
              <Empty description="No data">
                <Button type="primary" onClick={() => setActiveTab("assign")}>
                  Assign First
                </Button>
              </Empty>
            )}
          </Card>
        </motion.div>
      )}

      <Modal
        open={previewVisible}
        title={<><FileTextOutlined style={{ color: candidateAvatarColor, marginRight: 8 }} /> Details</>}
        footer={[
          <Button key="dl" icon={<DownloadOutlined />} href={previewData?.fileUrl} target="_blank">
            Download
          </Button>,
          <Button key="close" type="primary" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>,
        ]}
        onCancel={() => setPreviewVisible(false)}
        width={600}
        centered
      >
        {previewLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          previewData && (
            <>
              <Progress
                type="dashboard"
                percent={previewData.score}
                format={p => `${p}/100`}
                strokeColor={getScoreColor(previewData.score)}
              />
              <Divider />
              <Paragraph>
                <Text strong>Title:</Text> {previewData.title}
              </Paragraph>
              <Paragraph>
                <Text strong>Date:</Text> {dayjs(previewData.createdAt).format("MMM D, YYYY, h:mm A")}
              </Paragraph>
              {previewData.remarks && (
                <Paragraph>
                  <Text strong>Remarks:</Text> {previewData.remarks}
                </Paragraph>
              )}
              <Paragraph>
                <Text strong>File:</Text>{" "}
                <Space>
                  {getFileIcon(previewData.fileUrl)}
                  <Text>{previewData.fileUrl.split("/").pop()}</Text>
                </Space>
              </Paragraph>
            </>
          )
        )}
      </Modal>
    </div>
  )
}

export default AssessmentPage
