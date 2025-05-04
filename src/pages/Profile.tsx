// src/pages/Profile.tsx
import React from 'react'
import { Card, Typography } from 'antd'
import { useAppSelector } from '../store/hooks'

const { Title, Text } = Typography

const Profile: React.FC = () => {
  const email = useAppSelector(s => s.user.email)
  const name = useAppSelector(s => s.user.name ?? 'Unknown');

  return (
    <Card style={{ maxWidth: 400, margin: '2rem auto' }}>
      <Title level={3}>Your Profile</Title>
      <Text strong>Name:</Text> <Text>{name}</Text><br/>
      <Text strong>Email:</Text> <Text>{email}</Text>
    </Card>
  )
}

export default Profile
