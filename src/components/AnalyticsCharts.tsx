import type React from "react"
import { Row, Col, Card, Empty, Typography, Divider, Badge } from "antd"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Area,
  AreaChart,
  Text,
  Label,
} from "recharts"

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

// Enhanced color palette with more vibrant colors
const COLORS = ["#4361ee", "#38b000", "#ff9e00", "#ef233c", "#8338ec", "#ff006e"]

// Custom styles for a more premium look
const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  height: "100%",
  background: "#ffffff",
  border: "none",
}

const cardHeadStyle = {
  borderBottom: "1px solid #f0f0f2",
  padding: "16px 24px",
  background: "#ffffff",
}

const cardBodyStyle = {
  padding: "24px",
  background: "#ffffff",
}

const titleStyle = {
  fontSize: "16px",
  fontWeight: 600,
  margin: 0,
  padding: 0,
  color: "#111827",
}

// Custom label component for pie chart with better visibility
const renderCustomizedPieLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 1.1
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

  return (
    <Text
      x={x}
      y={y}
      fill="#111827"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontSize: "13px",
        fontWeight: 500,
        textShadow: "0px 0px 3px white, 0px 0px 3px white",
      }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </Text>
  )
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ pipeline, timeToHire, byTech }) => {
  // Calculate total candidates safely
  const totalCandidates = pipeline?.length > 0 ? pipeline.reduce((sum, item) => sum + item.value, 0) : 0

  // Get trend direction safely
  const getTrendDirection = () => {
    if (!timeToHire || timeToHire.length < 2) return null
    const trend = timeToHire[timeToHire.length - 1].value > timeToHire[0].value
    return trend ? (
      <Badge color="#ef233c" text={<span style={{ color: "#ef233c", fontWeight: 500 }}>Increasing</span>} />
    ) : (
      <Badge color="#38b000" text={<span style={{ color: "#38b000", fontWeight: 500 }}>Decreasing</span>} />
    )
  }

  // Get current average safely
  const getCurrentAverage = () => {
    if (!timeToHire || timeToHire.length === 0) return null
    const lastValue = timeToHire[timeToHire.length - 1].value
    return lastValue !== null && lastValue !== undefined ? lastValue.toFixed(1) : "N/A"
  }

  // Get top technology safely
  const getTopTechnology = () => {
    if (!byTech || byTech.length === 0) return "None"
    return byTech.reduce((prev, current) => (prev.count > current.count ? prev : current)).technology
  }

  return (
    <Row gutter={[24, 24]}>
      {/* Pipeline Distribution */}
      <Col xs={24} lg={8}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography.Title level={4} style={titleStyle}>
                Pipeline Distribution
              </Typography.Title>
              <Badge
                count={pipeline?.length || 0}
                style={{
                  backgroundColor: "#4361ee",
                  fontSize: "12px",
                  padding: "0 8px",
                  borderRadius: "10px",
                }}
              />
            </div>
          }
          bordered={false}
          style={cardStyle}
          headStyle={cardHeadStyle}
          bodyStyle={cardBodyStyle}
        >
          {pipeline && pipeline.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={pipeline}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    labelLine={false}
                    label={renderCustomizedPieLabel}
                  >
                    {pipeline.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    formatter={(value: number, name: string) => [
                      <span key="value" style={{ fontWeight: 600, fontSize: "14px" }}>
                        {value}
                      </span>,
                      <span key="name" style={{ color: "#111827", fontSize: "14px" }}>
                        {name}
                      </span>,
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "10px 14px",
                      backgroundColor: "white",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => (
                      <span style={{ color: "#111827", fontSize: "13px", fontWeight: 500 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              <Divider style={{ margin: "8px 0 16px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography.Text style={{ color: "#4b5563", fontSize: "14px", fontWeight: 500 }}>
                  Total Candidates
                </Typography.Text>
                <Typography.Text style={{ fontSize: "18px", fontWeight: 600, color: "#4361ee" }}>
                  {totalCandidates}
                </Typography.Text>
              </div>
            </>
          ) : (
            <Empty
              description={<span style={{ color: "#4b5563", fontWeight: 500 }}>No pipeline data</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: "40px 0" }}
            />
          )}
        </Card>
      </Col>

      {/* Avg Time to Hire */}
      <Col xs={24} lg={8}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography.Title level={4} style={titleStyle}>
                Avg Time to Hire (Days)
              </Typography.Title>
              {timeToHire && timeToHire.length > 1 ? getTrendDirection() : null}
            </div>
          }
          bordered={false}
          style={cardStyle}
          headStyle={cardHeadStyle}
          bodyStyle={cardBodyStyle}
        >
          {timeToHire && timeToHire.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeToHire} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                  <defs>
                    <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(str) => {
                      const d = new Date(str)
                      return `${d.getMonth() + 1}/${d.getDate()}`
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12, fill: "#111827" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  >
                    <Label
                      value="Date"
                      position="insideBottom"
                      offset={-15}
                      style={{ textAnchor: "middle", fill: "#4b5563", fontSize: 12, fontWeight: 500 }}
                    />
                  </XAxis>
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#111827" }}
                    width={40}
                  >
                    <Label
                      value="Days"
                      position="insideLeft"
                      angle={-90}
                      style={{ textAnchor: "middle", fill: "#4b5563", fontSize: 12, fontWeight: 500 }}
                    />
                  </YAxis>
                  <ChartTooltip
                    labelFormatter={(label) => (
                      <span style={{ color: "#111827", fontWeight: 600, fontSize: "14px" }}>Date: {label}</span>
                    )}
                    formatter={(val: number) => [
                      <span key="value" style={{ fontWeight: 600, fontSize: "14px" }}>
                        {val.toFixed(1)} days
                      </span>,
                      <span key="label" style={{ color: "#4b5563", fontSize: "14px" }}>
                        Average
                      </span>,
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "10px 14px",
                      backgroundColor: "white",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS[2]}
                    strokeWidth={3}
                    fill="url(#timeGradient)"
                    dot={{ r: 4, fill: COLORS[2], stroke: "white", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: COLORS[2], stroke: "white", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <Divider style={{ margin: "8px 0 16px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography.Text style={{ color: "#4b5563", fontSize: "14px", fontWeight: 500 }}>
                  Current Average
                </Typography.Text>
                <Typography.Text style={{ fontSize: "18px", fontWeight: 600, color: "#ff9e00" }}>
                  {getCurrentAverage()} days
                </Typography.Text>
              </div>
            </>
          ) : (
            <Empty
              description={<span style={{ color: "#4b5563", fontWeight: 500 }}>No hiring data</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: "40px 0" }}
            />
          )}
        </Card>
      </Col>

      {/* Bar Chart */}
      <Col xs={24} lg={8}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography.Title level={4} style={titleStyle}>
                Candidates by Technology
              </Typography.Title>
              <Badge
                count={byTech?.length || 0}
                style={{
                  backgroundColor: "#8338ec",
                  fontSize: "12px",
                  padding: "0 8px",
                  borderRadius: "10px",
                }}
              />
            </div>
          }
          bordered={false}
          style={cardStyle}
          headStyle={cardHeadStyle}
          bodyStyle={cardBodyStyle}
        >
          {byTech && byTech.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byTech} margin={{ top: 20, right: 20, bottom: 40, left: 20 }} barCategoryGap="30%">
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS[4]} stopOpacity={1} />
                      <stop offset="100%" stopColor={COLORS[4]} stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis
                    dataKey="technology"
                    angle={-30}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12, fill: "#111827" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                    interval={0}
                  >
                    <Label
                      value="Technology"
                      position="insideBottom"
                      offset={-15}
                      style={{ textAnchor: "middle", fill: "#4b5563", fontSize: 12, fontWeight: 500 }}
                    />
                  </XAxis>
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#111827" }}
                    width={40}
                  >
                    <Label
                      value="Count"
                      position="insideLeft"
                      angle={-90}
                      style={{ textAnchor: "middle", fill: "#4b5563", fontSize: 12, fontWeight: 500 }}
                    />
                  </YAxis>
                  <ChartTooltip
                    formatter={(v: number, name: string, props: any) => [
                      <span key="value" style={{ fontWeight: 600, fontSize: "14px" }}>
                        {v}
                      </span>,
                      <span key="candidates" style={{ color: "#4b5563", fontSize: "14px" }}>
                        Candidates
                      </span>,
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "10px 14px",
                      backgroundColor: "white",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: "top",
                      fill: "#111827",
                      fontSize: 12,
                      fontWeight: 500,
                      formatter: (value: number) => value,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>

              <Divider style={{ margin: "8px 0 16px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography.Text style={{ color: "#4b5563", fontSize: "14px", fontWeight: 500 }}>
                  Top Technology
                </Typography.Text>
                <Typography.Text style={{ fontSize: "18px", fontWeight: 600, color: "#8338ec" }}>
                  {getTopTechnology()}
                </Typography.Text>
              </div>
            </>
          ) : (
            <Empty
              description={<span style={{ color: "#4b5563", fontWeight: 500 }}>No technology data</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: "40px 0" }}
            />
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default AnalyticsCharts
