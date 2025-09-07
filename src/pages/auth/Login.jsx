import { Col, Row } from 'antd';
import { Button, Form, Input } from 'antd';
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
      .post('https://shey-pos-server.vercel.app/api/users/login', values)
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        const notify = () => toast.success('Login Successfully!');
        notify();
        console.log(res.data);
        localStorage.setItem('pos-user', JSON.stringify(res.data));
        navigate('/home');
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
            onFinish={(values) => onFinish(values)}>
            <h1>
              <b>SHEY POS</b>
            </h1>
            <hr />
            <h3 className='text-center'>Login</h3>
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
                Login
              </Button>
            </div>
            <div className='px-5'>
              <span>
                Dont't Registed ? Click here to{' '}
                <Link
                  to='/register'
                  className='text-decoration-none text-primary'>
                  Register
                </Link>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
