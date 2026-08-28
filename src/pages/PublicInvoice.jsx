/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import { Table, Button, Tag, Spin, Result } from 'antd';
import {
  PrinterOutlined,
  ShopOutlined,
  CheckCircleFilled,
  HomeOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import '../resursers/item.css';

const PublicInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    setLoading(true);
    setError(false);
    try {
      // 1. Try dedicated single bill endpoint
      let response = await fetch(`/api/bill/get-bill-by-id?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data._id) {
          setBill(data);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback: query from get-all-bill list
      response = await fetch('/api/bill/get-all-bill');
      if (response.ok) {
        const allBills = await response.json();
        const found = allBills.find((b) => b._id === id);
        if (found) {
          setBill(found);
          setLoading(false);
          return;
        }
      }

      setError(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const columns = [
    {
      title: 'Item',
      dataIndex: 'name',
      render: (name) => <span style={{ fontWeight: '600', color: '#0f172a' }}>{name}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (p) => `$${Number(p).toFixed(2)}`,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      render: (q) => <span>x{q}</span>,
    },
    {
      title: 'Total',
      render: (_, record) => (
        <span style={{ fontWeight: '700', color: '#059669' }}>
          ${(record.quantity * record.price).toFixed(2)}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
        }}>
        <Spin size='large' />
        <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '500' }}>
          Loading Digital Receipt...
        </p>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '20px',
        }}>
        <Result
          status='404'
          title='Invoice Not Found'
          subTitle='The requested bill could not be found or may have expired.'
          extra={
            <Button
              type='primary'
              icon={<HomeOutlined />}
              onClick={() => navigate('/home')}>
              Back to Home
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        padding: '24px 16px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      {/* Top Header Actions */}
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
        <Button
          type='default'
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ borderRadius: '8px' }}>
          Back
        </Button>

        <Button
          type='primary'
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          style={{ borderRadius: '8px', background: '#1890ff' }}>
          Print / Save PDF
        </Button>
      </div>

      {/* Main Printable Card */}
      <div
        ref={componentRef}
        style={{
          width: '100%',
          maxWidth: '540px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          border: '1px solid #e2e8f0',
          padding: '24px 20px',
          boxSizing: 'border-box',
        }}>
        {/* Receipt Header */}
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
              Official Digital Invoice
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

        {/* Verified Payment Status Banner */}
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '10px 14px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: '600', fontSize: '13px' }}>
            <CheckCircleFilled style={{ color: '#10b981', fontSize: '16px' }} />
            <span>Verified Paid Bill</span>
          </div>
          <Tag color={bill.paymentMode === 'card' ? 'blue' : 'green'} style={{ fontWeight: '700', textTransform: 'uppercase' }}>
            {bill.paymentMode || 'Cash'}
          </Tag>
        </div>

        {/* Customer & Bill Meta Details */}
        <div
          style={{
            background: '#f8fafc',
            padding: '12px 14px',
            borderRadius: '10px',
            margin: '14px 0',
            border: '1px solid #e2e8f0',
            fontSize: '13px',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div>
              <strong>Customer:</strong> {bill.customerName}
            </div>
            <div>
              <strong>Invoice:</strong> #{bill._id?.substring(0, 8)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>Phone:</strong> {bill.customerPhoneNumber || 'N/A'}
            </div>
            <div>
              <strong>Date:</strong>{' '}
              {bill.createdAt
                ? new Date(bill.createdAt).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Item Table */}
        <Table
          dataSource={bill.cartItems || []}
          columns={columns}
          pagination={false}
          size='small'
          rowKey={(r) => r._id || r.name}
        />

        {/* Calculation Summary */}
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
            <strong>${Number(bill.subTotal || 0).toFixed(2)}</strong>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
              fontSize: '13px',
            }}>
            <span>Tax (10%):</span>
            <strong>${Number(bill.tax || 0).toFixed(2)}</strong>
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
              ${Number(bill.totalAmount || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: '1px dashed #cbd5e1',
            color: '#64748b',
            fontSize: '12px',
          }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>
            Thank you for shopping with us!
          </p>
          <p style={{ margin: '4px 0 0' }}>Please visit again</p>
        </div>
      </div>
    </div>
  );
};

export default PublicInvoice;
