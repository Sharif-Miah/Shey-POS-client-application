/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DefaultLaout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import { Button, Modal, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';

const Bills = () => {
  const componentRef = useRef(null);
  const [billsData, setBillsData] = useState(null);
  const [printModalVisibility, setprintModalVisibility] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const dispatch = useDispatch();

  const getAllBills = () => {
    dispatch({ type: 'showLoading' });
    fetch('https://shey-pos-server.vercel.app/api/bill/get-all-bill')
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
          <EyeOutlined
            className='mx-2'
            onClick={() => {
              setSelectedBill(record);
              setprintModalVisibility(true);
            }}
          />
        </div>
      ),
    },
  ];

  const cartColumn = [
    {
      title: 'name',
      dataIndex: 'name',
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
          <b>{record.quantity}</b>
        </div>
      ),
    },
    {
      title: 'Total Fare',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <b>{record.quantity * record.price}</b>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });
  return (
    <DefaultLaout>
      <div className='d-flex justify-content-between py-4'>
        <h4 className='my-6'>Items</h4>
      </div>
      <Table
        columns={column}
        dataSource={billsData}
      />
      {printModalVisibility && (
        <Modal
          open={printModalVisibility}
          onCancel={() => {
            setprintModalVisibility(false);
          }}
          title={`Bills Details`}
          footer={false}
          width={800}>
          <div
            ref={componentRef}
            className='bill-model p-4'>
            <div className='d-flex justify-content-between bill-header pb-2'>
              <div>
                <h1>
                  <b>Social Circle</b>
                </h1>
              </div>
              <div>
                <p>Narsingdi</p>
                <p>Madhabdi, Amdiya-1603</p>
                <p>+88 01906-562866</p>
              </div>
            </div>
            <div className='bill-customer-details mt-2'>
              <p>
                <b>Name</b>: {selectedBill.customerName}
              </p>
              <p>
                <b>Mobile Number</b>: {selectedBill.customerPhoneNumber}
              </p>
              <p>
                <b>Date</b>:{' '}
                {selectedBill.createdAt.toString().substring(0, 10)}
              </p>
            </div>
            <Table
              dataSource={selectedBill.cartItems}
              columns={cartColumn}
              pagination={false}
              className='my-3'
            />
            <div className='dotted-border mt-2 mb-2 pb-2'>
              <p>
                <b>Sub Total</b>: {selectedBill.subTotal}
              </p>
              <p>
                <b>Tax</b>: {selectedBill.tax}
              </p>
            </div>
            <div className='mt-2 mb-2 pb-2'>
              <h2>
                <b>Grand Total: {selectedBill.totalAmount}</b>
              </h2>
            </div>
            <div className='dotted-border'></div>
            <div className='text-center'>
              <p>Thanks</p>
              <p>Visite Again :) </p>
            </div>
          </div>
          <div className='d-flex justify-content-end'>
            <Button
              type='primary'
              onClick={handlePrint}>
              Print Bill
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLaout>
  );
};

export default Bills;
