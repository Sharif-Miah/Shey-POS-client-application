/* eslint-disable react-hooks/exhaustive-deps */
import DefaultLayout from '../components/DefaultLayout';
import { useEffect, useState } from 'react';
import '../resursers/item.css';
import { Table, Input } from 'antd';
import { useDispatch } from 'react-redux';
import {
  UserOutlined,
  SearchOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const Customers = () => {
  const [billsData, setBillsData] = useState([]);
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

  const filteredBills = (billsData || []).filter(
    (item) =>
      item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerPhoneNumber?.includes(searchTerm)
  );

  // Calculate unique customers
  const uniqueCustomerMap = new Map();
  billsData.forEach((bill) => {
    const key = bill.customerPhoneNumber || bill.customerName;
    if (!uniqueCustomerMap.has(key)) {
      uniqueCustomerMap.set(key, {
        ...bill,
        totalOrders: 1,
        totalSpent: Number(bill.totalAmount || 0),
      });
    } else {
      const existing = uniqueCustomerMap.get(key);
      existing.totalOrders += 1;
      existing.totalSpent += Number(bill.totalAmount || 0);
    }
  });

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '15px',
            }}>
            {name ? name.charAt(0).toUpperCase() : <UserOutlined />}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#0f172a' }}>
              {name || 'Walk-in Customer'}
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Verified Buyer
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'customerPhoneNumber',
      render: (phone) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PhoneOutlined style={{ color: '#64748b' }} />
          <span>{phone || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Order Total',
      dataIndex: 'totalAmount',
      render: (amount) => (
        <span style={{ fontWeight: '700', color: '#059669' }}>
          ${Number(amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Bill Date',
      dataIndex: 'createdAt',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarOutlined style={{ color: '#64748b' }} />
          <span>
            {value ? new Date(value).toLocaleDateString() : 'Recent'}
          </span>
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      {/* Header */}
      <div className='page-header-container'>
        <div className='page-title-group'>
          <h2>Customer Directory</h2>
          <p>View customer transaction profiles and contact records</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className='stats-container'>
        <div className='stat-card'>
          <div className='stat-icon blue'>
            <TeamOutlined />
          </div>
          <div className='stat-info'>
            <h4>{uniqueCustomerMap.size}</h4>
            <p>Unique Customers</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon green'>
            <UserOutlined />
          </div>
          <div className='stat-info'>
            <h4>{billsData.length}</h4>
            <p>Total Customer Transactions</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '16px', maxWidth: '340px', width: '100%' }}>
        <Input
          placeholder='Search customer or phone...'
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
        scroll={{ x: 600 }}
      />
    </DefaultLayout>
  );
};

export default Customers;
