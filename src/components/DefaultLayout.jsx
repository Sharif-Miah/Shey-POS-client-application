import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  UserOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import '../resursers/layout.css';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
const { Header, Sider, Content } = Layout;
import { PuffLoader } from 'react-spinners';

const DefaultLaout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      {loading && (
        <div className='spiner'>
          <PuffLoader color='#21e5df' />
        </div>
      )}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}>
        <div className='demo-logo-vertical'>
          {' '}
          <h3>{collapsed ? 'FP' : 'FreshPOS'}</h3>{' '}
        </div>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={window.location.pathname}
          items={[
            {
              key: '/home',
              icon: <HomeOutlined />,
              label: (
                <Link
                  className=''
                  to={'/home'}>
                  Home
                </Link>
              ),
            },
            {
              key: '/cart',
              icon: <ShoppingCartOutlined />,
              label: (
                <Link
                  className=''
                  to={'/cart'}>
                  Cart
                </Link>
              ),
            },
            {
              key: '/bills',
              icon: <CopyOutlined />,
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
              icon: <UnorderedListOutlined />,
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
              icon: <UserOutlined />,
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
              icon: <LoginOutlined />,
              label: (
                <Link
                  onClick={() => {
                    localStorage.removeItem('pos-user');
                  }}
                  to={'/login'}>
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
          <div
            className='cart-count d-flex align-align-items-center'
            onClick={() => navigate('/cart')}>
            <b>
              <p className='mt-3 mr-2'>{cartItems.length}</p>
            </b>
            <ShoppingCartOutlined />
          </div>
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
