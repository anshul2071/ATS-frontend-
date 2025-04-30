// src/components/AnalyticsCharts.tsx
import React from 'react'
import { Row, Col, Card, Empty, Typography } from 'antd'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as ChartTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'

export interface PipeLineDataItem {
  name: string
  value: number
  color?: string
}

export interface TimeToHireDataItem {
  date: string
  value: number
}

export interface TechDistributionDataItem {
  technology: string
  count: number
}

interface AnalyticsChartsProps {
  pipeline: PipeLineDataItem[]
  timeToHire: TimeToHireDataItem[]
  byTech: TechDistributionDataItem[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF73FA']

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  pipeline,
  timeToHire,
  byTech,
}) => (
  <Row gutter={[16, 16]}>
    {/* Pipeline Pie */}
    <Col xs={24} lg={8}>
      <Card title={<Typography.Title level={4}>Pipeline Distribution</Typography.Title>} bordered={false}>
        {pipeline.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pipeline}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
              >
                {pipeline.map((entry, i) => (
                  <Cell key={entry.name} fill={entry.color || COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip formatter={(value: number, name: string) => [value, name]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Empty description="No pipeline data" />
        )}
      </Card>
    </Col>

    {/* Avg Time to Hire */}
    <Col xs={24} lg={8}>
      <Card title={<Typography.Title level={4}>Avg Time to Hire (Days)</Typography.Title>} bordered={false}>
        {timeToHire.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={timeToHire}
              margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
            >
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={str => {
                  const d = new Date(str)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <ChartTooltip
                labelFormatter={label => `Date: ${label}`}
                formatter={(val: number) => [`${val.toFixed(1)} days`, 'Avg']}
              />
              {/* use type="basis" for a smooth spline; you can also try "monotone" */}
              <Line
                type="basis"
                dataKey="value"
                stroke={COLORS[2]}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty description="No hiring data" />
        )}
      </Card>
    </Col>

    {/* Bar Chart */}
    <Col xs={24} lg={8}>
      <Card title={<Typography.Title level={4}>Candidates by Technology</Typography.Title>} bordered={false}>
        {byTech.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={byTech}
              margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
            >
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis dataKey="technology" angle={-30} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <ChartTooltip formatter={(v: number) => [v, 'Count']} />
              <Bar dataKey="count" fill={COLORS[4]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty description="No technology data" />
        )}
      </Card>
    </Col>
  </Row>
)

export default AnalyticsCharts
