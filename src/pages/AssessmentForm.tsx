import React, { useState } from 'react'
import { Form, Input, InputNumber, Button, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axiosInstance from '../services/axiosInstance'

interface Props {
  candidateId: string
  onSuccess?: () => void
}

const AssessmentForm: React.FC<Props> = ({ candidateId, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList)

  const onFinish = async (vals: any) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', vals.title)
      fd.append('score', vals.score.toString())
      fd.append('remarks', vals.remarks || '')
      fd.append('file', vals.file[0].originFileObj)
      await axiosInstance.post(`/candidates/${candidateId}/assessment`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      form.resetFields()
      onSuccess?.()
      message.success('Assessment submitted')
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="score" label="Score" rules={[{ required: true }]}>
        <InputNumber min={0} max={100} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="remarks" label="Remarks">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="file"
        label="File"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true }]}
      >
        <Upload maxCount={1} beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit Assessment
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AssessmentForm
