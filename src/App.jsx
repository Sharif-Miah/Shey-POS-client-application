import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import Items from './pages/Items';

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
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
