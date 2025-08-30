import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import Items from './pages/Items';
import CartPage from './pages/CartPage';

function App() {
  return (
    <>
      <div className=''>
        <BrowserRouter>
          <Routes>
            <Route
              path='/home'
              element={<Homepage />}
            />
            <Route
              path='/items'
              element={<Items />}
            />
            <Route
              path='/cart'
              element={<CartPage />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
