import { Button, Form, Input } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import '../../resursers/authentication.css';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    axios
      .post('/api/users/login', values)
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        toast.success('Login Successfully!');
        localStorage.setItem('pos-user', JSON.stringify(res.data));
        navigate('/home');
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });
        const errorMsg =
          err.response?.data?.message || 'Login failed. Please check your credentials.';
        toast.error(errorMsg);
      });
  };

  return (
    <div className='authentication'>
      <div className='auth-card'>
        {/* Left Hero Section */}
        <div className='auth-hero'>
          <div className='auth-brand-logo'>
            <div className='auth-logo-icon'>
              <ShopOutlined />
            </div>
            <h2>
              Fresh<span>POS</span>
            </h2>
          </div>

          <div className='auth-hero-content'>
            <div className='auth-hero-title'>
              Manage Your Store Smarter & Faster.
            </div>
            <div className='auth-hero-desc'>
              Streamline billing, keep real-time track of inventory, and deliver seamless customer checkout experiences.
            </div>

            <div className='auth-features-list'>
              <div className='auth-feature-item'>
                <div className='auth-feature-icon'>
                  <ThunderboltOutlined />
                </div>
                <span>Lightning-fast point of sale billing</span>
              </div>
              <div className='auth-feature-item'>
                <div className='auth-feature-icon'>
                  <DatabaseOutlined />
                </div>
                <span>Real-time inventory & stock tracking</span>
              </div>
              <div className='auth-feature-item'>
                <div className='auth-feature-icon'>
                  <SafetyCertificateOutlined />
                </div>
                <span>Secure cloud-synced customer records</span>
              </div>
            </div>
          </div>

          <div className='auth-hero-footer'>
            © {new Date().getFullYear()} FreshPOS. All rights reserved.
          </div>
        </div>

        {/* Right Form Section */}
        <div className='auth-form-wrapper'>
          <div className='auth-form-header'>
            <h2>Welcome Back! 👋</h2>
            <p>Please enter your email and password to access POS.</p>
          </div>

          <Form
            layout='vertical'
            onFinish={onFinish}
            autoComplete='off'>
            <Form.Item
              name='email'
              label='Email Address'
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email address!' },
              ]}>
              <Input
                prefix={<MailOutlined />}
                placeholder='Enter your email address'
                size='large'
              />
            </Form.Item>

            <Form.Item
              name='password'
              label='Password'
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Enter your password'
                size='large'
              />
            </Form.Item>

            <div style={{ marginTop: '28px' }}>
              <Button
                type='primary'
                htmlType='submit'
                className='auth-submit-btn'>
                Sign In <ArrowRightOutlined />
              </Button>
            </div>

            <div className='auth-switch-link'>
              Don't have an account?
              <Link to='/register'>Create Account</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
