/* eslint-disable react-hooks/exhaustive-deps */
import DefaultLaout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import { Button, Modal, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';

const Customers = () => {
  const [billsData, setBillsData] = useState(null);
  const dispatch = useDispatch();

  const getAllBills = () => {
    dispatch({ type: 'showLoading' });
    fetch('http://localhost:3000/api/bill/get-all-bill')
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: 'hideLoading' });
        const data = result.reverse();
        setBillsData(data);
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });

        console.log(err);
      });
  };

  const column = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'customerPhoneNumber',
    },
    {
      title: 'Created on',
      dataIndex: 'createdAt',
      render: (value) => <span>{value.toString().substring(0, 10)}</span>,
    },
  ];

  useEffect(() => {
    getAllBills();
  }, []);

  return (
    <DefaultLaout>
      <div className='d-flex justify-content-between py-4'>
        <h4 className='my-6'>Customers</h4>
      </div>
      <Table
        columns={column}
        dataSource={billsData}
      />
    </DefaultLaout>
  );
};

export default Customers;
