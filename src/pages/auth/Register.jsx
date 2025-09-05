/* eslint-disable no-unused-vars */
import { Col, Row } from 'antd';
import { Button, Form, Input } from 'antd';
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
      .post('http://localhost:3000/api/users/register', values)
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        const notify = () => toast.success('Registerd Successfully!');
        notify();
        navigate('/login');
      })
      .catch(() => {
        dispatch({ type: 'hideLoading' });
        const notify = () => toast.error('Something went wrong');
        notify();
      });
  };

  return (
    <div className='authentication'>
      <Row>
        <Col
          lg={8}
          xs={22}>
          <Form
            layout='vertical'
            onFinish={onFinish}>
            <h1>
              <b>SHEY POS</b>
            </h1>
            <hr />
            <h3 className='text-center'>Register</h3>
            <Form.Item
              name={'name'}
              label='Name'>
              <Input />
            </Form.Item>
            <Form.Item
              name={'userId'}
              label='User Id'>
              <Input />
            </Form.Item>
            <Form.Item
              name={'password'}
              label='Password'>
              <Input type='password' />
            </Form.Item>
            <div className='d-flex justify-content-end'>
              <Button
                htmlType='submit'
                type='primary'>
                Register
              </Button>
            </div>
            <div className='px-5'>
              <span>
                Already Registed ? Click here to{' '}
                <Link
                  to='/login'
                  className='text-decoration-none text-primary'>
                  Login
                </Link>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
