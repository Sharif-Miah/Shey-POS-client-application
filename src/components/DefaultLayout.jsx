import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import '../resursers/layout.css';
import { Link } from 'react-router';
const { Header, Sider, Content } = Layout;

const DefaultLaout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}>
        <div className='demo-logo-vertical' />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['/home']}
          items={[
            {
              key: '/home',
              icon: <UserOutlined />,
              label: (
                <Link
                  className=''
                  to={'/home'}>
                  Home
                </Link>
              ),
            },
            {
              key: '/bills',
              icon: <VideoCameraOutlined />,
              label: (
                <Link
                  className=''
                  to={'/bills'}>
                  Bills
                </Link>
              ),
            },
            {
              key: '/items',
              icon: <UploadOutlined />,
              label: (
                <Link
                  className=''
                  to={'/items'}>
                  Items
                </Link>
              ),
            },
            {
              key: '/customers',
              icon: <UploadOutlined />,
              label: (
                <Link
                  className=''
                  to={'/customers'}>
                  Customers
                </Link>
              ),
            },
            {
              key: '/logout',
              icon: <UploadOutlined />,
              label: (
                <Link
                  className=''
                  to={'/logout'}>
                  Logout
                </Link>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 10, background: colorBgContainer }}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '10px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default DefaultLaout;
