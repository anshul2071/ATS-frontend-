"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Tabs,
  Spin,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
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
  DollarOutlined,
  TeamOutlined,
  CodeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  SendOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../services/axiosInstance"
import ResumeParser, { type ResumeSummary } from "../components/ResumeParser"
import type { Offer as ApiOffer } from "../services/offerService"
import { getOffers, sendOffer } from "../services/offerService"
import { PIPELINE_STAGES } from "../constants/pipelineStages"

const { Text, Title } = Typography

interface Assessment {
  _id: string
  title: string
  fileUrl: string
  remarks?: string
  score?: number
  createdAt: string
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Applied":
      return "blue"
    case "Screening":
      return "cyan"
    case "Interview":
      return "purple"
    case "Technical":
      return "geekblue"
    case "Offer":
      return "orange"
    case "Hired":
      return "green"
    case "Rejected":
      return "red"
    default:
      return "default"
  }
}

// Helper function to get level color
const getLevelColor = (level: string) => {
  switch (level) {
    case "Junior":
      return "green"
    case "Mid":
      return "blue"
    case "Senior":
      return "purple"
    default:
      return "default"
  }
}

const CandidateDetail: React.FC = () => {
  const { id: candidateId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [candidate, setCandidate] = useState<CandidateType | null>(null)
  const [offers, setOffers] = useState<ApiOffer[]>([])
  const [editing, setEditing] = useState(false)
  const [infoForm] = Form.useForm()
  const [assessForm] = Form.useForm()
  const [offerForm] = Form.useForm()
  const [bgForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState("info")
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    if (!candidateId) return
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await axiosInstance.get<CandidateType>(`/candidates/${candidateId}`)
        setCandidate(data)
        infoForm.setFieldsValue({
          name: data.name,
          phone: data.phone,
          references: data.references,
          technology: data.technology,
          level: data.level,
          salaryExpectation: data.salaryExpectation,
          experience: data.experience,
        })
      } catch {
        message.error("Failed to load candidate")
      }
      try {
        const offs = await getOffers(candidateId)
        setOffers(offs)
      } catch (err: any) {
        if (err.response?.status === 404) {
          setOffers([])
        } else {
          message.error("Failed to load offers")
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [candidateId, infoForm])

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

  const changeStatus = async (newStatus: string) => {
    try {
      await axiosInstance.put(`/candidates/${candidateId}`, { status: newStatus })
      setCandidate({ ...candidate, status: newStatus })
      message.success(`Status updated to ${newStatus}`)
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

  const addAssessment = async (vals: any) => {
    try {
      const fd = new FormData()
      fd.append("title", vals.title)
      fd.append("score", vals.score.toString())
      fd.append("remarks", vals.remarks || "")
      fd.append("file", vals.file.file.originFileObj)
      const { data } = await axiosInstance.post<CandidateType>(`/candidates/${candidateId}/assessment`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setCandidate(data)
      assessForm.resetFields()
      message.success("Assessment added successfully")
    } catch {
      message.error("Upload failed")
    }
  }

  const addOffer = async (vals: any) => {
    if (candidate?.status !== 'Hired') {
      return message.error('Cannot send offer: candidate is not yet hired.')
    }
    try {
      const updated = await sendOffer(candidateId!, {
        template: vals.template,
        placeholders: vals.placeholders,
      })
      setOffers(updated)
      offerForm.resetFields()
      message.success('Offer created & emailed to candidate')
    } catch {
      message.error('Failed to send offer')
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
          </Form>
        </motion.div>
      ) : (
        <motion.div key="info-display" initial="hidden" animate="visible" exit="hidden" variants={containerVariants}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <motion.div variants={itemVariants}>
                <Card className="info-card" bordered={false} style={{ height: "100%" }}>
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
                <Card className="contact-card" bordered={false} style={{ height: "100%" }}>
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
            <Card className="status-card" style={{ marginTop: 24 }} bordered={false}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text strong style={{ marginRight: 8 }}>
                    Current Status:
                  </Text>
                  <Select
                    value={candidate.status}
                    onChange={changeStatus}
                    style={{ width: 200 }}
                    bordered={false}
                    dropdownMatchSelectWidth={false}
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <Select.Option key={s} value={s}>
                        <Tag color={getStatusColor(s)} style={{ margin: 0 }}>
                          {s}
                        </Tag>
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                {candidate.parserSummary && (
                  <div style={{ marginTop: 16 }}>
                    <Divider orientation="left">Resume Analysis</Divider>
                    <ResumeParser summary={candidate.parserSummary} />
                  </div>
                )}
              </Space>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const tabs = [
    {
      key: "info",
      label: (
        <span>
          <UserOutlined />
          Profile
        </span>
      ),
      children: (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Card
            className="profile-card"
            bordered={false}
            title={
              <motion.div variants={itemVariants} className="candidate-header">
                <Space size="large" align="center">
                  <Avatar
                    size={64}
                    style={{
                      backgroundColor: getAvatarColor(candidate.name),
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {getInitials(candidate.name)}
                  </Avatar>
                  <div>
                    <Title level={3} style={{ margin: 0 }}>
                      {candidate.name}
                    </Title>
                    <Tag color={getStatusColor(candidate.status)} style={{ marginTop: 8 }}>
                      {candidate.status}
                    </Tag>
                  </div>
                </Space>
              </motion.div>
            }
            extra={
              <motion.div variants={itemVariants}>
                <Space>
                  {editing ? (
                    <>
                      <Button icon={<CloseOutlined />} onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="primary" icon={<SaveOutlined />} onClick={() => infoForm.submit()}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
                        Edit
                      </Button>
                      <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteCandidate}>
                        Delete
                      </Button>
                    </>
                  )}
                </Space>
              </motion.div>
            }
          >
            {renderInfoContent()}
          </Card>
        </motion.div>
      ),
    },
    {
      key: "assessments",
      label: (
        <span>
          <FileTextOutlined />
          Assessments
        </span>
      ),
      children: (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Assessment Records</span>
                <Badge
                  count={candidate?.assessments?.length || 0}
                  style={{ backgroundColor: candidate?.assessments?.length ? "#1677ff" : "#d9d9d9" }}
                />
              </Space>
            }
            bordered={false}
            className="assessment-card"
          >
            <motion.div variants={itemVariants}>
              <Card
                type="inner"
                title="Add New Assessment"
                style={{ marginBottom: 24 }}
                bordered={false}
                className="add-assessment-form"
              >
                <Form form={assessForm} layout="vertical" onFinish={addAssessment}>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="title"
                        label="Assessment Title"
                        rules={[{ required: true, message: "Please enter assessment title" }]}
                      >
                        <Input placeholder="Enter assessment title" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="score" label="Score" rules={[{ required: true, message: "Please enter score" }]}>
                        <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="Enter score (0-100)" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="remarks" label="Remarks">
                    <Input.TextArea
                      rows={2}
                      placeholder="Enter assessment remarks or feedback"
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>

                  <Form.Item
                    name="file"
                    label="Assessment File"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList}
                    rules={[{ required: true, message: "Please upload assessment file" }]}
                  >
                    <Upload {...uploadProps} className="assessment-upload">
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                      Add Assessment
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Table
                dataSource={candidate.assessments}
                rowKey="_id"
                columns={[
                  {
                    title: "Title",
                    dataIndex: "title",
                    key: "title",
                    render: (text) => <Text strong>{text}</Text>,
                  },
                  {
                    title: "Score",
                    dataIndex: "score",
                    key: "score",
                    render: (score) => {
                      let color = "green"
                      if (score < 60) color = "red"
                      else if (score < 80) color = "orange"

                      return <Tag color={color}>{score}%</Tag>
                    },
                  },
                  {
                    title: "Remarks",
                    dataIndex: "remarks",
                    key: "remarks",
                    ellipsis: true,
                    render: (text) => text || "—",
                  },
                  {
                    title: "Date",
                    dataIndex: "createdAt",
                    key: "createdAt",
                    render: (date) => {
                      const formattedDate = new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      return formattedDate
                    },
                  },
                  {
                    title: "File",
                    key: "file",
                    render: (_: any, r: Assessment) => (
                      <Tooltip title="Download assessment file">
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          href={r.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </Button>
                      </Tooltip>
                    ),
                  },
                ]}
                pagination={{
                  pageSize: 5,
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                }}
                style={{ marginTop: 16 }}
                locale={{ emptyText: "No assessments added yet" }}
              />
            </motion.div>
          </Card>
        </motion.div>
      ),
    },
    // inside your `tabs` definition, replace the `offers` children with:

{
  key: "offers",
  label: (
    <span>
      <SendOutlined />
      Offers
    </span>
  ),
  children: (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card
        title={
          <Space>
            <SendOutlined />
            <span>Offer Management</span>
            <Badge
              count={offers?.length || 0}
              style={{ backgroundColor: offers?.length ? "#1677ff" : "#d9d9d9" }}
            />
          </Space>
        }
        bordered={false}
        className="offers-card"
      >
        <motion.div variants={itemVariants}>
          {candidate.status === "Hired" ? (
            <Card
              type="inner"
              title="Send New Offer"
              style={{ marginBottom: 24 }}
              bordered={false}
              className="send-offer-form"
            >
              <Form form={offerForm} layout="vertical" onFinish={addOffer}>
                <Form.Item
                  name="template"
                  label="Offer Template"
                  rules={[{ required: true, message: "Please select an offer template" }]}
                >
                  <Select placeholder="Select offer template">
                    <Select.Option value="Standard">Standard Offer</Select.Option>
                    <Select.Option value="Contractor">Contractor Offer</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="placeholders"
                  label="Custom Fields"
                  tooltip="Use JSON: {salary:60000, startDate:'2025-06-01'}"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="e.g. {salary:60000, startDate:'2025-06-01'}"
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                    Send Offer
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ) : (
            <Alert
              type="warning"
              showIcon
              message="You can only send an offer letter once the candidate is Hired."
              style={{ marginBottom: 24 }}
            />
          )}
        </motion.div>

        {/* existing table of past offers */}
        <motion.div variants={itemVariants}>
          <Table
            dataSource={offers}
            rowKey="_id"
            columns={[
              {
                title: "Date",
                dataIndex: "date",
                key: "date",
                render: (date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
              },
              {
                title: "Template",
                dataIndex: "template",
                key: "template",
                render: (t) => <Tag color="blue">{t}</Tag>,
              },
              {
                title: "Sent To",
                dataIndex: "sentTo",
                key: "sentTo",
                render: (email) => <Text copyable>{email}</Text>,
              },
            ]}
            pagination={{ pageSize: 5, hideOnSinglePage: true, showSizeChanger: false }}
            style={{ marginTop: 16 }}
            locale={{ emptyText: "No offers sent yet" }}
          />
        </motion.div>
      </Card>
    </motion.div>
  ),
},

    {
      key: "background",
      label: (
        <span>
          <SafetyCertificateOutlined />
          Background Check
        </span>
      ),
      children: (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Card
            title={
              <Space>
                <SafetyCertificateOutlined />
                <span>Background Check</span>
              </Space>
            }
            bordered={false}
            className="background-check-card"
          >
            <motion.div variants={itemVariants}>
              <Row justify="center">
                <Col xs={24} md={16} lg={12}>
                  <Card className="background-check-form-card" bordered={false}>
                    <Form form={bgForm} layout="vertical" onFinish={sendBackground}>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <SafetyCertificateOutlined style={{ fontSize: 48, color: "#1677ff" }} />
                        <Title level={4} style={{ marginTop: 16 }}>
                          Reference Check
                        </Title>
                        <Text type="secondary">
                          Send a background check request to the candidate's reference to verify their employment
                          history and qualifications.
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

                      <Form.Item>
                        <Button type="primary" htmlType="submit" block icon={<SendOutlined />} size="large">
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
  ]

  return (
    <div className="candidate-detail-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/candidates")}>
          Back to Candidates
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Tabs
          defaultActiveKey="info"
          items={tabs}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
          animated={{ tabPane: true }}
          className="candidate-tabs"
        />
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Candidate"
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
    </div>
  )
}

export default CandidateDetail
