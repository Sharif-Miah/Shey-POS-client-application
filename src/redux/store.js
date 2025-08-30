import { combineReducers, createStore } from 'redux';
import { rootReducer } from '../redux/rootReducer';

const finalReducer = combineReducers({
  rootReducer,
});

const initialState = {
  rootReducer: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

let store = createStore(finalReducer, initialState);

export default store;
