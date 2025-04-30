import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Button,
  Space,
  Spin,
  Tooltip,
  message,
  theme,
} from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import AnalyticsCharts from '../components/AnalyticsCharts'
import { fetchStats, StatsResponse } from '../services/statsService'

const { Title } = Typography

const Dashboard: React.FC = () => {
  const { token } = theme.useToken()
  const {
    colorBgContainer,
    borderRadius,
    colorText,
    colorTextSecondary,
    colorPrimary,
  } = token

  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchStats()
      setStats(data)
    } catch {
      message.error('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  if (loading || !stats) {
    return <Spin style={{ marginTop: 100, width: '100%' }} />
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2}>Dashboard</Title>
        </Col>
        <Col>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={refreshing}
              aria-label="Refresh statistics"
            />
          </Tooltip>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: colorBgContainer, borderRadius }} hoverable>
            <Statistic
              title="Total Candidates"
              value={stats.totalCandidates}
              valueStyle={{ color: colorPrimary }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: colorBgContainer, borderRadius }} hoverable>
            <Statistic
              title="Interviews Today"
              value={stats.interviewsToday}
              valueStyle={{ color: colorText }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: colorBgContainer, borderRadius }} hoverable>
            <Statistic
              title="Offers Pending"
              value={stats.offersPending}
              valueStyle={{ color: colorTextSecondary }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: colorBgContainer, borderRadius }} hoverable>
            <Statistic
              title="Avg Time to Hire"
              value={stats.avgTimeToHire}
              precision={1}
              suffix="days"
            />
          </Card>
        </Col>
      </Row>

      <AnalyticsCharts
        pipeline={stats.pipeline}
        timeToHire={stats.timeToHire}
        byTech={stats.byTech}
      />
    </Space>
  )
}

export default Dashboard
