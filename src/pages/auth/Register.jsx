import { Button, Form, Input } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import '../../resursers/authentication.css';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    axios
      .post('/api/users/register', values)
      .then(() => {
        dispatch({ type: 'hideLoading' });
        toast.success('Registration Successful! Please login.');
        navigate('/login');
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });
        const errorMsg =
          err.response?.data?.message || 'Registration failed. Please try again.';
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
              Get Started with FreshPOS Today.
            </div>
            <div className='auth-hero-desc'>
              Join thousands of businesses managing their inventory, fast checkout, and sales seamlessly.
            </div>

            <div className='auth-features-list'>
              <div className='auth-feature-item'>
                <div className='auth-feature-icon'>
                  <ThunderboltOutlined />
                </div>
                <span>Quick and simple onboarding in seconds</span>
              </div>
              <div className='auth-feature-item'>
                <div className='auth-feature-icon'>
                  <DatabaseOutlined />
                </div>
                <span>Automated inventory syncing & stock control</span>
              </div>
              <div className='auth-feature-item'>
                <div className='auth-feature-icon'>
                  <SafetyCertificateOutlined />
                </div>
                <span>Role-based access & secure user accounts</span>
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
            <h2>Create an Account</h2>
            <p>Fill in your details below to register your POS account.</p>
          </div>

          <Form
            layout='vertical'
            onFinish={onFinish}
            autoComplete='off'>
            <Form.Item
              name='name'
              label='Full Name'
              rules={[
                { required: true, message: 'Please enter your full name!' },
                { min: 2, message: 'Name must be at least 2 characters!' },
              ]}>
              <Input
                prefix={<UserOutlined />}
                placeholder='Enter your full name'
                size='large'
              />
            </Form.Item>

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
                { required: true, message: 'Please enter a password!' },
                { min: 4, message: 'Password must be at least 4 characters!' },
              ]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Enter a strong password'
                size='large'
              />
            </Form.Item>

            <div style={{ marginTop: '28px' }}>
              <Button
                type='primary'
                htmlType='submit'
                className='auth-submit-btn'>
                Register Now <UserAddOutlined />
              </Button>
            </div>

            <div className='auth-switch-link'>
              Already have an account?
              <Link to='/login'>Sign In</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
