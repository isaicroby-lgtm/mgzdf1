import actions from "./actions";

const {
  FILTER_PRODUCT_BEGIN,
  FILTER_PRODUCT_SUCCESS,
  FILTER_PRODUCT_ERR,

  SORTING_PRODUCT_BEGIN,
  SORTING_PRODUCT_SUCCESS,
  SORTING_PRODUCT_ERR,

  FETCH_PRODUCTS_END,
  FETCH_PRODUCTS_BEGIN,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERR,
} = actions;

const productReducer = (state = {}, action) => {
  const {
    type,
    err,
    productsAll,
    productsFiltered,
    productsSorted,
    sortingBy,
    productsFilteredWithoutMe,
    filterByThese,
  } = action;

  let maxCount = -1;
  let productMostPopular = productsAll?.[0];

  for (let i = 0; i < productsAll?.length; ++i) {
    if (productsAll[i]?.numberOfTimesBought > maxCount) {
      maxCount = productsAll[i]?.numberOfTimesBought;
      productMostPopular = productsAll[i];
    }
  }

  switch (type) {
    case FETCH_PRODUCTS_END:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_PRODUCTS_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        productMostPopular,
        productsAll,
        productsFiltered,
        productsSorted,
        isLoading: false,
      };
    case FETCH_PRODUCTS_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };
    case FILTER_PRODUCT_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case FILTER_PRODUCT_SUCCESS:
      return {
        productMostPopular,
        productsSorted,
        productsAll,
        productsFiltered,
        productsFilteredWithoutMe,
        filterByThese,
        isLoading: false,
      };
    case FILTER_PRODUCT_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };
    case SORTING_PRODUCT_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case SORTING_PRODUCT_SUCCESS:
      return {
        productMostPopular,
        productsSorted,
        productsAll,
        productsFiltered,
        isLoading: false,
        sortingBy,
      };
    case SORTING_PRODUCT_ERR:
      return {
        ...state,
        error: err,
        isLoading: false,
      };
    default:
      return state;
  }
};

export { productReducer };
