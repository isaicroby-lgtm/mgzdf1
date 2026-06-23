"use client";

import React, { useEffect, useState } from "react";

import { Row, Col, Spin, Pagination } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductCards from "./product-cards";
import Text from "@/components/atoms/Text";

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
  width: 100%;
  align-items: stretch;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;

  @media only screen and (max-width: 750px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;
function GridOfProducts({ isOnHomePage }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const size = 12;

  const [current, setCurrent] = useState(1);
  const [totalNumberOfProducts, setTotalNumberOfProducts] = useState(12);

  const onChangePagination = (v) => {
    if (pathname === "/") {
      router.push(`/magazin?pagina=${current + 1}`);
    } else {
      setCurrent(v);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 0);
    }
  };

  const {
    productsFiltered,
    isLoading,
    productsFavorite,
    isAdmin,
    productsAll,
  } = useSelector((state) => {
    let prAll = state.products?.productsAll || [];
    let prFiltered = state.products?.productsFiltered || [];

    if (!location?.pathname?.includes("admin")) {
      prAll = prAll.filter((p) => p.status !== "draft");
      prFiltered = prFiltered.filter((p) => p.status !== "draft");
    }

    return {
      productsFiltered: prFiltered,
      isLoading: state.products.isLoading,
      productsAll: prAll,
      productsFavorite: state.favorites.products,
      isAdmin: state.userInfo.isAdmin,
    };
  });

  const products = isOnHomePage ? productsAll : productsFiltered;

  useEffect(() => {
    if (totalNumberOfProducts !== products.length) {
      setTotalNumberOfProducts(products.length);

      if (products.length <= size) {
        setCurrent(1);
      }
    }
  }, [products]);

  useEffect(() => {
    if (pathname === "/magazin" && searchParams.get("pagina")) {
      const extractedNumber = parseInt(
        searchParams.get("pagina").match(/\d+/),
        10
      );

      setCurrent(extractedNumber);
    }
  }, [pathname, searchParams]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {!products || isLoading || isLoading === undefined ? (
        <div className="spin" style={{ marginTop: 24 }}>
          <Spin />
          <p style={{ margin: 0, padding: 0 }}>Se incarca</p>
        </div>
      ) : !products.length ? (
        <div style={{ marginTop: 24 }}>
          <Text as="p1" style={{ marginBottom: 16 }}>
            Pentru a gasi produsul dorit, incearca urmatoarele:
          </Text>
          <ul
            style={{
              marginLeft: 16,
              listStyleType: "circle",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <li>Verifica daca ai scris corect termenii.</li>
            <li>Incearca sa folosesti sinonime.</li>
            <li>Incearca din nou, folosind o cautare mai generala.</li>
          </ul>
        </div>
      ) : (
        <>
          <ProductsGrid>
            {products
              ?.slice((current - 1) * size, current * size)
              .map((product) => {
                const { id } = product;
                const favorite = !!productsFavorite.find(
                  (prod) => prod.id === id
                );

                return (
                  <ProductCards
                    key={id}
                    isAdmin={isAdmin}
                    product={{
                      ...product,
                      favorite,
                      file: product.files?.[0],
                    }}
                  />
                );
              })}
          </ProductsGrid>
          <PaginationContainer>
            <Pagination
              current={current}
              pageSize={size}
              onChange={onChangePagination}
              total={totalNumberOfProducts}
              showSizeChanger={false}
            />
          </PaginationContainer>
        </>
      )}
    </div>
  );
}

export default GridOfProducts;