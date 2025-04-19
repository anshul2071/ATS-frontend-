import React, { useEffect, useState } from 'react';
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
  theme
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { getAnalyticsData, AnalyticsData } from '../services/statsService';

const { Title } = Typography;

interface Stats {
  totalCandidates: number;
  interviewsToday: number;
  offersPending: number;
  avgTimeToHire: number;
}

const Dashboard: React.FC = () => {
  const {
    token: {
      colorBgContainer,
      borderRadius,
      colorText,
      colorTextSecondary,
      colorPrimary
    }
  } = theme.useToken();

  const [stats, setStats] = useState<Stats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pipeline: [],
    timeToHire: [],
    byTech: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulated summary stats - replace with real API if available
      await new Promise((r) => setTimeout(r, 500));
      setStats({
        totalCandidates: 120,
        interviewsToday: 8,
        offersPending: 4,
        avgTimeToHire: 12.3,
      });

      // Fetch detailed analytics
      const data = await getAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Dashboard</Title>
          </Col>
          <Col>
            <Tooltip title="Refresh statistics">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={refreshing}
                aria-label="Refresh statistics"
              >
                Refresh
              </Button>
            </Tooltip>
          </Col>
        </Row>

        {loading || !stats ? (
          <Spin tip="Loading dashboard..." style={{ marginTop: 100 }} />
        ) : (
          <>
            {/* Summary Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  bordered={false}
                  style={{ background: colorBgContainer, borderRadius }}
                  hoverable
                  aria-label="Total Candidates"
                >
                  <Statistic
                    title="Total Candidates"
                    value={stats.totalCandidates}
                    valueStyle={{ color: colorPrimary }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  bordered={false}
                  style={{ background: colorBgContainer, borderRadius }}
                  hoverable
                  aria-label="Interviews Today"
                >
                  <Statistic
                    title="Interviews Today"
                    value={stats.interviewsToday}
                    valueStyle={{ color: colorText }}
                    prefix={<ArrowDownOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  bordered={false}
                  style={{ background: colorBgContainer, borderRadius }}
                  hoverable
                  aria-label="Offers Pending"
                >
                  <Statistic
                    title="Offers Pending"
                    value={stats.offersPending}
                    valueStyle={{ color: colorTextSecondary }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  bordered={false}
                  style={{ background: colorBgContainer, borderRadius }}
                  hoverable
                  aria-label="Average Time to Hire"
                >
                  <Statistic
                    title="Avg Time to Hire (days)"
                    value={stats.avgTimeToHire}
                    precision={1}
                    suffix="days"
                  />
                </Card>
              </Col>
            </Row>

            {/* Charts Section */}
            <AnalyticsCharts
              pipeline={analyticsData.pipeline}
              timeToHire={analyticsData.timeToHire}
              byTech={analyticsData.byTech}
            />
          </>
        )}
      </Space>
    </div>
  );
};

export default Dashboard;
