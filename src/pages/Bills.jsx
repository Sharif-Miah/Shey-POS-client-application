/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import DefaultLaout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const Bills = () => {
  const [billsData, setBillsData] = useState(null);
  const [addEditModalVisibility, setAddEditModalVisibility] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const dispatch = useDispatch();

  const getAllBills = () => {
    dispatch({ type: 'showLoading' });
    fetch('http://localhost:3000/api/bill/get-all-bill')
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: 'hideLoading' });
        setBillsData(result);
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });

        console.log(err);
      });
  };

  useEffect(() => {
    getAllBills();
  }, []);

  const column = [
    {
      title: 'Id',
      dataIndex: '_id',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
    },
    {
      title: 'Sub Total',
      dataIndex: 'subTotal',
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (_id, record) => (
        <div className='flex'>
          <EyeOutlined className='mx-2' />
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
        dataSource={billsData}
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
          footer={false}></Modal>
      )}
    </DefaultLaout>
  );
};

export default Bills;
