import React from 'react';
import { Card, Tag, Typography, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

export interface Candidate {
  _id: string;
  name: string;
  technology?: string;
  status?: string;
}

interface CandidateCardProps {
  candidate: Candidate;
}

const statusColors: Record<string, string> = {
  Shortlisted: 'green',
  'HR Screening': 'blue',
  'Technical Interview': 'purple',
  'Managerial Interview': 'cyan',
  Hired: 'gold',
  Rejected: 'red',
  Blacklisted: 'default',
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const navigate = useNavigate();
  const {
    token: { borderRadius, colorBgContainer, colorTextSecondary, colorPrimary },
  } = theme.useToken();

  const handleCardClick = () => {
    navigate(`/candidates/${candidate._id}`);
  };

  return (
    <Card
      hoverable
      role="button"
      aria-label={`View details for ${candidate.name}`}
      onClick={handleCardClick}
      style={{
        width: 280,
        margin: 12,
        cursor: 'pointer',
        borderRadius,
        background: colorBgContainer,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        padding: 16,
      }}
    
    >
      <Title level={5} style={{ margin: 0, color: colorPrimary }}>
        {candidate.name}
      </Title>

      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        Technology: <Text strong>{candidate.technology || 'N/A'}</Text>
      </Text>

      <div style={{ marginTop: 10 }}>
        <Text type="secondary">Status: </Text>
        {candidate.status ? (
          <Tag color={statusColors[candidate.status] || 'default'}>
            {candidate.status}
          </Tag>
        ) : (
          <Text type="secondary">Unknown</Text>
        )}
      </div>
    </Card>
  );
};

export default CandidateCard;
