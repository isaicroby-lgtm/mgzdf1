import actions from './actions';

const {
  FAVORITES_UPDATE_BEGIN,
  FAVORITES_UPDATE_SUCCESS,
  FAVORITES_UPDATE_ERR,

  FAVORITES_DELETE_BEGIN,
  FAVORITES_DELETE_SUCCESS,
  FAVORITES_DELETE_ERR,

  FAVORITES_CLOSE_NOTIFICATION,
  FAVORITES_OPEN_NOTIFICATION,
} = actions;

const initialState = {
  products: [],
};

const favoriteReducer = (state = initialState, action) => {
  const { type, data, err, newProduct } = action;

  let products = state && state.products ? [...state.products] : [];
  let notification;

  if (newProduct && action?.type?.includes('FAVORITES')) {
    const idNewProduct = products.findIndex((pr) => pr.id === newProduct.id);
    if (idNewProduct !== -1) {
      products = products.filter((product) => product.id !== newProduct.id);
      notification = 'scos';
    } else {
      notification = 'adaugat';
      products.push({ ...newProduct });
    }
  }
  switch (type) {
    case FAVORITES_CLOSE_NOTIFICATION:
      return {
        ...state,
        notification: false,
      };
    case FAVORITES_OPEN_NOTIFICATION:
      return {
        ...state,
        notification: true,
      };
    case FAVORITES_UPDATE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case FAVORITES_UPDATE_SUCCESS:
      return {
        ...state,
        products,
        isLoading: false,
        notification,
      };
    case FAVORITES_UPDATE_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };

    case FAVORITES_DELETE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case FAVORITES_DELETE_SUCCESS:
      return {
        ...state,
        products: data,
        isLoading: false,
        notification,
      };
    case FAVORITES_DELETE_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default favoriteReducer;
