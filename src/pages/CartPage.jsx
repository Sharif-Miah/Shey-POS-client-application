/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Empty,
  Popconfirm,
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import '../resursers/item.css';

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [subTotal, setSubtotal] = useState(0);
  const [billChargeModel, setBillChargeModel] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const increaseQuantity = (record) => {
    dispatch({
      type: 'updatedCart',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity > 1) {
      dispatch({
        type: 'updatedCart',
        payload: { ...record, quantity: record.quantity - 1 },
      });
    } else {
      dispatch({ type: 'deleteFromCart', payload: record });
    }
  };

  useEffect(() => {
    let temp = 0;
    (cartItems || []).forEach((item) => {
      temp = temp + (Number(item.price) || 0) * (Number(item.quantity) || 1);
    });
    setSubtotal(temp);
  }, [cartItems]);

  const tax = Number(((subTotal / 100) * 10).toFixed(2));
  const grandTotal = Number((subTotal + tax).toFixed(2));

  const desktopColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={
              record.image ||
              'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'
            }
            alt={text}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              objectFit: 'cover',
              border: '1px solid #e2e8f0',
            }}
          />
          <div>
            <div style={{ fontWeight: '600', color: '#0f172a' }}>{text}</div>
            {record.category && (
              <Tag color='blue' style={{ fontSize: '11px', marginTop: '2px' }}>
                {record.category}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      render: (price) => (
        <span style={{ fontWeight: '600', color: '#475569' }}>
          ${Number(price).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, record) => (
        <div className='qty-stepper'>
          <button
            type='button'
            className='qty-btn'
            onClick={() => decreaseQuantity(record)}>
            <MinusOutlined />
          </button>
          <span className='qty-number'>{record.quantity}</span>
          <button
            type='button'
            className='qty-btn'
            onClick={() => increaseQuantity(record)}>
            <PlusOutlined />
          </button>
        </div>
      ),
    },
    {
      title: 'Total',
      render: (_, record) => (
        <span style={{ fontWeight: '700', color: '#059669' }}>
          ${(record.price * record.quantity).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Popconfirm
          title='Remove item from cart?'
          onConfirm={() =>
            dispatch({ type: 'deleteFromCart', payload: record })
          }
          okText='Yes'
          cancelText='No'>
          <Button
            type='text'
            danger
            icon={<DeleteOutlined />}
            style={{ borderRadius: '8px' }}
          />
        </Popconfirm>
      ),
    },
  ];

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    const user = JSON.parse(localStorage.getItem('pos-user') || '{}');
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax,
      totalAmount: grandTotal,
      userId: user?._id || 'guest',
    };

    if (values.paymentMode === 'card') {
      // 💳 Stripe Online Payment
      localStorage.setItem('pending-stripe-bill', JSON.stringify(reqObject));

      axios
        .post('/api/bill/create-checkout-session', reqObject)
        .then((res) => {
          dispatch({ type: 'hideLoading' });
          if (res.data?.url) {
            // Redirect to Stripe Hosted Checkout
            window.location.href = res.data.url;
          } else {
            toast.error('Could not initiate Stripe session. Please try again.');
          }
        })
        .catch((err) => {
          dispatch({ type: 'hideLoading' });
          const errorMsg =
            err.response?.data?.message ||
            'Stripe payment service error. Please make sure Stripe Secret Key is added to backend.';
          toast.error(errorMsg);
        });
    } else {
      // 💵 Cash Payment (Direct bill save)
      axios
        .post('/api/bill/charge-bill', reqObject)
        .then(() => {
          dispatch({ type: 'hideLoading' });
          toast.success('Bill generated and saved successfully!');
          setBillChargeModel(false);
          // Clear cart
          localStorage.removeItem('cartItems');
          dispatch({ type: 'emptyCart' });
          navigate('/bills');
        })
        .catch((err) => {
          dispatch({ type: 'hideLoading' });
          toast.error(
            err.response?.data?.message || 'Failed to charge bill. Try again.'
          );
        });
    }
  };

  return (
    <DefaultLayout>
      {/* Header */}
      <div className='page-header-container'>
        <div className='page-title-group'>
          <h2>Order Checkout & Cart</h2>
          <p>Review items, adjust quantities, and generate customer bill</p>
        </div>

        <Button
          type='default'
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/home')}
          style={{ borderRadius: '8px' }}>
          Continue Shopping
        </Button>
      </div>

      {cartItems && cartItems.length > 0 ? (
        <div className='cart-container'>
          {/* Left: Cart Items (Table on desktop, Touch Cards on mobile) */}
          <div>
            {!isMobile ? (
              <Table
                columns={desktopColumns}
                dataSource={cartItems}
                rowKey={(record) => record._id || record.name}
                pagination={false}
              />
            ) : (
              <div className='mobile-cart-list'>
                {cartItems.map((item) => (
                  <div key={item._id || item.name} className='mobile-cart-card'>
                    <div className='mobile-cart-card-top'>
                      <div className='mobile-cart-card-left'>
                        <img
                          src={
                            item.image ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'
                          }
                          alt={item.name}
                          className='mobile-cart-img'
                        />
                        <div className='mobile-cart-info'>
                          <div className='mobile-cart-name' title={item.name}>
                            {item.name}
                          </div>
                          <div className='mobile-cart-unit-price'>
                            ${Number(item.price).toFixed(2)} / unit
                          </div>
                        </div>
                      </div>

                      <Popconfirm
                        title='Remove item from cart?'
                        onConfirm={() =>
                          dispatch({ type: 'deleteFromCart', payload: item })
                        }
                        okText='Yes'
                        cancelText='No'>
                        <Button
                          type='text'
                          danger
                          icon={<DeleteOutlined />}
                          style={{ borderRadius: '6px' }}
                        />
                      </Popconfirm>
                    </div>

                    <div className='mobile-cart-card-bottom'>
                      <div className='qty-stepper'>
                        <button
                          type='button'
                          className='qty-btn'
                          onClick={() => decreaseQuantity(item)}>
                          <MinusOutlined />
                        </button>
                        <span className='qty-number'>{item.quantity}</span>
                        <button
                          type='button'
                          className='qty-btn'
                          onClick={() => increaseQuantity(item)}>
                          <PlusOutlined />
                        </button>
                      </div>

                      <div className='mobile-cart-line-total'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Summary Card */}
          <div className='cart-summary-card'>
            <h3>Order Summary</h3>

            <div className='summary-row'>
              <span>Items Total ({cartItems.length} items)</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>

            <div className='summary-row'>
              <span>Tax / VAT (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className='summary-row total'>
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <Button
              type='primary'
              className='cart-charge-btn'
              onClick={() => setBillChargeModel(true)}
              icon={<CheckCircleOutlined />}>
              Proceed to Charge (${grandTotal.toFixed(2)})
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: '#ffffff',
            padding: '60px 20px',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
          }}>
          <Empty
            image={
              <ShoppingCartOutlined
                style={{ fontSize: '56px', color: '#cbd5e1' }}
              />
            }
            description={
              <div>
                <h3 style={{ margin: '14px 0 4px', color: '#1e293b', fontSize: '18px' }}>
                  Your cart is empty
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px' }}>
                  Looks like you haven't added any products to your cart yet.
                </p>
              </div>
            }>
            <Button
              type='primary'
              size='large'
              onClick={() => navigate('/home')}
              style={{
                borderRadius: '8px',
                background: '#1890ff',
                marginTop: '10px',
              }}>
              Browse Products
            </Button>
          </Empty>
        </div>
      )}

      {/* Charge Bill Modal */}
      <Modal
        title={
          <div style={{ fontSize: '18px', fontWeight: '700' }}>
            Charge & Generate Bill
          </div>
        }
        open={billChargeModel}
        onCancel={() => setBillChargeModel(false)}
        footer={false}
        width={isMobile ? '95%' : 500}
        destroyOnClose>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='customerName'
            label='Customer Name'
            rules={[
              { required: true, message: 'Please enter customer name!' },
            ]}>
            <Input placeholder='e.g. John Doe' size='large' />
          </Form.Item>

          <Form.Item
            name='customerPhoneNumber'
            label='Phone Number'
            rules={[
              { required: true, message: 'Please enter phone number!' },
            ]}>
            <Input placeholder='e.g. +880 1700-000000' size='large' />
          </Form.Item>

          <Form.Item
            name='paymentMode'
            label='Payment Method'
            initialValue='cash'
            rules={[
              { required: true, message: 'Please select payment mode!' },
            ]}>
            <Select size='large'>
              <Select.Option value='cash'>
                <DollarCircleOutlined style={{ marginRight: '8px' }} /> Cash
              </Select.Option>
              <Select.Option value='card'>
                <CreditCardOutlined style={{ marginRight: '8px' }} /> Card / Online
              </Select.Option>
            </Select>
          </Form.Item>

          <div
            style={{
              background: '#f8fafc',
              padding: '14px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              border: '1px solid #e2e8f0',
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '13px',
                color: '#64748b',
              }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: '600' }}>${subTotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '13px',
                color: '#64748b',
              }}>
              <span>Tax (10%):</span>
              <span style={{ fontWeight: '600' }}>${tax.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: '800',
                color: '#0f172a',
                borderTop: '1px dashed #cbd5e1',
                paddingTop: '8px',
              }}>
              <span>Total Payable:</span>
              <span style={{ color: '#059669' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button onClick={() => setBillChargeModel(false)}>Cancel</Button>
            <Button
              htmlType='submit'
              type='primary'
              style={{ background: '#10b981', borderColor: '#10b981' }}>
              Confirm & Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
