/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import DefaultLayout from '../components/DefaultLayout';
import '../resursers/item.css';
import { Button, Modal, Table, Input, Tag } from 'antd';
import { useDispatch } from 'react-redux';
import {
  EyeOutlined,
  PrinterOutlined,
  SearchOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  ShopOutlined,
} from '@ant-design/icons';

const Bills = () => {
  const componentRef = useRef(null);
  const [billsData, setBillsData] = useState([]);
  const [printModalVisibility, setPrintModalVisibility] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const getAllBills = () => {
    dispatch({ type: 'showLoading' });
    fetch('/api/bill/get-all-bill')
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: 'hideLoading' });
        if (Array.isArray(result)) {
          const data = result.reverse();
          setBillsData(data);
        } else {
          setBillsData([]);
        }
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });
        console.error(err);
      });
  };

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const filteredBills = (billsData || []).filter((bill) =>
    bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customerPhoneNumber?.includes(searchTerm) ||
    bill._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalRevenue = billsData.reduce(
    (acc, item) => acc + (Number(item.totalAmount) || 0),
    0
  );
  const totalTax = billsData.reduce(
    (acc, item) => acc + (Number(item.tax) || 0),
    0
  );

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: '_id',
      render: (id) => (
        <span style={{ fontWeight: '600', color: '#64748b' }}>
          #{id?.substring(0, 8)}
        </span>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      render: (name) => (
        <span style={{ fontWeight: '600', color: '#0f172a' }}>{name}</span>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'customerPhoneNumber',
      render: (phone) => <span>{phone || 'N/A'}</span>,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subTotal',
      render: (subTotal) => `$${Number(subTotal || 0).toFixed(2)}`,
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      render: (tax) => `$${Number(tax || 0).toFixed(2)}`,
    },
    {
      title: 'Grand Total',
      dataIndex: 'totalAmount',
      render: (total) => (
        <span style={{ fontWeight: '700', color: '#059669' }}>
          ${Number(total || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      render: (mode) => (
        <Tag
          color={mode === 'card' ? 'blue' : 'green'}
          style={{ textTransform: 'uppercase', fontWeight: '600' }}>
          {mode || 'Cash'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button
          type='primary'
          ghost
          icon={<EyeOutlined />}
          size='small'
          onClick={() => {
            setSelectedBill(record);
            setPrintModalVisibility(true);
          }}
          style={{ borderRadius: '6px' }}>
          View Bill
        </Button>
      ),
    },
  ];

  const receiptItemColumns = [
    {
      title: 'Item',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (p) => `$${Number(p).toFixed(2)}`,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
    },
    {
      title: 'Total',
      render: (_, record) => `$${(record.quantity * record.price).toFixed(2)}`,
    },
  ];

  return (
    <DefaultLayout>
      {/* Header */}
      <div className='page-header-container'>
        <div className='page-title-group'>
          <h2>Sales & Invoices History</h2>
          <p>View, search, and print customer transaction bills</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className='stats-container'>
        <div className='stat-card'>
          <div className='stat-icon blue'>
            <FileTextOutlined />
          </div>
          <div className='stat-info'>
            <h4>{billsData.length}</h4>
            <p>Total Bills Issued</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon green'>
            <DollarCircleOutlined />
          </div>
          <div className='stat-info'>
            <h4>${totalRevenue.toFixed(2)}</h4>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon purple'>
            <DollarCircleOutlined />
          </div>
          <div className='stat-info'>
            <h4>${totalTax.toFixed(2)}</h4>
            <p>Total Tax Collected</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '16px', maxWidth: '340px', width: '100%' }}>
        <Input
          placeholder='Search by customer or phone...'
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          size='large'
          style={{ borderRadius: '10px', width: '100%' }}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredBills}
        rowKey='_id'
        pagination={{ pageSize: 8 }}
        scroll={{ x: 750 }}
      />

      {/* Print Modal */}
      {printModalVisibility && selectedBill && (
        <Modal
          open={printModalVisibility}
          onCancel={() => setPrintModalVisibility(false)}
          title='Receipt / Invoice Preview'
          footer={[
            <Button key='close' onClick={() => setPrintModalVisibility(false)}>
              Close
            </Button>,
            <Button
              key='print'
              type='primary'
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              style={{ background: '#1890ff' }}>
              Print Receipt
            </Button>,
          ]}
          width={650}>
          <div ref={componentRef} className='bill-model'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #0f172a',
                paddingBottom: '16px',
              }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#0f172a',
                  }}>
                  <ShopOutlined style={{ color: '#1890ff' }} /> FreshPOS Store
                </div>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Smart Point of Sale & Retail Management
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                <p style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>
                  FreshPOS Hub
                </p>
                <p style={{ margin: 0 }}>Madhabdi, Narsingdi</p>
                <p style={{ margin: 0 }}>Tel: +880 1906-562866</p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '8px',
                margin: '16px 0',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
              }}>
              <div>
                <div>
                  <strong>Customer:</strong> {selectedBill.customerName}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedBill.customerPhoneNumber || 'N/A'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>
                  <strong>Invoice:</strong> #{selectedBill._id?.substring(0, 8)}
                </div>
                <div>
                  <strong>Date:</strong>{' '}
                  {selectedBill.createdAt
                    ? new Date(selectedBill.createdAt).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
            </div>

            <Table
              dataSource={selectedBill.cartItems || []}
              columns={receiptItemColumns}
              pagination={false}
              size='small'
              rowKey={(r) => r._id || r.name}
            />

            <div
              style={{
                marginTop: '16px',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '12px',
              }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  fontSize: '13px',
                }}>
                <span>Subtotal:</span>
                <strong>${Number(selectedBill.subTotal || 0).toFixed(2)}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  fontSize: '13px',
                }}>
                <span>Tax (10%):</span>
                <strong>${Number(selectedBill.tax || 0).toFixed(2)}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#0f172a',
                  borderTop: '2px solid #0f172a',
                  paddingTop: '8px',
                  marginTop: '8px',
                }}>
                <span>Grand Total:</span>
                <span style={{ color: '#059669' }}>
                  ${Number(selectedBill.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px dashed #cbd5e1',
                color: '#64748b',
                fontSize: '13px',
              }}>
              <p style={{ margin: 0, fontWeight: '600' }}>
                Thank you for shopping with us!
              </p>
              <p style={{ margin: '4px 0 0' }}>Please visit again 🙏</p>
            </div>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default Bills;
