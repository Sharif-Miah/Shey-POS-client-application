import { Button } from 'antd';

const Items = ({ item }) => {
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
        <Button>At To Cart</Button>
      </div>
    </div>
  );
};

export default Items;
