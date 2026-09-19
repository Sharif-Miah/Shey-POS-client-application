const initialState = {
  loading: false,
  cartItems: [],
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'addToCart': {
      const itemToAdd = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === itemToAdd._id
      );

      if (existingItem) {
        // Enforce stock limit if available
        const maxStock =
          typeof itemToAdd.stock === 'number'
            ? itemToAdd.stock
            : typeof existingItem.stock === 'number'
            ? existingItem.stock
            : Infinity;

        if (existingItem.quantity >= maxStock) {
          return state;
        }

        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === itemToAdd._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // Do not add if explicitly out of stock
      if (typeof itemToAdd.stock === 'number' && itemToAdd.stock <= 0) {
        return state;
      }

      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            ...itemToAdd,
            quantity: itemToAdd.quantity ? itemToAdd.quantity : 1,
          },
        ],
      };
    }
    case 'deleteFromCart':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item._id !== action.payload._id
        ),
      };
    case 'updatedCart':
      return {
        ...state,
        cartItems: state.cartItems.map((item) => {
          if (item._id == action.payload._id) {
            const maxStock =
              typeof item.stock === 'number' ? item.stock : Infinity;
            const newQty = Math.min(action.payload.quantity, maxStock);
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        }),
      };
    case 'emptyCart':
    case 'clearCart':
      return {
        ...state,
        cartItems: [],
      };
    case 'showLoading':
      return {
        ...state,
        loading: true,
      };
    case 'hideLoading':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
