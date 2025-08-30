/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import DefaultLaout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import Items from '../components/Items';
import { useDispatch } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const ItemsPage = () => {
  const [itemsData, setItemsdata] = useState(null);
  const [addEditModalVisibility, setAddEditModalVisibility] = useState(false);
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();

  const data = () => {
    fetch('http://localhost:3000/api/items/get-all-items')
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: 'hideLoading' });
        setItemsdata(result);
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });

        console.log(err);
      });
  };

  useEffect(() => {
    dispatch({ type: 'showLoading' });
    data();
  }, []);

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
      title: 'category',
      dataIndex: 'category',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (_id, record) => (
        <div className='flex'>
          <DeleteOutlined className='mx-2' />
          <EditOutlined className='mx-2' />
        </div>
      ),
    },
  ];

  const onFinish = async (value) => {
    dispatch({ type: 'showLoading' });
    try {
      const response = await fetch('http://localhost:3000/api/items/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setAddEditModalVisibility(false);
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  };

  return (
    <DefaultLaout>
      <div className='d-flex justify-content-between'>
        <h4 className='my-6'>Items</h4>
        <Button
          type='primary'
          onClick={() => setAddEditModalVisibility(true)}>
          Add Item
        </Button>
      </div>
      <Table
        columns={column}
        dataSource={itemsData}
        direction=''
      />
      <Modal
        visible={addEditModalVisibility}
        onCancel={() => setAddEditModalVisibility(false)}
        title='Add New Item'
        footer={false}>
        <Form
          layout='vertical'
          onFinish={onFinish}>
          <Form.Item
            name={'name'}
            label='Name'>
            <Input />
          </Form.Item>
          <Form.Item
            name={'price'}
            label='Price'>
            <Input />
          </Form.Item>
          <Form.Item
            name={'image'}
            label='ImageUrl'>
            <Input />
          </Form.Item>
          <Form.Item
            name='category'
            label='Category'>
            <Select>
              <Select.Option value='vegetables'> Vegetables</Select.Option>
              <Select.Option value='fruits'>Fruits</Select.Option>
              <Select.Option value='meat'>Meat</Select.Option>
            </Select>
          </Form.Item>
          <div className='d-flex justify-content-end'>
            <Button
              htmlType='submit'
              type='primary'>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLaout>
  );
};

export default ItemsPage;
