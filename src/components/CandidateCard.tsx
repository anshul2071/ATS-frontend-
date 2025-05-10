"use client"

import type React from "react"
import {
  Card,
  Avatar,
  Tag,
  Typography,
  Button,
  Tooltip,
  Divider,
} from "antd"
import {
  MailOutlined,
  PhoneOutlined,
  EyeOutlined,
  DeleteOutlined,
  LaptopOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import styled from "styled-components"

const { Text } = Typography

export interface Candidate {
  _id: string
  name: string
  technology?: string
  status?: string
  email?: string
  phone?: string
  level?: string
}

interface CandidateCardProps {
  candidate: Candidate
  onClick: (id: string) => void
  onDelete: (id: string, e: React.MouseEvent) => void
}

// Styled components for improved UI
const StyledCard = styled(Card)`
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(to bottom right, #f9fcff, #e6f0ff);
  border: 1px solid #dfeaff;
  box-shadow: 0 10px 30px rgba(74, 144, 226, 0.15);
  transition: all 0.3s ease-in-out;

  .ant-card-body {
    padding: 0;
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: white;
  border-radius: 20px;
`

const AvatarContainer = styled.div`
  margin-bottom: 16px;
`

const NameText = styled(Text)`
  font-size: 26px;
  font-weight: 600;
  color: #0a2540;
  margin-bottom: 8px;
  text-align: center;
`

const StatusTag = styled(Tag)<{ color?: string }>`
  background-color: ${(props) => props.color || "#4a90e2"};
  color: white;
  font-size: 14px;
  border-radius: 16px;
  padding: 4px 18px;
  margin-bottom: 20px;
`

const ContactInfo = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: #444;

  .anticon {
    color: #4a90e2;
    font-size: 18px;
  }
`

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`

const TechTag = styled(Tag)`
  background-color: #e8f2ff;
  color: #2a70c2;
  border-radius: 14px;
  font-size: 14px;
  padding: 4px 12px;
  border: none;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #f5faff;
  border-top: 1px solid #e3f0ff;
`

const FooterButton = styled(Button)`
  border: none;
  color: #4a90e2;
  background: transparent;
  font-size: 16px;

  &:hover {
    color: #2a70c2;
    background: rgba(74, 144, 226, 0.05);
  }
`

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onClick, onDelete }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(candidate._id, e)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard hoverable onClick={() => onClick(candidate._id)}>
        <CardContent>
          <AvatarContainer>
            <Avatar
              size={96}
              style={{
                backgroundColor: "#4a90e2",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              {getInitials(candidate.name)}
            </Avatar>
          </AvatarContainer>

          <NameText>{candidate.name}</NameText>

          <StatusTag color="#4a90e2">{candidate.status || "New"}</StatusTag>

          <ContactInfo>
            {candidate.email && (
              <ContactItem>
                <MailOutlined />
                <span>{candidate.email}</span>
              </ContactItem>
            )}
            {candidate.phone && (
              <ContactItem>
                <PhoneOutlined />
                <span>{candidate.phone}</span>
              </ContactItem>
            )}
          </ContactInfo>

          <TagsContainer>
            {candidate.technology && (
              <Tooltip title="Technology">
                <TechTag icon={<LaptopOutlined />}>{candidate.technology}</TechTag>
              </Tooltip>
            )}
            {candidate.level && (
              <Tooltip title="Level">
                <TechTag>{candidate.level}</TechTag>
              </Tooltip>
            )}
          </TagsContainer>
        </CardContent>

        <Divider style={{ margin: 0 }} />

        <CardFooter>
          <FooterButton
            type="text"
            icon={<EyeOutlined style={{ fontSize: 18 }} />}
            onClick={() => onClick(candidate._id)}
          />
          <FooterButton
            type="text"
            icon={<DeleteOutlined style={{ fontSize: 18 }} />}
            onClick={handleDelete}
          />
        </CardFooter>
      </StyledCard>
    </motion.div>
  )
}

export default CandidateCard