/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import '../resursers/item.css';
import { Col, Row, Input, Empty } from 'antd';
import {
  AppstoreOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import Items from '../components/Items';
import { useDispatch } from 'react-redux';

const Homepage = () => {
  const [itemsData, setItemsdata] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const categories = [
    {
      name: 'all',
      label: 'All Products',
      isAll: true,
    },
    {
      name: 'fruits',
      label: 'Fruits',
      imageUrl:
        'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&auto=format&fit=crop&q=60',
    },
    {
      name: 'vegetables',
      label: 'Vegetables',
      imageUrl:
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=200&auto=format&fit=crop&q=60',
    },
    {
      name: 'meat',
      label: 'Meat',
      imageUrl:
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&auto=format&fit=crop&q=60',
    },
  ];

  useEffect(() => {
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
  }, []);

  // Filter items by category and search query
  const filteredItems = (itemsData || []).filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DefaultLayout>
      {/* Page Header */}
      <div className='page-header-container'>
        <div className='page-title-group'>
          <h2>Point of Sale (POS)</h2>
          <p>Select items to add to the active customer order cart</p>
        </div>

        {/* Quick Search */}
        <div style={{ minWidth: '220px', flex: '1 1 240px', maxWidth: '360px' }}>
          <Input
            placeholder='Search products...'
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            size='large'
            style={{ borderRadius: '10px', width: '100%' }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className='categories-container'>
        {categories.map((category) => {
          const isActive = selectedCategory === category.name;
          return (
            <div
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`category-card ${isActive ? 'active' : ''}`}>
              <div className='category-info'>
                <span className='category-title'>{category.label}</span>
              </div>
              <div className='category-image-wrap'>
                {category.isAll ? (
                  <AppstoreOutlined className='category-all-icon' />
                ) : (
                  <img src={category.imageUrl} alt={category.label} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredItems.map((item) => (
            <Col key={item._id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Items item={item} />
            </Col>
          ))}
        </Row>
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
            image={<ShoppingOutlined style={{ fontSize: '48px', color: '#94a3b8' }} />}
            description={
              <span style={{ color: '#64748b', fontSize: '15px' }}>
                No products found in this category.
              </span>
            }
          />
        </div>
      )}
    </DefaultLayout>
  );
};

export default Homepage;
