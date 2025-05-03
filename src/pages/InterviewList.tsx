// src/pages/InterviewList.tsx
import React, { useEffect, useState, useMemo } from 'react'
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
} from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { ColumnsType } from 'antd/es/table'
import axiosInstance from '../services/axiosInstance'

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

const InterviewStages = [
  'HR Screening',
  'Technical Interview',
  'Managerial Interview',
  'Final Interview',
] as const

type Stage = typeof InterviewStages[number]

interface CandidateRef {
  _id: string
  name: string
  email: string
}

interface Interview {
  _id: string
  candidate: CandidateRef
  round: Stage
  interviewer: string
  date: string // ISO timestamp
}

export default function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [stageFilter, setStageFilter] = useState<Stage | ''>('')
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)

  const fetchInterviews = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get<Interview[]>('/interviews')
      setInterviews(res.data)
    } catch (err) {
      console.error(err)
      message.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviews();
  }, []);

  const filtered = useMemo(() => {
    return interviews.filter(i => {
      if (!i.candidate || !i.candidate.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false
      }
      if (stageFilter && i.round !== stageFilter) {
        return false
      }
      if (dateRange) {
        const d = dayjs(i.date)
        if (d.isBefore(dateRange[0], 'day') || d.isAfter(dateRange[1], 'day')) {
          return false
        }
      }
      return true
    })
  }, [interviews, searchName, stageFilter, dateRange])

  const columns: ColumnsType<Interview> = [
    {
      title: 'Candidate',
      dataIndex: ['candidate', 'name'],
      key: 'candidate',
      sorter: (a, b) => a.candidate.name.localeCompare(b.candidate.name),
      render: (_: any, record) => (
        <>
          <Text strong>{record.candidate.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.candidate.email}
          </Text>
        </>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'round',
      key: 'round',
      filters: InterviewStages.map(s => ({ text: s, value: s })),
      onFilter: (value, record) => record.round === value,
      render: (r: Stage) => <Tag color="blue">{r}</Tag>,
    },
    {
      title: 'Interviewer',
      dataIndex: 'interviewer',
      key: 'interviewer',
      sorter: (a, b) => a.interviewer.localeCompare(b.interviewer),
    },
    {
      title: 'Scheduled At',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: d => dayjs(d).format('YYYY-MM-DD HH:mm'),
    },
  ]

  return (
    <Card
      title={<Title level={4}>Scheduled Interviews</Title>}
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchInterviews}
          loading={loading}
        />
      }
      style={{ margin: 24 }}
    >
      <Space wrap style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by name"
          onSearch={setSearchName}
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Select<Stage | ''>
          placeholder="Filter by stage"
          allowClear
          style={{ width: 200 }}
          value={stageFilter}
          onChange={setStageFilter}
        >
          {InterviewStages.map(s => (
            <Select.Option key={s} value={s}>
              {s}
            </Select.Option>
          ))}
        </Select>
        <RangePicker
          format="YYYY-MM-DD"
          onChange={dates =>
            dates && dates[0] && dates[1]
              ? setDateRange([dates[0], dates[1]])
              : setDateRange(null)
          }
        />
        <Button onClick={() => {
          setSearchName('')
          setStageFilter('')
          setDateRange(null)
        }}>
          Clear Filters
        </Button>
      </Space>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="_id"
          dataSource={filtered}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </Card>
  )
}
