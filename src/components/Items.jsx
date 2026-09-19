import { Button, Tag } from 'antd';
import { ShoppingCartOutlined, BarcodeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Items = ({ item }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer);

  // Current quantity of this item in cart
  const cartItem = (cartItems || []).find((ci) => ci._id === item._id);
  const currentInCart = cartItem?.quantity || 0;

  // Stock calculations
  const hasStockField = typeof item.stock === 'number';
  const availableStock = hasStockField ? item.stock : Infinity;
  const isOutOfStock = hasStockField && availableStock <= 0;
  const isCartMax = hasStockField && currentInCart >= availableStock;
  const isLowStock =
    hasStockField &&
    availableStock > 0 &&
    availableStock <= (item.lowStockThreshold || 5);

  const addToCart = () => {
    if (isOutOfStock) {
      toast.error(`${item.name} is currently out of stock!`);
      return;
    }
    if (isCartMax) {
      toast.warning(`Only ${availableStock} units available in stock!`);
      return;
    }

    dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } });
    toast.success(`${item.name} added to cart!`, {
      autoClose: 1500,
      hideProgressBar: true,
    });
  };

  return (
    <div className={`pos-product-card ${isOutOfStock ? 'card-out-of-stock' : ''}`}>
      <div className='product-image-container'>
        <img
          src={
            item.image ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'
          }
          alt={item.name}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
          }}
        />
        {item.category && (
          <span className='product-category-badge'>{item.category}</span>
        )}

        {/* Stock Status Badge on Image */}
        {isOutOfStock ? (
          <span className='stock-badge badge-out-of-stock'>Out of Stock</span>
        ) : isLowStock ? (
          <span className='stock-badge badge-low-stock'>
            Only {availableStock} left!
          </span>
        ) : hasStockField ? (
          <span className='stock-badge badge-in-stock'>
            Stock: {availableStock}
          </span>
        ) : null}
      </div>

      <div className='product-body'>
        <h4 className='product-title' title={item.name}>
          {item.name}
        </h4>

        {/* Barcode representation if available */}
        {item.barcode && (
          <div style={{ marginTop: '2px', marginBottom: '6px' }}>
            <Tag
              icon={<BarcodeOutlined />}
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                borderRadius: '4px',
                padding: '1px 6px',
              }}>
              {item.barcode}
            </Tag>
          </div>
        )}

        <div className='product-footer'>
          <div className='product-price'>${Number(item.price).toFixed(2)}</div>
          <Button
            type='primary'
            className={`product-add-btn ${
              isOutOfStock || isCartMax ? 'btn-disabled' : ''
            }`}
            disabled={isOutOfStock || isCartMax}
            onClick={addToCart}
            icon={<ShoppingCartOutlined />}>
            {isOutOfStock
              ? 'Sold Out'
              : isCartMax
              ? `In Cart (${currentInCart})`
              : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Items;

