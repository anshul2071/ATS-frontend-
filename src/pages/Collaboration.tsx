import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Select,
  Input,
  List,
  message,
  Spin,
  
  Typography,
} from 'antd';

import Comment from '../pages/Comment';

import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const { Text } = Typography;

interface CommentItem {
  _id: string;
  user: string;
  content: string;
  datetime: string;
}

const Collaboration: React.FC = () => {
  const { id: candidateId } = useParams<{ id: string }>();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [posting, setPosting] = useState(false);

  const [formShare] = Form.useForm<{ users: string[] }>();
  const [formComment] = Form.useForm<{ comment: string }>();

  useEffect(() => {
    const fetchComments = async() => {
        if(!candidateId) return;
        setLoadingComments(true);
        try {
            const res = await axiosInstance.get<CommentItem[]>(`/candidates/${candidateId}/comments`);
            setComments(res.data);
        }
        catch(err: any) {
            console.error(err);
            message.error('Failed to load comments');
        }
        finally {
     setLoadingComments(false);
        }
    };
    fetchComments();
  }, [candidateId]);

  const handleShare = async(values: { users: string[] }) => {
    if(!candidateId) return;
    setSharing(true);
    try {
        await axiosInstance.post(`/candidates/${candidateId}/share`, {user: values.users});
        message.success('Candidates shared successfully');
        formShare.resetFields();
        setModalOpen(false);
    }
    catch(err: any) {
        console.error(err);
        message.error(
            err.response?.data?.message || 'Failed to share candidates'
        )
    }
    finally {
        setSharing(false);
    }

  };
  
  
  const handlePostComment = async(values: { comment: string }) => {
    if(!candidateId) return;
    setPosting(true)
    try {
        const res = await axiosInstance.post(`/candidates/${candidateId}/comment`, {comment: values.comment});
        setComments([...comments, res.data]);
        message.success('Comment posted successfully');
        formComment.resetFields();

    }
    catch(err: any) {
        console.error(err);
        message.error(
            err.response?.data?.message || 'Failed to post comment'
        )
    }
    finally {
        setPosting(false);
    }

  };

  return (
    <>
      <Card 
        title = "Collaboration &  Feedback"
        style={{ width: 600, margin: 'auto' }}
      >
        <Button type="primary" onClick={() => setModalOpen(true)}>
            Share Candidate
        </Button>
         
         <div style={{ marginTop: 24}}>
            <Text strong>Feedback</Text>
            {loadingComments ? (
                <Spin tip = "Loading comments...."style={{ marginTop: 16 }} />
            ) : (
                <List
                   dataSource={comments}
                   renderItem={(comment) => (
                       <Comment
                           author={comment.user}
                           content={comment.content}
                           datetime={comment.datetime}
                       />
                   )}
                   />

            )}

         </div>

              <Form 
                form={formComment}
                onFinish={handlePostComment}
                style={{ marginTop: 24 }}
              >
                  <Form.Item
                      name = "comment"
                      rules={[{
                          required: true,
                          message: 'Please enter a comment'
                      }]}
                  >
                      <Input.TextArea rows={3} placeholder='Add Feedback...'/>
                  </Form.Item>
                  <Form.Item>
                      <Button 
                          type="primary"
                          htmlType="submit"
                          loading={posting}
                          block
                      >
                          Post Comment
                      </Button>
                  </Form.Item>
              </Form>

      </Card>

      <Modal
        title = "Share Candidate"
        open = {modalOpen}
        onCancel={() => setModalOpen(false)}
        footer = {null}
        destroyOnClose
      >
        <Form form={formShare} onFinish = {handleShare} layout='vertical'>
            <Form.Item
                 name={'users'}
                 label ='Select User'
                 rules={[{
                     required: true,
                     message: 'Please select a user'
                 }]}
            >
                <Select
                  mode='multiple'
                  placeholder = "Select users to share with"
                  loading = {sharing}
                >
                    <Select.Option value = "admin">Admin</Select.Option> 
                    <Select.Option value = "recruiter">Recruiter</Select.Option>
                    <Select.Option value = "hr">HR</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    type = "primary"
                    htmlType = "submit"
                    loading = {sharing}
                    block
                >
                    Share
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Collaboration;