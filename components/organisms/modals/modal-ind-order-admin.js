import React, { useEffect, useState } from "react";

import { Row, Col, Table, Input, Select, Form, InputNumber } from "antd";
import { useForm } from "antd/lib/form/Form";
import styled from "styled-components";
import dayjs from "dayjs";
import FeatherIcon from "feather-icons-react";

import {
  getAwbStatus,
  samedayCreateAwb,
  samedayDeleteAwb,
} from "@/api/shipping";
import {
  cancelOrder,
  deleteOrder,
  updateOrderFinishDate,
  updateStatusComanda,
} from "@/api/comenzi";
import { isProductInStock, reduceProductStock } from "@/api/stock";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/public/firebase";
import { resendOrderEmail, getPretAchizitie } from "@/api/comenzi";
import { toNumber } from "lodash";

import {
  cancelInvoice,
  getFactura,
  makeInvoice,
  sendCustomerOrderEmail,
} from "@/api/smartbill";
import { awardPoints } from "@/api/users";

import Modal from "@/components/atoms/Modal";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import theme from "@/components/atoms/theme";
import { TableWrapper } from "@/components/style";
import Button from "@/components/atoms/Button";

import { RomaniaCounties } from "@/utility/counties";
import renderBadge, { badgeKeys } from "@/utility/renderBadge";
import { TopToolBox } from "../style";

const FormStyled = styled(Form)``;

const columnsPr = [
  {
    title: "Nume produs",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Cod produs",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Pret",
    dataIndex: "price",
    key: "price",
  },
];

