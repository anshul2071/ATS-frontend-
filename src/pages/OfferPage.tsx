// src/pages/OfferPage.tsx

import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Select,
  Radio,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Tag,
  message,
  Typography,
  Spin,
  Modal,
  Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import axiosInstance from '../services/axiosInstance';

const { Option } = Select;
const { Title } = Typography;

interface Candidate {
  _id: string;
  name: string;
  email: string;
}

interface Letter {
  _id: string;
  templateType: 'offer' | 'rejection';
  position: string;
  technology: string;
  startingDate: string;
  salary: number;
  probationDate: string;
  acceptanceDeadline: string;
  sentTo: string;
  createdAt: string;
}

interface FormValues {
  candidateId: string;
  templateType: 'offer' | 'rejection';
  position?: string;
  technology?: string;
  startingDate?: Dayjs;
  salary?: number;
  probationDate?: Dayjs;
  acceptanceDeadline?: Dayjs;
}

const OfferPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const selectedCandidateId = Form.useWatch('candidateId', form);

  const [hiredCandidates, setHiredCandidates] = useState<Candidate[]>([]);
  const [letters, setLetters]                 = useState<Letter[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [loadingLetters, setLoadingLetters]       = useState(false);
  const [submitting, setSubmitting]               = useState(false);
  const [previewHtml, setPreviewHtml]             = useState('');
  const [previewVisible, setPreviewVisible]       = useState(false);

  // Load hired candidates
  useEffect(() => {
    setLoadingCandidates(true);
    axiosInstance
      .get<Candidate[]>('/candidates?status=Hired')
      .then(({ data }) => setHiredCandidates(data))
      .catch(() => message.error('Failed to load candidates'))
      .finally(() => setLoadingCandidates(false));
  }, []);

  // When candidate changes, fetch their letters
  useEffect(() => {
    if (!selectedCandidateId) {
      setLetters([]);
      return;
    }
    setLoadingLetters(true);
    axiosInstance
      .get<Letter[]>(`/candidates/${selectedCandidateId}/letters`)
      .then(({ data }) => setLetters(data))
      .catch(() => message.error('Failed to load letters'))
      .finally(() => setLoadingLetters(false));
  }, [selectedCandidateId]);

  // Form submit handler
  const onFinish = async (values: FormValues) => {
    if (!values.candidateId) return;
    setSubmitting(true);

    const payload: any = { templateType: values.templateType };
    if (values.templateType === 'offer') {
      payload.position           = values.position;
      payload.technology         = values.technology;
      payload.startingDate       = values.startingDate!.toISOString();
      payload.salary             = Number(values.salary);
      payload.probationDate      = values.probationDate!.toISOString();
      payload.acceptanceDeadline = values.acceptanceDeadline!.toISOString();
    }

    try {
      await axiosInstance.post(`/candidates/${values.candidateId}/letters`, payload);
      message.success('Letter sent');
      form.resetFields(['templateType','position','technology','startingDate','salary','probationDate','acceptanceDeadline']);
      const { data } = await axiosInstance.get<Letter[]>(`/candidates/${values.candidateId}/letters`);
      setLetters(data);
    } catch {
      message.error('Failed to send letter');
    } finally {
      setSubmitting(false);
    }
  };

  // Table columns
  const columns: ColumnsType<Letter> = [
    {
      title: 'Type',
      dataIndex: 'templateType',
      key: 'templateType',
      render: t => <Tag color={t==='offer'?'green':'red'}>{t.toUpperCase()}</Tag>,
      filters: [
        { text: 'Offer', value: 'offer' },
        { text: 'Rejection', value: 'rejection' },
      ],
      onFilter: (value, record) => record.templateType === value,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (pos, rec) => rec.templateType==='offer'?pos:'—',
    },
    {
      title: 'Technology',
      dataIndex: 'technology',
      key: 'technology',
      render: (tech, rec) => rec.templateType==='offer'?tech:'—',
    },
    {
      title: 'Start Date',
      dataIndex: 'startingDate',
      key: 'startingDate',
      render: d => d ? dayjs(d).format('MMM D, YYYY') : '—',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: s => (s!=null?`$${s.toLocaleString()}`:'—'),
    },
    {
      title: 'Probation End',
      dataIndex: 'probationDate',
      key: 'probationDate',
      render: d => d?dayjs(d).format('MMM D, YYYY'):'—',
    },
    {
      title: 'Accept By',
      dataIndex: 'acceptanceDeadline',
      key: 'acceptanceDeadline',
      render: d => d?dayjs(d).format('MMM D, YYYY'):'—',
    },
    { title:'Sent To', dataIndex:'sentTo', key:'sentTo' },
    {
      title:'Sent On',
      dataIndex:'createdAt',
      key:'createdAt',
      render: d => dayjs(d).format('MMM D, YYYY'),
    },
    {
      title:'Actions',
      key:'actions',
      render: (_, rec) => (
        <Button
          type="link"
          onClick={() => {
            const html = rec.templateType==='offer'
              ? `<p>Dear Candidate,</p>
                 <p>We are pleased to offer you the position of <strong>${rec.position}</strong> on our <strong>${rec.technology}</strong> team.</p>
                 <ul>
                   <li><strong>Start Date:</strong> ${dayjs(rec.startingDate).format('MMM D, YYYY')}</li>
                   <li><strong>Salary:</strong> $${rec.salary.toLocaleString()}</li>
                   <li><strong>Probation Ends:</strong> ${dayjs(rec.probationDate).format('MMM D, YYYY')}</li>
                   <li><strong>Accept By:</strong> ${dayjs(rec.acceptanceDeadline).format('MMM D, YYYY')}</li>
                 </ul>
                 <p>Please reply by the deadline above to confirm.</p>`
              : `<p>Dear Candidate,</p>
                 <p>Thank you for applying. After careful review, we will not be moving forward with your application at this time.</p>
                 <p>We appreciate your interest and wish you the best.</p>`;
            setPreviewHtml(html);
            setPreviewVisible(true);
          }}
        >
          Preview
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Title level={2}>Send Offer / Rejection Letter</Title>

      <Card style={{ marginBottom: 32, borderRadius: 12 }}>
        <Spin spinning={loadingCandidates}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="candidateId"
              label="Candidate"
              rules={[{ required: true, message: 'Please select a hired candidate' }]}
            >
              <Select
                placeholder="Choose a hired candidate"
                allowClear
                loading={loadingCandidates}
              >
                {hiredCandidates.map(c => (
                  <Option key={c._id} value={c._id}>
                    {c.name} — {c.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="templateType"
              label="Letter Type"
              rules={[{ required: true, message: 'Please choose letter type' }]}
            >
              <Radio.Group disabled={!selectedCandidateId}>
                <Radio.Button value="offer">Offer Letter</Radio.Button>
                <Radio.Button value="rejection">Rejection Letter</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prev, cur) => prev.templateType !== cur.templateType}
            >
              {({ getFieldValue }) =>
                getFieldValue('templateType') === 'offer' && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item name="position" label="Position" rules={[{ required: true }]}>
                      <Input placeholder="e.g. Front-end Developer" />
                    </Form.Item>
                    <Form.Item name="technology" label="Technology" rules={[{ required: true }]}>
                      <Input placeholder="e.g. React JS" />
                    </Form.Item>
                    <Form.Item name="startingDate" label="Start Date" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="Annual package" />
                    </Form.Item>
                    <Form.Item name="probationDate" label="Probation End" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="acceptanceDeadline"
                      label="Acceptance Deadline"
                      rules={[{ required: true }]}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Space>
                )
              }
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={!selectedCandidateId}
              >
                {submitting ? 'Sending…' : 'Send Letter'}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>

      <Card title="Previous Letters" style={{ borderRadius: 12 }}>
        {loadingLetters ? (
          <Spin />
        ) : (
          <Table<Letter>
            rowKey="_id"
            columns={columns}
            dataSource={letters}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>

      <Modal
        open={previewVisible}
        title="Email Preview"
        footer={<Button onClick={() => setPreviewVisible(false)}>Close</Button>}
        onCancel={() => setPreviewVisible(false)}
      >
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </Modal>
    </div>
  );
};

export default OfferPage;
