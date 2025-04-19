import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Typography, Button, message } from "antd";
import axiosInstance from "../services/axiosInstance";
import { useEffect } from "react";


const {Title, Paragraph} = Typography;

const VerifyEmail: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if(!token) {
                message.error('No verification token provided')
                return;
            }
    
            try {
                await axiosInstance.post('/auth/verify', { token });
                message.success('Email verified successfully! You can now login.');
                navigate('/login');
              } catch (err: any) {
                message.error(err.response?.data?.message || 'Verification failed');
              }
        };
        verifyToken();
    }, [token, navigate]);

    return (
        <div style={{maxWidth: 400, margin: '0 auto', padding: 40, textAlign: 'center'}}>
            <Title level={2}>Verifying...</Title>
            <Paragraph>If this page doesn't automatically redirect, <Button onClick={()=> navigate('/login')}>click here</Button> to login.</Paragraph> <Paragraph>{token}</Paragraph>

            </div>

    )

}