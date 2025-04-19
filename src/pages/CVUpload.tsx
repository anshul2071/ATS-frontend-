import React from "react";
import {Form, Input, InputNumber, Select, Upload, Button, message, Row, Col, Spin, Card} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../services/axiosInstance";
import axios from "axios";


const CVUpload: React.FC = () => {
    const [form] = Form.useForm();
    const[submitting, setSubmitting] = React.useState(false);

    const onFinish = async (values: any) => {
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phone', values.phone || '');
            formData.append('references', values.references || '');
            formData.append('technology', values.technology);
            formData.append('level', values.level);
            formData.append('salary', values.salary?.toString() || '');
            formData.append('experience' ,values.experience?.toString() || '');
            formData.append('file', values.file.fileoriginFileObj);
            await axiosInstance.post('/candidates', formData, {
                headers: {
                    "Content-Type" : 'multipart/form-data'
                },
            });
            message.success('CV uploaded successfully');
            form.resetFields();
            } catch {
                message.error('CV upload failed');
            }
            finally {
                setSubmitting(false);
            }


        }

        return (
            <Card title = "Upload CV" style = {{maxWidth: 700, margin: 'auto'}}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <Input placeholder="Full Name" />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                <Input placeholder="Email Address" />
                            </Form.Item>
                            <Form.Item name="phone" label = "Phone">
                                <Input placeholder="Phone Number"/>
                            </Form.Item>
                            <Form.Item name = "references" label = "References">
                                 <Input.TextArea rows = {2} placeholder="Reference Emails"/>
                            </Form.Item>

                            </Col>

                        <Col span={12}>
                            <Form.Item name= "technology" label = "Technology" rules={[{required: true}] }>
                                <Select placeholder = "Select..." allowClear>
                                    <Select.Option value = "DotNet">Dot Net</Select.Option>
                                    <Select.Option value = "React Js">React Js</Select.Option>
                                    <Select.Option value = "DevOps">DevOps</Select.Option>
                                    <Select.Option value = "QA">QA</Select.Option>
                                    <Select.Option value = "UI/UX Designer"> UI/UX</Select.Option>
                                </Select>

                            </Form.Item>
                            <Form.Item name="level" label = "Level" rules={[{required: true}]}>
                                <Select placeholder = "Select..." allowClear>
                                    <Select.Option value = "Intern">Intern</Select.Option>
                                    <Select.Option value = "Junior">Junior</Select.Option>
                                    <Select.Option value = "Associate">Associate</Select.Option>
                                    <Select.Option value = "Mid">Mid</Select.Option>
                                    <Select.Option value = "Senior">Senior</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name = "salary" label = "Salary Expectation">
                                <InputNumber style={{width: '100%'}} prefix = "NRS" placeholder="e.g. 10000"/>
                            </Form.Item>

                            <Form.Item name="experience" label = "Experience(yrs)">
                                <InputNumber style={{width: '100%'}} min={0} />
                            </Form.Item>
                            </Col>
                            </Row>
                            <Form.Item 
                                name = "file" 
                                label = "CV File (PDF/DOC/Images  ≤10 MB"
                                valuePropName="file"
                                getValueFromEvent={(e) => e}
                                rules={[{required: true}]}
                                
                                >
                                    <Upload 
                                       maxCount={1}
                                       beforeUpload={(file) => {
                                        const ok = file.size <10*1024*1024;
                                        if(!ok) message.error("File too large");
                                        return ok;
                                       }}>
                                        <Button icon = {<UploadOutlined />}>Select File</Button>
                                       </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading = {submitting}>
                                    Save Candidate
                                </Button>
                            </Form.Item>
                            </Form>
                            </Card>
                                

        )
}
