import React, { useEffect, useState } from 'react'
import { Card, Form, Select, DatePicker, Button, message, Spin } from 'antd'
import axiosInstance from '../services/axiosInstance'
import type { Moment } from 'moment'

export const PIPELINE_STAGES = [
  'HR Screening',
  'Technical Interview',
  'Managerial Interview',
] as const
export type PipelineStage = typeof PIPELINE_STAGES[number]

interface Candidate {
  _id: string
  name: string
  email: string
}

interface FormValues {
  candidateId: string
  pipelineStage: PipelineStage
  interviewer: string
  date: Moment
}

export default function InterviewSchedule() {
  const [form] = Form.useForm<FormValues>()
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

  const onFinish = async (vals: FormValues) => {
    setSubmitting(true)
    try {
      await axiosInstance.post('/interviews', {
        candidate: vals.candidateId,
        pipelineStage: vals.pipelineStage,
        interviewer: vals.interviewer,
        date: vals.date.toISOString(),
      })
      message.success('Interview scheduled successfully')
      form.resetFields()
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Interview scheduling failed')
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
          name="pipelineStage"
          label="Pipeline Stage"
          rules={[{ required: true, message: 'Please select a pipeline stage' }]}
        >
          <Select<PipelineStage> placeholder="Select pipeline stage">
            {PIPELINE_STAGES.map((stage) => (
              <Select.Option key={stage} value={stage}>
                {stage}
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
