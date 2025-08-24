import './App.css';
// import 'antd/dist/antd.css';
import { Button, Flex } from 'antd';

function App() {
  return (
    <>
      <div>
        <h1>Hey POS Applications</h1>
        <Flex
          gap='small'
          wrap>
          <Button type='gost'>Primary Button</Button>
        </Flex>
      </div>
    </>
  );
}

export default App;
