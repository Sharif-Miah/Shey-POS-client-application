import { Button } from 'antd';
import { useDispatch } from 'react-redux';

const Items = ({ item }) => {
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } });
  };
  return (
    <div className='item'>
      <h4 className='name'>{item.name}</h4>
      <img
        src={item.image}
        alt={item.name}
        height='100'
        width='100'
      />
      <h4 className='price'>Price : {item.price} $/-</h4>
      <div className='d-flex justify-content-end'>
        <Button onClick={() => addToCart()}>At To Cart</Button>
      </div>
    </div>
  );
};

export default Items;
