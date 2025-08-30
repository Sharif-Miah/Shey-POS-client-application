/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import DefaultLaout from '../components/DefaultLayout';
import '../resursers/item.css';
import { Col, Row } from 'antd';
import Items from '../components/Items';
import { useDispatch } from 'react-redux';

const Homepage = () => {
  const [itemsData, setItemsdata] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'showLoading' });
    fetch('http://localhost:3000/api/items/get-all-items')
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
      <Row gutter={6}>
        {itemsData?.map((item) => {
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
