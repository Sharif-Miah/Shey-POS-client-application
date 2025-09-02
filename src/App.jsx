import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Homepage from './pages/Homepage';
import Items from './pages/Items';
import CartPage from './pages/CartPage';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

function App() {
  return (
    <>
      <div className=''>
        <BrowserRouter>
          <Routes>
            <Route
              path='/home'
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/items'
              element={
                <ProtectedRoute>
                  <Items />
                </ProtectedRoute>
              }
            />
            <Route
              path='/cart'
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/register'
              element={<Register />}
            />
            <Route
              path='/'
              element={<Login />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem('pos-user')) {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
}
