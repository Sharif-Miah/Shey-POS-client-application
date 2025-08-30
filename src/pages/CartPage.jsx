/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import DefaultLaout from '../components/DefaultLayout';
import { Button, Table } from 'antd';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const dispatch = useDispatch();

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

  return (
    <DefaultLaout>
      <h4 className='my-6'>Cart</h4>
      <Table
        columns={column}
        dataSource={cartItems}
        bordered
      />
    </DefaultLaout>
  );
};

export default CartPage;
