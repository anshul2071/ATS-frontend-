import React, { useEffect, useState } from 'react'
import { Card, Form, Select, DatePicker, Button, message, Spin } from 'antd'
import axiosInstance from '../services/axiosInstance'

interface Candidate {
  _id: string
  name: string
  email: string
}

const pipelineStages = [
  'HR Screening',
  'Technical Interview',
  'Managerial Interview',
  'Final Interview',
]

export default function InterviewSchedule() {
  const [form] = Form.useForm()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get<Candidate[]>('/candidates', { params: { status: 'Shortlisted' } })
      .then((res) => setCandidates(res.data))
      .catch(() => message.error('Failed to load shortlisted candidates.'))
      .finally(() => setLoading(false))
  }, [])

  const onFinish = async (vals: any) => {
    setSubmitting(true)
    try {
      await axiosInstance.post('/interviews', {
        candidate:   vals.candidateId,
        round:       vals.round,
        interviewer: vals.interviewer,
        date:        vals.date.toISOString(),
      })
      message.success('Interview scheduled successfully')
      form.resetFields()
    } catch {
      message.error('Interview scheduling failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 100 }} />
  }

  return (
    <Card title="Schedule Interview" style={{ maxWidth: 600, margin: '24px auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="candidateId"
          label="Candidate"
          rules={[{ required: true, message: 'Please select a candidate' }]}
        >
          <Select placeholder="Select a shortlisted candidate">
            {candidates.map((c) => (
              <Select.Option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="round"
          label="Pipeline Stage"
          rules={[{ required: true, message: 'Please select a pipeline stage' }]}
        >
          <Select placeholder="Select pipeline stage">
            {pipelineStages.map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="interviewer"
          label="Interviewer"
          rules={[{ required: true, message: 'Please select an interviewer' }]}
        >
          <Select placeholder="Select interviewer">
            <Select.Option value="HR">HR</Select.Option>
            <Select.Option value="Tech">Tech</Select.Option>
            <Select.Option value="Manager">Manager</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Date & Time"
          rules={[{ required: true, message: 'Please select date & time' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Schedule Interview
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

