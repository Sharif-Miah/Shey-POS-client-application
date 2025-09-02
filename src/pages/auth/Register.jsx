import { Col, Row } from 'antd';
import { Button, Form, Input } from 'antd';
import '../../resursers/authentication.css';
import { Link } from 'react-router';

const Register = () => {
  const onFinish = (value) => {
    console.log(value);
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
              name={'userid'}
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
                  className='text-decoration-none'>
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
