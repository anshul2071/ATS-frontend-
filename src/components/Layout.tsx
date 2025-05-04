"use client"

import type React from "react"
import { useState } from "react"
import {
  Layout,
  Modal,
  Menu,
  Button,
  theme,
  Tooltip,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Divider,
} from "antd"
import {
  DashboardOutlined,
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { logout } from "../store/userSlice"

const { Header, Sider, Content, Footer } = Layout
const { Text, Title } = Typography

const LayoutComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const email = useAppSelector((state) => state.user.email)

  const {
    token: { colorBgContainer, borderRadius, colorTextSecondary, colorPrimary },
  } = theme.useToken()

  const getUserInitials = () => {
    if (!email) return "U"
    return email.split("@")[0].split(".").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
  }

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        dispatch(logout())
        navigate("/login")
      },
    })
  }

  const getCurrentPageTitle = () => {
    switch (location.pathname) {
      case "/upload": return "Upload CV"
      case "/candidates": return "Candidates"
      case "/schedule": return "Schedule Interview"
      case "/interviews": return "Interview List"
      case "/custom-sections": return "Custom Sections"
      case "/collaboration": return "Collaboration"
      default: return "Dashboard"
    }
  }

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: "/upload", icon: <UploadOutlined />, label: <Link to="/upload">Upload CV</Link> },
    { key: "/candidates", icon: <UserOutlined />, label: <Link to="/candidates">Candidates</Link> },
    { key: "/schedule", icon: <CalendarOutlined />, label: <Link to="/schedule">Schedule</Link> },
    { key: "/interviews", icon: <CalendarOutlined />, label: <Link to="/interviews">Interviews</Link> },
    { key: "/custom-sections", icon: <SettingOutlined />, label: <Link to="/custom-sections">Custom</Link> },
    { key: "/collaboration", icon: <TeamOutlined />, label: <Link to="/collaboration">Collaboration</Link> },
  ]

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        style={{
          background: colorPrimary,
          position: "fixed",
          left: 0,
          height: "100vh",
          overflow: "auto",
          boxShadow: "2px 0 6px rgba(0,0,0,0.08)",
          zIndex: 1000,
        }}
      >
        <div style={{
          height: 64,
          margin: "16px",
          textAlign: "center",
          fontSize: 24,
          fontWeight: 600,
          color: "#fff",
        }}>
          {collapsed ? "ATS" : "ATS System"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: "transparent" }}
          items={menuItems}
        />

        <div style={{ padding: 16, position: "absolute", bottom: 0, width: "100%" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: "#fff",
              width: "100%",
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
            }}
          />
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: "all 0.3s ease" }}>
        <Header
          style={{
            height: 64,
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>{getCurrentPageTitle()}</Title>

          <Space size="middle">
            <Tooltip title="Search">
              <Button shape="circle" icon={<SearchOutlined />} />
            </Tooltip>
            <Tooltip title="Notifications">
              <Button shape="circle" icon={<BellOutlined />} />
            </Tooltip>
            <Divider type="vertical" style={{ height: 24 }} />
            <Dropdown
              menu={{
                items: [
                  { key: "profile", icon: <UserOutlined />, label: "Profile" },
                  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
                  { type: "divider" },
                  { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true, onClick: handleLogout },
                ]
              }}
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar style={{ backgroundColor: colorPrimary }}>{getUserInitials()}</Avatar>
                {!collapsed && <Text>{email}</Text>}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius,
            minHeight: "calc(100vh - 64px - 70px)",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            color: colorTextSecondary,
            background: colorBgContainer,
            padding: 16,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Text type="secondary">ATS System © {new Date().getFullYear()} All rights reserved.</Text>
        </Footer>
      </Layout>
    </Layout>
  )
}

export default LayoutComponent
