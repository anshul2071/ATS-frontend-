import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Spin, message } from 'antd';
import CandidateCard, { Candidate } from '../components/CandidateCard';
import axiosInstance from '../services/axiosInstance';

const { Search } = Input;

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filters, setFilters] = useState({ search: '', tech: '', status: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get<Candidate[]>('/candidates', {
          params: filters,
        });
        setCandidates(res.data);
      } catch (error: any) {
        console.error('Error fetching candidates:', error);
        message.error('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [filters]);

  if (loading) {
    return <Spin tip="Loading candidates..." style={{ marginTop: 100 }} />;
  }

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search by name"
            onSearch={(v) => setFilters((f) => ({ ...f, search: v }))}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter by Technology"
            allowClear
            style={{ width: '100%' }}
            onChange={(v) => setFilters((f) => ({ ...f, tech: v }))}
          >
            <Select.Option value="Dot Net">Dot Net</Select.Option>
            <Select.Option value="React JS">React JS</Select.Option>
            <Select.Option value="DevOps">DevOps</Select.Option>
            <Select.Option value="QA">QA</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: '100%' }}
            onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          >
            <Select.Option value="Shortlisted">Shortlisted</Select.Option>
            <Select.Option value="First Interview">HR Screening</Select.Option>
            <Select.Option value="Second Interview">Tech Interview</Select.Option>
            <Select.Option value="Third Interview">Managerial Interview</Select.Option>
            <Select.Option value="Hired">Hired</Select.Option>
            <Select.Option value="Rejected">Rejected</Select.Option>
            <Select.Option value="Blacklisted">Blacklisted</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {candidates.map((c) => (
          <CandidateCard key={c._id} candidate={c} />
        ))}
      </Row>
    </>
  );
};

export default CandidateList;