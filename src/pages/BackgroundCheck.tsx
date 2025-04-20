import React from "react";
import {Card, Form, Input,Button, message} from "antd";
import axiosInstance from "../services/axiosInstance";


const BackgroundCheck: React.FC = () => {
    
    const[form] = Form.useForm();
    const [sending, setSending] = React.useState(false);

    const onFinish = async(values: any) => {
        setSending(true);
        try {
            await axiosInstance.post('/background', values);
            message.success('Background check submitted successfully');
            form.resetFields();
        }
            catch(error:any) {
                message.error('Background check submission failed');
            }
            finally {
                setSending(false);
            }
        };

        return (
            <Card title = "Background Check" style={{ width: 600, margin: 'auto' }}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item 
                        name = "refEmail"
                        label = "Reference Email"
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Input placeholder="Enter reference email" />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type="primary"
                            htmlType="submit"
                            block loading={sending}
                            >Send Check Email</Button>

                    </Form.Item>
                </Form>
            </Card>
        );

};


export default BackgroundCheck;