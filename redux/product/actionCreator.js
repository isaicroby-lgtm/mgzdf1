import { intersection } from "lodash";

import { filterUpdate } from "../filters/actionCreator";
import productActions from "./actions";

const {
  filterProductBegin,
  filterProductSuccess,
  filterProductErr,

  sortingProductBegin,
  sortingProductSuccess,
  sortingProductErr,

  fetchProductsBegin,
  fetchProductsSuccess,
  fetchProductsErr,
} = productActions;

const fetchProducts = (admin, products) => {
  return async (dispatch) => {
    try {
      dispatch(fetchProductsBegin());

      let theProducts = [];
      if (!admin) {
        theProducts = products.filter(
          (product) => product.status === "published"
        );
      } else theProducts = [...products];
      dispatch(fetchProductsSuccess(theProducts));
    } catch (err) {
      dispatch(fetchProductsErr(err));
    }
  };
};

const sorting = (value, productsToBeSorted) => {
  let data = [];

  if (value.includes("*")) {
    const both = value.split("*");
    const sortWithThis = both[0];
    const order = both[1];
    if (order === "asc")
      data = productsToBeSorted.sort((a, b) => {
        return a[sortWithThis] - b[sortWithThis];
      });
    else
      data = productsToBeSorted.sort((a, b) => {
        return b[sortWithThis] - a[sortWithThis];
      });
  } else {
    data = productsToBeSorted.sort((a, b) => {
      if (value === "date_created")
        if (b[value] && a[value]) return b[value].seconds - a[value].seconds;
        else if (b[value]) return 1;
        else if (a[value]) return -1;

      return b[value] - a[value];
    });
  }

  return async (dispatch) => {
    try {
      dispatch(sortingProductBegin());
      dispatch(sortingProductSuccess(data, productsToBeSorted, value));
    } catch (err) {
      dispatch(sortingProductErr(err));
    }
  };
};

const filtering = (productsAll, filterByThese) => {
  return async (dispatch) => {
    dispatch(filterProductBegin());

    dispatch(filterUpdate(filterByThese));

    const productsFilteredWithoutMeLocal = {
      category: [],
      price: [],
      gender: [],
      age: [],
      name: [],
    };
    if (productsAll) {
      productsFilteredWithoutMeLocal.category = [...productsAll];
      productsFilteredWithoutMeLocal.price = [...productsAll];
      productsFilteredWithoutMeLocal.age = [...productsAll];
      productsFilteredWithoutMeLocal.name = [...productsAll];
      productsFilteredWithoutMeLocal.gender = [...productsAll];
    }

    try {
      filterByThese.forEach((filterByThis) => {
        if (filterByThis.name === "name" && filterByThis.value) {
          const filteredThese = productsAll.filter((product) => {
            return (
              product?.name
                ?.toLowerCase()
                ?.includes(filterByThis.value.toLowerCase()) ||
              product?.code
                ?.toLowerCase()
                ?.includes(filterByThis.value.toLowerCase())
            );
          });

          productsFilteredWithoutMeLocal.gender = intersection(
            productsFilteredWithoutMeLocal.gender,
            filteredThese
          );
          productsFilteredWithoutMeLocal.age = intersection(
            productsFilteredWithoutMeLocal.age,
            filteredThese
          );
          productsFilteredWithoutMeLocal.category = intersection(
            productsFilteredWithoutMeLocal.category,
            filteredThese
          );
        } else if (filterByThis.name === "price" && filterByThis.value.length) {
          const filteredThese = productsAll.filter((product) => {
            return (
              product.price >= filterByThis.value[0] &&
              product.price <= filterByThis.value[1]
            );
          });
          productsFilteredWithoutMeLocal.gender = intersection(
            productsFilteredWithoutMeLocal.gender,
            filteredThese
          );
          productsFilteredWithoutMeLocal.age = intersection(
            productsFilteredWithoutMeLocal.age,
            filteredThese
          );
          productsFilteredWithoutMeLocal.category = intersection(
            productsFilteredWithoutMeLocal.category,
            filteredThese
          );
          productsFilteredWithoutMeLocal.name = intersection(
            productsFilteredWithoutMeLocal.name,
            filteredThese
          );
        } else if (filterByThis.name === "category") {
          if (
            filterByThis.value.length &&
            !filterByThis.value.includes("all")
          ) {
            let pCopy = [];
            filterByThis.value.forEach((category) => {
              pCopy = [
                ...pCopy,
                ...productsAll.filter((product) => {
                  return product.category === category;
                }),
              ];
            });

            productsFilteredWithoutMeLocal.gender = intersection(
              pCopy,
              productsFilteredWithoutMeLocal.gender
            );
            productsFilteredWithoutMeLocal.age = intersection(
              pCopy,
              productsFilteredWithoutMeLocal.age
            );
            productsFilteredWithoutMeLocal.price = intersection(
              pCopy,
              productsFilteredWithoutMeLocal.price
            );
            productsFilteredWithoutMeLocal.name = intersection(
              pCopy,
              productsFilteredWithoutMeLocal.name
            );
          }
        } else if (filterByThis.name === "gender") {
          if (filterByThis.value.length) {
            let p = [];
            filterByThis.value.forEach((gender) => {
              p = [
                ...p,
                ...productsAll.filter((product) => {
                  return product.gender === gender;
                }),
              ];
            });
            productsFilteredWithoutMeLocal.category = intersection(
              p,
              productsFilteredWithoutMeLocal.category
            );
            productsFilteredWithoutMeLocal.age = intersection(
              p,
              productsFilteredWithoutMeLocal.age
            );
            productsFilteredWithoutMeLocal.price = intersection(
              p,
              productsFilteredWithoutMeLocal.price
            );
            productsFilteredWithoutMeLocal.name = intersection(
              p,
              productsFilteredWithoutMeLocal.name
            );
          }
        } else if (filterByThis.name === "age") {
          if (filterByThis.value.length) {
            let p = [];
            filterByThis.value.forEach((gender) => {
              p = [
                ...p,
                ...productsAll.filter((product) => {
                  return product.age === gender;
                }),
              ];
            });
            productsFilteredWithoutMeLocal.gender = intersection(
              p,
              productsFilteredWithoutMeLocal.gender
            );
            productsFilteredWithoutMeLocal.category = intersection(
              p,
              productsFilteredWithoutMeLocal.category
            );
            productsFilteredWithoutMeLocal.price = intersection(
              p,
              productsFilteredWithoutMeLocal.price
            );
            productsFilteredWithoutMeLocal.name = intersection(
              p,
              productsFilteredWithoutMeLocal.name
            );
          }
        }
      });

      const products1Intersection = intersection(
        productsFilteredWithoutMeLocal.price,
        productsFilteredWithoutMeLocal.gender
      );

      const products2Intersection = intersection(
        productsFilteredWithoutMeLocal.age,
        productsFilteredWithoutMeLocal.category
      );

      const products3Intersection = intersection(
        productsFilteredWithoutMeLocal.name,
        products2Intersection
      );

      const productsFiltered = intersection(
        products1Intersection,
        products3Intersection
      );

      dispatch(
        filterProductSuccess(
          productsFiltered,
          productsAll,
          productsFilteredWithoutMeLocal,
          filterByThese
        )
      );
    } catch (error) {
      console.log(error);
      dispatch(filterProductErr(error));
    }
  };
};

export { fetchProducts, sorting, filtering };
