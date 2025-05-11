"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  Radio,
  Select,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Tag,
  message,
  Typography,
  Spin,
  Empty,
  Alert,
  Tabs,
  Modal,
  Space,
  Divider,
  Skeleton,
  Avatar,
  Badge,
  Tooltip,
  Statistic,
  Timeline,
  Drawer,
  Row,
  Col,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import {
  SendOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  SearchOutlined,
  MailOutlined,
  PrinterOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  HistoryOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import dayjs, { type Dayjs } from "dayjs"
import axiosInstance from "../services/axiosInstance"

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const avatarColors = ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1", "#13c2c2", "#fa541c"]
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length]
const getInitials = (name: string) =>
  name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

interface Candidate {
  _id: string
  name: string
  email: string
  status: string
}
interface Letter {
  _id: string
  templateType: "offer" | "rejection"
  position: string
  technology: string
  startingDate: string
  salary: number
  probationDate: string
  acceptanceDeadline: string
  sentTo: string
  createdAt: string
}
interface FormValues {
  candidateId: string
  templateType: "offer" | "rejection"
  position?: string
  technology?: string
  startingDate?: Dayjs
  salary?: number
  probationDate?: Dayjs
  acceptanceDeadline?: Dayjs
}

const OfferPage: React.FC = () => {
  const [scope, setScope] = useState<"offer" | "rejection" | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCands, setLoadingCands] = useState(false)
  const [selectedCand, setSelectedCand] = useState<string | null>(null)

  const [letters, setLetters] = useState<Letter[]>([])
  const [letterStats, setLetterStats] = useState({ offers: 0, rejections: 0 })
  const [loadingLetters, setLoadingLetters] = useState(false)

  const [form] = Form.useForm<FormValues>()
  const [submitting, setSubmitting] = useState(false)

  const [activeTab, setActiveTab] = useState<"create" | "history">("create")

  const [previewHtml, setPreviewHtml] = useState("")
  const [previewVisible, setPreviewVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  // 1️⃣ Load candidates when scope changes
  useEffect(() => {
    if (!scope) return
    setLoadingCands(true)
    axiosInstance
      .get<Candidate[]>(`/candidates?status=${scope === "offer" ? "Hired" : "Rejected"}`)
      .then(r => setCandidates(r.data))
      .catch(() => message.error("Failed to load candidates"))
      .finally(() => setLoadingCands(false))
  }, [scope])

  // 2️⃣ Load letters when a candidate is selected
  useEffect(() => {
    if (!selectedCand) {
      setLetters([])
      setLetterStats({ offers: 0, rejections: 0 })
      return
    }
    setLoadingLetters(true)
    axiosInstance
      .get<Letter[]>(`/candidates/${selectedCand}/letters`)
      .then(r => {
        setLetters(r.data)
        setLetterStats({
          offers: r.data.filter(l => l.templateType === "offer").length,
          rejections: r.data.filter(l => l.templateType === "rejection").length,
        })
      })
      .catch(() => message.error("Failed to load letters"))
      .finally(() => setLoadingLetters(false))
  }, [selectedCand])

  // 3️⃣ Submit new letter
  const onFinish = async (vals: FormValues) => {
    setSubmitting(true)
  
    // Build payload
    const payload: any = { templateType: vals.templateType }
  
    if (vals.templateType === "offer") {
      // Defensive checks
      if (
        !vals.position ||
        !vals.technology ||
        !vals.startingDate ||
        vals.salary == null ||
        !vals.probationDate ||
        !vals.acceptanceDeadline
      ) {
        message.error("All offer fields are required before sending.")
        setSubmitting(false)
        return
      }
  
      payload.position = vals.position
      payload.technology = vals.technology
      payload.startingDate = vals.startingDate.toISOString()
      payload.salary = Number(vals.salary)
      payload.probationDate = vals.probationDate.toISOString()
      payload.acceptanceDeadline = vals.acceptanceDeadline.toISOString()
    }
  
    try {
      await axiosInstance.post(`/candidates/${vals.candidateId}/letters`, payload)
      message.success(
        vals.templateType === "offer"
          ? "🟢 Offer letter sent successfully!"
          : "🔴 Rejection letter sent successfully!"
      )
      form.resetFields([
        "templateType",
        "position",
        "technology",
        "startingDate",
        "salary",
        "probationDate",
        "acceptanceDeadline",
      ])
      // Reload history
      const { data } = await axiosInstance.get<Letter[]>(`/candidates/${vals.candidateId}/letters`)
      setLetters(data)
      setLetterStats({
        offers: data.filter(l => l.templateType === "offer").length,
        rejections: data.filter(l => l.templateType === "rejection").length,
      })
      setActiveTab("history")
    } catch (err: any) {
      console.error(err)
      message.error(err.response?.data?.message || "Failed to send letter.")
    } finally {
      setSubmitting(false)
    }
  }
  

  // Preview & Details helpers
  const generatePreview = (ltr: Letter) =>
    ltr.templateType === "offer"
      ? `
        <h2 style="text-align:center;color:#1677ff">🎉 Offer</h2>
        <p>Dear ${ltr.sentTo},</p>
        <p>We offer you <strong>${ltr.position}</strong> on <strong>${ltr.technology}</strong>.</p>
        <ul>
          <li>Start: ${dayjs(ltr.startingDate).format("MMM D, YYYY")}</li>
          <li>Salary: $${ltr.salary.toLocaleString()}</li>
          <li>Probation: ${dayjs(ltr.probationDate).format("MMM D, YYYY")}</li>
          <li>Accept by: ${dayjs(ltr.acceptanceDeadline).format("MMM D, YYYY")}</li>
        </ul>
        <p>Best,<br/>HR Team</p>`
      : `
        <h2 style="text-align:center;color:#ff4d4f">❌ Rejection</h2>
        <p>Dear ${ltr.sentTo},</p>
        <p>Thank you for applying. We won’t proceed at this time.</p>
        <p>Regards,<br/>HR Team</p>`

  const preview = (ltr: Letter) => {
    setPreviewHtml(generatePreview(ltr))
    setPreviewVisible(true)
  }
  const openDetails = (ltr: Letter) => {
    setSelectedLetter(ltr)
    setDrawerVisible(true)
  }

  const columns: ColumnsType<Letter> = [
    {
      title: "Type",
      dataIndex: "templateType",
      key: "type",
      render: t =>
        t === "offer"
          ? <Tag color="success" icon={<CheckCircleOutlined />}>OFFER</Tag>
          : <Tag color="error" icon={<CloseCircleOutlined />}>REJECTION</Tag>,
      filters: [
        { text: "Offer", value: "offer" },
        { text: "Rejection", value: "rejection" },
      ],
      onFilter: (v, r) => r.templateType === v,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "pos",
      render: (val, r) => (r.templateType === "offer" ? val : "—"),
    },
    {
      title: "Sent On",
      dataIndex: "createdAt",
      key: "sent",
      render: d => dayjs(d).format("MMM D, YYYY"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Tooltip title="Preview"><Button icon={<EyeOutlined />} onClick={() => preview(r)} /></Tooltip>
          <Tooltip title="Details"><Button icon={<FileTextOutlined />} onClick={() => openDetails(r)} /></Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>Offer & Rejection Letters</Title>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Card bordered={false} style={{ textAlign: "center", marginBottom: 24, borderRadius: 12 }}>
          <Radio.Group
            buttonStyle="solid"
            size="large"
            onChange={e => {
              setScope(e.target.value)
              setSelectedCand(null)
              setActiveTab("create")
            }}
            value={scope}
          >
            <Radio.Button value="offer" style={{ width: 150 }}>
              <CheckCircleOutlined /> Offer Letters
            </Radio.Button>
            <Radio.Button value="rejection" style={{ width: 150 }}>
              <CloseCircleOutlined /> Rejection Letters
            </Radio.Button>
          </Radio.Group>
        </Card>
      </motion.div>

      {scope && (
        <motion.div initial="hidden" animate="visible" variants={itemVariants}>
          <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>Select Candidate ({scope === "offer" ? "Hired" : "Rejected"})</Text>
              <Spin spinning={loadingCands}>
                <Select
                  showSearch
                  placeholder="Pick a candidate"
                  style={{ width: "100%" }}
                  onChange={id => {
                    setSelectedCand(id)
                    form.setFieldsValue({ candidateId: id })
                  }}
                  value={selectedCand}
                  notFoundContent={<Empty description="No candidates" />}
                  suffixIcon={<SearchOutlined />}
                >
                  {candidates.map(c => (
                    <Option key={c._id} value={c._id}>
                      <Space>
                        <Avatar style={{ backgroundColor: getAvatarColor(c.name) }}>
                          {getInitials(c.name)}
                        </Avatar>
                        <div>
                          <div><strong>{c.name}</strong></div>
                          <div style={{ fontSize: 12, color: "#888" }}>{c.email}</div>
                        </div>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Spin>
              {!loadingCands && !candidates.length && (
                <Alert
                  type="info"
                  showIcon
                  message="No candidates"
                  description="There are no candidates with that status."
                />
              )}
            </Space>
          </Card>
        </motion.div>
      )}

      {selectedCand && (
        <>
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <Tabs
              activeKey={activeTab}
              onChange={k => setActiveTab(k as any)}
              type="card"
              style={{ marginBottom: 24 }}
            >
              <TabPane key="create" tab={<><SendOutlined /> Create</>} />
              <TabPane
                key="history"
                tab={<><HistoryOutlined /> History <Badge count={letters.length} /></>}
              />
            </Tabs>
          </motion.div>

          {activeTab === "create" ? (
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <Card bordered={false} style={{ borderRadius: 12 }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{ candidateId: selectedCand, templateType: scope! }}
                >
                  <Form.Item name="candidateId" hidden><Input /></Form.Item>
                  <Form.Item name="templateType" hidden><Input /></Form.Item>

                  {scope === "offer" && (
                    <>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="position" label="Position" rules={[{ required: true }]}>
                            <Input prefix={<TeamOutlined />} placeholder="e.g. Frontend Developer" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="technology" label="Technology" rules={[{ required: true }]}>
                            <Input prefix={<LaptopOutlined />} placeholder="e.g. ReactJS" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="startingDate" label="Start Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
                            <InputNumber
                              style={{ width: "100%" }}
                              formatter={v => `$${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              parser={v => Number(v?.replace(/\$\s?|(,*)/g, "") || 0)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="probationDate" label="Probation End" rules={[{ required: true }]}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="acceptanceDeadline" label="Accept By" rules={[{ required: true }]}>
                            <DatePicker style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      icon={<SendOutlined />}
                      block
                    >
                      Send {scope === "offer" ? "Offer" : "Rejection"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <Card bordered={false} style={{ borderRadius: 12 }}>
                {loadingLetters ? (
                  <Skeleton active paragraph={{ rows: 5 }} />
                ) : letters.length > 0 ? (
                  <Table<Letter>
                    rowKey="_id"
                    columns={columns}
                    dataSource={letters}
                    pagination={{ pageSize: 5 }}
                  />
                ) : (
                  <Empty description="No letters yet" />
                )}
              </Card>
            </motion.div>
          )}
        </>
      )}

      <Modal
        open={previewVisible}
        title={<><MailOutlined /> Preview</>}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print
          </Button>,
          <Button key="close" type="primary" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </Modal>

      <Drawer
        width={400}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title={
          selectedLetter && (
            <><FileTextOutlined /> {selectedLetter.templateType === "offer" ? "Offer" : "Rejection"} Details</>
          )
        }
      >
        {selectedLetter && (
          <>
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                marginBottom: 24,
                background: selectedLetter.templateType === "offer" ? "#f6ffed" : "#fff2f0",
                border: selectedLetter.templateType === "offer" ? "1px solid #b7eb8f" : "1px solid #ffccc7",
              }}
            >
              <Space>
                {selectedLetter.templateType === "offer" ? (
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                ) : (
                  <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                )}
                <Text strong>
                  {selectedLetter.templateType === "offer" ? "Offer" : "Rejection"} Letter
                </Text>
              </Space>
              <div style={{ marginTop: 8, color: "#888" }}>
                Sent to {selectedLetter.sentTo} on{" "}
                {dayjs(selectedLetter.createdAt).format("MMM D, YYYY, h:mm A")}
              </div>
            </div>

            {selectedLetter.templateType === "offer" && (
              <>
                <Divider>Details</Divider>
                <Statistic
                  title="Position"
                  value={selectedLetter.position}
                  prefix={<TeamOutlined />}
                />
                <Statistic
                  title="Technology"
                  value={selectedLetter.technology}
                  prefix={<LaptopOutlined />}
                />
                <Statistic
                  title="Salary"
                  value={`$${selectedLetter.salary.toLocaleString()}`}
                  prefix={<DollarOutlined />}
                />
                <Statistic
                  title="Start Date"
                  value={dayjs(selectedLetter.startingDate).format("MMM D, YYYY")}
                  prefix={<CalendarOutlined />}
                />
                <Statistic
                  title="Probation Ends"
                  value={dayjs(selectedLetter.probationDate).format("MMM D, YYYY")}
                  prefix={<ClockCircleOutlined />}
                />
                <Statistic
                  title="Accept By"
                  value={dayjs(selectedLetter.acceptanceDeadline).format("MMM D, YYYY")}
                  prefix={<ExclamationCircleOutlined />}
                />
              </>
            )}

            <Divider>Timeline</Divider>
            <Timeline>
              <Timeline.Item color="blue">
                Created: {dayjs(selectedLetter.createdAt).format("MMM D, YYYY, h:mm A")}
              </Timeline.Item>
              <Timeline.Item color="green">
                Email sent to {selectedLetter.sentTo}
              </Timeline.Item>
            </Timeline>
          </>
        )}
      </Drawer>
    </div>
  )
}

export default OfferPage
