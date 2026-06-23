"use client";

import React, { useEffect, useState } from "react";
import { Col, Input, InputNumber, Row, Table } from "antd";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";

import { updatePrice } from "@/api/products";

import { fetchStockTableData, setProductStock } from "@/api/stock";
import Modal from "@/components/atoms/Modal";
import PageHeader from "@/components/atoms/PageHeader";
import { Main, TableWrapper } from "@/components/style";
import theme from "@/components/atoms/theme";
import Cards from "@/components/atoms/Cards";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import { TopToolBox } from "../style";

const TableWithAlignEnd = styled(Table)`
  .ant-table-cell:last-child {
    text-align: end;
  }
`;

const columnsProduseStoc = [
  {
    title: "Nume produs",
    dataIndex: "name",
    key: "name",

    sorter: (a, b) => {
      return b.name?.localeCompare(a.name);
    },
  },
  {
    title: "Cod produs",
    dataIndex: "code",
    key: "code",

    sorter: (a, b) => {
      return b.code?.localeCompare(a.code);
    },
  },
  {
    title: "Pret produs",
    dataIndex: "price",
    key: "price",

    sorter: (a, b) => {
      return b.price - a.price;
    },
  },
  {
    title: "Nr. bucati in stoc",
    dataIndex: "stock",
    key: "stock",

    sorter: (a, b) => {
      return b.stock - a.stock;
    },
  },
];

const ProductStock = () => {
  const [modalStocProdus, setModalStocProdus] = useState();
  const [newPrice, setNewPrice] = useState();
  const [oldPrice, setOldPrice] = useState();
  const [greenTax, setGreenTax] = useState();
  const [loading, setLoading] = useState(false);
  const [stockToAdd, setStockToAdd] = useState();

  const [searchValue, setSearchValue] = useState();

  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetching = async () => {
      const d = await fetchStockTableData();
      setData(d);
      setRawData(d);
    };

    fetching();
  }, []);

  useEffect(() => {
    const filtered = rawData.filter(
      (d) =>
        d?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        d?.code?.toLowerCase()?.includes(searchValue?.toLowerCase())
    );
    setData(filtered);
  }, [searchValue]);

  const handleModalOk = async () => {
    setError("");

    try {
      setLoading(true);
      if (stockToAdd != modalStocProdus.stock && stockToAdd>=0) {
        const newStock = await setProductStock(modalStocProdus.id, stockToAdd);
        const _data = [...data];
        _data[modalStocProdus.rowIndex].stock = newStock;

        setData([..._data]);
      }
      setModalStocProdus();
    } catch (error) {
      setError(error.message);
    }

    await updatePrice(
      modalStocProdus.id,
      oldPrice !== undefined ? oldPrice : modalStocProdus?.oldPrice,
      newPrice || modalStocProdus?.price,
      greenTax !== undefined ? greenTax : modalStocProdus?.greenTax
    );
  };

  return (
    <>
      <Modal
        visible={modalStocProdus}
        onCancel={() => {
          setModalStocProdus();
          setStockToAdd();
          setNewPrice();
          setOldPrice();
          setGreenTax();
        }}
        confirmLoading={loading}
        onOk={handleModalOk}
        color="primary"
        type="primary"
        okText="Salveaza modificarile"
      >
        {modalStocProdus && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Heading as="h4">Date produs</Heading>
            <Text as="p5">Nume produs: {modalStocProdus.name}</Text>
            <Text as="p5">Cod produs: {modalStocProdus.code}</Text>
            <Text as="p5">Pret produs: {modalStocProdus.price}</Text>

            {modalStocProdus.type === "simple" && (
              <>
                <Text as="p5">Stoc produs: {modalStocProdus.stock}</Text>
                <Heading as="h5" style={{ marginTop: 12 }}>
                  Seteaza stoc
                </Heading>
                <Text as="p5">
                  Stoc produs in prezent: {modalStocProdus.stock || 0}
                </Text>

                <InputNumber
                  value={
                    stockToAdd !== null && stockToAdd !== undefined
                      ? stockToAdd
                      : modalStocProdus.stock
                  }
                  onChange={(v) => {
                    if (v >= 0) setStockToAdd(v);
                  }}
                />
                <Heading as="h5" style={{ marginTop: 12 }}>
                  Schimbă prețul
                </Heading>
                <InputNumber
                  value={
                    newPrice !== undefined ? newPrice : modalStocProdus.price
                  }
                  onChange={(v) => {
                    if (v >= 0) setNewPrice(v);
                  }}
                />
                <Heading as="h5" style={{ marginTop: 12 }}>
                  Schimbă prețul taiat
                </Heading>
                <InputNumber
                  value={
                    oldPrice !== undefined ? oldPrice : modalStocProdus.oldPrice
                  }
                  onChange={(v) => {
                    if (v >= 0 || v === null) setOldPrice(v);
                  }}
                />

                <Heading as="h5" style={{ marginTop: 12 }}>
                  Schimbă taxa timbru verde
                </Heading>
                <InputNumber
                  value={
                    greenTax !== undefined ? greenTax : modalStocProdus.greenTax
                  }
                  onChange={(v) => {
                    setGreenTax(v);
                  }}
                />
              </>
            )}

            {error && <h4>{error}</h4>}
          </div>
        )}
      </Modal>
      <PageHeader title="Stoc produse" />
      <Main theme={theme}>
        <Cards headless>
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
          <TableWrapper theme={theme} className="table-order table-responsive">
            <TableWithAlignEnd
              dataSource={data}
              columns={columnsProduseStoc}
              onRow={(record) => {
                return {
                  onClick: async (event) => {
                    const ri = data.findIndex((d) => d.id === record.id);
                    setModalStocProdus({ ...data[ri], rowIndex: ri });

                    setStockToAdd();
                    setError("");
                  },
                };
              }}
            />
          </TableWrapper>
        </Cards>
      </Main>
    </>
  );
};

export default ProductStock;
