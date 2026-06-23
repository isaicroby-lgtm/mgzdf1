"use client";

import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { Row, Col, Radio, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";

import { filtering, sorting } from "@/redux/product/actionCreator";
import Button from "@/components/atoms/Button";
import PageHeader from "@/components/atoms/PageHeader";

import theme from "@/components/atoms/theme";

import { Main } from "../../style";
import { TopToolBox } from "../style";

const Filters = dynamic(() => import("./filters"), { ssr: false });
const GridOfProducts = dynamic(() => import("./grid-of-products"), {
  ssr: false,
});

function ProductsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState();

  const { isAdmin, productsFiltered, products, filterByTheseR } = useSelector(
    (state) => {
      return {
        productsFiltered: state.products.productsFiltered,
        products: state.products.productsAll,
        filterByTheseR: state.products.filterByThese || [],
        adminInterface: state.userInfo.adminInterface,
        isAdmin: state.userInfo.isAdmin,
      };
    }
  );

  const dispatch = useDispatch();

  const onSorting = (e) => {
    dispatch(
      sorting(
        e.target.value,
        productsFiltered && productsFiltered.length
          ? productsFiltered
          : products
      )
    );
  };

  useEffect(() => {
    if (isAdmin && pathname.includes("admin")) {
      let copy = [...filterByTheseR];

      const name = "name";
      const value = searchValue;

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

      dispatch(filtering(products, [...copy]));
    }
  }, [searchValue]);

  return (
    <>
      <PageHeader
        ghost
        title={isAdmin && pathname.includes("admin") && "Management produse"}
        buttons={
          isAdmin && pathname.includes("admin")
            ? [
                <div key="1" className="page-header-actions">
                  <Button
                    size="small"
                    key="4"
                    type="primary"
                    onClick={() => router.push("/admin/produse-adauga")}
                  >
                    <FeatherIcon icon="plus" size={14} />
                    Adauga un produs
                  </Button>
                </div>,
              ]
            : []
        }
      />
      <Main theme={theme}>
        {isAdmin && pathname.includes("admin") && (
          <Row gutter={15}>
            <Col xs={24}>
              <TopToolBox theme={theme}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <Input
                    size="large"
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                    style={{ width: "50%", minWidth: 300 }}
                    suffix={<FeatherIcon icon="search" size={18} />}
                  />
                </div>
              </TopToolBox>
            </Col>
          </Row>
        )}
        <Row gutter={[30, 30]}>
          <Col
            className="product-sidebar-col"
            xxl={5}
            xl={7}
            lg={7}
            md={10}
            xs={24}
          >
            <Filters />
          </Col>
          <Col className="product-content-col" xxl={19} lg={17} md={14} xs={24}>
            <TopToolBox theme={theme}>
              <Row gutter={0}>
                <Col xxl={10} xs={24}>
                  <div className="product-list-action d-flex justify-content-between align-items-center">
                    <div className="product-list-action__tab">
                      <span className="toolbox-menu-title">Sorteaza dupa:</span>
                      <Radio.Group onChange={onSorting}>
                        <Radio.Button value="date_created">
                          Cele mai noi
                        </Radio.Button>
                        <Radio.Button value="price*asc">
                          Pret crescator
                        </Radio.Button>
                        <Radio.Button value="price*desc">
                          Pret descrescator
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                </Col>
              </Row>
            </TopToolBox>
            <GridOfProducts />
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default ProductsPage;
