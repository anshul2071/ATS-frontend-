// components/CustomComment.tsx
import React from 'react';
import { Card, Avatar, Typography } from 'antd';

const { Text } = Typography;

interface CustomCommentProps {
  author: string;
  content: string;
  datetime: string;
}

const Comment: React.FC<CustomCommentProps> = ({ author, content, datetime }) => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <Avatar>{author[0]}</Avatar>
        <div>
          <Text strong>{author}</Text>
          <br />
          <Text>{content}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{datetime}</Text>
        </div>
      </div>
    </Card>
  );
};

export default Comment;
