/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import DefaultLaout from '../components/DefaultLayout';
import '../resursers/item.css';
import { Col, Row } from 'antd';
import Items from '../components/Items';
import { useDispatch } from 'react-redux';

const Homepage = () => {
  const [itemsData, setItemsdata] = useState(null);
  const [selectedcategories, setSelectedcategories] = useState('fruits');
  const categories = [
    {
      name: 'fruits',
      imageUrl:
        'https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      name: 'vegetables',
      imageUrl:
        'https://media.istockphoto.com/id/589415708/photo/fresh-fruits-and-vegetables.webp?a=1&b=1&s=612x612&w=0&k=20&c=L4JLiFkq1OWXrZv55n8cuqa1L2Vc2vLxnycM8o0tfSg=',
    },
    {
      name: 'meat',
      imageUrl:
        'https://media.istockphoto.com/id/1315903639/photo/raw-meats-on-butchers-shop-stock-image.webp?a=1&b=1&s=612x612&w=0&k=20&c=yHo9phxLl3X0jWCIDIgjgUFu1v4yqz_7KAo-lOfn7g4=',
    },
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'showLoading' });
    fetch('https://shey-pos-server.vercel.app/api/items/get-all-items')
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: 'hideLoading' });
        setItemsdata(result);
      })
      .catch((err) => {
        dispatch({ type: 'hideLoading' });
        console.log(err);
      });
  }, []);

  return (
    <DefaultLaout>
      <div className='d-flex categories'>
        {categories.map((category) => {
          return (
            <div
              onClick={() => setSelectedcategories(category.name)}
              className={`d-flex category ${
                selectedcategories === category.name && `selected-category`
              }`}>
              <h4>{category.name}</h4>
              <img
                src={category.imageUrl}
                alt={category.name}
                height='60'
                width='80'
              />
            </div>
          );
        })}
      </div>
      <Row gutter={6}>
        {itemsData
          ?.filter((i) => i.category === selectedcategories)
          ?.map((item) => {
            return (
              <Col
                key={item._id}
                xs={24}
                lg={6}
                md={12}
                sm={6}>
                <Items item={item} />
              </Col>
            );
          })}
      </Row>
    </DefaultLaout>
  );
};

export default Homepage;
