import React from "react";
import {Card, Form, InputNumber, Select, DatePicker, Button, message} from "antd";
import axiosInstance  from "../services/axiosInstance";
import axios from "axios";


const InterviewSchedule: React.FC = () => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);

    const onFinish =async(values: any) => {
        setSubmitting(true);
        try {
            await axiosInstance.post('/interviews', values);
            message.success('Interview scheduled successfully');
            form.resetFields();
        }
            catch(error:any) {
                message.error('Interview scheduling failed');

            }

            finally {
                setSubmitting(false);
            }
        };

        return (

            <Card title = "Schedule Interview" style={{ width: 600, margin: 'auto' }}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item 
                        name={"candidateId"}
                        label = "Candidate ID"
                        rules={[{
                            required: true,
                            message: 'Candidate ID is required'
                        }]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                             name="round"
                             label = "Round"
                             rules={[{
                                required: true,

                             }]}
                             >
                             <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item 
                             name="interviewer"
                             label = "Interviewer"
                             rules={[{
                                required: true,

                             }]}
                             >
                                <Select placeholder = "Select Interviewer">
                                    <Select.Option value = "HR">HR</Select.Option>
                                    <Select.Option value = "Tech">Tech</Select.Option>
                                </Select>

                        </Form.Item>

                        <Form.Item 
                          name = "date"
                          label = "Date & Time"
                          rules={[{
                              required: true,
                          }]}
                          >
                            <DatePicker showTime style = {{width: '100%'}} />
                          </Form.Item>
                          <Form.Item >
                          <Button 
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                                style={{ width: '100%' }}
                            >
                                Schedule Interview
                            </Button>
                          </Form.Item>
                           </Form>
            </Card>
        );
    };

    export default InterviewSchedule;
