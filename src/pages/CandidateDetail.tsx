// src/pages/CandidateDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
  Space,
  Typography,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axiosInstance from '../services/axiosInstance'
import ResumeParser, { ResumeSummary } from '../components/ResumeParser'
import type { UploadProps } from 'antd'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import { getOffers, sendOffer, Offer as ApiOffer } from '../services/offerService'

const { Text } = Typography

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

export default function CandidateDetail() {
  const { id: candidateId } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [candidate, setCandidate] = useState<CandidateType | null>(null)
  const [offers, setOffers] = useState<ApiOffer[]>([])
  const [editing, setEditing] = useState(false)

  const [infoForm] = Form.useForm()
  const [assessForm] = Form.useForm()
  const [offerForm] = Form.useForm()
  const [bgForm] = Form.useForm()

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
        message.error('Failed to load candidate')
      }
      try {
        const offs = await getOffers(candidateId)
        setOffers(offs)
      } catch (err: any) {
        if (err.response?.status === 404) {
          setOffers([])
        } else {
          message.error('Failed to load offers')
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [candidateId, infoForm])

  if (loading || !candidate) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" /></div>
  }

  const saveInfo = async (vals: any) => {
    try {
      const { data } = await axiosInstance.put<CandidateType>(
        `/candidates/${candidateId}`, vals
      )
      setCandidate(data)
      setEditing(false)
      message.success('Info updated')
    } catch {
      message.error('Update failed')
    }
  }

  const changeStatus = async (newStatus: string) => {
    try {
      await axiosInstance.put(`/candidates/${candidateId}`, { status: newStatus })
      setCandidate({ ...candidate, status: newStatus })
      message.success('Status updated')
    } catch {
      message.error('Failed to update status')
    }
  }

  const uploadProps: UploadProps = {
    beforeUpload: file => {
      const ok = file.size < 10 * 1024 * 1024
      if (!ok) message.error('File too large')
      return ok
    },
    maxCount: 1,
    customRequest: (options: UploadRequestOption<any>) => {
      const { onSuccess } = options
      setTimeout(() => onSuccess && onSuccess('ok'), 0)
    },
  }

  const addAssessment = async (vals: any) => {
    try {
      const fd = new FormData()
      fd.append('title', vals.title)
      fd.append('score', vals.score.toString())
      fd.append('remarks', vals.remarks || '')
      fd.append('file', vals.file.file.originFileObj)
      const { data } = await axiosInstance.post<CandidateType>(
        `/candidates/${candidateId}/assessment`, fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setCandidate(data)
      assessForm.resetFields()
      message.success('Assessment added')
    } catch {
      message.error('Upload failed')
    }
  }

  const addOffer = async (vals: any) => {
    try {
      const updated = await sendOffer(candidateId!, {
        template: vals.template,
        placeholders: vals.placeholders,
      })
      setOffers(updated)
      offerForm.resetFields()
      message.success('Offer created & emailed')
    } catch {
      message.error('Failed to send offer')
    }
  }

  const sendBackground = async (vals: any) => {
    try {
      await axiosInstance.post(`/candidates/${candidateId}/background`, vals)
      bgForm.resetFields()
      message.success('Background check email sent')
    } catch {
      message.error('Failed to send background check')
    }
  }

  const tabs = [
    {
      key: 'info',
      label: 'Info',
      children: (
        <Card
          extra={editing
            ? <Space><Button onClick={() => setEditing(false)}>Cancel</Button><Button type="primary" onClick={() => infoForm.submit()}>Save</Button></Space>
            : <Button onClick={() => setEditing(true)}>Edit</Button>
          }
        >
          {editing
            ? <Form form={infoForm} layout="vertical" onFinish={saveInfo}>
                <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input/></Form.Item>
                <Form.Item name="phone" label="Phone"><Input/></Form.Item>
                <Form.Item name="references" label="References"><Input.TextArea rows={2}/></Form.Item>
                <Form.Item name="technology" label="Technology" rules={[{ required: true }]}>
                  <Select>{['Dot Net','React JS','DevOps','QA'].map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}</Select>
                </Form.Item>
                <Form.Item name="level" label="Level">
                  <Select>{['Junior','Mid','Senior'].map(l => <Select.Option key={l} value={l}>{l}</Select.Option>)}</Select>
                </Form.Item>
                <Form.Item name="salaryExpectation" label="Salary Expectation"><InputNumber style={{width:'100%'}}/></Form.Item>
                <Form.Item name="experience" label="Experience (yrs)"><InputNumber style={{width:'100%'}}/></Form.Item>
              </Form>
            : <>
                <Text strong>Name:</Text> {candidate.name}<br/>
                <Text strong>Email:</Text> {candidate.email}<br/>
                <Text strong>Phone:</Text> {candidate.phone||'—'}<br/>
                <Text strong>References:</Text> {candidate.references||'—'}<br/>
                <Text strong>Tech:</Text> {candidate.technology}<br/>
                <Text strong>Level:</Text> {candidate.level}<br/>
                <Text strong>Salary:</Text> ${candidate.salaryExpectation||0}<br/>
                <Text strong>Experience:</Text> {candidate.experience||0} yrs<br/>
                <Space style={{marginTop:8}}>
                  <Text strong>Status:</Text>
                  <Select value={candidate.status} onChange={changeStatus} style={{width:200}}>
                    {['Shortlisted','First Interview','Second Interview','Hired','Rejected','Blacklisted']
                      .map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                  </Select>
                </Space>
                {candidate.parserSummary && <ResumeParser summary={candidate.parserSummary}/>}
              </>
          }
        </Card>
      ),
    },
    {
      key: 'assessments',
      label: 'Assessments',
      children: (
        <Card title="Assessment Records">
          <Form form={assessForm} layout="vertical" onFinish={addAssessment}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input/></Form.Item>
            <Form.Item name="file" label="File" valuePropName="fileList" getValueFromEvent={e => e.fileList} rules={[{ required: true }]}>
              <Upload {...uploadProps}><Button icon={<UploadOutlined/>}>Select File</Button></Upload>
            </Form.Item>
            <Form.Item name="score" label="Score" rules={[{ required: true }]}><InputNumber min={0} max={100} style={{width:'100%'}}/></Form.Item>
            <Form.Item name="remarks" label="Remarks"><Input.TextArea rows={2}/></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">Add Assessment</Button></Form.Item>
          </Form>
          <Table
            dataSource={candidate.assessments}
            rowKey="_id"
            columns={[
              { title:'Title', dataIndex:'title', key:'title' },
              { title:'Score', dataIndex:'score', key:'score' },
              { title:'Remarks', dataIndex:'remarks', key:'remarks' },
              { title:'Date', dataIndex:'createdAt', key:'createdAt' },
              { title:'File', key:'file', render:(_,_r)=> <a href={(_r as Assessment).fileUrl} target="_blank" rel="noopener noreferrer">Download</a> }
            ]}
            pagination={false}
            style={{marginTop:16}}
          />
        </Card>
      ),
    },
    {
      key: 'offers',
      label: 'Offers',
      children: (
        <Card title="Offer Management">
          <Form form={offerForm} layout="vertical" onFinish={addOffer}>
            <Form.Item name="template" label="Template" rules={[{ required: true }]}>
              <Select placeholder="Select template">
                <Select.Option value="Standard">Standard Offer</Select.Option>
                <Select.Option value="Contractor">Contractor Offer</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="placeholders" label="Custom Fields">
              <Input.TextArea rows={3} placeholder="e.g. {salary:60000}"/>
            </Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">Send Offer</Button></Form.Item>
          </Form>
          <Table
            dataSource={offers}
            rowKey="_id"
            columns={[
              { title:'Date', dataIndex:'date', key:'date' },
              { title:'Template', dataIndex:'template', key:'template' },
              { title:'Sent To', dataIndex:'sentTo', key:'sentTo' }
            ]}
            pagination={false}
            style={{marginTop:16}}
          />
        </Card>
      ),
    },
    {
      key: 'background',
      label: 'Background Check',
      children: (
        <Card title="Background Check">
          <Form form={bgForm} layout="vertical" onFinish={sendBackground}>
            <Form.Item name="refEmail" label="Reference Email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="reference@example.com"/>
            </Form.Item>
            <Form.Item><Button type="primary" htmlType="submit" block>Send Background Check</Button></Form.Item>
          </Form>
        </Card>
      ),
    },
  ]

  return <Tabs defaultActiveKey="info" items={tabs}/>
}
