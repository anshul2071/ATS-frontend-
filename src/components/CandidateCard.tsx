import React from 'react';
import { Card, Tag, Typography, theme, Avatar, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  UserOutlined, 
  RightOutlined, 
  CodeOutlined, 
  CheckCircleFilled 
} from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

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

// Direct color mapping for status indicator
const statusIndicatorColors: Record<string, string> = {
  Shortlisted: '#52c41a',
  'HR Screening': '#1890ff',
  'Technical Interview': '#722ed1',
  'Managerial Interview': '#13c2c2',
  Hired: '#faad14',
  Rejected: '#f5222d',
  Blacklisted: '#d9d9d9',
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const navigate = useNavigate();
  const {
    token: { 
      borderRadius, 
      colorBgContainer, 
      colorTextSecondary, 
      colorPrimary, 
      colorBorderSecondary,
      boxShadow,
      colorBgElevated,
      colorText
    },
  } = theme.useToken();

  const handleCardClick = () => {
    navigate(`/candidates/${candidate._id}`);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get background gradient based on status
  const getStatusGradient = (status?: string) => {
    if (!status) return 'linear-gradient(to right, #e0e0e0, #f0f0f0)';
    
    const baseColor = statusIndicatorColors[status] || '#d9d9d9';
    const lighterColor = status === 'Hired' ? '#fff8e6' : 
                         status === 'Rejected' ? '#fff1f0' : 
                         status === 'Shortlisted' ? '#f6ffed' : 
                         status === 'HR Screening' ? '#e6f7ff' : 
                         status === 'Technical Interview' ? '#f9f0ff' : 
                         status === 'Managerial Interview' ? '#e6fffb' : '#f5f5f5';
    
    return `linear-gradient(135deg, ${lighterColor} 0%, ${colorBgContainer} 100%)`;
  };

  return (
    <Card
  hoverable
  onClick={handleCardClick}
  style={{
    width: 320, // Increased width
    margin: 16,
    borderRadius: 16,
    background: colorBgContainer,
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    border: `1px solid ${colorBorderSecondary}`,
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s',
  }}
  bodyStyle={{ padding: 0 }}
>
  {/* Top section with background */}
  <div 
    style={{ 
      background: getStatusGradient(candidate.status),
      padding: '24px 20px 20px',
      position: 'relative',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar 
        size={56}
        style={{ 
          backgroundColor: colorPrimary,
          fontSize: 20,
          marginRight: 16,
        }}
      >
        {getInitials(candidate.name)}
      </Avatar>
      <div style={{ flex: 1 }}>
        <Title level={5} style={{ margin: 0, fontWeight: 600 }}>{candidate.name}</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Candidate ID: {candidate._id.substring(0, 8)}...
        </Text>
      </div>
    </div>

    {/* Status pill BELOW name */}
    {candidate.status && (
      <div 
        style={{
          marginTop: 12,
          display: 'inline-block',
          borderRadius: 14,
          padding: '4px 12px',
          fontSize: 12,
          fontWeight: 600,
          background: statusIndicatorColors[candidate.status] || '#d9d9d9',
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        {candidate.status}
      </div>
    )}
  </div>

  {/* Technology */}
  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colorBorderSecondary}` }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CodeOutlined style={{ color: colorPrimary, marginRight: 8 }} />
      <Text strong style={{ fontSize: 13 }}>Technology</Text>
    </div>
    <Paragraph style={{ marginLeft: 28, marginTop: 6, fontSize: 14 }} ellipsis={{ rows: 1, tooltip: candidate.technology || 'N/A' }}>
      {candidate.technology || 'N/A'}
    </Paragraph>
  </div>

  {/* Bottom section */}
  <div 
    style={{ 
      padding: '14px 20px', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      background: colorBgElevated
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div 
        style={{ 
          width: 8, 
          height: 8, 
          borderRadius: '50%', 
          background: statusIndicatorColors[candidate.status || ''] || '#d9d9d9',
          marginRight: 8
        }} 
      />
      <Text type="secondary" style={{ fontSize: 12 }}>
        {candidate.status ? `${candidate.status} Status` : 'No Status'}
      </Text>
    </div>

    <Tooltip title="View Details">
      <div style={{ color: colorPrimary, fontWeight: 500, fontSize: 13 }}>
        View Details <RightOutlined style={{ marginLeft: 4, fontSize: 12 }} />
      </div>
    </Tooltip>
  </div>
</Card>

  );
};

export default CandidateCard;