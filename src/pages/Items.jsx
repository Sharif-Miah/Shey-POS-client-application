/* eslint-disable react-hooks/exhaustive-deps */
import DefaultLayout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tag,
  Popconfirm,
  Tooltip,
} from 'antd';
import { useDispatch } from 'react-redux';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  BarcodeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const ItemsPage = () => {
  const [itemsData, setItemsdata] = useState([]);
  const [addEditModalVisibility, setAddEditModalVisibility] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const showAllItems = () => {
    dispatch({ type: 'showLoading' });
    fetch('/api/items/get-all-items?t=' + Date.now())
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: 'hideLoading' });
        if (Array.isArray(result)) {
          setItemsdata(result);
        } else {
          setItemsdata([]);
        }
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });
        console.error(err);
      });
  };

  const deleteItem = async (record) => {
    try {
      const response = await fetch('/api/items/delete-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId: record._id }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      toast.success('Item Deleted Successfully!');
      setAddEditModalVisibility(false);
      showAllItems();
    } catch (error) {
      console.error('Fetch error:', error.message);
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    showAllItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      category: 'vegetables',
      stock: 50,
      lowStockThreshold: 5,
    });
    setAddEditModalVisibility(true);
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      stock: record.stock !== undefined ? record.stock : 0,
      lowStockThreshold: record.lowStockThreshold ?? 5,
      barcode: record.barcode ?? '',
    });
    setAddEditModalVisibility(true);
  };

  // Helper to generate a random 12-digit barcode
  const handleGenerateBarcode = () => {
    const randomCode =
      '890' + Math.floor(100000000 + Math.random() * 900000000).toString();
    form.setFieldsValue({ barcode: randomCode });
    toast.info(`Generated barcode: ${randomCode}`);
  };

  const filteredData = (itemsData || []).filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.barcode && item.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      title: 'Item Details',
      dataIndex: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={
              record.image ||
              'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'
            }
            alt={name}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid #e2e8f0',
            }}
          />
          <div>
            <div style={{ fontWeight: '600', color: '#0f172a' }}>{name}</div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              ID: {record._id?.substring(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      render: (barcode) =>
        barcode ? (
          <Tooltip title='Copy Barcode'>
            <Tag
              icon={<BarcodeOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(barcode);
                toast.success('Barcode copied!');
              }}
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                cursor: 'pointer',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '2px 8px',
              }}>
              {barcode}
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>No Barcode</span>
        ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category) => {
        let color = 'geekblue';
        if (category === 'fruits') color = 'orange';
        if (category === 'vegetables') color = 'green';
        if (category === 'meat') color = 'volcano';
        return (
          <Tag color={color} style={{ textTransform: 'capitalize', fontWeight: '600' }}>
            {category || 'General'}
          </Tag>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => (
        <span style={{ fontWeight: '700', color: '#059669' }}>
          ${Number(price).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Stock Status',
      dataIndex: 'stock',
      render: (stock, record) => {
        const currentStock = typeof stock === 'number' ? stock : 0;
        const threshold = record.lowStockThreshold || 5;

        if (currentStock <= 0) {
          return (
            <Tag
              icon={<CloseCircleOutlined />}
              color='error'
              style={{ borderRadius: '6px', fontWeight: '600' }}>
              Out of Stock (0)
            </Tag>
          );
        }

        if (currentStock <= threshold) {
          return (
            <Tag
              icon={<WarningOutlined />}
              color='warning'
              style={{ borderRadius: '6px', fontWeight: '600' }}>
              Low Stock ({currentStock})
            </Tag>
          );
        }

        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color='success'
            style={{ borderRadius: '6px', fontWeight: '600' }}>
            In Stock ({currentStock})
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type='text'
            icon={<EditOutlined style={{ color: '#2563eb' }} />}
            onClick={() => openEditModal(record)}
            style={{ borderRadius: '6px' }}
          />
          <Popconfirm
            title='Delete Item'
            description='Are you sure you want to delete this product?'
            onConfirm={() => deleteItem(record)}
            okText='Yes, Delete'
            cancelText='Cancel'>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: '6px' }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onFinish = async (value) => {
    dispatch({ type: 'showLoading' });
    const endpoint =
      editingItem === null ? '/api/items/add-item' : '/api/items/edit-item';
    const payload = {
      ...(editingItem === null ? value : { ...value, itemId: editingItem._id }),
      stock: Number(value.stock) || 0,
      lowStockThreshold: Number(value.lowStockThreshold) || 5,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      dispatch({ type: 'hideLoading' });
      toast.success(
        editingItem === null
          ? 'Item Added Successfully!'
          : 'Item Updated Successfully!'
      );
      setAddEditModalVisibility(false);
      showAllItems();
    } catch (error) {
      dispatch({ type: 'hideLoading' });
      console.error('Fetch error:', error.message);
      toast.error('Something went wrong!');
    }
  };

  // Stats calculation
  const totalCategories = new Set(itemsData.map((i) => i.category)).size;
  const lowStockCount = itemsData.filter(
    (i) =>
      typeof i.stock === 'number' &&
      i.stock > 0 &&
      i.stock <= (i.lowStockThreshold || 5)
  ).length;
  const outOfStockCount = itemsData.filter(
    (i) => typeof i.stock === 'number' && i.stock <= 0
  ).length;

  return (
    <DefaultLayout>
      {/* Page Header */}
      <div className='page-header-container'>
        <div className='page-title-group'>
          <h2>Product & Inventory Management</h2>
          <p>Create, update barcode, or manage real-time stock levels</p>
        </div>

        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={openAddModal}
          size='large'
          style={{
            borderRadius: '10px',
            background: '#1890ff',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
          }}>
          Add New Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='stats-container'>
        <div className='stat-card'>
          <div className='stat-icon blue'>
            <ShoppingOutlined />
          </div>
          <div className='stat-info'>
            <h4>{itemsData.length}</h4>
            <p>Total Products</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon purple'>
            <AppstoreOutlined />
          </div>
          <div className='stat-info'>
            <h4>{totalCategories}</h4>
            <p>Active Categories</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <WarningOutlined />
          </div>
          <div className='stat-info'>
            <h4 style={{ color: '#d97706' }}>{lowStockCount}</h4>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ background: '#fef2f2', color: '#ef4444' }}>
            <CloseCircleOutlined />
          </div>
          <div className='stat-info'>
            <h4 style={{ color: '#dc2626' }}>{outOfStockCount}</h4>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ marginBottom: '16px', maxWidth: '360px', width: '100%' }}>
        <Input
          placeholder='Search name, category, or barcode...'
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
        dataSource={filteredData}
        rowKey='_id'
        pagination={{ pageSize: 8 }}
        scroll={{ x: 750 }}
      />

      {/* Add / Edit Modal */}
      <Modal
        open={addEditModalVisibility}
        onCancel={() => {
          setEditingItem(null);
          setAddEditModalVisibility(false);
        }}
        title={
          <div style={{ fontSize: '18px', fontWeight: '700' }}>
            {editingItem !== null ? 'Edit Product' : 'Add New Product'}
          </div>
        }
        footer={false}
        destroyOnClose>
        <Form
          form={form}
          initialValues={
            editingItem || {
              category: 'vegetables',
              stock: 50,
              lowStockThreshold: 5,
            }
          }
          layout='vertical'
          onFinish={onFinish}>
          <Form.Item
            name='name'
            label='Item Name'
            rules={[{ required: true, message: 'Please enter item name!' }]}>
            <Input placeholder='e.g. Fresh Red Apple' size='large' />
          </Form.Item>

          {/* Barcode with Auto-Generate Helper */}
          <Form.Item
            name='barcode'
            label={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <span>Product Barcode (EAN / UPC)</span>
                <Button
                  type='link'
                  size='small'
                  icon={<BarcodeOutlined />}
                  onClick={handleGenerateBarcode}
                  style={{ padding: 0, height: 'auto', fontWeight: '500' }}>
                  Generate Random
                </Button>
              </div>
            }>
            <Input
              placeholder='e.g. 890123456789 (Scan or type)'
              prefix={<BarcodeOutlined style={{ color: '#94a3b8' }} />}
              size='large'
            />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Form.Item
              name='stock'
              label='Stock Quantity'
              rules={[{ required: true, message: 'Please enter stock quantity!' }]}>
              <Input
                type='number'
                min='0'
                placeholder='e.g. 50'
                size='large'
              />
            </Form.Item>

            <Form.Item
              name='lowStockThreshold'
              label='Low Stock Alert Level'
              rules={[{ required: true, message: 'Alert threshold required!' }]}>
              <Input
                type='number'
                min='1'
                placeholder='e.g. 5'
                size='large'
              />
            </Form.Item>
          </div>

          <Form.Item
            name='price'
            label='Price ($)'
            rules={[{ required: true, message: 'Please enter price!' }]}>
            <Input type='number' step='0.01' placeholder='e.g. 4.99' size='large' />
          </Form.Item>

          <Form.Item
            name='image'
            label='Image URL'
            rules={[{ required: true, message: 'Please enter image URL!' }]}>
            <Input placeholder='https://example.com/image.jpg' size='large' />
          </Form.Item>

          <Form.Item
            name='category'
            label='Category'
            rules={[{ required: true, message: 'Please select a category!' }]}>
            <Select size='large'>
              <Select.Option value='fruits'>🍎 Fruits</Select.Option>
              <Select.Option value='vegetables'>🥦 Vegetables</Select.Option>
              <Select.Option value='meat'>🥩 Meat</Select.Option>
            </Select>
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '24px',
            }}>
            <Button
              onClick={() => {
                setEditingItem(null);
                setAddEditModalVisibility(false);
              }}>
              Cancel
            </Button>
            <Button htmlType='submit' type='primary' size='large'>
              {editingItem !== null ? 'Update Item' : 'Save Product'}
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default ItemsPage;
