// src/components/LayoutComponent.tsx
"use client"

import React, { useState, useEffect } from "react"
import {
  Layout,
  Menu,
  theme,
  Tooltip,
  Avatar,
  Dropdown,
  Input,
  Breadcrumb,
  Typography,
  Space,
  Button,
  Badge,
  Divider,
  List,
  message,
  Spin,
  Modal,
} from "antd"
import {
  DashboardOutlined,
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { logout as logoutAction } from "../store/userSlice"
import axiosInstance from "../services/axiosInstance"
import { Label } from "recharts"
import {motion} from "framer-motion"
const { Header, Sider, Content, Footer } = Layout
const { Title, Text } = Typography
const { Search } = Input
const { confirm } = Modal

const notificationItems = [
  { id: 1, title: "Interview Reminder", description: "Interview with John Doe for React Developer position in 30 minutes", time: "30 min" },
  { id: 2, title: "Interview Scheduled", description: "New interview scheduled with Sarah Smith for UI/UX Designer position", time: "2 hours" },
  { id: 3, title: "Interview Feedback Required", description: "Please submit feedback for yesterday's DevOps Engineer interview", time: "1 day" },
]
interface Profile {
  name: string
  email: string
}
const LayoutComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  const [loadingProfile, setLoadingProfile] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.user.token)

  const {
    token: { colorBgContainer, colorPrimary, colorTextSecondary, borderRadius },
  } = theme.useToken()

  useEffect(() => {
    axiosInstance
      .get<Profile>('/auth/profile')
      .then(res => {
        setProfile(res.data)
      })
      .catch(() => {
        message.error('Could not load user profile')
      })
      .finally(() => {
        setLoadingProfile(false)
      })
  }, [])

  const handleLogout = () => {
    confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        dispatch(logoutAction())
        localStorage.removeItem("token")
        delete axiosInstance.defaults.headers.common["Authorization"]
        navigate("/login", { replace: true })
      },
    })
  }

  const displayName = profile?.name ?? profile?.email?.split("@")[0] ?? "User"
  const initials = displayName
    .split(" ")
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const dashboardItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
  ]
  const recruitmentItems = [
    { key: "/upload", icon: <UploadOutlined />, label: <Link to="/upload">Upload CV</Link> },
    { key: "/candidates", icon: <TeamOutlined />, label: <Link to="/candidates">Candidates</Link> },
  ]
  const interviewItems = [
    { key: "/schedule", icon: <CalendarOutlined />, label: <Link to="/schedule">Schedule</Link> },
    { key: "/interviews", icon: <FileTextOutlined />, label: <Link to="/interviews">Interviews</Link> },
    { key: "/interview-calendar", icon: <CalendarOutlined/>, label: <Link to="/calendar">Interview Calendar</Link>}
  ]
  const settingsItems = [
    { key: "/custom-sections", icon: <AppstoreOutlined />, label: <Link to="/custom-sections">Sections</Link> },
    { key: "/profile", icon: <UserOutlined />, label: <Link to="/profile">Profile</Link> },
  ]

  const breadcrumbNameMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/upload": "Upload CV",
    "/candidates": "Candidates",
    "/schedule": "Schedule Interview",
    "/interviews": "Interview List",
    "/calendar": "Interview Calendar",
    "/custom-sections": "Custom Sections",
    "/profile": "Profile",

  }
  const pathSnippets = location.pathname.split("/").filter(i => i)
  const extraBreadcrumbItems = pathSnippets.map((_, idx) => {
    const url = `/${pathSnippets.slice(0, idx + 1).join("/")}`
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url] ?? url.replace("/", "")}</Link>
      </Breadcrumb.Item>
    )
  })
  const breadcrumbItems = [
    <Breadcrumb.Item key="home"><Link to="/dashboard">Home</Link></Breadcrumb.Item>,
    ...extraBreadcrumbItems,
  ]
  const currentPageTitle = breadcrumbNameMap[location.pathname] ?? "Dashboard"

  const userMenuItems = [
    {
      key: "header",
      type: "group" as const,
      label: (
        <div style={{ padding: "8px 0" }}>
          <Text strong style={{ fontSize: 16 }}>{displayName}</Text><br />
          <Text type="secondary" style={{ fontSize: 12 }}>{profile?.email}</Text>
        </div>
      ),
    },
    { type: "divider" as const },
    { key: "profile", icon: <UserOutlined />, label: <Link to="/profile">My Profile</Link> },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log Out",
      danger: true,
      onClick: handleLogout,
    },
  ]

  const notificationDropdownContent = (
    <div style={{ width: 360, maxHeight: 400, overflow: "auto" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
        <Text strong>Notifications</Text>
        <Button type="link" size="small">Mark all as read</Button>
      </div>
      <List
        dataSource={notificationItems}
        renderItem={item => (
          <List.Item style={{ padding: "12px 16px", cursor: "pointer" }} onClick={() => setNotificationOpen(false)}>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: colorPrimary }}><ClockCircleOutlined /></Avatar>}
              title={item.title}
              description={item.description}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
          </List.Item>
        )}
      />
      <div style={{ padding: "8px 16px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
        <Button type="link" onClick={() => navigate("/notifications")}>View All</Button>
      </div>
    </div>
  )

  if (!token || loadingProfile) {
    return <div style={{ textAlign: "center", marginTop: 48 }}><Spin size="large" /></div>
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        collapsedWidth={80}
        style={{
          background: `linear-gradient(180deg, #4361ee 0%, #3a0ca3 100%)`,
          position: "fixed", top: 0, bottom: 0, left: 0,
          overflow: "auto", boxShadow: "2px 0 8px rgba(0,0,0,0.15)", zIndex: 1000,
        }}
        trigger={null}
      >
        <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "flex-start",
  marginRight: collapsed ? 0 : 12,
}}>
  <div style={{
    width: collapsed ? 40 : 44,
    height: collapsed ? 40 : 44,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}>
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 50 50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glowing background circle */}
      <motion.circle
        cx="25"
        cy="25"
        r="20"
        fill="url(#logoGradient)"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Outer ring */}
      <motion.circle
        cx="25"
        cy="25"
        r="22"
        fill="none"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* N letter */}
      <motion.path
        d="M18 16L18 34L22 34L22 22L32 34L32 16L28 16L28 28L18 16Z"
        fill="white"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4361ee" />
          <stop offset="100%" stopColor="#3a0ca3" />
        </linearGradient>
      </defs>
    </motion.svg>
    
    {/* Subtle particle effects */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: "absolute",
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "white",
          top: "50%",
          left: "50%",
        }}
        animate={{
          x: [0, (Math.random() - 0.5) * 30],
          y: [0, (Math.random() - 0.5) * 30],
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
  
  {!collapsed && (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Title level={4} style={{ margin: 0, color: "#fff", marginLeft: 12 }}>
        Nexcruit
      </Title>
    </motion.div>
  )}
</div>
        <div style={{ padding: collapsed ? 0 : "0 16px" }}>
          {!collapsed && (
            <div style={{ marginBottom: 24, padding: "0 8px" }}>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500 }}>
                WELCOME, {displayName.split(" ")[0].toUpperCase()}
              </Text>
            </div>
          )}
          <div style={{ marginBottom: 8, padding: collapsed ? 0 : "0 8px" }}>
            {!collapsed && <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>OVERVIEW</Text>}
            <Menu
              theme="dark"
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={[location.pathname]}
              style={{ background: "transparent", border: "none", fontSize: 15 }}
              items={dashboardItems}
            />
          </div>
          <div style={{ marginBottom: 8, padding: collapsed ? 0 : "0 8px" }}>
            {!collapsed && <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>RECRUITMENT</Text>}
            <Menu
              theme="dark"
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={[location.pathname]}
              style={{ background: "transparent", border: "none", fontSize: 15 }}
              items={recruitmentItems}
            />
          </div>
          <div style={{ marginBottom: 8, padding: collapsed ? 0 : "0 8px" }}>
            {!collapsed && <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>INTERVIEWS</Text>}
            <Menu
              theme="dark"
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={[location.pathname]}
              style={{ background: "transparent", border: "none", fontSize: 15 }}
              items={interviewItems}
            />
          </div>
          <div style={{ marginBottom: 8, padding: collapsed ? 0 : "0 8px" }}>  
            {!collapsed && <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>SETTINGS</Text>}
            <Menu
              theme="dark"
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={[location.pathname]}
              style={{ background: "transparent", border: "none", fontSize: 15 }}
              items={settingsItems}
            />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 24, width: "100%", textAlign: "center" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: "100%", color: "#fff", background: "rgba(255,255,255,0.1)", borderRadius: 8, height: 40 }}
          >
            {!collapsed && "Collapse"}
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: "margin-left 0.3s" }}>
        <Header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", background: colorBgContainer,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", height: 64,
          position: "sticky", top: 0, zIndex: 999,
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0, marginRight: 24 }}>{currentPageTitle}</Title>
            <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Search placeholder="Search..." onSearch={val => console.log(val)} style={{ width: 240, marginRight: 16 }} enterButton={<SearchOutlined />} />
            <Tooltip title="Help"><Button type="text" shape="circle" icon={<QuestionCircleOutlined />} style={{ fontSize: 16, marginRight: 16 }} /></Tooltip>
            <Dropdown overlay={notificationDropdownContent} trigger={["click"]} open={notificationOpen} onOpenChange={setNotificationOpen} placement="bottomRight" arrow={{ pointAtCenter: true }}>
              <Badge size="small"><Button type="text" shape="circle" icon={<BellOutlined />} style={{ fontSize: 16, marginRight: 16 }} onClick={() => setNotificationOpen(!notificationOpen)} /></Badge>
            </Dropdown>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar size={40} style={{ backgroundColor: colorPrimary, fontSize: 16, fontWeight: 600 }}>{initials}</Avatar>
                {!collapsed && <Text strong style={{ color: colorTextSecondary }}>{displayName}</Text>}
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content style={{
          margin: "24px 16px", padding: 24, background: colorBgContainer,
          borderRadius, minHeight: `calc(100vh - 112px)`, overflowY: "auto",
        }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center", background: colorBgContainer, padding: 16 }}>
          <Text type="secondary">ATS System © {new Date().getFullYear()} All rights reserved</Text>
        </Footer>
      </Layout>
    </Layout>
  )
}

export default LayoutComponent
