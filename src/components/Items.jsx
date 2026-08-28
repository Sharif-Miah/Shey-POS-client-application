import { Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Items = ({ item }) => {
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } });
    toast.success(`${item.name} added to cart!`, {
      autoClose: 1500,
      hideProgressBar: true,
    });
  };

  return (
    <div className='pos-product-card'>
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
      </div>

      <div className='product-body'>
        <h4 className='product-title' title={item.name}>
          {item.name}
        </h4>

        <div className='product-footer'>
          <div className='product-price'>${Number(item.price).toFixed(2)}</div>
          <Button
            type='primary'
            className='product-add-btn'
            onClick={addToCart}
            icon={<ShoppingCartOutlined />}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Items;
