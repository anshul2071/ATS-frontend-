// src/Settings/Name.tsx
import React from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import axiosInstance from '../services/axiosInstance'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/userSlice'

interface Props {
  visible: boolean
  initialName: string
  onClose: () => void
  onUpdated: (name: string, token: string) => void
}

const NameEditor: React.FC<Props> = ({ visible, initialName, onClose, onUpdated }) => {
  const [form] = Form.useForm<{ name: string }>()
  const dispatch = useAppDispatch()

  const handleSave = async (vals: { name: string }) => {
    try {
      // now expect userId from the backend as well
      const res = await axiosInstance.put<{
        token: string
        userId: string
        name: string
        email: string
      }>('/auth/update-profile', { name: vals.name })

      dispatch(setCredentials({
        token: res.data.token,
        userId: res.data.userId,  // ← include the userId here
        email: res.data.email,
        name: res.data.name,
      }))

      onUpdated(res.data.name, res.data.token)
      message.success('Name updated')
      onClose()
    } catch (e: any) {
      message.error(e.response?.data?.message || 'Update failed')
    }
  }

  return (
    <Modal
      title="Edit Name"
      open={visible}
      footer={null}
      onCancel={onClose}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: initialName }}
        onFinish={handleSave}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NameEditor