const ModalIndOrderAdmin = ({
  modalDetaliiComanda,
  setModalDetaliiComanda,
  allProducts,
}) => {
  const [form] = useForm();

  const [confirmDelete, setConfirmDelete] = useState();
  const [selectExtraProducts, setSelectExtraProducts] = useState();
  const [openIstoricStatus, setOpenIstoricStatus] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [openCreateAwbModal, setOpenCreateAwbModal] = useState();
  const [openCreateFacturaModal, setOpenCreateFacturaModal] = useState();

  const [cancelAwbModal, setCancelAwbModal] = useState();
  const [cancelInvoiceModal, setCancelInvoiceModal] = useState();

  const [confirmCancel, setConfirmCancel] = useState();

  const [loading, setLoading] = useState();
  const [profit, setProfit] = useState(null);

  useEffect(() => {
    const fetchProfit = async () => {
      const result = await calculateProfitWithPurchasePrice(
        modalDetaliiComanda?.products || []
      );
      setProfit(result.toFixed(2));
    };

    fetchProfit();
  }, [modalDetaliiComanda]);
  const [numberOfPackages, setNumberOfPackages] = useState(1);

  const [packages, setPackages] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [awbStatus, setAwbStatus] = useState();

  const [status, setStatus] = useState("");

  const [newProducts, setNewProducts] = useState([]); //has price per unit
  useEffect(() => {
    setPackages((oldPackages) => {
      const newPackages = Array.from(
        { length: numberOfPackages },
        (_, i) =>
          oldPackages[i] ?? { lungime: 1, latime: 1, inaltime: 1, greutate: 1 }
      );
      return newPackages;
    });
  }, [numberOfPackages]);

  let oldProducts = modalDetaliiComanda
    ? JSON.parse(JSON.stringify(modalDetaliiComanda.products))
    : [];

  const createAwb = async (orderId, parcelData, clientData) => {
    try {
      const { awb, awbProvider } = await samedayCreateAwb(
        orderId,
        parcelData,
        clientData
      );
      return { awb, awbProvider };
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  const deleteAwb = async (orderId) => {
    try {
      await samedayDeleteAwb(orderId);
      setModalDetaliiComanda({ ...modalDetaliiComanda, awb: null });
    } catch (e) {
      console.log(e);
    }
  };
  const calculateProfitWithPurchasePrice = async (products) => {
    const tvaRate = 21; // TVA de 19%
  
    // Calculate total purchase price (without VAT)
    const pricePurchaseWithoutVAT = await Promise.all(
      products.map(async (product) => {
        const purchasePrice = await getPretAchizitie(product.code);
        // CORECTARE: Înmulțim prețul de achiziție cu cantitatea
        return purchasePrice ? purchasePrice * product.quantity : 0;
      })
    ).then((values) => values.reduce((total, value) => total + value, 0));
  
    // Calculate total sale price (without VAT)
    const priceSaleWithVAT = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    const priceSaleWithoutVAT = priceSaleWithVAT / (1 + tvaRate / 100);
  
    // Calculate gross profit
    const grossProfit = priceSaleWithoutVAT - pricePurchaseWithoutVAT;
  
    // Delivery and packaging tax calculations
    const deliveryTaxWithVAT = 
      priceSaleWithVAT <= 150 ? 2 : 
      priceSaleWithVAT <= 300 ? 5 : 10;
    
    const packagingTaxWithVAT = 
      priceSaleWithVAT <= 180 ? 1 :
      priceSaleWithVAT <= 300 ? 2 :
      priceSaleWithVAT <= 450 ? 4 : 5;
  
    const deliveryTaxWithoutVAT = deliveryTaxWithVAT / (1 + tvaRate / 100);
    const packagingTaxWithoutVAT = packagingTaxWithVAT / (1 + tvaRate / 100);
  
    // Adjust profit for taxes
    const totalTaxesWithoutVAT = deliveryTaxWithoutVAT + packagingTaxWithoutVAT;
    const adjustedGrossProfit = grossProfit - totalTaxesWithoutVAT;
  
    // Profit tax (1% of adjusted gross profit)
    const profitTax = adjustedGrossProfit * 0.01;
  
    // Final net profit
    const netProfit = adjustedGrossProfit - profitTax;
  
    return netProfit;
  };

  const handleModifyOrder = async () => {
    const condensedProducts = [];

    for (const product of newProducts) {
      let found = false;
      for (const p of condensedProducts) {
        if (p.price == product.price) {
          if (p.id == product.id) {
            p.quantity += product.quantity;
            found = true;
            break;
          }
        }
      }

      if (!found) condensedProducts.push(JSON.parse(JSON.stringify(product)));
    }

    const addedProducts = [];

    //compute added items regarding to the original order
    for (const product of condensedProducts) {
      let eq = {};
      let found = false;

      for (const p of oldProducts) {
        if (p.price / p.quantity == product.price) {
          if (p.id == product.id) {
            eq = p;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        product.added = product.quantity;
        addedProducts.push({
          name: product.name,
          id: product.id,
          added: product.quantity,
          picture: product.fileDownloadURL,
        });
      } else {
        let { added, quantity } = eq;
        if (!added) added = 0;

        if (product.quantity == quantity) {
          product.added = added;
        } else if (product.quantity > quantity) {
          product.added = added + (product.quantity - quantity);
          addedProducts.push({
            name: product.name,
            id: product.id,
            added: product.quantity - quantity,
            picture: product.fileDownloadURL,
          });
        } else {
          const n_added = added - (quantity - product.quantity);
          product.added = n_added > 0 ? n_added : 0;
        }
      }
      product.price *= product.quantity;
    }

    //check added products stock
    const notInStock = [];
    for (const product of addedProducts) {
      const { id, added, name } = product;

      if (!(await isProductInStock(id, added))) {
        notInStock.push(name);
      } else {
        reduceProductStock(id, added);
      }
    }

    if (notInStock.length) {
      alert(
        `Produsele ${notInStock.join(
          ", "
        )} au stoc insuficient pentru această modificare.`
      );
      return;
    }

    //compute old discountable price
    let oldDiscountablePrice = 0;
    for (const product of oldProducts) {
      const unitPrice = product.price / product.quantity;
      let { added } = product;
      if (!added) added = 0;

      oldDiscountablePrice += (product.quantity - added) * unitPrice;
    }

    const roundNumber = (x) => {
      return parseFloat((Math.round(x * 100) / 100).toFixed(2));
    };

    //compute new discountable price
    let newDiscountablePrice = 0;
    for (const product of condensedProducts) {
      product.price = roundNumber(product.price);

      let unitPrice = product.price / product.quantity;

      unitPrice = roundNumber(unitPrice);
      let { added } = product;
      if (!added) added = 0;
      newDiscountablePrice += (product.quantity - added) * unitPrice;
    }

    const discounts = modalDetaliiComanda.discounts || [];
    for (const discount of discounts) {
      discount.value *= newDiscountablePrice / oldDiscountablePrice;
      discount.value = roundNumber(discount.value);
    }

    let total =
      condensedProducts?.reduce((a, b) => a + b.price, 0) +
      modalDetaliiComanda.shippingPrice;
    for (const discount of discounts) {
      total -= discount.value;
    }

    total = roundNumber(total);

    if (condensedProducts.length === 0) {
      alert("Comanda nu poate avea 0 produse");
      return;
    }

    await cancelInvoice(modalDetaliiComanda.docId);
    await deleteAwb(modalDetaliiComanda.docId);
    await updateDoc(doc(db, "orders", modalDetaliiComanda?.docId), {
      products: condensedProducts,
      discounts,
      price: total,
    });
    await resendOrderEmail(modalDetaliiComanda?.docId);
    window.location.reload(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newKeys) => {
      setSelectedRowKeys(newKeys);
    },
  };

  const items = [];

  for (let i = 1; i <= numberOfPackages; i++) {
    items.push(
      <Row gutter={12} key={i}>
        <Col>
          <InputNumber
            value={packages[i]?.lungime ?? 1}
            onChange={(v) => {
              const oldPackage = packages[i] || {
                lungime: 1,
                latime: 1,
                inaltime: 1,
                greutate: 1,
              };
              oldPackage.lungime = v;
              setPackages((oldPackages) => {
                const copyOldPackages = { ...oldPackages };
                copyOldPackages[i] = oldPackage;
                return copyOldPackages;
              });
            }}
            placeholder="Lungime"
          />
        </Col>
        <Col>
          <InputNumber
            value={packages[i]?.latime ?? 1}
            onChange={(v) => {
              const oldPackage = packages[i] || {
                lungime: 1,
                latime: 1,
                inaltime: 1,
                greutate: 1,
              };
              oldPackage.latime = v;
              setPackages((oldPackages) => {
                const copyOldPackages = { ...oldPackages };
                copyOldPackages[i] = oldPackage;
                return copyOldPackages;
              });
            }}
            placeholder="Latime"
          />
        </Col>
        <Col>
          <InputNumber
            value={packages[i]?.inaltime ?? 1}
            onChange={(v) => {
              const oldPackage = packages[i] || {
                lungime: 1,
                latime: 1,
                inaltime: 1,
                greutate: 1,
              };
              oldPackage.inaltime = v;
              setPackages((oldPackages) => {
                const copyOldPackages = { ...oldPackages };
                copyOldPackages[i] = oldPackage;
                return copyOldPackages;
              });
            }}
            placeholder="Inaltime"
          />
        </Col>
        <Col>
          <InputNumber
            value={packages[i]?.greutate ?? 1}
            onChange={(v) => {
              const oldPackage = packages[i] || {
                lungime: 1,
                latime: 1,
                inaltime: 1,
                greutate: 1,
              };
              oldPackage.greutate = v;
              setPackages((oldPackages) => {
                const copyOldPackages = { ...oldPackages };
                copyOldPackages[i] = oldPackage;
                return copyOldPackages;
              });
            }}
            placeholder="kg"
          />
        </Col>
      </Row>
    );
  }

  useEffect(() => {
    setStatus(modalDetaliiComanda?.status);
  }, [modalDetaliiComanda?.status]);

  useEffect(() => {
    setNewProducts(
      modalDetaliiComanda
        ? JSON.parse(JSON.stringify(modalDetaliiComanda.products)).map((p) => {
            const _p = p;
            _p.price /= _p.quantity;
            return _p;
          })
        : []
    );
  }, [modalDetaliiComanda]);

  useEffect(() => {
    const _getAwbStatus = async () => {
      if (modalDetaliiComanda?.docId) {
        const stat = await getAwbStatus(modalDetaliiComanda.docId);

        if (stat) {
          //setAwbStatus(awbStatus.expeditionStatus.statusState);
          setAwbStatus(stat);
        } else {
          setAwbStatus("nu exista awb");
        }
      }
    };
    if (modalDetaliiComanda) _getAwbStatus();
  }, [modalDetaliiComanda]);

  return (
    <>
      <Modal
        visible={cancelInvoiceModal}
        onCancel={() => setCancelInvoiceModal()}
        onOk={async () => {
          await cancelInvoice(modalDetaliiComanda.docId);
          const copy = { ...modalDetaliiComanda };
          copy.invoiceId = null;
          setModalDetaliiComanda(copy);
          setCancelInvoiceModal(false);
        }}
        title={"Esti sigur ca vrei sa anulezi aceasta factura?"}
      />
      <Modal
        visible={cancelAwbModal}
        onCancel={() => setCancelAwbModal()}
        onOk={async () => {
          await samedayDeleteAwb(modalDetaliiComanda.docId);
          const copy = { ...modalDetaliiComanda };
          copy.awb = null;
          setModalDetaliiComanda(copy);
          setCancelAwbModal(false);
        }}
        title={"Esti sigur ca vrei sa anulezi acest awb?"}
      />
      <Modal
        isLoading={loading}
        visible={openCreateFacturaModal && modalDetaliiComanda}
        okText={"Creeaza factura"}
        type="primary"
        color="primary"
        onCancel={() => setOpenCreateFacturaModal()}
        width={1000}
        onOk={async () => {
          setLoading(true);
          const data = form.getFieldsValue();

          const invoiceClientData = {
            county: data.county,
            city: data.city,
            address: data.adress + " " + data.apartment,
            zipCode: data.zipCode,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email,
          };
          const { invoiceId } = await makeInvoice(
            modalDetaliiComanda?.docId,
            invoiceClientData
          );

          await updateStatusComanda(modalDetaliiComanda.docId, "in lucru");
          await updateOrderFinishDate(modalDetaliiComanda.docId);
          setLoading(false);
          const copy = { ...modalDetaliiComanda };
          copy.invoiceId = invoiceId;
          copy.status = "in lucru";
          setModalDetaliiComanda(copy);
          setOpenCreateFacturaModal(false);
          //window.location.reload(false);
        }}
      >
        <FormStyled initialValues={modalDetaliiComanda} form={form}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 16,
              marginTop: 12,
            }}
          >
            <Heading as="h5" style={{ fontWeight: 500, marginTop: 32 }}>
              Detalii facturare
            </Heading>

            <div style={{ display: "flex", gap: 16 }}>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="firstName"
              >
                <Input size="large" placeholder="Prenume" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="lastName"
              >
                <Input size="large" placeholder="Nume" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="email"
              >
                <Input size="large" placeholder="Email" readOnly />
              </Form.Item>
            </div>

            {modalDetaliiComanda?.isCompany ? (
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  rules={[
                    { required: modalDetaliiComanda?.isCompany, message: "" },
                  ]}
                  name="companyName"
                  style={{ margin: 0, padding: 0, width: "100%" }}
                >
                  <Input size="large" placeholder="Nume companie" />
                </Form.Item>
                <Form.Item
                  rules={[
                    { required: modalDetaliiComanda?.isCompany, message: "" },
                  ]}
                  name="companyCui"
                  style={{ margin: 0, padding: 0, width: "100%" }}
                >
                  <Input size="large" placeholder="CUI companie" />
                </Form.Item>
              </div>
            ) : null}

            <Form.Item
              rules={[{ required: true, message: "" }]}
              style={{ margin: 0, padding: 0, width: "100%" }}
              name="adress"
            >
              <Input size="large" placeholder="Adresa" />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "" }]}
              style={{ margin: 0, padding: 0, width: "100%" }}
              name="apartment"
            >
              <Input size="large" placeholder="Apartament, nr, etc" />
            </Form.Item>

            <div style={{ display: "flex", gap: 16 }}>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="county"
              >
                <Select
                  showSearch
                  placeholder="Judet"
                  style={{ width: "100%" }}
                  options={RomaniaCounties.map((county) => {
                    return {
                      value: county,
                      label: county,
                    };
                  })}
                ></Select>
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="city"
              >
                <Input size="large" placeholder="Oraș" />
              </Form.Item>
            </div>

            <Form.Item
              rules={[{ required: true, message: "" }]}
              style={{ margin: 0, width: "100%" }}
              name="zipCode"
            >
              <Input size="large" placeholder="Cod postal" />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "" }]}
              style={{ margin: 0, marginBottom: 32, padding: 0, width: "100%" }}
              name="phone"
            >
              <Input size="large" placeholder="Număr telefon" />
            </Form.Item>

            <div>
              <Heading as={"h5"}>Detalii plata</Heading>
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  label="Plata ramburs"
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="cash_on_delivery"
                >
                  <Input
                    size="large"
                    placeholder="Plata ramburs"
                    readOnly
                  ></Input>
                </Form.Item>
                <Form.Item
                  label="Total factura"
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="price"
                >
                  <Input size="large" readOnly placeholder="Total factura" />
                </Form.Item>
              </div>
            </div>
          </div>
        </FormStyled>
      </Modal>
      <Modal
        isLoading={loading}
        visible={openCreateAwbModal && modalDetaliiComanda}
        okText={"Creeaza awb"}
        type="primary"
        color="primary"
        onCancel={() => setOpenCreateAwbModal()}
        width={1000}
        onOk={async () => {
          try {
            setLoading(true);
            const data = form.getFieldsValue();

            const parcelData = [];
            for (const key in packages) {
              const { lungime, latime, inaltime, greutate } = packages[key];
              parcelData.push({
                lungime,
                latime,
                inaltime,
                greutate,
              });
            }
            if (!parcelData.length) {
              alert(
                "Va rugam completati toate campurile pentru fiecare pachet in parte"
              );
              setLoading(false);
              return;
            }
            for (const p of parcelData) {
              if (!p.lungime || !p.latime || !p.inaltime || !p.greutate) {
                alert(
                  "Va rugam completati toate campurile pentru fiecare pachet in parte"
                );
                setLoading(false);
                return;
              }
            }

            const awbClientData = {
              county: data.delivery_county,
              city: data.delivery_city,
              address: data.delivery_adress + " " + data.delivery_apartment,
              zipCode: data.delivery_zipCode,
              firstName: data.delivery_firstName,
              lastName: data.delivery_lastName,
              phone: modalDetaliiComanda?.phone,
              email: modalDetaliiComanda?.email,
            };
            const { awb, awbProvider } = await createAwb(
              modalDetaliiComanda.docId,
              parcelData,
              awbClientData
            );

            await updateStatusComanda(modalDetaliiComanda.docId, "in lucru");
            await updateOrderFinishDate(modalDetaliiComanda.docId);
            setLoading(false);
            const copy = { ...modalDetaliiComanda };
            copy.status = "in lucru";
            copy.awb = awb;
            copy.awbProvider = awbProvider;
            setModalDetaliiComanda(copy);
            setOpenCreateAwbModal(false);
            //window.location.reload(false);
          } catch (error) {
            alert(error);
            console.log(error);
          }
        }}
      >
        <FormStyled initialValues={modalDetaliiComanda} form={form}>
          <Heading as="h5" style={{ fontWeight: 500, marginTop: 32 }}>
            Detalii awb
          </Heading>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 16,
              marginTop: 12,
            }}
          >
            <Row>
              <Col>
                <InputNumber
                  min={0}
                  style={{ width: 240 }}
                  value={numberOfPackages}
                  onChange={(v) => {
                    if (v > 0) setNumberOfPackages(v);
                  }}
                  placeholder="Nr. pachete"
                />
              </Col>
            </Row>
            {items}

            <>
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_firstName"
                >
                  <Input size="large" placeholder="Prenume" />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_lastName"
                >
                  <Input size="large" placeholder="Nume" />
                </Form.Item>
              </div>

              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="delivery_adress"
              >
                <Input size="large" placeholder="Adresa" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="delivery_apartment"
              >
                <Input size="large" placeholder="Apartament, nr, etc" />
              </Form.Item>

              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_county"
                >
                  <Select
                    showSearch
                    placeholder="Judet"
                    style={{ width: "100%" }}
                    options={RomaniaCounties.map((county) => {
                      return {
                        value: county,
                        label: county,
                      };
                    })}
                  ></Select>
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_city"
                >
                  <Input size="large" placeholder="Oraș" />
                </Form.Item>
              </div>

              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, width: "100%", marginBottom: 32 }}
                name="delivery_zipCode"
              >
                <Input size="large" placeholder="Cod postal" />
              </Form.Item>
            </>

            <>
              <Heading as={"h5"}>Detalii plata</Heading>
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  label="Plata ramburs"
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="cash_on_delivery"
                >
                  <Input
                    size="large"
                    placeholder="Plata ramburs"
                    readOnly
                  ></Input>
                </Form.Item>
                <Form.Item
                  label="Total factura"
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="price"
                >
                  <Input size="large" readOnly placeholder="Total factura" />
                </Form.Item>
              </div>
            </>
          </div>

          <Form.Item></Form.Item>
        </FormStyled>
      </Modal>
      <Modal
        isLoading={loading}
        visible={openCreateAwbModal && modalDetaliiComanda}
        okText={"Creeaza awb"}
        type="primary"
        color="primary"
        onCancel={() => setOpenCreateAwbModal()}
        width={1000}
        onOk={async () => {
          try {
            setLoading(true);
            const data = form.getFieldsValue();

            const parcelData = [];
            for (const key in packages) {
              const { lungime, latime, inaltime, greutate } = packages[key];
              parcelData.push({
                lungime,
                latime,
                inaltime,
                greutate,
              });
            }
            if (!parcelData.length) {
              alert(
                "Va rugam completati toate campurile pentru fiecare pachet in parte"
              );
              setLoading(false);
              return;
            }
            for (const p of parcelData) {
              if (!p.lungime || !p.latime || !p.inaltime || !p.greutate) {
                alert(
                  "Va rugam completati toate campurile pentru fiecare pachet in parte"
                );
                setLoading(false);
                return;
              }
            }

            const awbClientData = {
              county: data.delivery_county,
              city: data.delivery_city,
              address: data.delivery_adress + " " + data.delivery_apartment,
              zipCode: data.delivery_zipCode,
              firstName: data.delivery_firstName,
              lastName: data.delivery_lastName,
              phone: modalDetaliiComanda?.phone,
              email: modalDetaliiComanda?.email,
            };
            const { awb, awbProvider } = await createAwb(
              modalDetaliiComanda.docId,
              parcelData,
              awbClientData
            );

            await updateStatusComanda(modalDetaliiComanda.docId, "in lucru");
            await updateOrderFinishDate(modalDetaliiComanda.docId);
            setLoading(false);
            const copy = { ...modalDetaliiComanda };
            copy.status = "in lucru";
            copy.awb = awb;
            copy.awbProvider = awbProvider;
            setModalDetaliiComanda(copy);
            setOpenCreateAwbModal(false);
            //window.location.reload(false);
          } catch (error) {
            alert(error);
            console.log(error);
          }
        }}
      >
        <FormStyled initialValues={modalDetaliiComanda} form={form}>
          <Heading as="h5" style={{ fontWeight: 500, marginTop: 32 }}>
            Detalii awb
          </Heading>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 16,
              marginTop: 12,
            }}
          >
            <Row>
              <Col>
                <InputNumber
                  min={0}
                  style={{ width: 240 }}
                  value={numberOfPackages}
                  onChange={(v) => {
                    if (v > 0) setNumberOfPackages(v);
                  }}
                  placeholder="Nr. pachete"
                />
              </Col>
            </Row>
            {items}

            <>
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_firstName"
                >
                  <Input size="large" placeholder="Prenume" />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_lastName"
                >
                  <Input size="large" placeholder="Nume" />
                </Form.Item>
              </div>

              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="delivery_adress"
              >
                <Input size="large" placeholder="Adresa" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="delivery_apartment"
              >
                <Input size="large" placeholder="Apartament, nr, etc" />
              </Form.Item>

              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_county"
                >
                  <Select
                    showSearch
                    placeholder="Judet"
                    style={{ width: "100%" }}
                    options={RomaniaCounties.map((county) => {
                      return {
                        value: county,
                        label: county,
                      };
                    })}
                  ></Select>
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_city"
                >
                  <Input size="large" placeholder="Oraș" />
                </Form.Item>
              </div>

              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, width: "100%", marginBottom: 32 }}
                name="delivery_zipCode"
              >
                <Input size="large" placeholder="Cod postal" />
              </Form.Item>
            </>

            <>
              <Heading as={"h5"}>Detalii plata</Heading>
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  label="Plata ramburs"
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="cash_on_delivery"
                >
                  <Input
                    size="large"
                    placeholder="Plata ramburs"
                    readOnly
                  ></Input>
                </Form.Item>
                <Form.Item
                  label="Total factura"
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="price"
                >
                  <Input size="large" readOnly placeholder="Total factura" />
                </Form.Item>
              </div>
            </>
          </div>

          <Form.Item></Form.Item>
        </FormStyled>
      </Modal>
      <Modal
        width={1200}
        okText="Continua"
        title={
          <>
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
          </>
        }
        onOk={() => {
          const toAdd = [];
          for (const key of selectedRowKeys) {
            toAdd.push({
              ...allProducts[key],
              quantity: 1,
              picture: allProducts[key].fileDownloadURL,
            });
          }
          setNewProducts((old) => [...old, ...toAdd]);
          setSelectExtraProducts();
        }}
        visible={selectExtraProducts}
        onCancel={() => setSelectExtraProducts()}
      >
        <Row gutter={15}>
          <Col xs={24}>
            {allProducts?.length ? (
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <Table
                  rowSelection={rowSelection}
                  dataSource={allProducts
                    ?.map((pr, i) => ({ key: i, ...pr }))
                    ?.filter((prod) => {
                      return (
                        prod?.name
                          ?.toLowerCase()
                          ?.includes(searchValue?.toLowerCase()) ||
                        prod?.code
                          ?.toLowerCase()
                          ?.includes(searchValue?.toLowerCase())
                      );
                    })}
                  columns={columnsPr}
                />
              </TableWrapper>
            ) : null}
          </Col>
        </Row>
      </Modal>
      <Modal
        title={
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              paddingRight: "2%",
            }}
          >
            <Text>Comanda Nr. {modalDetaliiComanda?.docId} </Text>
            <Text as="p6">
              Plasată pe data de:{" "}
              {dayjs(modalDetaliiComanda?.timestamp?.toDate())
                ?.format("DD.MM.YYYY, HH:mm")
                ?.toString()}
            </Text>

            <div style={{ minWidth: 124 }}>{renderBadge(status)}</div>
          </div>
        }
        width={1400}
        footer={
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: "1%",
              marginTop: 16,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button
              disabled={
                status === "anulata de doifrati" ||
                status === "anulata de client"
              }
              onClick={async () => {
                setConfirmCancel(true);
              }}
            >
              Anuleaza comanda (aceasta actiune va anula automat awb ul creat si
              factura creata, va seta statusul comenzii la anulata de doifrati
              si va anunta clientul)
            </Button>

            <Modal
              visible={confirmCancel}
              onCancel={() => setConfirmCancel()}
              onOk={async (e) => {
                e.stopPropagation();
                await cancelOrder(modalDetaliiComanda.docId, false);
                const copy = { ...modalDetaliiComanda };
                copy.status = "anulata de doifrati";
                copy.awb = null;
                copy.invoiceId = null;
                setModalDetaliiComanda(copy);
                setConfirmCancel(false);
              }}
              title="Esti sigur ca vrei sa anulezi aceasta comanda?"
            />

            <Button
              type="danger"
              outlined
              onClick={() => setConfirmDelete(true)}
            >
              Sterge comanda
            </Button>

            <Modal
              visible={confirmDelete}
              onCancel={() => setConfirmDelete()}
              onOk={async (e) => {
                e.stopPropagation();

                await deleteOrder(modalDetaliiComanda.docId);
                window.location.reload(false);
              }}
              title="Esti sigur ca vrei sa stergi aceasta comanda?"
            />
          </div>
        }
        visible={modalDetaliiComanda}
        onCancel={() => setModalDetaliiComanda()}
      >
        <Row style={{ marginTop: 32 }}>
          <Col sm={24} md={24} lg={12}>
            <Heading as="h6">Client</Heading>
            <Row style={{ marginTop: 12 }} gutter={[12, 12]}>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">
                  Nume de familie: {modalDetaliiComanda?.lastName}
                </Text>
              </Col>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">Prenume: {modalDetaliiComanda?.firstName}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }} gutter={[12, 12]}>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">Email: {modalDetaliiComanda?.email}</Text>
              </Col>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">
                  Numar de telefon: {modalDetaliiComanda?.phone}
                </Text>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }} gutter={[12, 12]}>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">Adresa: {modalDetaliiComanda?.adress}</Text>
              </Col>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">
                  Apartament: {modalDetaliiComanda?.apartment}
                </Text>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }} gutter={[12, 12]}>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">Oras: {modalDetaliiComanda?.city}</Text>
              </Col>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">Judet: {modalDetaliiComanda?.county}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">Cod postal: {modalDetaliiComanda?.zipCode}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col sm={24} md={24} lg={12}>
                <Text as="p5">
                  Note aditionale: {modalDetaliiComanda?.notes || "Nu exista"}
                </Text>
              </Col>
            </Row>

            <Row
              style={{
                marginTop: 36,
                display: "flex",
                flexDirection: "column",
              }}
              gutter={8}
            >
              <Heading as="h6">Mai multe detalii comandă</Heading>
              <Text as="p5" style={{ marginTop: 12, color: "red" }}>
                Profit estimat:{" "}
                {profit !== null ? `${profit} RON` : "Calculating..."}
              </Text>

              <Text as="p5" style={{ marginTop: 12 }}>
                Facuta de un utilizator / cont:{" "}
                {modalDetaliiComanda?.uid ? "Da" : "Nu"}
              </Text>
              <Text as="p5" style={{ marginTop: 12 }}>
                Pret de vanzare: {modalDetaliiComanda?.price}
              </Text>
              <Text as="p5" style={{ marginTop: 12 }}>
                Pret de baza:{" "}
                {(
                  modalDetaliiComanda?.price +
                    modalDetaliiComanda?.discounts?.reduce(
                      (a, b) => a + b.value,
                      0
                    ) || 0
                ).toFixed(2)}
              </Text>
              <Text as="p5" style={{ marginTop: 12 }}>
                Modalitate de plată: {modalDetaliiComanda?.paymentType}
              </Text>
              <Text as="p5" style={{ marginTop: 12 }}>
                Modalitate de livrare: {modalDetaliiComanda?.deliveryType}
              </Text>
              <Text as="p5" style={{ marginTop: 12 }}>
                S-a folosit vreun cupon de reducere / puncte de fidelitate:{" "}
                {modalDetaliiComanda?.discounts?.length ? "Da" : "Nu"}
              </Text>

              {modalDetaliiComanda?.discounts
                ? modalDetaliiComanda?.discounts?.map((discount) => (
                    <>
                      <Text as="p5" style={{ marginTop: 12 }}>
                        {discount.name}
                      </Text>
                      <Text as="p5" style={{ marginTop: 12 }}>
                        Valoare reducere: {discount.value}
                      </Text>
                    </>
                  ))
                : null}

              {true ? (
                <>
                  <Text as="p5" style={{ marginTop: 12 }}>
                    Puncte de fidelitate: {modalDetaliiComanda?.awardedPoints}
                  </Text>
                  <Button
                    type={"primary"}
                    style={{ width: "80%", maxWidth: "80%", marginTop: 12 }}
                    onClick={async () => {
                      try {
                        await awardPoints(
                          modalDetaliiComanda?.docId,
                          modalDetaliiComanda?.hasAwardedPoints,
                          modalDetaliiComanda?.uid,
                          modalDetaliiComanda?.awardedPoints
                        );
                        const copy = { ...modalDetaliiComanda };
                        copy.hasAwardedPoints =
                          !modalDetaliiComanda.hasAwardedPoints;
                        setModalDetaliiComanda({ ...copy });
                      } catch (e) {
                        console.log(e);
                        alert("a aparut o eroare");
                      }
                    }}
                  >
                    {!modalDetaliiComanda?.hasAwardedPoints
                      ? "Acordă puncte de fidelitate (apăsați acest buton când comanda a ajuns la client)"
                      : "Anulează puncte de fidelitate (apăsați acest buton când comanda a fost returnată)"}
                  </Button>
                </>
              ) : null}
            </Row>

            <Row
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 36,
              }}
              sm={24}
              md={24}
              gutter={8}
            >
              <Heading as="h6">Status livrare comandă</Heading>
              <Text as="p5" style={{ marginTop: 12 }}>
                {awbStatus}
              </Text>
            </Row>

            <Row
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 36,
              }}
              sm={24}
              md={24}
              gutter={8}
            >
              <Heading as="h6">Trimite comandă</Heading>

              <Row style={{ marginTop: 8, gap: 12 }}>
                <Button
                  type="primary"
                  disabled={
                    loading ||
                    modalDetaliiComanda?.deliveryType === "ridicare-sediu"
                  }
                  onClick={async () => {
                    if (modalDetaliiComanda?.deliveryType === "ridicare-sediu")
                      return;
                    else if (!modalDetaliiComanda?.awb)
                      setOpenCreateAwbModal(true);
                    else {
                      if (modalDetaliiComanda?.awbProvider === "sameday") {
                        window.open(
                          `https://api-ekfyledvua-ew.a.run.app/awb/download/${modalDetaliiComanda.awb}/A6/pdf/inline`,
                          "_blank",
                          "noreferrer"
                        );
                      } else
                        window.open(
                          `https://api-ekfyledvua-ew.a.run.app/awb/download/${modalDetaliiComanda.awb}/A6/pdf/inline`,
                          "_blank",
                          "noreferrer"
                        );
                    }
                  }}
                >
                  {modalDetaliiComanda?.deliveryType === "ridicare-sediu"
                    ? "Ridicare la sediu"
                    : modalDetaliiComanda?.awb
                    ? `Vezi awb | ${modalDetaliiComanda?.awb}`
                    : "Creeaza awb"}
                </Button>
                <Button
                  style={{ width: "fit-content" }}
                  type="default"
                  disabled={!modalDetaliiComanda?.awb}
                  onClick={() => setCancelAwbModal(true)}
                >
                  Anuleaza awb
                </Button>
              </Row>

              <Row style={{ marginTop: 8, gap: 12 }}>
                <Button
                  type="primary"
                  disabled={loading}
                  onClick={async () => {
                    if (!modalDetaliiComanda?.invoiceId)
                      setOpenCreateFacturaModal(true);
                    else await getFactura(modalDetaliiComanda?.docId);
                  }}
                >
                  {modalDetaliiComanda?.invoiceId
                    ? `Vezi factura | ${modalDetaliiComanda?.invoiceId}`
                    : "Creeaza factura"}
                </Button>
                <Button
                  style={{ width: "fit-content" }}
                  type="default"
                  disabled={!modalDetaliiComanda?.invoiceId}
                  onClick={() =>
                    setCancelInvoiceModal(modalDetaliiComanda.invoiceId)
                  }
                >
                  Anuleaza factura
                </Button>
              </Row>

              <Row style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  disabled={
                    loading ||
                    !modalDetaliiComanda?.invoiceId ||
                    !modalDetaliiComanda?.awb
                  }
                  onClick={async () => {
                    await sendCustomerOrderEmail(modalDetaliiComanda?.docId);
                  }}
                >
                  Trimite factura si awb la client
                </Button>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  disabled={loading || !modalDetaliiComanda?.invoiceId}
                  onClick={async () => {
                    await sendCustomerOrderOnlyEmail(
                      modalDetaliiComanda?.docId
                    );
                  }}
                >
                  Trimite doar factura
                </Button>
              </Row>
            </Row>

            <Form layout="inline" style={{ rowGap: 14, marginTop: 12 }}>
              <Form.Item>
                <Select
                  style={{ width: 248 }}
                  value={status}
                  onChange={(v) => {
                    setStatus(v);
                  }}
                >
                  {badgeKeys.map((status, i) => {
                    return (
                      <Select.Option
                        key={i}
                        value={status}
                        label={status}
                        style={{ height: "fit-content" }}
                      >
                        {renderBadge(status)}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ padding: "8px 20px" }}
                  onClick={async () => {
                    await updateStatusComanda(
                      modalDetaliiComanda.docId,
                      status
                    );
                    window.location.reload(false);
                  }}
                >
                  Schimbă statusul comenzii
                </Button>
              </Form.Item>
            </Form>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                maxWidth: "100%",
                width: 464,
                marginTop: 32,
                marginBottom: 16,
              }}
            >
              <Heading as="h6">Istoric status comanda</Heading>

              <FeatherIcon
                icon={openIstoricStatus ? "chevron-right" : "chevron-down"}
                onClick={() => setOpenIstoricStatus((prev) => !prev)}
                size={16}
              />
            </div>
            {openIstoricStatus ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {modalDetaliiComanda?.statusHistory?.map((status) => {
                  return (
                    <div
                      key={status?.time}
                      style={{
                        boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                        maxWidth: "100%",
                        width: 464,
                        padding: 6,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {renderBadge(status?.status)}
                      <Text as="p5">{status?.time}</Text>
                    </div>
                  );
                })}
              </div>
            ) : null}
            <Text
              as="p6"
              style={{ marginTop: 16, marginBottom: 32, maxWidth: "90%" }}
            >
              Schimbarea statusului comenzii nu va anula awb-ul creat sau
              factura creata si nici nu va anunta clientul. Acest status este
              folosit pentru o mai buna organizare a comenzilor. Anularea
              comenzii schimba automat statusul comenzii, iar in rest acesta
              trebuie setat manual.
            </Text>
          </Col>

          <Col sm={24} md={24} lg={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="warning"
                outlined
                onClick={() => {
                  handleModifyOrder();
                }}
              >
                Salveaza modificarile facute la produse. (Aceasta actiune va
                anula automat awb ul si factura precedente si va anunta
                clientul)
              </Button>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="primary"
                  style={{ width: "50%", minWidth: "fit-content" }}
                  onClick={() => {
                    setNewProducts(
                      modalDetaliiComanda
                        ? JSON.parse(
                            JSON.stringify(modalDetaliiComanda.products)
                          ).map((p) => {
                            const _p = p;
                            _p.price /= _p.quantity;
                            return _p;
                          })
                        : []
                    );
                  }}
                >
                  Reseteaza modificarile facute
                </Button>

                <Button
                  type="info"
                  style={{ width: "50%", minWidth: "fit-content" }}
                  onClick={() => setSelectExtraProducts(modalDetaliiComanda)}
                >
                  Adauga un produs nou in comanda
                </Button>
              </div>
            </div>

            {newProducts?.map((produs, i) => (
              <div
                key={produs.picture}
                style={{
                  border: "1px solid",
                  borderColor: theme["border-color-deep"],
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <img
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    objectFit: "contain",
                    border: "1px solid",
                    borderColor: theme["extra-light-color"],
                    padding: 8,
                  }}
                  alt="imagine produs"
                  src={produs.picture}
                />

                <Form.Item label="Nume produs">
                  <Input size="large" readOnly={true} value={produs.name} />
                </Form.Item>
                <Form.Item label="Cod produs:">
                  <Input size="large" readOnly={true} value={produs.code} />
                </Form.Item>
                <Form.Item label="Cantitate">
                  <Input
                    size="large"
                    readOnly={false}
                    placeholder="Alege o cantitate"
                    value={produs.quantity}
                    onChange={(e) => {
                      const _newProducts = [...newProducts];
                      _newProducts[i].quantity = toNumber(e.target.value);
                      setNewProducts([..._newProducts]);
                    }}
                  />
                </Form.Item>
                <Form.Item label="Pret unitar">
                  <Input
                    size="large"
                    readOnly={true}
                    value={produs.price?.toFixed(2)}
                  />
                </Form.Item>
                <Button
                  type="danger"
                  outlined
                  onClick={() => {
                    const _newProducts = [...newProducts];
                    _newProducts.splice(i, 1);
                    setNewProducts([..._newProducts]);
                  }}
                >
                  Sterge acest produs din comanda
                </Button>
              </div>
            ))}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ModalIndOrderAdmin;
