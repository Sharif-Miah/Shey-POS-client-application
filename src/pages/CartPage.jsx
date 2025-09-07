/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import DefaultLaout from '../components/DefaultLayout';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [subTotal, setSubtotal] = useState(0);
  const [billChargeModel, setBillChargeModel] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const increaseQuantity = (record) => {
    dispatch({
      type: 'updatedCart',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: 'updatedCart',
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const column = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'image',
      dataIndex: 'image',
      render: (image, record) => (
        <img
          src={image}
          alt=''
          height={'60'}
          width={'60'}
        />
      ),
    },
    {
      title: 'price',
      dataIndex: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className='mx-3 mt-4'
            onClick={() => increaseQuantity(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className='mx-3 mt-4'
            onClick={() => decreaseQuantity(record)}
          />
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (_id, record) => (
        <DeleteOutlined
          onClick={() => dispatch({ type: 'deleteFromCart', payload: record })}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;
    });
    setSubtotal(temp);
  }, [cartItems]);

  const onFinish = (values) => {
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax: Number(((subTotal / 100) * 10).toFixed(2)),
      totalAmount: Number((subTotal + (subTotal / 100) * 10).toFixed(2)),
      userId: JSON.parse(localStorage.getItem('pos-user'))._id,
    };
    axios
      .post(
        'https://shey-pos-server.vercel.app/api/bill/charge-bill',
        reqObject
      )
      .then(() => {
        const notify = () => toast.success('bill charged Successfully!');
        notify();
        Navigate('/bills');
      })
      .catch(() => {
        const notify = () => toast.error('Something went wrong');
        notify();
      });
  };

  return (
    <DefaultLaout>
      <h4 className='my-6'>Cart</h4>
      <Table
        columns={column}
        dataSource={cartItems}
        bordered
      />
      <hr />
      <div className='d-flex justify-content-end flex-column align-items-end'>
        <div className='subtotal'>
          <h3>
            Sub Total: <b>{subTotal} $/-</b>
          </h3>
        </div>
        <Button
          type='primary'
          onClick={() => setBillChargeModel(true)}>
          CHARGE BILL
        </Button>
      </div>
      <Modal
        title='Charge Bill'
        visible={billChargeModel}
        onCancel={() => setBillChargeModel(false)}
        footer={false}>
        <Form
          layout='vertical'
          onFinish={onFinish}>
          <Form.Item
            name={'customerName'}
            label='Customer Name'>
            <Input />
          </Form.Item>
          <Form.Item
            name={'customerPhoneNumber'}
            label='Phone Number'>
            <Input />
          </Form.Item>
          <Form.Item
            name='paymentMode'
            label='Payment Mode'>
            <Select>
              <Select.Option value='cash'>Cash</Select.Option>
              <Select.Option value='card'>Card</Select.Option>
            </Select>
          </Form.Item>
          <div className='charge-bill-amount'>
            <h5>
              SubTotal: <b>{subTotal} $/-</b>
            </h5>
            <h5>
              Tax: <b>{((subTotal / 100) * 10).toFixed(2)} $/-</b>
            </h5>
            <hr />
            <h2>
              Grand Total:{' '}
              <b>{(subTotal + (subTotal / 100) * 10).toFixed(2)}</b>
            </h2>
          </div>
          <div className='d-flex justify-content-end'>
            <Button
              htmlType='submit'
              type='primary'>
              GENERATE BILL
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLaout>
  );
};

export default CartPage;
