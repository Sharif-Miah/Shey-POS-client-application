import { useEffect, useState } from 'react';
import DefaultLaout from '../components/DefaultLayout';
import Items from '../components/items';
import '../resursers/item.css';
import { Col, Row } from 'antd';

const Homepage = () => {
  const [itemsData, setItemsdata] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/items/get-all-items')
      .then((res) => res.json())
      .then((result) => {
        setItemsdata(result);
      })
      .catch((err) => {
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
