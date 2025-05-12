"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  Tabs,
  Spin,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Modal,
  Alert,
  Space,
  Typography,
  Avatar,
  Tag,
  Divider,
  Row,
  Col,
  Tooltip,
  Badge,
  Steps,
  Timeline,
  Drawer,
  Collapse,
  Empty,
} from "antd"
import {
  UploadOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CodeOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  SendOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  StarOutlined,
  StarFilled,
  FileSearchOutlined,
  TrophyOutlined,
  DollarOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../services/axiosInstance"
import ResumeParser, { type ResumeSummary } from "../components/ResumeParser"
import dayjs from "dayjs"

// Update the pipeline stages constant
const PIPELINE_STAGES = [
  "Shortlisted",
  "HR Screening",
  "Technical Interview",
  "Managerial Interview",
  "Hired",
  "Rejected",
  "Blacklisted",
]

const { Text, Title, Paragraph } = Typography
const { Panel } = Collapse
const { Step } = Steps
const { TabPane } = Tabs

interface Assessment {
  _id: string
  title: string
  fileUrl: string
  remarks?: string
  score?: number
  createdAt: string
}

interface AssessmentItem {
  _id: string
  title: string
  score: number | undefined
  remarks?: string
  fileUrl: string
  createdAt: string
  
}


interface Offer {
  _id: string
  templateName: string
  sentTo: string
  date: string
}

interface CandidateType {
  _id: string
  name: string
  email: string
  phone?: string
  references?: string
  technology: string
  level: string
  salaryExpectation?: number
  experience?: number
  status: string
  assessments: Assessment[]
  parserSummary?: ResumeSummary
  cvUrl?: string
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { scale: 1.02 },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

// Status colors
const statusColors: Record<string, string> = {
  Hired: "#52c41a",
  Shortlisted: "#1677ff",
  "Technical Interview": "#722ed1",
  "HR Screening": "#13c2c2",
  "Managerial Interview": "#fa8c16",
  Rejected: "#f5222d",
  Blacklisted: "#595959",
}




// Technology colors
const techColors: Record<string, string> = {
  "Dot Net": "#1677ff",
  "React JS": "#61dafb",
  DevOps: "#6b4fbb",
  QA: "#13c2c2",
  Java: "#f56a00",
  Python: "#3572A5",
  "UI/UX Designer": "#eb2f96",
}

// Level colors
const levelColors: Record<string, string> = {
  Junior: "#52c41a",
  Mid: "#1677ff",
  Senior: "#722ed1",
}

// Avatar background colors based on first letter of name
const avatarColors = [
  "#1677ff", // Blue
  "#52c41a", // Green
  "#fa8c16", // Orange
  "#eb2f96", // Pink
  "#722ed1", // Purple
  "#13c2c2", // Cyan
  "#fa541c", // Volcano
]

// Helper function to get status color
const getStatusColor = (status: string) => {
  return statusColors[status] || "#8c8c8c"
}

// Helper function to get level color
const getLevelColor = (level: string) => {
  return levelColors[level] || "#8c8c8c"
}

// Helper function to get technology color
const getTechColor = (tech: string) => {
  return techColors[tech] || "#1677ff"
}

// Helper function to get file icon based on file extension
const getFileIcon = (fileUrl: string) => {
  const extension = fileUrl.split(".").pop()?.toLowerCase()

  switch (extension) {
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

const CandidateDetail:React.FC =() =>{
  const { id: candidateId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [candidate, setCandidate] = useState<CandidateType | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [editing, setEditing] = useState(false)
  const [infoForm] = Form.useForm()
  const [assessForm] = Form.useForm()
  const [bgForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState("profile")
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [resumePreviewVisible, setResumePreviewVisible] = useState(false)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [statusChangeModalVisible, setStatusChangeModalVisible] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [statusHistory, setStatusHistory] = useState<{ status: string; date: string }[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [scoreModalVisible, setScoreModalVisible] = useState(false)
  const [detailRecord, setDetailRecord] = useState<AssessmentItem|null>(null)
  
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  

  const openAssessmentDetails = (rec: AssessmentItem) => {
    setDetailRecord(rec)
    setDetailModalVisible(true)
  }
  
  const closeAssessmentDetails = () => {
    setDetailModalVisible(false)
    setDetailRecord(null)
  }

  const prevStatusRef = useRef<string>("")

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const params = new URLSearchParams(location.search)
    const tabParam = params.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [location])

  useEffect(() => {
    if (!candidateId) return;
  
    (async () => {
      setLoading(true);
  
      // load candidate data and its existing assessments
      try {
        const { data: candidateData } = await axiosInstance.get<CandidateType>(
          `/candidates/${candidateId}`
        );
        setCandidate(candidateData);
        setAssessments(candidateData.assessments as AssessmentItem[]);        prevStatusRef.current = candidateData.status;
  
        infoForm.setFieldsValue({
          name: candidateData.name,
          phone: candidateData.phone,
          references: candidateData.references,
          technology: candidateData.technology,
          level: candidateData.level,
          salaryExpectation: candidateData.salaryExpectation,
          experience: candidateData.experience,
        });
  
        setStatusHistory([
          { status: "Applied", date: "2023-01-15" },
          { status: "Shortlisted", date: "2023-01-20" },
          { status: candidateData.status, date: "2023-02-01" },
        ]);
      } catch {
        message.error("Failed to load candidate");
      }
  
      // load offers for this candidate
      try {
        const { data: lettersData } = await axiosInstance.get<Offer[]>(
          `/candidates/${candidateId}/letters?type=offer`
        );
        setOffers(lettersData || []);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setOffers([]);
        } else {
          message.error("Failed to load offers");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [candidateId, infoForm]);
  

  if (loading || !candidate) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
          flexDirection: "column",
          gap: "16px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Spin size="large" />
        <Text type="secondary">Loading candidate details...</Text>
      </div>
    )
  }

  const saveInfo = async (vals: any) => {
    try {
      const { data } = await axiosInstance.put<CandidateType>(`/candidates/${candidateId}`, vals)
      setCandidate(data)
      setEditing(false)
      message.success("Candidate information updated successfully")
    } catch {
      message.error("Update failed")
    }
  }

  const changeStatus = async (newStatusValue: string) => {
    setNewStatus(newStatusValue)
    setStatusChangeModalVisible(true)
  }

  const confirmStatusChange = async () => {
    try {
      await axiosInstance.put(`/candidates/${candidateId}`, { status: newStatus })

      // Update status history
      setStatusHistory([...statusHistory, { status: newStatus, date: new Date().toISOString().split("T")[0] }])

      // Update candidate status
      setCandidate({ ...candidate, status: newStatus })
      prevStatusRef.current = newStatus

      message.success(`Status updated to ${newStatus}`)
      setStatusChangeModalVisible(false)
    } catch {
      message.error("Failed to update status")
    }
  }

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const ok = file.size < 10 * 1024 * 1024
      if (!ok) message.error("File too large (max 10MB)")
      return ok
    },
    maxCount: 1,
    customRequest: (options: any) => {
      const { onSuccess } = options
      setTimeout(() => onSuccess && onSuccess("ok"), 0)
    },
  }
// at the very top of the file

const addAssessment = async (vals: any) => {
  if (!candidateId) return

  try {
    const fd = new FormData()
    fd.append("title", vals.title)
    fd.append("score", String(vals.score))
    if (vals.remarks) {
      fd.append("remarks", vals.remarks)
    }

    // vals.file is the Upload’s fileList
    const fileList = vals.file as any[]
    if (!fileList?.length) {
      message.error("Please select a file before submitting.")
      return
    }
    fd.append("file", fileList[0].originFileObj)

    // POST to the plural `/assessments` endpoint
  
    const { data: newAssessment } = await axiosInstance.post<AssessmentItem>(
      `/candidates/${candidateId}/assessments`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )


    setAssessments(prev => [newAssessment, ...prev])
    assessForm.resetFields()
    message.success("Assessment added successfully")
  } catch (err: any) {
    console.error("addAssessment error:", err)

    const apiMsg = err.response?.data?.message
    if (apiMsg) {
      message.error(apiMsg)
    } else {
      message.error("Upload failed")
    }
  }
}


  const handleDeleteCandidate = () => {
    setDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/candidates/${candidateId}`)
      message.success("Candidate deleted successfully")
      navigate("/candidates")
    } catch {
      message.error("Failed to delete candidate")
    } finally {
      setDeleteModalVisible(false)
    }
  }

  const sendBackground = async (vals: any) => {
    try {
      await axiosInstance.post(`/candidates/${candidateId}/background`, vals)
      bgForm.resetFields()
      message.success("Background check email sent successfully")
    } catch {
      message.error("Failed to send background check")
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get avatar color based on name
  const getAvatarColor = (name: string) => {
    const firstChar = name.charAt(0).toLowerCase()
    const index = firstChar.charCodeAt(0) % avatarColors.length
    return avatarColors[index]
  }

  const openResumePreview = (fileUrl: string) => {
    setSelectedResume(fileUrl)
    setResumePreviewVisible(true)
  }

  // Get current step in pipeline
  const getCurrentStep = () => {
    return PIPELINE_STAGES.findIndex((s) => s === candidate.status)
  }

  // Get available next stages
  const getAvailableStages = () => {
    const currentIndex = PIPELINE_STAGES.findIndex((s) => s === candidate.status)
    return PIPELINE_STAGES.filter((_, index) => index > currentIndex)
  }

  const avatarColor = getAvatarColor(candidate.name)

  // Replace the profile section to remove stats
  const renderInfoContent = () => (
    <AnimatePresence mode="wait">
      {editing ? (
        <motion.div key="edit-form" initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
          <Form form={infoForm} layout="vertical" onFinish={saveInfo} className="candidate-edit-form">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter candidate name" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="phone" label="Phone Number">
                  <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="references" label="References">
              <Input.TextArea
                rows={2}
                placeholder="Enter references or referral information"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="technology"
                  label="Technology"
                  rules={[{ required: true, message: "Please select technology" }]}
                >
                  <Select placeholder="Select technology">
                    {["Dot Net", "React JS", "DevOps", "QA", "Java", "Python", "UI/UX Designer"].map((t) => (
                      <Select.Option key={t} value={t}>
                        {t}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="level" label="Experience Level">
                  <Select placeholder="Select experience level">
                    {["Junior", "Mid", "Senior"].map((l) => (
                      <Select.Option key={l} value={l}>
                        {l}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item name="salaryExpectation" label="Salary Expectation">
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                    placeholder="Enter expected salary"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="experience" label="Years of Experience">
                  <InputNumber style={{ width: "100%" }} min={0} max={50} placeholder="Enter years of experience" />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
              <Button icon={<CloseOutlined />} onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </motion.div>
      ) : (
        <motion.div key="info-display" initial="hidden" animate="visible" exit="hidden" variants={containerVariants}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <motion.div variants={itemVariants}>
                <Card
                  className="info-card"
                  bordered={false}
                  style={{
                    height: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    backgroundColor: "#fff",
                  }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Space align="center">
                      <CodeOutlined style={{ fontSize: 18, color: "#1677ff" }} />
                      <Text strong>Technology:</Text>
                      <Tag color="blue">{candidate.technology}</Tag>
                    </Space>

                    <Space align="center">
                      <TrophyOutlined style={{ fontSize: 18, color: "#722ed1" }} />
                      <Text strong>Level:</Text>
                      <Tag color={getLevelColor(candidate.level)}>{candidate.level}</Tag>
                    </Space>

                    <Space align="center">
                      <DollarOutlined style={{ fontSize: 18, color: "#52c41a" }} />
                      <Text strong>Salary Expectation:</Text>
                      <Text>
                        {candidate.salaryExpectation ? `$${candidate.salaryExpectation.toLocaleString()}` : "—"}
                      </Text>
                    </Space>

                    <Space align="center">
                      <ClockCircleOutlined style={{ fontSize: 18, color: "#fa8c16" }} />
                      <Text strong>Experience:</Text>
                      <Text>{candidate.experience || 0} years</Text>
                    </Space>
                  </Space>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} md={12}>
              <motion.div variants={itemVariants}>
                <Card
                  className="contact-card"
                  bordered={false}
                  style={{
                    height: "100%",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    backgroundColor: "#fff",
                  }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Space align="center">
                      <MailOutlined style={{ fontSize: 18, color: "#1677ff" }} />
                      <Text strong>Email:</Text>
                      <Text copyable>{candidate.email}</Text>
                    </Space>

                    <Space align="center">
                      <PhoneOutlined style={{ fontSize: 18, color: "#52c41a" }} />
                      <Text strong>Phone:</Text>
                      <Text copyable={!!candidate.phone}>{candidate.phone || "—"}</Text>
                    </Space>

                    <Space align="start">
                      <TeamOutlined style={{ fontSize: 18, color: "#722ed1" }} />
                      <div>
                        <Text strong>References:</Text>
                        <div style={{ marginTop: 4 }}>
                          {candidate.references ? (
                            <Text style={{ whiteSpace: "pre-line" }}>{candidate.references}</Text>
                          ) : (
                            <Text type="secondary">No references provided</Text>
                          )}
                        </div>
                      </div>
                    </Space>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>

          <motion.div variants={itemVariants}>
            <Card
              className="status-card"
              style={{
                marginTop: 24,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                backgroundColor: "#fff",
              }}
              bordered={false}
            >
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 16, marginBottom: 16, display: "block" }}>
                  Hiring Pipeline Status
                </Text>

                <Steps current={getCurrentStep()} progressDot size="small" style={{ marginBottom: 24 }}>
                  {PIPELINE_STAGES.map((stage) => (
                    <Step
                      key={stage}
                      title={stage}
                      description={stage === candidate.status ? <Badge status="processing" text="Current" /> : null}
                    />
                  ))}
                </Steps>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <Text strong style={{ marginRight: 8 }}>
                      Current Status:
                    </Text>
                    <Tag color={getStatusColor(candidate.status)} style={{ padding: "4px 8px", fontSize: "14px" }}>
                      {candidate.status}
                    </Tag>
                  </div>

                  <Select placeholder="Change Status" style={{ width: 200 }} onChange={changeStatus}>
                    {getAvailableStages().map((stage) => (
                      <Select.Option key={stage} value={stage}>
                        {stage}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <Divider style={{ margin: "16px 0" }} />

                <Collapse ghost>
                  <Panel header="Status History" key="1">
                    <Timeline mode="left">
                      {statusHistory.map((item, index) => (
                        <Timeline.Item key={index} color={getStatusColor(item.status)} label={item.date}>
                          <Text strong>{item.status}</Text>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Panel>
                </Collapse>
              </div>

              {candidate.parserSummary && (
                <div style={{ marginTop: 16 }}>
                  <Divider orientation="left">Resume Analysis</Divider>
                  <ResumeParser summary={candidate.parserSummary} />
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}

      {candidate.cvUrl && (
        <motion.div
          key="resume-card"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={cardVariants}
          whileHover="hover"
          style={{ marginTop: 24 }}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
            }}
          >
            <Text strong style={{ display: "block", marginBottom: 12, fontSize: 16 }}>
              Candidate Resume
            </Text>
            <Divider style={{ margin: "8px 0 16px" }} />
            <Space size="middle">
              <Button type="default" icon={<DownloadOutlined />} href={candidate.cvUrl} download>
                Download CV
              </Button>
              <Button
                type="primary"
                icon={<FileSearchOutlined />}
                onClick={() => {
                  setSelectedResume(candidate.cvUrl!)
                  setResumePreviewVisible(true)
                }}
              >
                View CV
              </Button>
            </Space>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
    <div className="candidate-detail-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/candidates")} style={{ borderRadius: "6px" }}>
          Back to Candidates
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Space size="large" align="start">
                <Avatar
                  size={96}
                  style={{
                    backgroundColor: avatarColor,
                    fontSize: 40,
                    fontWeight: "bold",
                    boxShadow: `0 4px 12px ${avatarColor}40`,
                  }}
                >
                  {getInitials(candidate.name)}
                </Avatar>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Title level={2} style={{ margin: 0 }}>
                      {candidate.name}
                    </Title>
                    <Button
                      type="text"
                      icon={isFavorite ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
                      onClick={() => setIsFavorite(!isFavorite)}
                      size="large"
                    />
                  </div>

                  <Space style={{ marginTop: 8 }} wrap>
                    <Tag
                      color={getStatusColor(candidate.status)}
                      style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "14px" }}
                    >
                      {candidate.status}
                    </Tag>
                    <Tag
                      color={getTechColor(candidate.technology)}
                      style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "14px" }}
                    >
                      {candidate.technology}
                    </Tag>
                    <Tag
                      color={getLevelColor(candidate.level)}
                      style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "14px" }}
                    >
                      {candidate.level}
                    </Tag>
                  </Space>
                </div>
              </Space>

              <Space>
                <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteCandidate}>
                  Delete
                </Button>
              </Space>
            </div>

            {candidate.cvUrl && (
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  href={candidate.cvUrl}
                  download
                  style={{ borderRadius: "6px" }}
                >
                  Download Resume
                </Button>
                <Button
                  icon={<FileSearchOutlined />}
                  onClick={() => {
                    setSelectedResume(candidate.cvUrl!)
                    setResumePreviewVisible(true)
                  }}
                  style={{ borderRadius: "6px" }}
                >
                  View Resume
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          className="candidate-tabs"
          items={[
            {
              key: "profile",
              label: (
                <span>
                  <UserOutlined /> Profile
                </span>
              ),
              children: (
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                  {renderInfoContent()}
                </motion.div>
              ),
            },
           
            {
              key: "assessments",
              label: (
                <span>
                  <FileTextOutlined /> Assessments
                </span>
              ),
              children: (
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                  <Card
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FileTextOutlined style={{ marginRight: 8, color: avatarColor }} />
                        <span>Assessment Records</span>
                        <Badge
                          count={assessments.length}
                          style={{
                            backgroundColor: assessments.length ? avatarColor : "#d9d9d9",
                            marginLeft: 8,
                          }}
                        />
                      </div>
                    }
                    bordered={false}
                    style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    {/* ▶️ Navigate to full AssessmentPage to assign new ones */}
                    <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => navigate("/assessments")}
                        block
                      >
                        Assign New Assessment
                      </Button>
                    </motion.div>
            
                    {/* ▶️ History & grading of existing assessments */}
                    <motion.div variants={itemVariants}>
                      {assessments.length > 0 ? (
                        <Row gutter={[16, 16]}>
                          {assessments.map(a => (
                            <Col xs={24} sm={12} md={8} key={a._id}>
                              <Card
                                hoverable
                                style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                                actions={[
                                  <Tooltip title="View Details" key="view">
                                    <Button
                                      type="text"
                                      icon={<EyeOutlined />}
                                      onClick={() => openAssessmentDetails(a)}
                                    />
                                  </Tooltip>,
                                  <Tooltip title="Download" key="download">
                                    <Button
                                      type="text"
                                      icon={<DownloadOutlined />}
                                      href={a.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    />
                                  </Tooltip>,
                                ]}
                              >
                                <div style={{ display: "flex", gap: 12 }}>
                                  <div
                                    style={{
                                      width: 40,
                                      height: 40,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 20,
                                      backgroundColor: `${avatarColor}20`,
                                      borderRadius: 8,
                                      color: avatarColor,
                                    }}
                                  >
                                    {getFileIcon(a.fileUrl)}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <Text strong>{a.title}</Text>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                      <Text type="secondary" style={{ fontSize: 12 }}>
                                        {dayjs(a.createdAt).format("MMM D, YYYY")}
                                      </Text>
                                      <Tag color={a.score! >= 80 ? "green" : a.score! >= 60 ? "orange" : "red"}>
                                        {a.score}%
                                      </Tag>
                                    </div>
                                    {a.remarks && (
                                      <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                                        {a.remarks}
                                      </Text>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <Empty description="No assessments yet" />
                      )}
                    </motion.div>
                  </Card>
                </motion.div>
              ),
            }
            
,
            {
              key: "offers",
              label: (
                <span>
                  <SendOutlined /> Offers
                </span>
              ),
              children: (
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                  <Card
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <SendOutlined style={{ marginRight: 8, color: avatarColor }} />
                        <span>Offers ({offers.length})</span>
                      </div>
                    }
                    bordered={false}
                    style={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    {candidate.status === "Hired" ? (
                      <div>
                        <Alert
                          type="info"
                          showIcon
                          message="Send Offer Letter"
                          description="Use the Letters page to send an offer letter to this candidate."
                          action={
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => navigate("/letters")}
                              style={{ backgroundColor: avatarColor, borderColor: avatarColor }}
                            >
                              Go to Letters
                            </Button>
                          }
                          style={{ marginBottom: 24 }}
                        />
                      </div>
                    ) : (
                      <Alert
                        type="warning"
                        showIcon
                        message="Only 'Hired' candidates may receive offers."
                        description="Update the candidate status to 'Hired' to enable offer creation."
                        style={{ marginBottom: 24 }}
                      />
                    )}

                    <Divider />

                    {offers.length > 0 ? (
                      <motion.div variants={itemVariants}>
                        <Row gutter={[16, 16]}>
                          {offers.map((offer, index) => (
                            <Col xs={24} sm={12} md={8} key={index}>
                              <Card
                                hoverable
                                style={{
                                  borderRadius: "12px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                }}
                                actions={[
                                  <Tooltip title="View Offer" key="view">
                                    <Button type="text" icon={<FileSearchOutlined />} />
                                  </Tooltip>,
                                  <Tooltip title="Download Offer" key="download">
                                    <Button type="text" icon={<DownloadOutlined />} />
                                  </Tooltip>,
                                ]}
                              >
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "20px",
                                      backgroundColor: `${avatarColor}20`,
                                      borderRadius: "8px",
                                      color: avatarColor,
                                    }}
                                  >
                                    <FilePdfOutlined />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: "block", marginBottom: "4px" }}>
                                      {offer.templateName}
                                    </Text>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text type="secondary" style={{ fontSize: "12px" }}>
                                        {new Date(offer.date).toLocaleDateString()}
                                      </Text>
                                      <Tag color="green">Sent</Tag>
                                    </div>
                                    <div style={{ marginTop: "8px" }}>
                                      <Text type="secondary" style={{ fontSize: "12px" }}>
                                        Sent to: {offer.sentTo}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </motion.div>
                    ) : (
                      <Empty description="No offers sent yet" />
                    )}
                  </Card>
                </motion.div>
              ),
            },
            {
              key: "background",
              label: (
                <span>
                  <SafetyCertificateOutlined /> Background Check
                </span>
              ),
              children: (
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                  <Card
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <SafetyCertificateOutlined style={{ marginRight: 8, color: avatarColor }} />
                        <span>Background Check</span>
                      </div>
                    }
                    bordered={false}
                    style={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    className="background-check-card"
                  >
                    <motion.div variants={itemVariants}>
                      <Row justify="center">
                        <Col xs={24} md={16} lg={12}>
                          <Card
                            className="background-check-form-card"
                            bordered={false}
                            style={{
                              borderRadius: "12px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            }}
                          >
                            <Form form={bgForm} layout="vertical" onFinish={sendBackground}>
                              <div style={{ textAlign: "center", marginBottom: 24 }}>
                                <div
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    backgroundColor: `${avatarColor}20`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 16px",
                                    color: avatarColor,
                                  }}
                                >
                                  <SafetyCertificateOutlined style={{ fontSize: 40 }} />
                                </div>
                                <Title level={4} style={{ marginTop: 16 }}>
                                  Reference Check
                                </Title>
                                <Text type="secondary">
                                  Send a background check request to the candidate's reference to verify their
                                  employment history and qualifications.
                                </Text>
                              </div>

                              <Form.Item
                                name="refEmail"
                                label="Reference Email"
                                rules={[
                                  { required: true, message: "Please enter reference email" },
                                  { type: "email", message: "Please enter a valid email address" },
                                ]}
                              >
                                <Input prefix={<MailOutlined />} placeholder="reference@example.com" />
                              </Form.Item>

                              <Form.Item name="message" label="Custom Message (Optional)">
                                <Input.TextArea
                                  rows={3}
                                  placeholder="Add a custom message to the reference check email"
                                  showCount
                                  maxLength={500}
                                />
                              </Form.Item>

                              <Form.Item>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  block
                                  icon={<SendOutlined />}
                                  size="large"
                                  style={{ backgroundColor: avatarColor, borderColor: avatarColor }}
                                >
                                  Send Background Check
                                </Button>
                              </Form.Item>
                            </Form>
                          </Card>
                        </Col>
                      </Row>
                    </motion.div>
                  </Card>
                </motion.div>
              ),
            },
          ]}
        />
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DeleteOutlined style={{ color: "#ff4d4f" }} />
            <span>Delete Candidate</span>
          </div>
        }
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={confirmDelete}>
            Delete
          </Button>,
        ]}
      >
        <div>
          <p>Are you sure you want to delete this candidate?</p>
          <p>
            <strong>{candidate.name}</strong>
          </p>
          <p>This action cannot be undone.</p>
        </div>
      </Modal>

      {/* Status Change Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <InfoCircleOutlined style={{ color: avatarColor }} />
            <span>Change Candidate Status</span>
          </div>
        }
        open={statusChangeModalVisible}
        onCancel={() => setStatusChangeModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setStatusChangeModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={confirmStatusChange}
            style={{ backgroundColor: avatarColor, borderColor: avatarColor }}
          >
            Confirm
          </Button>,
        ]}
      >
        <div>
          <p>
            Are you sure you want to change the status of <strong>{candidate.name}</strong> from:
          </p>
          <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
            <Tag
              color={getStatusColor(candidate.status)}
              style={{ padding: "4px 12px", fontSize: "14px", margin: "0 8px", borderRadius: "12px" }}
            >
              {candidate.status}
            </Tag>
            <div style={{ margin: "0 8px" }}>→</div>
            <Tag
              color={getStatusColor(newStatus)}
              style={{ padding: "4px 12px", fontSize: "14px", margin: "0 8px", borderRadius: "12px" }}
            >
              {newStatus}
            </Tag>
          </div>
          <p>This action will update the candidate's status in the hiring pipeline.</p>
        </div>
      </Modal>

      {/* Resume Preview Drawer */}
      <Drawer
        title="Document Preview"
        placement="right"
        width={720}
        onClose={() => setResumePreviewVisible(false)}
        open={resumePreviewVisible}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              href={selectedResume || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: avatarColor, borderColor: avatarColor }}
            >
              Download
            </Button>
          </Space>
        }
      >
        {selectedResume && (
          <div style={{ height: "calc(100vh - 120px)" }}>
            <iframe
              src={selectedResume}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Resume Preview"
            />
          </div>
        )}
      </Drawer>
    </div>
    </>
  )
 
}



export default CandidateDetail;