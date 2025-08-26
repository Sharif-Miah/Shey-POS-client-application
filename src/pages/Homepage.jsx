import { useEffect, useState } from 'react';
import DefaultLaout from '../components/DefaultLayout';
import Items from '../components/items';
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

  console.log(itemsData);

  return (
    <DefaultLaout>
      <Row>
        {itemsData?.map((item) => {
          return (
            <Col span={6}>
              <Items item={item} />
            </Col>
          );
        })}
      </Row>
    </DefaultLaout>
  );
};

export default Homepage;
