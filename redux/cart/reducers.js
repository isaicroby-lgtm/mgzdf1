import actions from "./actions";

const {
  CART_ADD_BEGIN,
  CART_ADD_SUCCESS,
  CART_ADD_ERR,

  CART_UPDATE_BEGIN,
  CART_UPDATE_SUCCESS,
  CART_UPDATE_ERR,

  CART_DELETE_BEGIN,
  CART_DELETE_SUCCESS,
  CART_DELETE_ERR,

  CART_INFO_ADD_BEGIN,
  CART_INFO_ADD_SUCCESS,
  CART_INFO_ADD_ERR,

  CART_INFO_DELETE_BEGIN,
  CART_INFO_DELETE_SUCCESS,
  CART_INFO_DELETE_ERR,

  CART_OPEN,
  CART_CLOSE,

  CART_OPEN_NOTIFICATION,
  CART_CLOSE_NOTIFICATION,

  CART_CLEAR,
} = actions;

const initialState = {
  products: [],
};

const cartReducer = (state = initialState, action) => {
  const { type, data, err, newProduct } = action;

  const products = [...state.products];

  if (newProduct && action?.type?.includes("CART")) {
    let idNewProduct = "";
    idNewProduct = products.findIndex((pr) => pr.id === newProduct.id);

    if (idNewProduct === -1) products.push({ ...newProduct, quantity: 1 });
    else
      products[idNewProduct].quantity =
        (parseInt(products[idNewProduct].quantity) || 1) + 1;
  }

  switch (type) {
    case CART_OPEN_NOTIFICATION:
      return {
        ...state,
        notification: true,
      };
    case CART_CLOSE_NOTIFICATION:
      return {
        ...state,
        notification: false,
      };
    case CART_OPEN:
      return {
        ...state,
        openCart: true,
      };
    case CART_CLOSE:
      return {
        ...state,
        openCart: false,
      };
    case CART_ADD_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case CART_ADD_SUCCESS:
      return {
        ...state,
        notification: "adaugat",
        products,
        isLoading: false,
      };
    case CART_ADD_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };
    case CART_UPDATE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case CART_UPDATE_SUCCESS:
      return {
        ...state,
        products: data,
        isLoading: false,
      };
    case CART_UPDATE_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };
    case CART_DELETE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case CART_DELETE_SUCCESS:
      return {
        ...state,
        products: data,
        isLoading: false,
      };
    case CART_DELETE_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };
    case CART_INFO_ADD_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case CART_INFO_ADD_SUCCESS:
      return {
        ...state,
        info: data,
        isLoading: false,
      };
    case CART_INFO_ADD_ERR:
      return {
        ...state,
        isLoading: true,
      };
    case CART_INFO_DELETE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case CART_INFO_DELETE_SUCCESS:
      return {
        ...state,
        info: data,
        isLoading: false,
      };
    case CART_INFO_DELETE_ERR:
      return {
        ...state,
        isLoading: true,
      };
    case CART_CLEAR:
      return {
        ...state,
        products: [],
      };
    default:
      return state;
  }
};

export default cartReducer;
