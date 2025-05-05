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
  Card,
  Typography,
  Divider,
  Space
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CodeOutlined,
  TrophyOutlined,
  DollarOutlined,
  HistoryOutlined,
  FilePdfOutlined,
  SaveOutlined
} from "@ant-design/icons";
import axiosInstance from "../services/axiosInstance";

const { Title, Text } = Typography;
const { Option } = Select;

// Custom styles
const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  margin: "auto",
  maxWidth: 800,
  border: "none",
  overflow: "hidden"
};

const cardHeadStyle = {
  background: "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
  borderBottom: "none",
  padding: "20px 24px",
};

const cardBodyStyle = {
  padding: "32px",
};

const inputStyle = {
  borderRadius: "8px",
  padding: "10px 12px",
  height: "auto",
  boxShadow: "none",
  border: "1px solid #e2e8f0"
};

const selectStyle = {
  borderRadius: "8px",
  height: "auto",
};

const buttonStyle = {
  height: "46px",
  borderRadius: "8px",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(67, 97, 238, 0.2)",
  background: "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
  border: "none",
};

const CVUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);
  const [fileList, setFileList] = React.useState<any[]>([]);

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
      setFileList([]);
    } catch (error: any) {
      console.error("CV upload error:", error);
      message.error(error.response?.data?.message || "CV upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (info: any) => {
    let fileList = [...info.fileList];
    // Limit to the most recent upload
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };

  return (
    <Card 
      title={
        <Title level={4} style={{ color: "white", margin: 0 }}>
          <Space>
            <UserOutlined /> Add New Candidate
          </Space>
        </Title>
      } 
      style={cardStyle}
      headStyle={cardHeadStyle}
      bodyStyle={cardBodyStyle}
    >
      <Text type="secondary" style={{ display: "block", marginBottom: "24px" }}>
        Fill in the candidate details and upload their CV to add them to the recruitment pipeline.
      </Text>
      
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        requiredMark="optional"
        size="large"
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginTop: 0, marginBottom: "16px" }}>Personal Information</Title>
            
            <Form.Item
              name="name"
              label={<Text strong>Full Name</Text>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input 
                placeholder="Enter candidate's full name" 
                prefix={<UserOutlined style={{ color: "#a0aec0" }} />}
                style={inputStyle}
              />
            </Form.Item>
            
            <Form.Item
              name="email"
              label={<Text strong>Email Address</Text>}
              rules={[
                { required: true, type: "email", message: "Valid email is required" }
              ]}
            >
              <Input 
                placeholder="Enter email address" 
                prefix={<MailOutlined style={{ color: "#a0aec0" }} />}
                style={inputStyle}
              />
            </Form.Item>
            
            <Form.Item 
              name="phone" 
              label={<Text strong>Phone Number</Text>}
            >
              <Input 
                placeholder="Enter phone number" 
                prefix={<PhoneOutlined style={{ color: "#a0aec0" }} />}
                style={inputStyle}
              />
            </Form.Item>
            
            <Form.Item 
              name="references" 
              label={<Text strong>References</Text>}
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Enter reference emails or contact information" 
                style={{ ...inputStyle, resize: "none" }}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginTop: 0, marginBottom: "16px" }}>Professional Details</Title>
            
            <Form.Item
              name="technology"
              label={<Text strong>Technology</Text>}
              rules={[{ required: true, message: "Select a technology" }]}
            >
              <Select 
                placeholder="Select technology" 
                allowClear
                suffixIcon={<CodeOutlined style={{ color: "#a0aec0" }} />}
                style={selectStyle}
                dropdownStyle={{ borderRadius: "8px" }}
              >
                <Option value="DotNet">Dot Net</Option>
                <Option value="React Js">React Js</Option>
                <Option value="DevOps">DevOps</Option>
                <Option value="QA">QA</Option>
                <Option value="Java">Java</Option>
                <Option value="Python">Python</Option>
                <Option value="UI/UX Designer">UI/UX Designer</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="level"
              label={<Text strong>Experience Level</Text>}
              rules={[{ required: true, message: "Select a level" }]}
            >
              <Select 
                placeholder="Select experience level" 
                allowClear
                suffixIcon={<TrophyOutlined style={{ color: "#a0aec0" }} />}
                style={selectStyle}
                dropdownStyle={{ borderRadius: "8px" }}
              >
                <Option value="Intern">Intern</Option>
                <Option value="Junior">Junior</Option>
                <Option value="Associate">Associate</Option>
                <Option value="Mid">Mid</Option>
                <Option value="Senior">Senior</Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="salary" 
              label={<Text strong>Salary Expectation</Text>}
            >
              <InputNumber 
                style={{ width: "100%", ...inputStyle }} 
                placeholder="e.g. 10000" 
                prefix={<DollarOutlined style={{ color: "#a0aec0" }} />}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            
            <Form.Item 
              name="experience" 
              label={<Text strong>Experience (years)</Text>}
            >
              <InputNumber 
                style={{ width: "100%", ...inputStyle }} 
                min={0} 
                placeholder="Years of experience"
                prefix={<HistoryOutlined style={{ color: "#a0aec0" }} />}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Divider style={{ margin: "24px 0" }} />
        
        <Form.Item
          name="file"
          label={<Text strong>CV File (PDF/DOC/Images ≤10 MB)</Text>}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please select a file!" }]}
          style={{ marginBottom: "32px" }}
        >
          <Upload 
            maxCount={1} 
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
            listType="picture"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          >
            <Button 
              icon={<UploadOutlined />} 
              style={{ 
                borderRadius: "8px", 
                height: "46px",
                borderColor: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "center"
              }}
            >
              <Space>
                <FilePdfOutlined />
                Click to Upload CV
              </Space>
            </Button>
          </Upload>
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
            icon={<SaveOutlined />}
            style={buttonStyle}
          >
            Save Candidate
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CVUpload;
