// src/pages/OfferForm.tsx
import React, { useEffect, useState } from 'react'
import { Form, Select, InputNumber, DatePicker, Button , message} from 'antd'
import axiosInstance from '../services/axiosInstance'
import type { OfferTemplate } from '../services/types'

interface Props { candidateId: string

  onSuccess?: () => void
 }
interface FormValues {
  templateId: string
  salary: number
  startDate: moment.Moment
}

const OfferForm: React.FC<Props> = ({ candidateId , onSuccess}) => {
  const [templates, setTemplates] = useState<OfferTemplate[]>([])
  const [loading, setLoading]   = useState(true)
  const [form] = Form.useForm<FormValues>()

  useEffect(() => {
    axiosInstance.get<OfferTemplate[]>('/offer-templates')
      .then(r => setTemplates(r.data))
      .finally(() => setLoading(false))
  }, [])

  const onFinish = async (vals: FormValues) => {
    try {
      await axiosInstance.post('/offers', {
        candidateId,
        templateId: vals.templateId,
        placeholders: {
          salary:    vals.salary,
          startDate: vals.startDate.format('YYYY-MM-DD'),
        }
      })
      form.resetFields()
      message.success('Offer sent successfully')
      onSuccess?.()
    } catch (err) {
      message.error('Failed to send offer')
    }
  }
  

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="templateId"
        label="Offer Template"
        rules={[{ required: true }]}
      >
        <Select loading={loading} placeholder="Select template">
          {templates.map(t => (
            <Select.Option key={t._id} value={t._id}>
              {t.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="salary"
        label="Salary"
        rules={[{ required: true }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={v => `$ ${v}`}
          parser={v => v!.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Send Offer
        </Button>
      </Form.Item>
    </Form>
  )
}

export default OfferForm
