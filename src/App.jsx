import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import Items from './pages/Items';
import CartPage from './pages/CartPage';
import Login from './pages/auth/login';
import Register from './pages/auth/Register';

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
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/register'
              element={<Register />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
