import { Col, Row } from 'antd';
import { Button, Form, Input } from 'antd';
import '../../resursers/authentication.css';

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
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
