"use client";

import React, { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import FeatherIcon from "feather-icons-react";
import TextArea from "antd/lib/input/TextArea";
import styled from "styled-components";
import dayjs from "dayjs";

import { createCoupon, getAllCoupons, deleteCoupon } from "@/api/cupoane";
import { getSetariRules, updateSetariRules } from "@/api/setari-rules";
import theme from "@/components/atoms/theme";
import { Main } from "@/components/style";
import PageHeader from "@/components/atoms/PageHeader";
import Cards from "@/components/atoms/Cards";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Image from "next/image";

const CodeAndEditContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 8px;

  h1::-moz-selection {
    color: ${theme["primary-color"]} !important;
    background: white !important;
  }

  h1::selection {
    color: ${theme["primary-color"]} !important;
    background: white !important;
  }
`;

const IndCuponReduceri = styled.div`
  border: 1px solid;
  padding: 20px;
  border-radius: 10px;
  position: relative;

  .admin-btn-container {
    display: flex;
    gap: 4px;

    position: absolute;
    right: 20px;
  }
  .btn-edit,
  .btn-delete,
  .btn-copy {
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;

    background-color: #fff;
    border-radius: 4px;

    cursor: pointer;

    box-shadow: 0 0px 10px ${({ theme }) => theme["border-color-normal"]};
    transition: all 300ms ease-in-out;
  }

  .btn-delete {
    color: ${({ theme }) => theme["secondary-color"]};
  }

  .btn-delete:hover {
    background-color: ${({ theme }) => theme["secondary-color"]};
    color: white !important;
  }

  .btn-edit:hover {
    background-color: ${({ theme }) => theme["primary-color"]};
    color: white !important;
  }

  .btn-copy {
    transition: all 100ms ease-in-out;
  }

  .btn-copy:hover {
    color: ${theme["primary-color"]};
  }
`;

const WebsiteSettings = () => {
  const [mainForm] = useForm();

  const [state, setState] = useState({
    open: false,
  });

  const [cupoane, setCupoane] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState({ 0: false, 1: false, 2: false });

  const [formValues, setFormValues] = useState({
    transport_gratuit: {},
    puncte_fidelitate: {},
    detalii: {},
  });

  const handleFinishCoupon = async (values) => {
    setIsLoading((prev) => ({ ...prev, 3: true }));
    try {
      await createCoupon(values);

      setCupoane((prev) => [...prev, { ...values }]);
      mainForm.resetFields();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, 3: false }));
    }
  };

  const handleCancelCreateCoupon = () => {
    setState((prev) => ({ ...prev, openCreateCoupon: !prev.openCreateCoupon }));
  };

  const handleSubmitPuncteSiTransport = async ({
    values,
    instance,
    inMap,
    i,
  }) => {
    setIsLoading((prev) => ({ ...prev, [i]: true }));
    try {
      await updateSetariRules({ instance, values, inMap });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [i]: false }));
    }
  };

  const handleChangeDeliveryProvider = async (values) => {
    setIsLoading((prev) => ({ ...prev, [1]: true }));

    try {
      await updateSetariRules({ values });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [1]: false }));
    }
  };

  useEffect(() => {
    let timeoutId;

    if (state.open) {
      timeoutId = setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }));
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state.open]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getSetariRules();

      const obj = {
        transport_gratuit: {},
        puncte_fidelitate: {},
        detalii: {},
      };

      if (data)
        Object.keys(data).forEach((resKey) => {
          if (typeof data[resKey] === "object") {
            obj.transport_gratuit[resKey] = data[resKey]?.transport_gratuit;
            obj.puncte_fidelitate[resKey] = data[resKey]?.puncte_fidelitate;
          }
        });

      obj.detalii = {
        ...data,
      };

      setFormValues({
        ...obj,
      });

      setLoading(false);
    };

    const fetchCupoane = async () => {
      const data = await getAllCoupons();
      setCupoane(data);
    };

    fetch();
    fetchCupoane();
  }, []);

  return (
    <>
      <PageHeader title="Setari website" />
      {!loading ? (
        <Main theme={theme}>
          <Row gutter={24}>
            <Col xs={24}>
              <Cards
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
                title="Acordă puncte de fidelitate"
              >
                <Form
                  initialValues={formValues.puncte_fidelitate}
                  onFinish={(values) =>
                    handleSubmitPuncteSiTransport({
                      values,
                      instance: "puncte_fidelitate",
                      inMap: true,
                      i: 0,
                    })
                  }
                >
                  <Form.Item>
                    <Form.Item noStyle name="conturi_noi">
                      <InputNumber style={{ marginRight: 8 }} />
                    </Form.Item>
                    <Tooltip>La crearea contului</Tooltip>
                  </Form.Item>
                  <Form.Item>
                    <Form.Item noStyle name="client_1">
                      <InputNumber style={{ marginRight: 8 }} />
                    </Form.Item>
                    <Tooltip>La prima comandă</Tooltip>
                  </Form.Item>
                  <Form.Item>
                    <Form.Item noStyle name="client_3">
                      <InputNumber style={{ marginRight: 8 }} />
                    </Form.Item>
                    <Tooltip>La a treia comandă</Tooltip>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      isLoading={isLoading[0]}
                      type="primary"
                      outlined
                    >
                      {isLoading[0] ? "Se incarca..." : "Salvează modificările"}
                    </Button>
                  </Form.Item>
                </Form>
              </Cards>
            </Col>

            <Col xs={24}>
              <Cards
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
                title="Setari generale"
              >
                <Form
                  onFinish={handleChangeDeliveryProvider}
                  initialValues={formValues.detalii}
                  layout="vertical"
                >
                  <Form.Item
                    label="Alege ce serviciu de curierat vrei sa folosesti"
                    name="deliveryProvider"
                  >
                    <Radio.Group style={{ marginTop: 12 }}>
                      <Radio value={"fan-courier"}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {"Fan Courier"}
                          <Image
                            width={42}
                            height={32}
                            unoptimized={true}
                            src={"/img/FanCurierLogo.png"}
                            alt="fan courier logo"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </Radio>
                      <Radio value={"sameday"}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {"Sameday"}
                          <Image
                            width={42}
                            height={34}
                            unoptimized={true}
                            src={"/img/SamedayLogo.png"}
                            alt="sameday logo"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label="Alege ce serviciu de 'box' vrei sa folosesti"
                    name="boxProvider"
                  >
                    <Radio.Group style={{ marginTop: 12 }}>
                      <Radio value={"fanbox"}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {"Fanbox"}
                        </div>
                      </Radio>
                      <Radio value={"easybox"}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {"Easybox"}
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 24 }}>
                    <Button
                      style={{ padding: "6px 20px" }}
                      outlined
                      htmlType="submit"
                      type="secondary"
                      isLoading={isLoading[1]}
                    >
                      {isLoading[1] ? "Se incarca..." : "Salvează modificările"}
                    </Button>
                  </Form.Item>
                </Form>
                <Form
                  initialValues={formValues.detalii}
                  name="transport_points"
                  layout="vertical"
                  onFinish={(values) =>
                    handleSubmitPuncteSiTransport({ values, i: 2 })
                  }
                >
                  <Form.Item
                    name="prag_transport_gratuit"
                    label="Pragul pentru tranport gratuit"
                  >
                    <InputNumber />
                  </Form.Item>

                  <Form.Item
                    name="discount_navbar"
                    label="Completați ce vă doriți să apară în bara de deasupra navigației. (Lăsați gol în cazul în care nu vreți ca această bară să apară) "
                  >
                    <TextArea />
                  </Form.Item>

                  <Form.Item
                    name="indice_conversie_puncte"
                    label="Indicele de conversie dintre un punct de fidelitate si un leu ( 1 leu * x = y puncte, completează x )"
                  >
                    <InputNumber />
                  </Form.Item>

                  <Form.Item
                    name="category_options"
                    label="Optiuni de categorii pentru produse"
                  >
                    <Select mode="tags" />
                  </Form.Item>

                  <Form.Item
                    name="age_options"
                    label="Optiuni de varsta pentru produse"
                  >
                    <Select mode="tags" />
                  </Form.Item>

                  <Form.Item name="delivery_price" label="Cost livrare curier">
                    <InputNumber />
                  </Form.Item>

                  <Form.Item
                    name="delivery_price_easybox"
                    label="Cost livrare easybox"
                  >
                    <InputNumber />
                  </Form.Item>

                  <Form.Item
                    name="ramburs_payment_tax"
                    label="Taxa plata ramburs"
                  >
                    <InputNumber />
                  </Form.Item>

                  <Form.Item
                    name="procent_minim_puncte"
                    label="Procentajul minim din valoarea comenzii ce poate fi dedus folosind puncte de fidelitate"
                  >
                    <InputNumber />
                  </Form.Item>

                  <Form.Item
                    name="procent_maxim_puncte"
                    label="Procentajul maxim din valoarea comenzii ce poate fi dedus folosind puncte de fidelitate"
                  >
                    <InputNumber />
                  </Form.Item>

                  <Form.Item style={{ marginTop: 16, marginBottom: 4 }}>
                    <Button
                      outlined
                      htmlType="submit"
                      type="primary"
                      isLoading={isLoading[2]}
                    >
                      {isLoading[2] ? "Se incarca..." : "Salvează modificările"}
                    </Button>
                  </Form.Item>
                </Form>
              </Cards>
            </Col>
          </Row>
          <Row>
            <Cards
              bodyStyle={{ display: "flex", flexDirection: "column", gap: 10 }}
              title="Cupoane de reducere"
              isbutton={
                <Button
                  type="primary"
                  outlined
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      openCreateCoupon: !prev.openCreateCoupon,
                    }))
                  }
                >
                  Creează un nou cupon de reducere
                </Button>
              }
            >
              {state.openCreateCoupon ? (
                <Form
                  form={mainForm}
                  name="dynamic_coupon_form"
                  onFinish={handleFinishCoupon}
                >
                  <Form.Item
                    rules={[{ required: true, message: "Camp obligatoriu" }]}
                    name="nume"
                  >
                    <Input
                      size="large"
                      placeholder="Numele cuponului (ex: Economisește....)"
                    />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true, message: "Camp obligatoriu" }]}
                    name="cod"
                  >
                    <Input
                      size="large"
                      placeholder="Codul cuponului (ex: client-doi-frati)"
                    />
                  </Form.Item>

                  <Form.Item
                    rules={[{ required: true, message: "Camp obligatoriu" }]}
                    name="valoare"
                  >
                    <Input size="large" placeholder="Valoarea cuponului" />
                  </Form.Item>

                  <Form.Item name="valoareMinimaComanda">
                    <Input
                      size="large"
                      placeholder="Pretul minim a unei comenzi pentru a putea fi aplicat (lăsați gol dacă vreți să nu existe un minim)"
                    />
                  </Form.Item>

                  <Form.Item
                    rules={[{ required: true, message: "Camp obligatoriu" }]}
                    name="tip"
                  >
                    <Select
                      size="large"
                      placeholder="Tipul de valoare a cuponului"
                      options={[
                        {
                          label: "procentaj",
                          value: "procentaj",
                        },
                        {
                          label: "bani",
                          value: "bani",
                        },
                      ]}
                    ></Select>
                  </Form.Item>

                  <Form.Item name="dataExpirare">
                    <DatePicker
                      size="large"
                      placeholder="Când să expire acesta (lăsați gol dacă vreți să expire numai atunci când îl ștergeți dvs)"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      outlined
                      htmlType="submit"
                      isLoading={isLoading[3]}
                      style={{ marginRight: 8 }}
                    >
                      {isLoading[3] ? "Se incarca..." : "Creează"}
                    </Button>
                    <Button
                      type="danger"
                      outlined
                      onClick={handleCancelCreateCoupon}
                    >
                      Anulează
                    </Button>
                  </Form.Item>
                </Form>
              ) : null}
              <IndCuponReduceri
                style={{ borderColor: theme["primary-color"] }}
                theme={theme}
              >
                <div
                  style={{
                    display: "flex",
                    marginBottom: 16,
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10%",
                  }}
                >
                  <Heading as="h4" style={{ color: theme["primary-color"] }}>
                    Acest cupon este un exemplu! Economisește 80 RON la
                    următoarea ta comandă
                  </Heading>
                  <Text as="p5" style={{ textAlign: "end" }}>
                    Reducere valabilă până pe 8.04.2024
                  </Text>
                </div>
                <Heading as="h6">Folosind codul de reducere</Heading>
                <CodeAndEditContainer>
                  <Heading
                    as="h6"
                    style={{
                      background: theme["primary-color"],
                      color: "white",
                      padding: "8px 4%",
                      borderRadius: 4,

                      marginRight: 4,
                      userSelect: "text",
                    }}
                  >
                    client-doi-frati
                  </Heading>
                  <Tooltip
                    title="Codul de reducere a fost copiat in clipboard"
                    showArrow={false}
                    open={state.open}
                  >
                    <div
                      className="btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText("client-doi-frati");
                        setState((prev) => ({
                          ...prev,
                          open: !prev.open,
                        }));
                      }}
                    >
                      <FeatherIcon icon="copy" size={14} />
                    </div>
                  </Tooltip>
                </CodeAndEditContainer>
              </IndCuponReduceri>
              {cupoane.map((cupon) => (
                <IndCuponReduceri
                  key={cupon.docId}
                  theme={theme}
                  style={{ borderColor: theme["primary-color"] }}
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: 16,
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10%",
                    }}
                  >
                    <Heading as="h4" style={{ color: theme["primary-color"] }}>
                      {cupon.nume}
                    </Heading>
                    {cupon.data_expirare && (
                      <Text as="p5" style={{ textAlign: "end" }}>
                        Reducere valabilă până pe{" "}
                        {dayjs(cupon.data_expirare.toDate()).format(
                          "DD.MM.YYYY"
                        )}
                      </Text>
                    )}
                  </div>
                  <Heading as="h6">
                    Folosind codul de reducere {cupon.cod}
                  </Heading>
                  <CodeAndEditContainer>
                    <Heading
                      as="h6"
                      style={{
                        background: theme["primary-color"],
                        color: "white",
                        padding: "8px 4%",
                        borderRadius: 4,

                        marginRight: 4,
                        userSelect: "text",
                      }}
                    >
                      {cupon.cod}
                    </Heading>
                    <Tooltip
                      title="Codul de reducere a fost copiat in clipboard"
                      showArrow={false}
                      open={state.open}
                    >
                      <div
                        className="btn-copy"
                        onClick={() => {
                          navigator.clipboard.writeText("client-doi-frati");
                          setState((prev) => ({
                            ...prev,
                            open: !prev.open,
                          }));
                        }}
                      >
                        <FeatherIcon icon="copy" size={14} />
                      </div>
                    </Tooltip>
                    <div className="admin-btn-container">
                      <div
                        className="btn-delete"
                        onClick={() => {
                          deleteCoupon(cupon.docId);
                          setCupoane((prev) =>
                            prev.filter((c) => c.docId !== cupon.docId)
                          );
                        }}
                      >
                        <FeatherIcon icon="trash-2" size={14} />
                      </div>
                    </div>
                  </CodeAndEditContainer>
                </IndCuponReduceri>
              ))}
            </Cards>
          </Row>
        </Main>
      ) : (
        <Row>
          <Cards>Se incarca</Cards>
        </Row>
      )}
    </>
  );
};

export default WebsiteSettings;
