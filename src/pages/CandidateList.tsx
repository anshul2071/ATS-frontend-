"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Row,
  Col,
  Input,
  Select,
  Spin,
  message,
  Card,
  Avatar,
  Tag,
  Typography,
  Space,
  Button,
  Empty,
  Modal,
  Tooltip,
} from "antd"
import {
  MailOutlined,
  PhoneOutlined,
  CodeOutlined,
  TrophyOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axiosInstance from "../services/axiosInstance"

const { Search } = Input
const { Text, Title } = Typography
const { Option } = Select

interface Candidate {
  _id: string
  name: string
  email: string
  phone?: string
  technology: string
  level: string
  status: string
  experience?: number
  createdAt: string
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Applied":
    case "Shortlisted":
      return "blue"
    case "Screening":
    case "First Interview":
      return "cyan"
    case "Interview":
    case "Second Interview":
      return "purple"
    case "Technical":
    case "Third Interview":
      return "geekblue"
    case "Offer":
      return "orange"
    case "Hired":
      return "green"
    case "Rejected":
    case "Blacklisted":
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

const CandidateList: React.FC = () => {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: "", tech: "", status: "" })
  const [technologies, setTechnologies] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>([])

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

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get<Candidate[]>("/candidates", {
          params: filters,
        })
        setCandidates(res.data)

        // Extract unique technologies and statuses for filter dropdowns
        const techs = Array.from(new Set(res.data.map((candidate) => candidate.technology)))
        const stats = Array.from(new Set(res.data.map((candidate) => candidate.status)))
        setTechnologies(techs)
        setStatuses(stats)
      } catch (error: any) {
        console.error("Error fetching candidates:", error)
        message.error("Failed to load candidates")
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [filters])

  const handleDeleteCandidate = (id: string, name: string) => {
    Modal.confirm({
      title: "Delete Candidate",
      content: (
        <div>
          <p>Are you sure you want to delete candidate:</p>
          <p>
            <strong>{name}</strong>
          </p>
          <p>This action cannot be undone.</p>
        </div>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/candidates/${id}`)
          setCandidates(candidates.filter((c) => c._id !== id))
          message.success(`${name} has been deleted successfully`)
        } catch (error) {
          console.error("Error deleting candidate:", error)
          message.error("Failed to delete candidate")
        }
      },
    })
  }

  const resetFilters = () => {
    setFilters({ search: "", tech: "", status: "" })
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

  const renderCandidateCard = (candidate: Candidate) => (
    <Col xs={24} sm={12} md={8} lg={6} key={candidate._id}>
      <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card
          hoverable
          style={{
            borderRadius: 12,
            overflow: "hidden",
            height: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
          bodyStyle={{ padding: 20 }}
          actions={[
            <Tooltip title="View Details" key="view">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/candidates/${candidate._id}`)}
                aria-label="View candidate details"
              />
            </Tooltip>,
            <Tooltip title="Delete Candidate" key="delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteCandidate(candidate._id, candidate.name)}
                aria-label="Delete candidate"
              />
            </Tooltip>,
          ]}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Avatar
              size={64}
              style={{
                backgroundColor: getAvatarColor(candidate.name),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 24,
                fontWeight: "bold",
                margin: "0 auto",
              }}
            >
              {getInitials(candidate.name)}
            </Avatar>
            <Title level={5} style={{ marginTop: 12, marginBottom: 4 }}>
              {candidate.name}
            </Title>
            <Tag color={getStatusColor(candidate.status)}>{candidate.status}</Tag>
          </div>

          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <MailOutlined style={{ color: "#1677ff", marginRight: 8, flexShrink: 0 }} />
              <Text ellipsis style={{ width: "100%" }} title={candidate.email}>
                {candidate.email}
              </Text>
            </div>

            {candidate.phone && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <PhoneOutlined style={{ color: "#52c41a", marginRight: 8, flexShrink: 0 }} />
                <Text>{candidate.phone}</Text>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center" }}>
              <CodeOutlined style={{ color: "#722ed1", marginRight: 8, flexShrink: 0 }} />
              <Tag color="blue">{candidate.technology}</Tag>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <TrophyOutlined style={{ color: "#fa8c16", marginRight: 8, flexShrink: 0 }} />
              <Tag color={getLevelColor(candidate.level)}>{candidate.level}</Tag>
            </div>
          </Space>
        </Card>
      </motion.div>
    </Col>
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}
    >
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Candidates
          </Title>
        }
        extra={
          <Link to="/upload">
            <Button type="primary">Add Candidate</Button>
          </Link>
        }
        style={{ borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search by name"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={(value) => setFilters((f) => ({ ...f, search: value }))}
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Technology"
              allowClear
              style={{ width: "100%" }}
              value={filters.tech || undefined}
              onChange={(value) => setFilters((f) => ({ ...f, tech: value || "" }))}
              suffixIcon={<FilterOutlined />}
            >
              {technologies.map((tech) => (
                <Option key={tech} value={tech}>
                  {tech}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: "100%" }}
              value={filters.status || undefined}
              onChange={(value) => setFilters((f) => ({ ...f, status: value || "" }))}
              suffixIcon={<FilterOutlined />}
            >
              {statuses.map((status) => (
                <Option key={status} value={status}>
                  <Tag color={getStatusColor(status)} style={{ margin: 0 }}>
                    {status}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={resetFilters}
              style={{ width: "100%" }}
              disabled={!filters.search && !filters.tech && !filters.status}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Loading candidates...</Text>
          </div>
        </div>
      ) : candidates.length > 0 ? (
        <Row gutter={[24, 24]}>{candidates.map(renderCandidateCard)}</Row>
      ) : (
        <Card style={{ textAlign: "center", padding: "40px 0", borderRadius: 12 }}>
          <Empty
            description={
              <Text type="secondary">
                {filters.search || filters.tech || filters.status
                  ? "No candidates match your search criteria"
                  : "No candidates found"}
              </Text>
            }
          />
          <Button type="primary" style={{ marginTop: 16 }}>
            <Link to="/upload">Add Candidate</Link>
          </Button>
        </Card>
      )}
    </motion.div>
  )
}

export default CandidateList
