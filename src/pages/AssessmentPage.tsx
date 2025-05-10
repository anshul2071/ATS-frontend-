// src/pages/AssessmentPage.tsx

import React, { useEffect, useState } from 'react';
import {
  Card,
  Select,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Table,
  message,
  Spin,
  Modal,
  Typography,
  Space,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosInstance from '../services/axiosInstance';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface Candidate {
  _id: string;
  name: string;
  email: string;
}

interface AssessmentItem {
  _id: string;
  title: string;
  score: number;
  remarks?: string;
  fileUrl: string;
  createdAt: string;
}

const AssessmentPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string>('');

  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState<AssessmentItem | null>(null);

  const [form] = Form.useForm();

  // 1️⃣ Load shortlisted candidates
  useEffect(() => {
    setLoadingCandidates(true);
    axiosInstance
      .get<Candidate[]>('/candidates?status=Shortlisted')
      .then(({ data }) => setCandidates(data))
      .catch(() => message.error('Failed to load candidates'))
      .finally(() => setLoadingCandidates(false));
  }, []);

  // 2️⃣ Fetch assessments for one candidate
  const fetchAssessments = (candId: string) => {
    setLoadingAssessments(true);
    axiosInstance
      .get<AssessmentItem[]>(`/candidates/${candId}/assessment`)
      .then(({ data }) => setAssessments(data))
      .catch(() => message.error('Failed to load assessments'))
      .finally(() => setLoadingAssessments(false));
  };

  // When user picks a candidate
  const handleCandidateChange = (value: string) => {
    setSelectedId(value);
    const cand = candidates.find(c => c._id === value);
    setSelectedName(cand ? cand.name : '');
    form.resetFields();
    fetchAssessments(value);
  };

  // 3️⃣ Submit new assessment
  const onFinish = (vals: any) => {
    if (!selectedId) return;
    setSubmitting(true);

    const fd = new FormData();
    fd.append('title', vals.title);
    fd.append('score', String(vals.score));
    if (vals.remarks) fd.append('remarks', vals.remarks);
    fd.append('file', vals.file.file.originFileObj);

    axiosInstance
      .post(`/candidates/${selectedId}/assessment`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        message.success('Assessment assigned');
        form.resetFields();
        fetchAssessments(selectedId);
      })
      .catch(() => message.error('Failed to assign assessment'))
      .finally(() => setSubmitting(false));
  };

  // 4️⃣ Table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (s: number) => `${s}/100`,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (r: string) => r || '—',
    },
    {
      title: 'Uploaded On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => dayjs(d).format('MMM D, YYYY, h:mm A'),
    },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      render: (url: string, record: AssessmentItem) => (
        <Space>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Download
          </a>
          <Button
            size="small"
            onClick={() => {
              setPreviewData(record);
              setPreviewVisible(true);
            }}
          >
            Preview
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Title level={2}>Assign & Review Assessments</Title>

      {/* — Candidate Selector — */}
      <Card
        style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Spin spinning={loadingCandidates}>
          <Select
            showSearch
            placeholder="Select a shortlisted candidate"
            optionFilterProp="children"
            onChange={handleCandidateChange}
            style={{ width: '100%' }}
            disabled={loadingCandidates}
          >
            {candidates.map(c => (
              <Option key={c._id} value={c._id}>
                {c.name} — {c.email}
              </Option>
            ))}
          </Select>
        </Spin>
      </Card>

      {selectedId && (
        <>
          {/* — Assignment Form — */}
          <Card
            title={`New Assessment for ${selectedName}`}
            style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish} disabled={submitting}>
              <Form.Item
                name="title"
                label="Assessment Title"
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input placeholder="e.g. Coding Challenge" />
              </Form.Item>

              <Form.Item
                name="score"
                label="Max Score"
                rules={[{ required: true, message: 'Please set a score' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="remarks" label="Remarks">
                <Input.TextArea rows={2} placeholder="Optional feedback or instructions" />
              </Form.Item>

              <Form.Item
                name="file"
                label="Upload Assessment File"
                valuePropName="fileList"
                getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                rules={[{ required: true, message: 'Please upload a file' }]}
              >
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {submitting ? 'Assigning…' : 'Assign Assessment'}
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* — History Table — */}
          <Card
            title="Previous Assessments"
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {loadingAssessments ? (
              <Spin />
            ) : (
              <Table<AssessmentItem>
                rowKey="_id"
                columns={columns}
                dataSource={assessments}
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
              />
            )}
          </Card>
        </>
      )}

      {/* — Preview Modal — */}
      <Modal
        visible={previewVisible}
        title="Assessment Details"
        footer={<Button onClick={() => setPreviewVisible(false)}>Close</Button>}
        onCancel={() => setPreviewVisible(false)}
        width={600}
      >
        {previewData && (
          <>
            <Paragraph>
              <strong>Title:</strong> {previewData.title}
            </Paragraph>
            <Paragraph>
              <strong>Score:</strong> {previewData.score}/100
            </Paragraph>
            <Paragraph>
              <strong>Remarks:</strong> {previewData.remarks || '—'}
            </Paragraph>
            <Paragraph>
              <strong>Uploaded On:</strong>{" "}
              {dayjs(previewData.createdAt).format("MMM D, YYYY, h:mm A")}
            </Paragraph>
            <Paragraph>
              <strong>Download:</strong>{" "}
              <a href={previewData.fileUrl} target="_blank" rel="noopener noreferrer">
                {previewData.fileUrl.split("/").pop()}
              </a>
            </Paragraph>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AssessmentPage;
