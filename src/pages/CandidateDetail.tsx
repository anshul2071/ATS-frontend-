// src/pages/CandidateDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  DatePicker,
  message,
  Space,
  Typography,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from '../services/axiosInstance';
import ResumeParser, { ResumeSummary } from '../components/ResumeParser';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface Assessment {
  _id: string;
  title: string;
  fileUrl: string;
  remarks?: string;
  score?: number;
  createdAt: string;
}

interface Offer {
  _id: string;
  template: string;
  sentTo: string;
  date: string;
}

interface CandidateType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  references?: string;
  technology: string;
  level: string;
  salaryExpectation?: number;
  experience?: number;
  status: string;
  assessments: Assessment[];
  parserSummary: ResumeSummary;
}

const CandidateDetail: React.FC = () => {
  const { id: candidateId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<CandidateType | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editing, setEditing] = useState(false);

  const [infoForm] = Form.useForm();
  const [assessForm] = Form.useForm();
  const [offerForm] = Form.useForm();
  const [bgForm] = Form.useForm();

  // Fetch candidate, offers
  useEffect(() => {
    const fetchData = async () => {
      if (!candidateId) return;
      setLoading(true);
      try {
        const [cRes, oRes] = await Promise.all([
          axiosInstance.get<CandidateType>(`/candidates/${candidateId}`),
          axiosInstance.get<Offer[]>(`/candidates/${candidateId}/offers`),
        ]);
        setCandidate(cRes.data);
        setOffers(oRes.data);
        infoForm.setFieldsValue({
          name: cRes.data.name,
          phone: cRes.data.phone,
          references: cRes.data.references,
          technology: cRes.data.technology,
          level: cRes.data.level,
          salaryExpectation: cRes.data.salaryExpectation,
          experience: cRes.data.experience,
        });
      } catch (err) {
        console.error(err);
        message.error('Failed to load candidate data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [candidateId, infoForm]);

  if (loading || !candidate) {
    return <Spin tip="Loading candidate..." style={{ marginTop: 100 }} />;
  }

  /** Info Tab **/
  const onInfoSave = async (vals: any) => {
    try {
      const res = await axiosInstance.put<CandidateType>(
        `/candidates/${candidateId}`,
        vals
      );
      setCandidate(res.data);
      setEditing(false);
      message.success('Candidate info updated');
    } catch {
      message.error('Update failed');
    }
  };

  /** Status Change **/
  const onStatusChange = async (newStatus: string) => {
    try {
      await axiosInstance.put(`/candidates/${candidateId}`, { status: newStatus });
      setCandidate({ ...candidate, status: newStatus });
      message.success(`Status updated to ${newStatus}`);
    } catch {
      message.error('Failed to update status');
    }
  };

  /** Assessment Tab **/
  const uploadProps = {
    beforeUpload: (file: File) => {
      const ok = file.size < 10 * 1024 * 1024;
      if (!ok) message.error('File too large');
      return ok;
    },
    maxCount: 1,
  };
  const onAssessSubmit = async (vals: any) => {
    try {
      const formData = new FormData();
      formData.append('title', vals.title);
      formData.append('score', vals.score.toString());
      formData.append('remarks', vals.remarks || '');
      formData.append('file', vals.file.file.originFileObj);
      const res = await axiosInstance.post<CandidateType>(
        `/candidates/${candidateId}/assessment`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setCandidate(res.data);
      assessForm.resetFields();
      message.success('Assessment added');
    } catch {
      message.error('Upload failed');
    }
  };

  /** Offers Tab **/
  const onOfferSubmit = async (vals: any) => {
    try {
      const res = await axiosInstance.post<Offer[]>(
        `/candidates/${candidateId}/offers`,
        vals
      );
      setOffers(res.data);
      offerForm.resetFields();
      message.success('Offer sent');
    } catch {
      message.error('Failed to send offer');
    }
  };

  /** Background Check Tab **/
  const onBgSubmit = async (vals: any) => {
    try {
      await axiosInstance.post(`/candidates/${candidateId}/background`, vals);
      message.success('Background check email sent');
      bgForm.resetFields();
    } catch {
      message.error('Failed to send background check');
    }
  };

  return (
    <Tabs defaultActiveKey="info" type="card">
      {/* Info */}
      <TabPane tab="Info" key="info">
        <Card
          extra={
            editing ? (
              <Space>
                <Button onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="primary" onClick={() => infoForm.submit()}>
                  Save
                </Button>
              </Space>
            ) : (
              <Button onClick={() => setEditing(true)}>Edit</Button>
            )
          }
        >
          {!editing ? (
            <>
              <Text><strong>Name:</strong> {candidate.name}</Text><br/>
              <Text><strong>Email:</strong> {candidate.email}</Text><br/>
              <Text><strong>Phone:</strong> {candidate.phone || '—'}</Text><br/>
              <Text><strong>References:</strong> {candidate.references || '—'}</Text><br/>
              <Text><strong>Tech:</strong> {candidate.technology}</Text><br/>
              <Text><strong>Level:</strong> {candidate.level}</Text><br/>
              <Text><strong>Salary:</strong> ${candidate.salaryExpectation || 0}</Text><br/>
              <Text><strong>Experience:</strong> {candidate.experience || 0} yrs</Text><br/>
              <Space style={{ marginTop: 8 }}>
                <Text strong>Status:</Text>
                <Select
                  value={candidate.status}
                  onChange={onStatusChange}
                  style={{ width: 200 }}
                >
                  {['Shortlisted','First Interview','Second Interview','Hired','Rejected','Blacklisted']
                    .map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                </Select>
              </Space>
              <ResumeParser summary={candidate.parserSummary} />
            </>
          ) : (
            <Form form={infoForm} layout="vertical" onFinish={onInfoSave}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
              <Form.Item name="references" label="References">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="technology" label="Technology" rules={[{ required: true }]}>
                <Select>
                  {['Dot Net','React JS','DevOps','QA'].map(t => (
                    <Select.Option key={t} value={t}>{t}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="level" label="Level">
                <Select>
                  {['Junior','Mid','Senior'].map(l => (
                    <Select.Option key={l} value={l}>{l}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="salaryExpectation" label="Salary Expectation">
                <InputNumber prefix="$" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="experience" label="Experience (yrs)">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          )}
        </Card>
      </TabPane>

      {/* Assessments */}
      <TabPane tab="Assessments" key="assessments">
        <Card title="Assessment Records">
          <Form form={assessForm} layout="vertical" onFinish={onAssessSubmit}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input placeholder="Assessment Title" />
            </Form.Item>
            <Form.Item
              name="file"
              label="Upload File"
              valuePropName="file"
              getValueFromEvent={(e) => e}
              rules={[{ required: true }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="score" label="Score" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Assessment
              </Button>
            </Form.Item>
          </Form>
          <Table
            dataSource={candidate.assessments}
            rowKey="_id"
            columns={[
              { title: 'Title', dataIndex: 'title', key: 'title' },
              { title: 'Score', dataIndex: 'score', key: 'score' },
              { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
              { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
              {
                title: 'File',
                key: 'file',
                render: (_, record) => (
                  <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                ),
              },
            ]}
            style={{ marginTop: 16 }}
            pagination={false}
          />
        </Card>
      </TabPane>

      {/* Offers */}
      <TabPane tab="Offers" key="offers">
        <Card title="Offer Management">
          <Form form={offerForm} layout="vertical" onFinish={onOfferSubmit}>
            <Form.Item name="template" label="Template" rules={[{ required: true }]}>
              <Select placeholder="Select template">
                <Select.Option value="Standard">Standard Offer</Select.Option>
                <Select.Option value="Contractor">Contractor Offer</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="placeholders" label="Custom Fields">
              <Input.TextArea rows={3} placeholder="e.g. {salary:60000}" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Offer
              </Button>
            </Form.Item>
          </Form>
          <Table
            dataSource={offers}
            rowKey="_id"
            columns={[
              { title: 'Date', dataIndex: 'date', key: 'date' },
              { title: 'Template', dataIndex: 'template', key: 'template' },
              { title: 'Sent To', dataIndex: 'sentTo', key: 'sentTo' },
            ]}
            style={{ marginTop: 16 }}
            pagination={false}
          />
        </Card>
      </TabPane>

      {/* Background Check */}
      <TabPane tab="Background Check" key="background">
        <Card title="Background Check">
          <Form form={bgForm} layout="vertical" onFinish={onBgSubmit}>
            <Form.Item
              name="refEmail"
              label="Reference Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input placeholder="reference@example.com" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Background Check
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </TabPane>
    </Tabs>
  );
};

export default CandidateDetail;
