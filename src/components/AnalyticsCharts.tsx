import React from "react";
import { Card, Row, Col } from "antd";
import {PieChart, Pie, Cell, ResponsiveContainer, Legend,LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Tooltip as ReTooltip, Bar} from 'recharts';
import { PipeLineDataItem, TimeToHireDataItem, TechDistributionDataItem } from "../services/statsServide";

interface AnalyticsChartsProps {
    pipeline: PipeLineDataItem[];
    timeToHire: TimeToHireDataItem[];
    byTech: TechDistributionDataItem[];
}

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF73FA'];


const AnalyticsCharts : React.FC<AnalyticsChartsProps> = ({pipeline, timeToHire, byTech}) => (
    <Row gutter = {[16, 16]}>
        <Col xs = {24} lg= {8}>
        <Card title = "Pipeline">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pipeline}
                        dataKey='value'
                        nameKey='name'
                        cx='50%'
                        cy='50%'
                        outerRadius={80}
                        label
                        >
                        {pipeline.map((entry, index) => (
                            <Cell 
                               key={`cell-${index}`}
                               fill= {
                                entry.color || 
                                DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                               }
                               />
                        ))}
                        </Pie>
                        <ReTooltip />
                        <Legend layout = "horizontal" verticalAlign="bottom" />
                </PieChart>
            </ResponsiveContainer>
        </Card>
        
        </Col>

        <Col xs = {24} lg= {8}>
        <Card title = "Average Time to Hire(Days)">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeToHire} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid stroke= "f5f5f5" />
                    <ReTooltip/>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" dot/>
                </LineChart>
            </ResponsiveContainer>
        </Card>
        </Col>

        <Col xs={24} lg={8}>
        <Card title = "Candidates by Technology">
            <ResponsiveContainer width={"100%"} height={300}>
                <BarChart data={byTech} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="technology"/>
                    <YAxis/>
                    <CartesianGrid stroke = "f5f5f5" />
                    <ReTooltip/>
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>


        </Card>
        
        </Col>

    </Row>
    
);

export default AnalyticsCharts;