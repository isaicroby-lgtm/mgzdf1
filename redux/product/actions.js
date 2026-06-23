const productActions = {
  FILTER_PRODUCT_BEGIN: "FILTER_PRODUCT_BEGIN",
  FILTER_PRODUCT_SUCCESS: "FILTER_PRODUCT_SUCCESS",
  FILTER_PRODUCT_ERR: "FILTER_PRODUCT_ERR",

  SORTING_PRODUCT_BEGIN: "SORTING_PRODUCT_BEGIN",
  SORTING_PRODUCT_SUCCESS: "SORTING_PRODUCT_SUCCESS",
  SORTING_PRODUCT_ERR: "SORTING_PRODUCT_ERR",

  FETCH_PRODUCTS_END: "FETCH_PRODUCTS_END",
  FETCH_PRODUCTS_BEGIN: "FETCH_PRODUCTS_BEGIN",
  FETCH_PRODUCTS_SUCCESS: "FETCH_PRODUCTS_SUCCESS",
  FETCH_PRODUCTS_ERR: "FETCH_PRODUCTS_ERR",

  fetchProductsBegin: () => {
    return {
      type: productActions.FETCH_PRODUCTS_BEGIN,
    };
  },

  fetchProductsEnd: () => {
    return {
      type: productActions.FETCH_PRODUCTS_END,
    };
  },

  fetchProductsSuccess: (data) => {
    const toBeReturned = {
      type: productActions.FETCH_PRODUCTS_SUCCESS,
      productsAll: data,
      productsFiltered: data,
      productsSorted: data,
      productsFilteredWihoutMe: data,
    };
    return toBeReturned;
  },

  fetchProductsErr: (err) => {
    return {
      type: productActions.FETCH_PRODUCTS_ERR,

      err,
    };
  },

  filterProductBegin: () => {
    return {
      type: productActions.FILTER_PRODUCT_BEGIN,
    };
  },

  filterProductSuccess: (
    productsFiltered,
    productsToBeFiltered,
    productsFilteredWithoutMe,
    filterByThese
  ) => {
    const toBeReturned = {
      type: productActions.FILTER_PRODUCT_SUCCESS,
      productsFiltered,
      productsAll: productsToBeFiltered,
      productsSorted: productsToBeFiltered,
      productsFilteredWithoutMe,
      filterByThese,
    };

    return toBeReturned;
  },

  filterProductErr: (err) => {
    return {
      type: productActions.FILTER_PRODUCT_ERR,
      err,
    };
  },

  sortingProductBegin: () => {
    return {
      type: productActions.SORTING_PRODUCT_BEGIN,
    };
  },

  sortingProductSuccess: (data, productsToBeSorted, sortingBy) => {
    return {
      type: productActions.SORTING_PRODUCT_SUCCESS,
      productsSorted: data,
      productsAll: productsToBeSorted,
      productsFiltered: productsToBeSorted,
      sortingBy,
    };
  },

  sortingProductErr: (err) => {
    return {
      type: productActions.SORTING_PRODUCT_ERR,
      err,
    };
  },
};

export default productActions;
