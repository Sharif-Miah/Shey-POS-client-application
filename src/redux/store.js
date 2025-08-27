import { combineReducers, createStore } from 'redux';
import { rootReducer } from '../redux/rootReducer';

const finalReducer = combineReducers({
  rootReducer,
});

const initialState = {
  rootReducer: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

const store = createStore(initialState, finalReducer);

export default store;
