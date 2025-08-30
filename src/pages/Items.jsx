/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import DefaultLaout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import { Button, Col, Modal, Row, Table } from 'antd';
import Items from '../components/Items';
import { useDispatch } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const ItemsPage = () => {
  const [itemsData, setItemsdata] = useState(null);
  const [addEditModalVisibility, setAddEditModalVisibility] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'showLoading' });
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
        title='Add New Item'
        footer={false}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
        doloremque. Rem, iste quisquam alias incidunt, corrupti suscipit nostrum
        eligendi itaque a necessitatibus aperiam aliquid quidem! Aut quaerat
        molestiae dolore ab.
      </Modal>
    </DefaultLaout>
  );
};

export default ItemsPage;
