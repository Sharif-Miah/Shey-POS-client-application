/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import DefaultLaout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const ItemsPage = () => {
  const [itemsData, setItemsdata] = useState(null);
  const [addEditModalVisibility, setAddEditModalVisibility] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const dispatch = useDispatch();

  const showAllItems = () => {
    dispatch({ type: 'showLoading' });
    fetch('https://shey-pos-server.vercel.app/api/items/get-all-items')
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

  const deleteItem = async (record) => {
    try {
      const response = await fetch(
        'https://shey-pos-server.vercel.app/api/items/delete-item',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId: record._id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const notify = () => toast.success('Item Deleted Successfully!');
      notify();
      setAddEditModalVisibility(false);
      showAllItems();
    } catch (error) {
      console.error('Fetch error:', error.message);
      const notify = () => toast.error('Something went Wrong!');
      notify();
    }
  };

  useEffect(() => {
    showAllItems();
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
          <EditOutlined
            className='mx-2'
            onClick={() => {
              setEditingItem(record);
              setAddEditModalVisibility(true);
            }}
          />
          <DeleteOutlined
            className='mx-2'
            onClick={() => deleteItem(record)}
          />
        </div>
      ),
    },
  ];

  const onFinish = async (value) => {
    dispatch({ type: 'showLoading' });
    if (editingItem === null) {
      try {
        const response = await fetch(
          'https://shey-pos-server.vercel.app/api/items/add-item',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
          }
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const notify = () => toast.success('Item Added Successfully!');
        notify();
        setAddEditModalVisibility(false);
        showAllItems();
      } catch (error) {
        console.error('Fetch error:', error.message);
        message.error('Something went wrong!');
      }
    } else {
      try {
        const response = await fetch(
          'https://shey-pos-server.vercel.app/api/items/edit-item',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...value, itemId: editingItem._id }),
          }
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const notify = () => toast.success('Item Edited Successfully!');
        notify();
        setAddEditModalVisibility(false);
        showAllItems();
      } catch (error) {
        console.error('Fetch error:', error.message);
        message.error('Something went wrong!');
      }
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
      {addEditModalVisibility && (
        <Modal
          visible={addEditModalVisibility}
          onCancel={() => {
            setEditingItem(null);
            setAddEditModalVisibility(false);
          }}
          title={`${editingItem !== null ? `Edit Item` : `Add New Item`}`}
          footer={false}>
          <Form
            initialValues={editingItem}
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
      )}
    </DefaultLaout>
  );
};

export default ItemsPage;
