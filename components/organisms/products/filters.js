import React, { useEffect, useState } from "react";

import FeatherIcon from "feather-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import { filtering } from "@/redux/product/actionCreator";
import Cards from "@/components/atoms/Cards";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import Slider from "@/components/atoms/Slider";
import { CheckboxGroup } from "@/components/atoms/Checkbox/checkbox";

import { Sidebar, SidebarSingle } from "../style";

const getAllMinAndMax = (products) => {
  let maxPrice = Number.NEGATIVE_INFINITY;
  let minPrice = Number.POSITIVE_INFINITY;

  if (products)
    products.forEach((product) => {
      if (maxPrice < product.price) maxPrice = product.price -= "0";
      if (minPrice > product.price) minPrice = product.price -= "0";

      minPrice -= "0";
      maxPrice -= "0";
    });

  return { minPrice, maxPrice };
};

const Filters = ({ closeFilterModal }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const [state, setState] = useState({
    minAll: 0,
    maxAll: 5000,
  });

  const {
    productsFilteredWithoutMe,
    minPrice,
    maxPrice,
    products,
    filterByTheseR,
    categoryOptions,
    ageOptions,
  } = useSelector((state) => {
    const { productsAll, productsFilteredWithoutMe, filterByThese } =
      state.products;

    const { minPrice, maxPrice } = getAllMinAndMax(
      productsFilteredWithoutMe?.price?.length
        ? productsFilteredWithoutMe.price
        : productsAll
    );

    return {
      productsFilteredWithoutMe,
      minPrice,
      maxPrice,
      products: productsAll,
      filterByTheseR: filterByThese || [],
      categoryOptions: state.setariRules.category_options,
      ageOptions: state.setariRules.age_options,
    };
  });

  const optionsAge = [];

  const optionsGen = [
    {
      label: (
        <>
          <span>Baiat</span>
          <span className="category-count">
            {productsFilteredWithoutMe
              ? productsFilteredWithoutMe?.gender?.filter(
                  (product) => product.gender === "baieti"
                )?.length
              : products?.filter((product) => product.gender === "baieti")
                  .length}
          </span>
        </>
      ),
      value: "baieti",
    },
    {
      label: (
        <>
          <span>Fata</span>
          <span className="category-count">
            {productsFilteredWithoutMe
              ? productsFilteredWithoutMe?.gender?.filter(
                  (product) => product.gender === "fete"
                )?.length
              : products?.filter((product) => product.gender === "fete").length}
          </span>
        </>
      ),
      value: "fete",
    },
    {
      label: (
        <>
          <span>Unisex</span>
          <span className="category-count">
            {productsFilteredWithoutMe
              ? productsFilteredWithoutMe?.gender?.filter(
                  (product) => product.gender === "unisex"
                )?.length
              : products?.filter((product) => product.gender === "unisex")
                  .length}
          </span>
        </>
      ),
      value: "unisex",
    },
  ];

  const optionsCategory = [
    {
      value: "all",
      label: (
        <>
          <span>Toate</span>
          <span className="category-count">
            {productsFilteredWithoutMe
              ? productsFilteredWithoutMe?.category?.length
              : products?.length}
          </span>
        </>
      ),
    },
  ];

  if (ageOptions)
    optionsAge.push(
      ...ageOptions.map((cat) => {
        return {
          value: cat.toLowerCase(),
          label: (
            <>
              <span style={{ textTransform: "capitalize" }}>{cat}</span>

              <span className="category-count">
                {productsFilteredWithoutMe
                  ? productsFilteredWithoutMe?.age?.filter(
                      (product) =>
                        product.age.toLowerCase() === cat.toLowerCase()
                    )?.length
                  : products?.filter(
                      (product) =>
                        product.age.toLowerCase() === cat.toLowerCase()
                    ).length}
              </span>
            </>
          ),
        };
      })
    );

  if (categoryOptions)
    optionsCategory.push(
      ...categoryOptions.map((cat) => {
        return {
          value: cat.toLowerCase(),
          label: (
            <>
              <span style={{ textTransform: "capitalize" }}>{cat}</span>

              <span className="category-count">
                {productsFilteredWithoutMe
                  ? productsFilteredWithoutMe?.category?.filter(
                      (product) =>
                        product.category.toLowerCase() === cat.toLowerCase()
                    )?.length
                  : products?.filter(
                      (product) =>
                        product.category.toLowerCase() === cat.toLowerCase()
                    ).length}
              </span>
            </>
          ),
        };
      })
    );

  const onChangeFilter = (value, name) => {
    if (closeFilterModal) closeFilterModal();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (products) {
      let copy = [...filterByTheseR];

      const index = copy.findIndex((elem) => {
        return elem.name === name;
      });

      if (name) {
        if (index === -1) {
          copy.push({ value, name });
        } else {
          copy[index] = { value, name };
        }
      } else {
        copy = [];
      }

      dispatch(filtering(products, [...copy], productsFilteredWithoutMe));
    }
  };

  useEffect(() => {
    if (products) {
      if (
        searchParams.get("filter-nume") !== undefined &&
        searchParams.get("filter-nume") !== null
      ) {
        onChangeFilter(searchParams.get("filter-nume"), "name");
      }
      if (searchParams.get("categorie")) {
        onChangeFilter([searchParams.get("categorie")], "category");
      }
    }
  }, [searchParams, products]);

  useEffect(() => {
    if (minPrice < 100000) {
      setState({
        minAll: minPrice,
        maxAll: maxPrice,
      });
    }
  }, [minPrice, maxPrice]);

  const { minAll, maxAll } = state;

  return (
    <Sidebar id="all-shop-filters">
      {filterByTheseR && (
        <Cards
          title={
            <span>
              <FeatherIcon icon="sliders" size={14} />
              Filtrare
            </span>
          }
          more={
            <Button type="primary" outlined onClick={() => onChangeFilter()}>
              Resetează toate filtrele
            </Button>
          }
        >
          <SidebarSingle>
            <Heading as="h5">Interval de pret</Heading>
            <Slider
              range
              max={maxAll}
              min={minAll}
              onAfterChange={(e) => onChangeFilter(e, "price")}
              defaultValues={
                filterByTheseR.find((obj) => obj.name === "price")?.value || [
                  0,
                  maxAll,
                ]
              }
            />
            <p className="price-range-text">
              {minAll}RON - {maxAll}RON
            </p>
          </SidebarSingle>

          <SidebarSingle>
            <Heading as="h5">Vârsta</Heading>
            <CheckboxGroup
              value={filterByTheseR.find((obj) => obj.name === "age")?.value}
              options={optionsAge}
              onChange={(value) => onChangeFilter(value, "age")}
            />
          </SidebarSingle>

          <SidebarSingle>
            <Heading as="h5">Categorie</Heading>
            <CheckboxGroup
              value={
                filterByTheseR.find((obj) => obj.name === "category")?.value
              }
              options={optionsCategory}
              onChange={(value) => onChangeFilter(value, "category")}
            />
          </SidebarSingle>

          <SidebarSingle>
            <Heading as="h5">Gen</Heading>
            <CheckboxGroup
              value={filterByTheseR.find((obj) => obj.name === "gender")?.value}
              options={optionsGen}
              onChange={(value) => onChangeFilter(value, "gender")}
            />
          </SidebarSingle>
        </Cards>
      )}
    </Sidebar>
  );
};

export default Filters;
