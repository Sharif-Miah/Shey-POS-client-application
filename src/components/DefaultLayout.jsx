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
  ShopOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Popconfirm } from 'antd';
import '../resursers/layout.css';
import { Link, useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { PuffLoader } from 'react-spinners';

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('pos-user') || '{}');

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pos-user');
    navigate('/login');
  };

  const desktopMenuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: <Link to='/home'>Home</Link>,
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: <Link to='/cart'>Cart</Link>,
    },
    {
      key: '/bills',
      icon: <CopyOutlined />,
      label: <Link to='/bills'>Bills</Link>,
    },
    {
      key: '/items',
      icon: <UnorderedListOutlined />,
      label: <Link to='/items'>Items</Link>,
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: <Link to='/customers'>Customers</Link>,
    },
    {
      key: '/logout',
      icon: <LoginOutlined />,
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  const mobileNavItems = [
    {
      key: '/home',
      label: 'Home',
      icon: <HomeOutlined />,
      path: '/home',
    },
    {
      key: '/items',
      label: 'Items',
      icon: <UnorderedListOutlined />,
      path: '/items',
    },
    {
      key: '/cart',
      label: 'Cart',
      icon: <ShoppingCartOutlined />,
      path: '/cart',
      badge: cartItems?.length || 0,
    },
    {
      key: '/bills',
      label: 'Bills',
      icon: <CopyOutlined />,
      path: '/bills',
    },
    {
      key: '/customers',
      label: 'Customers',
      icon: <UserOutlined />,
      path: '/customers',
    },
  ];

  return (
    <Layout className='pos-main-layout'>
      {loading && (
        <div className='pos-spinner-overlay'>
          <PuffLoader color='#38bdf8' size={60} />
          <div className='pos-spinner-text'>Processing...</div>
        </div>
      )}

      {/* Desktop Sider (Hidden on mobile) */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className='pos-sidebar'
          width={240}>
          <div className='pos-sidebar-inner'>
            <div className='pos-logo-container'>
              <div className='pos-logo-badge'>
                <ShopOutlined />
              </div>
              {!collapsed && (
                <h3 className='pos-logo-text'>
                  Fresh<span>POS</span>
                </h3>
              )}
            </div>

            <Menu
              theme='dark'
              mode='inline'
              selectedKeys={[location.pathname]}
              items={desktopMenuItems}
            />
          </div>
        </Sider>
      )}

      <Layout className='pos-inner-layout'>
        {/* Top Header */}
        <Header className='pos-header'>
          <div className='pos-header-left'>
            {!isMobile ? (
              <Button
                type='text'
                className='pos-toggle-btn'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <div className='pos-mobile-logo'>
                <div className='pos-logo-badge' style={{ width: '32px', height: '32px', fontSize: '16px' }}>
                  <ShopOutlined />
                </div>
                <span className='pos-mobile-brand-title'>
                  Fresh<span>POS</span>
                </span>
              </div>
            )}
          </div>

          <div className='pos-header-right'>
            {!isMobile && (
              <div
                className='pos-cart-badge-btn'
                onClick={() => navigate('/cart')}>
                <ShoppingCartOutlined className='pos-cart-icon' />
                <span className='pos-cart-count-badge'>
                  {cartItems?.length || 0}
                </span>
              </div>
            )}

            {user?.name && (
              <div className='pos-user-profile-badge'>
                <div className='pos-user-avatar'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className='pos-user-name'>{user.name}</div>
              </div>
            )}

            {isMobile && (
              <Popconfirm
                title='Log out of FreshPOS?'
                onConfirm={handleLogout}
                okText='Yes'
                cancelText='No'>
                <Button
                  type='text'
                  danger
                  icon={<LoginOutlined style={{ fontSize: '18px' }} />}
                  className='pos-mobile-logout-btn'
                />
              </Popconfirm>
            )}
          </div>
        </Header>

        {/* Page Content */}
        <Content className='pos-content'>{children}</Content>
      </Layout>

      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <nav className='pos-mobile-bottom-nav'>
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.key}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}>
                <div className='mobile-nav-icon-wrap'>
                  {item.icon}
                  {item.badge > 0 && (
                    <span className='mobile-nav-badge'>{item.badge}</span>
                  )}
                </div>
                <span className='mobile-nav-label'>{item.label}</span>
              </div>
            );
          })}
        </nav>
      )}
    </Layout>
  );
};

export default DefaultLayout;
