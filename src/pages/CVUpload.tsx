import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
  Card
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../services/axiosInstance";

const CVUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  // This function normalizes the upload file input so that we always return an array.
  const normFile = (e: any) => {
    if (!e) return [];
    // If e is already an array, return it directly
    return Array.isArray(e) ? e : (e.fileList ? e.fileList : []);
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      // Create FormData instance for multipart/form-data submission.
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone || "");
      formData.append("references", values.references || "");
      formData.append("technology", values.technology);
      formData.append("level", values.level);
      formData.append("salary", values.salary ? values.salary.toString() : "");
      formData.append("experience", values.experience ? values.experience.toString() : "");

      // Extract the uploaded file object – make sure fileList is valid.
      const fileArray = values.file;
      if (!fileArray || !Array.isArray(fileArray) || !fileArray.length) {
        message.error("No file selected. Please choose a file to upload.");
        setSubmitting(false);
        return;
      }
      const fileObj = fileArray[0]?.originFileObj;
      if (!fileObj) {
        message.error("File data is missing. Please try again.");
        setSubmitting(false);
        return;
      }
      formData.append("file", fileObj);

      // Post the FormData to your backend candidate endpoint.
      await axiosInstance.post("/candidates", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      message.success("CV uploaded successfully");
      form.resetFields();
    } catch (error: any) {
      console.error("CV upload error:", error);
      message.error(error.response?.data?.message || "CV upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Upload CV" style={{ maxWidth: 700, margin: "auto" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        // Enable autoComplete off for security (optional)
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, type: "email", message: "Valid email is required" }
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="Phone Number" />
            </Form.Item>
            <Form.Item name="references" label="References">
              <Input.TextArea rows={2} placeholder="Reference Emails" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="technology"
              label="Technology"
              rules={[{ required: true, message: "Select a Technology" }]}
            >
              <Select placeholder="Select..." allowClear>
                <Select.Option value="DotNet">Dot Net</Select.Option>
                <Select.Option value="React Js">React Js</Select.Option>
                <Select.Option value="DevOps">DevOps</Select.Option>
                <Select.Option value="QA">QA</Select.Option>
                <Select.Option value="Java">Java</Select.Option>
                <Select.Option value="Python">Python</Select.Option>
                <Select.Option value="UI/UX Designer">UI/UX Designer</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="level"
              label="Level"
              rules={[{ required: true, message: "Select a Level" }]}
            >
              <Select placeholder="Select..." allowClear>
                <Select.Option value="Intern">Intern</Select.Option>
                <Select.Option value="Junior">Junior</Select.Option>
                <Select.Option value="Associate">Associate</Select.Option>
                <Select.Option value="Mid">Mid</Select.Option>
                <Select.Option value="Senior">Senior</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="salary" label="Salary Expectation">
              <InputNumber style={{ width: "100%" }} placeholder="e.g. 10000" />
            </Form.Item>
            <Form.Item name="experience" label="Experience (yrs)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="file"
          label="CV File (PDF/DOC/Images ≤10 MB)"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please select a file!" }]}
        >
          <Upload maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
          >
            Save Candidate
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CVUpload;