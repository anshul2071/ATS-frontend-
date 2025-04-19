import React, { FC, useState } from 'react';
import { Layout, Menu, Button, theme, Tooltip } from 'antd';
import {
  DashboardOutlined,
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/userSlice';

const { Header, Sider, Content, Footer } = Layout;

const LayoutComponent: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.user.email);

  const {
    token: { colorBgContainer, borderRadius, colorTextSecondary, colorPrimary },
  } = theme.useToken();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: colorPrimary }}
        aria-label="Sidebar navigation"
      >
        <div
          style={{
            height: 40,
            margin: '16px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius,
            textAlign: 'center',
            color: '#fff',
            lineHeight: '40px',
            fontWeight: 'bold',
          }}
        >
          ATS
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: colorPrimary }}
          items={[
            { key: '/', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
            { key: '/upload', icon: <UploadOutlined />, label: <Link to="/upload">Upload CV</Link> },
            { key: '/candidates', icon: <UserOutlined />, label: <Link to="/candidates">Candidates</Link> },
            { key: '/schedule', icon: <CalendarOutlined />, label: <Link to="/schedule">Schedule Interview</Link> },
            { key: '/custom-sections', icon: <SettingOutlined />, label: <Link to="/custom-sections">Custom Sections</Link> },
            { key: '/collaboration', icon: <TeamOutlined />, label: <Link to="/collaboration">Collaboration</Link> },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: <span onClick={handleLogout}>Logout</span>,
              danger: true,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          aria-label="Top bar"
        >
          <div style={{ fontWeight: 500 }}>
            Welcome{email ? `, ${email}` : ''}
          </div>

          <Tooltip title="Logout">
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </Button>
          </Tooltip>
        </Header>

        <Content style={{ margin: '24px 16px', padding: '24px', background: colorBgContainer, borderRadius }}>
          {children}
        </Content>

        <Footer style={{ textAlign: 'center', color: colorTextSecondary }}>
          ATS ©{new Date().getFullYear()} Your Company
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
