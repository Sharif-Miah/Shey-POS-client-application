const Items = ({ item }) => {
  return (
    <div className='item'>
      <h4>{item.name}</h4>
      <img
        src={item.image}
        alt={item.name}
        height='100'
        width='100'
      />
      <h4>Price : {item.price} $/-</h4>
    </div>
  );
};

export default Items;
