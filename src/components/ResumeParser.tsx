import React from "react";

import {Card, Tag, List, Typography, Space,Divider} from 'antd';

const {Text, Title} = Typography;


export interface ResumeSummary {
    skills : string[],
    score : number;
    education: string[];

    experience: {
        company: string;
        role: string;
        duration: string;
    }[];
}


const ResumeParser: React.FC<{summary:ResumeSummary}> = ({summary}) => (
    <Card title = "Resume Summary" style={{marginTop: 24}}>
            <Title level={5}>Match Score </Title>
            <Tag color="blue" style={{fontSize: '1.1em'}}>{summary.score}%</Tag>

            <Divider/>

            <Title level={5}>Skills</Title>
            <Space wrap>
                {summary.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                ))}
            </Space>

            <Divider/>

            <Title level={5}>Education</Title>
            <List
                dataSource={summary.education}
                renderItem={(edu) => <List.Item>{edu}</List.Item>}
                size="small"
                />

            <Divider/>

            <Title level={5}>Experience</Title>
            <List 
                dataSource={summary.experience}
                renderItem={(exp) => (
                    <List.Item>
                        <Text strong>{exp.role}</Text> @ {exp.company} <Text type="secondary">{exp.duration}</Text>
                    </List.Item>
                )}
                size="small"
                />

    </Card>

);


export default ResumeParser;