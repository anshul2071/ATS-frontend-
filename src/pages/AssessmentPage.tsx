"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
  ConfigProvider,
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
}

interface AssessmentItem {
  _id: string
  title: string
  score: number
  remarks?: string
  fileUrl: string
  createdAt: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1, duration: 0.3 },
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

// Theme colors
const primaryColor = "#5b21b6" // Deep purple
const secondaryColor = "#ec4899" // Pink

// Avatar colors based on first letter of name
const avatarColors = [
  "#5b21b6", // Purple (primary)
  "#ec4899", // Pink (secondary)
  "#06b6d4", // Cyan
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
]

// Helper function to get avatar color based on name
const getAvatarColor = (name: string) => {
  const firstChar = name.charAt(0).toLowerCase()
  const index = firstChar.charCodeAt(0) % avatarColors.length
  return avatarColors[index]
}

// Helper function to get initials for avatar
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Helper function to get file icon based on file extension
const getFileIcon = (fileUrl: string) => {
  const extension = fileUrl.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
      return <FilePdfOutlined style={{ color: "#ef4444" }} />
    case "doc":
    case "docx":
      return <FileWordOutlined style={{ color: "#5b21b6" }} />
    case "xls":
    case "xlsx":
      return <FileExcelOutlined style={{ color: "#10b981" }} />
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

  // 1️⃣ Load shortlisted candidates
  useEffect(() => {
    setLoadingCandidates(true)
    axiosInstance
      .get<Candidate[]>("/candidates?status=Shortlisted")
      .then((r) => setCandidates(r.data))
      .catch(() => message.error("Failed to load candidates"))
      .finally(() => setLoadingCandidates(false))
  }, [])

  // 2️⃣ Fetch assessments for one candidate
  const fetchAssessments = (candId: string) => {
    setLoadingAssessments(true)
    axiosInstance
      .get<AssessmentItem[]>(`/candidates/${candId}/assessments`)
      .then((r) => setAssessments(r.data))
      .catch(() => message.error("Failed to load assessments"))
      .finally(() => setLoadingAssessments(false))
  }

  // When user picks a candidate
  const handleCandidateChange = (id: string) => {
    setSelectedId(id)
    const cand = candidates.find((c) => c._id === id) || null
    setSelectedCandidate(cand)
    form.resetFields()
    fetchAssessments(id)
    setActiveTab("assign")
  }

  // 3️⃣ Submit new assessment
   // 3️⃣ Submit new assessment
   const onFinish = (vals: any) => {
    if (!selectedId) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", vals.title);
    formData.append("score", String(vals.score));
    if (vals.remarks) formData.append("remarks", vals.remarks);
    const fileList: any[] = vals.file || [];
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("file", fileList[0].originFileObj);
    }


   axiosInstance.post(
     `/candidates/${selectedId}/assessments`,
     formData,
     { headers: { 'Content-Type': 'multipart/form-data' } }
   )
      .then(() => {
        message.success("Assessment assigned & email sent!");
        form.resetFields();
        fetchAssessments(selectedId);
        setActiveTab("history");
      })
      .catch((err) => {
        console.error("Assign assessment failed:", err);
        const apiMsg = err.response?.data?.message;
        message.error(apiMsg || "Failed to assign assessment");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const viewAssessmentDetails = (rec: AssessmentItem) => {
    setPreviewData(rec)
    setPreviewVisible(true)
    setPreviewLoading(true)
    setTimeout(() => setPreviewLoading(false), 500)
  }

  // Get score color based on score value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981" // Green
    if (score >= 60) return "#f59e0b" // Amber
    return "#ef4444" // Red
  }

  // Calculate assessment statistics
  const stats = assessments.length
    ? {
        avg: Math.round(assessments.map((a) => a.score).reduce((s, x) => s + x, 0) / assessments.length),
        highest: Math.max(...assessments.map((a) => a.score)),
        lowest: Math.min(...assessments.map((a) => a.score)),
        total: assessments.length,
      }
    : { avg: 0, highest: 0, lowest: 0, total: 0 }

  // Get the candidate's avatar color if a candidate is selected
  const candidateAvatarColor = selectedCandidate ? getAvatarColor(selectedCandidate.name) : primaryColor

  // 4️⃣ Table columns
  const columns = [
    {
      title: "Assessment",
      dataIndex: "title",
      key: "title",
      render: (title: string, rec: AssessmentItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              backgroundColor: `${candidateAvatarColor}20`,
              borderRadius: "8px",
              color: candidateAvatarColor,
            }}
          >
            {getFileIcon(rec.fileUrl)}
          </div>
          <div>
            <Text strong style={{ display: "block" }}>
              {title}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
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
          <Progress
            percent={score}
            size="small"
            strokeColor={getScoreColor(score)}
            format={(percent) => `${percent}%`}
          />
        </Tooltip>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      ellipsis: true,
      render: (remarks: string) =>
        remarks ? (
          <Tooltip title={remarks}>
            <Text ellipsis style={{ maxWidth: 200 }}>
              {remarks}
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
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => viewAssessmentDetails(rec)}
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
          >
            View
          </Button>
          <Button icon={<DownloadOutlined />} size="small" href={rec.fileUrl} target="_blank" rel="noopener noreferrer">
            Download
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          borderRadius: 8,
        },
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <FileSearchOutlined style={{ fontSize: 24, marginRight: 12, color: primaryColor }} />
          <Title level={2} style={{ margin: 0, color: primaryColor }}>
            Assessment Management
          </Title>
        </div>

        {/* Candidate Selector Card */}
        <Card
          bordered={false}
          style={{
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <TeamOutlined style={{ fontSize: 20, marginRight: 8, color: primaryColor }} />
            <Title level={4} style={{ margin: 0, color: "#374151" }}>
              Select Candidate
            </Title>
          </div>

          <Spin spinning={loadingCandidates}>
            <Select
              showSearch
              placeholder="Search and select a shortlisted candidate"
              optionFilterProp="children"
              onChange={handleCandidateChange}
              style={{ width: "100%" }}
              value={selectedId}
              disabled={loadingCandidates}
              size="large"
              suffixIcon={<SearchOutlined />}
              notFoundContent={
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No shortlisted candidates found" />
              }
              labelInValue={false}
              optionLabelProp="label"
            >
              {candidates.map((c) => (
                <Option key={c._id} value={c._id} label={c.name}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      style={{
                        backgroundColor: getAvatarColor(c.name),
                        marginRight: 8,
                      }}
                      size="small"
                    >
                      {getInitials(c.name)}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{c.name}</div>
                      <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{c.email}</div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Spin>

          {!loadingCandidates && candidates.length === 0 && (
            <Alert
              message="No Shortlisted Candidates"
              description="There are no shortlisted candidates available. Please shortlist candidates first to assign assessments."
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Card>

        {/* Selected Candidate Info */}
        {selectedCandidate && (
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                size={64}
                style={{
                  backgroundColor: candidateAvatarColor,
                  fontSize: 24,
                  fontWeight: "bold",
                  marginRight: 16,
                  boxShadow: `0 4px 12px ${candidateAvatarColor}40`,
                }}
              >
                {getInitials(selectedCandidate.name)}
              </Avatar>

              <div>
                <Title level={3} style={{ margin: 0, marginBottom: 4, color: "#374151" }}>
                  {selectedCandidate.name}
                </Title>
                <Text type="secondary">{selectedCandidate.email}</Text>
              </div>

              <div style={{ marginLeft: "auto" }}>
                <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k as any)} type="card" size="small">
                  <TabPane
                    tab={
                      <span>
                        <PlusOutlined /> Assign
                      </span>
                    }
                    key="assign"
                  />
                  <TabPane
                    tab={
                      <span>
                        <FileTextOutlined /> History
                        {assessments.length > 0 && (
                          <Badge
                            count={assessments.length}
                            style={{
                              marginLeft: 8,
                              backgroundColor: candidateAvatarColor,
                            }}
                          />
                        )}
                      </span>
                    }
                    key="history"
                  />
                  <TabPane
                    tab={
                      <span>
                        <BarChartOutlined /> Stats
                      </span>
                    }
                    key="stats"
                  />
                </Tabs>
              </div>
            </div>
          </Card>
        )}

        {/* Content based on active tab */}
        {selectedId && activeTab === "assign" && (
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <PlusOutlined style={{ marginRight: 8, color: candidateAvatarColor }} />
                  <span>Assign New Assessment</span>
                </div>
              }
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Form form={form} layout="vertical" onFinish={onFinish} disabled={submitting} requiredMark="optional">
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="title"
                      label="Assessment Title"
                      rules={[{ required: true, message: "Please enter a title" }]}
                    >
                      <Input
                        placeholder="e.g. Coding Challenge, Technical Interview"
                        prefix={<FileTextOutlined style={{ color: "#bfbfbf" }} />}
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="score"
                      label="Score (0-100)"
                      rules={[{ required: true, message: "Please set a score" }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                        placeholder="Enter score out of 100"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="remarks"
                  label="Remarks or Feedback"
                  extra="Add any additional feedback, instructions, or notes about this assessment"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Optional feedback or instructions for the candidate"
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Form.Item
                  name="file"
                  label="Assessment File"
                  valuePropName="fileList"
                  getValueFromEvent={({ fileList }: UploadChangeParam) => fileList}
                  rules={[{ required: true, message: "Please upload a file" }]}
                  extra="Upload the assessment document, test results, or evaluation form (max 10MB)"
                >
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    listType="picture"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  >
                    <Button icon={<UploadOutlined />} size="large">
                      Select File
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<CheckCircleOutlined />}
                    size="large"
                    block
                    style={{
                      height: 48,
                      backgroundColor: candidateAvatarColor,
                      borderColor: candidateAvatarColor,
                    }}
                  >
                    {submitting ? "Assigning Assessment..." : "Assign Assessment"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </motion.div>
        )}

        {selectedId && activeTab === "history" && (
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FileTextOutlined style={{ marginRight: 8, color: candidateAvatarColor }} />
                    <span>Assessment History</span>
                  </div>
                  <Badge
                    count={assessments.length}
                    style={{ backgroundColor: assessments.length ? candidateAvatarColor : "#d9d9d9" }}
                  />
                </div>
              }
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              {loadingAssessments ? (
                <div style={{ padding: "20px 0" }}>
                  <Skeleton active paragraph={{ rows: 5 }} />
                </div>
              ) : assessments.length > 0 ? (
                <Table
                  rowKey="_id"
                  columns={columns}
                  dataSource={assessments}
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: 800 }}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No assessments have been assigned yet">
                  <Button type="primary" onClick={() => setActiveTab("assign")} icon={<PlusOutlined />}>
                    Assign First Assessment
                  </Button>
                </Empty>
              )}
            </Card>
          </motion.div>
        )}

        {selectedId && activeTab === "stats" && (
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BarChartOutlined style={{ marginRight: 8, color: candidateAvatarColor }} />
                  <span>Assessment Statistics</span>
                </div>
              }
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              {assessments.length > 0 ? (
                <>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={6}>
                      <Card bordered={false} style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}>
                        <Statistic
                          title="Average Score"
                          value={stats.avg}
                          suffix="/100"
                          valueStyle={{ color: getScoreColor(stats.avg) }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card bordered={false} style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}>
                        <Statistic
                          title="Highest Score"
                          value={stats.highest}
                          suffix="/100"
                          valueStyle={{ color: getScoreColor(stats.highest) }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card bordered={false} style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}>
                        <Statistic
                          title="Lowest Score"
                          value={stats.lowest}
                          suffix="/100"
                          valueStyle={{ color: getScoreColor(stats.lowest) }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card bordered={false} style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}>
                        <Statistic
                          title="Total Assessments"
                          value={stats.total}
                          valueStyle={{ color: candidateAvatarColor }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Divider />

                  <div style={{ marginTop: 24 }}>
                    <Title level={5}>Score Distribution</Title>
                    <div style={{ marginTop: 16 }}>
                      {assessments.map((assessment) => (
                        <div key={assessment._id} style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <Text>{assessment.title}</Text>
                            <Text strong style={{ color: getScoreColor(assessment.score) }}>
                              {assessment.score}/100
                            </Text>
                          </div>
                          <Progress
                            percent={assessment.score}
                            strokeColor={getScoreColor(assessment.score)}
                            showInfo={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No assessment data available">
                  <Button type="primary" onClick={() => setActiveTab("assign")} icon={<PlusOutlined />}>
                    Assign First Assessment
                  </Button>
                </Empty>
              )}
            </Card>
          </motion.div>
        )}

        {/* Assessment Preview Modal */}
        <Modal
          open={previewVisible}
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <FileTextOutlined style={{ marginRight: 8, color: candidateAvatarColor }} />
              <span>Assessment Details</span>
            </div>
          }
          footer={[
            <Button
              key="download"
              icon={<DownloadOutlined />}
              href={previewData?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </Button>,
            <Button
              key="close"
              type="primary"
              onClick={() => setPreviewVisible(false)}
              style={{ backgroundColor: candidateAvatarColor, borderColor: candidateAvatarColor }}
            >
              Close
            </Button>,
          ]}
          onCancel={() => setPreviewVisible(false)}
          width={600}
          centered
        >
          {previewLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Spin size="large" />
            </div>
          ) : (
            previewData && (
              <div>
                <div style={{ marginBottom: 24, textAlign: "center" }}>
                  <Progress
                    type="dashboard"
                    percent={previewData.score}
                    format={(percent) => `${percent}/100`}
                    strokeColor={getScoreColor(previewData.score)}
                  />
                </div>

                <Divider />

                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text strong>Title:</Text>
                    <Paragraph>{previewData.title}</Paragraph>
                  </Col>

                  <Col span={24}>
                    <Text strong>Date:</Text>
                    <Paragraph>{dayjs(previewData.createdAt).format("MMMM D, YYYY, h:mm A")}</Paragraph>
                  </Col>

                  {previewData.remarks && (
                    <Col span={24}>
                      <Text strong>Remarks:</Text>
                      <Paragraph>{previewData.remarks}</Paragraph>
                    </Col>
                  )}

                  <Col span={24}>
                    <Text strong>File:</Text>
                    <Paragraph>
                      <Space>
                        {getFileIcon(previewData.fileUrl)}
                        <Text>{previewData.fileUrl.split("/").pop()}</Text>
                      </Space>
                    </Paragraph>
                  </Col>
                </Row>
              </div>
            )
          )}
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default AssessmentPage
