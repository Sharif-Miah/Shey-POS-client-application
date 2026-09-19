/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import '../resursers/item.css';
import { Col, Row, Input, Empty, Tag, Tooltip } from 'antd';
import {
  AppstoreOutlined,
  SearchOutlined,
  ShoppingOutlined,
  BarcodeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import Items from '../components/Items';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Homepage = () => {
  const [itemsData, setItemsdata] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const barcodeInputRef = useRef(null);

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer);

  // Beep Sound Effect for Barcode Scanning
  const playBeep = (isSuccess = true) => {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      const audioCtx = new AudioCtxClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';

      if (isSuccess) {
        osc.frequency.setValueAtTime(1450, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn('Audio Context error: ', e);
    }
  };

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

  // Barcode Lookup & Cart Addition Handler
  const handleBarcodeScan = (rawCode) => {
    const code = (rawCode || '').trim();
    if (!code) return;

    // Search item by exact barcode or fallback to _id
    const matchedItem = itemsData.find(
      (item) =>
        (item.barcode && item.barcode.trim().toLowerCase() === code.toLowerCase()) ||
        item._id === code
    );

    if (!matchedItem) {
      playBeep(false);
      toast.error(`No product found with barcode: "${code}"`, {
        autoClose: 2500,
      });
      return;
    }

    // Check if out of stock
    const isOutOfStock =
      typeof matchedItem.stock === 'number' && matchedItem.stock <= 0;
    if (isOutOfStock) {
      playBeep(false);
      toast.error(`"${matchedItem.name}" is Out of Stock!`, {
        autoClose: 2000,
      });
      return;
    }

    // Check if item already reached stock capacity in cart
    const itemInCart = cartItems.find((ci) => ci._id === matchedItem._id);
    if (
      itemInCart &&
      typeof matchedItem.stock === 'number' &&
      itemInCart.quantity >= matchedItem.stock
    ) {
      playBeep(false);
      toast.warning(
        `Cannot add more. Max available stock (${matchedItem.stock}) reached for "${matchedItem.name}"!`
      );
      return;
    }

    // Success: play scan beep and add to cart
    playBeep(true);
    dispatch({ type: 'addToCart', payload: { ...matchedItem, quantity: 1 } });
    toast.success(`⚡ Scanned: ${matchedItem.name}`, {
      autoClose: 1500,
      hideProgressBar: true,
    });
  };

  // Hardware Barcode Scanner Listener (USB / Bluetooth Keyboard Wedge)
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e) => {
      // If user is actively typing in another input (like search box), let normal typing proceed
      const activeTag = document.activeElement?.tagName;
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag) &&
        document.activeElement !== barcodeInputRef.current?.input
      ) {
        return;
      }

      const currentTime = Date.now();
      // Hardware scanners type very rapidly (< 70ms per char)
      if (currentTime - lastKeyTime > 90) {
        barcodeBuffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.trim().length > 1) {
          handleBarcodeScan(barcodeBuffer.trim());
          barcodeBuffer = '';
        }
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [itemsData, cartItems]);

  // Filter items by category and search query
  const filteredItems = (itemsData || []).filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.barcode && item.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <DefaultLayout>
      {/* Page Header */}
      <div className='page-header-container'>
        <div className='page-title-group'>
          <h2>Point of Sale (POS)</h2>
          <p>Scan barcode or select items to add to the customer cart</p>
        </div>

        {/* Action Header: Barcode Scanner & Search */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            flex: '1 1 auto',
            justifyContent: 'flex-end',
          }}>
          {/* Quick Barcode Scanner Input */}
          <div style={{ minWidth: '240px', maxWidth: '340px', flex: '1 1 240px' }}>
            <Tooltip title='Scan barcode with USB scanner or type code and press Enter'>
              <Input
                ref={barcodeInputRef}
                placeholder='Scan / Type Barcode + Enter...'
                prefix={
                  <BarcodeOutlined
                    style={{ color: '#0284c7', fontSize: '18px', marginRight: '4px' }}
                  />
                }
                suffix={
                  <Tag
                    color='blue'
                    style={{
                      borderRadius: '6px',
                      fontSize: '11px',
                      margin: 0,
                      cursor: 'pointer',
                    }}>
                    <ThunderboltOutlined /> Auto
                  </Tag>
                }
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
                onPressEnter={() => {
                  handleBarcodeScan(barcodeQuery);
                  setBarcodeQuery('');
                }}
                allowClear
                size='large'
                style={{
                  borderRadius: '10px',
                  border: '1.5px solid #0284c7',
                  background: '#f8fafc',
                }}
              />
            </Tooltip>
          </div>

          {/* Quick Search */}
          <div style={{ minWidth: '200px', maxWidth: '300px', flex: '1 1 200px' }}>
            <Input
              placeholder='Search name or code...'
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size='large'
              style={{ borderRadius: '10px', width: '100%' }}
            />
          </div>
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
              {category.imageUrl ? (
                <div className='category-image-wrap'>
                  <img src={category.imageUrl} alt={category.label} />
                </div>
              ) : (
                <AppstoreOutlined className='category-all-icon' />
              )}
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
                No products found matching your search.
              </span>
            }
          />
        </div>
      )}
    </DefaultLayout>
  );
};

export default Homepage;
