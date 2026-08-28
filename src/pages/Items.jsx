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
} from 'antd';
import { useDispatch } from 'react-redux';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
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
    setAddEditModalVisibility(true);
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setAddEditModalVisibility(true);
  };

  const filteredData = (itemsData || []).filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const payload =
      editingItem === null ? value : { ...value, itemId: editingItem._id };

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

  return (
    <DefaultLayout>
      {/* Page Header */}
      <div className='page-header-container'>
        <div className='page-title-group'>
          <h2>Product & Inventory Management</h2>
          <p>Create, update, or remove store products and stock listings</p>
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
      </div>

      {/* Search & Filter Bar */}
      <div style={{ marginBottom: '16px', maxWidth: '340px', width: '100%' }}>
        <Input
          placeholder='Search items or category...'
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
        scroll={{ x: 600 }}
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
          initialValues={editingItem || { category: 'vegetables' }}
          layout='vertical'
          onFinish={onFinish}>
          <Form.Item
            name='name'
            label='Item Name'
            rules={[{ required: true, message: 'Please enter item name!' }]}>
            <Input placeholder='e.g. Fresh Red Apple' size='large' />
          </Form.Item>

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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
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
