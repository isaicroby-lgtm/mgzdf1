import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import FeatherIcon from "feather-icons-react";

import { errorReformatted } from "@/components/atoms/errorReformatted";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import theme from "@/components/atoms/theme";
import { cartAdd, cartUpdateQuantity } from "@/redux/cart/actionCreator";
import { updateUserInfo } from "@/redux/userInfo/actionCreator";
import { isProductOutOfStock } from "@/api/stock";

import { BarWrapper } from "./BarWrapper";

import jucaria_lunii from "../svg/jucaria_lunii.svg";
import home from "../svg/home.svg";
import cart from "../svg/shoping_cart.svg";
import { logout } from "@/api/account";
import Text from "@/components/atoms/Text";
import { Checkbox, Form, Input, InputNumber, Progress } from "antd";
import { useForm } from "antd/lib/form/Form";
import { favoritesUpdate } from "@/redux/favorites/actionCreator";
import { encodeURL } from "@/utility/urlFormatting";

export const CartSingleProductNameAndQ = styled.div`
  .pdbr__quantity {
    font-weight: 500;
    margin: 20px 0 0;
    color: ${({ theme }) => theme["dark-color"]};

    button {
      background-color: ${({ theme }) => theme["bg-color-normal"]};
      &.btn-inc {
        margin-right: 15px;
        margin-left: 15px;
      }
      &.btn-dec {
        margin-left: 15px;
      }
    }

    * {
      font-size: 14px;
    }
  }

  .btn-heart,
  .btn-eye {
    z-index: 1;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 34px;
    height: 34px;

    margin-top: 16px;

    background-color: #fff;
    border-radius: 50%;

    box-shadow: 0 0px 10px ${({ theme }) => theme["border-color-normal"]};
    transition: background-color 300ms ease-in-out;
  }

  .btn-heart {
    color: ${theme["secondary-color"]};
  }

  .btn-heart:hover {
    background-color: ${theme["secondary-color"]};
    color: white !important;
  }

  .btn-eye {
    color: ${theme["primary-color"]};
  }

  .btn-eye:hover {
    background-color: ${theme["primary-color"]};
    color: white !important;
  }
`;

export const CartSingleProduct = styled.div`
  width: 100%;
  display: grid;

  background-color: white;
  padding: 8px;

  position: relative;

  grid-template-columns: 1fr 1.8fr 0.7fr;
  gap: 5%;

  @media only screen and (max-width: 750px) {
    grid-template-columns: 1fr 1.8fr;
  }

  border-bottom: 1px solid ${theme["border-color-base"]};

  padding-top: 16px;
  padding-bottom: 16px;
  padding-right: 18px;
`;

const SidebarContent = styled.div`
  padding: 20px;
  z-index: 1000;

  width: ${(props) => props.width || "624px"};
  max-width: 100%;
  height: 100vh;

  background-color: white;

  position: fixed;
  overflow-y: scroll;

  border-radius: 10px 0 0 0;
  top: 0;
  right: 0;
  transform: translateX(${(props) => (props.modalOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;

  @media only screen and (max-width: 750px) {
    padding-bottom: 22vw !important;
  }
`;

const PragTransportGratuitContainer = styled.div`
  border: 1px dashed;
  border-radius: 6px;
  padding: 10px;
  border-color: ${theme["border-color-base"]};

  .ant-progress.ant-progress-status-success .ant-progress-text {
    color: ${theme["primary-color"]} !important;
  }
`;

const HartSingleProductCta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  div {
    cursor: pointer;
  }

  .circle-ctas {
    display: flex;
    gap: 8px;
  }

  .product-single-action {
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    align-items: center;

    gap: 8px;

    button {
      margin: 0;
    }
    .ant-btn-default {
      border-color: ${({ theme }) => theme["border-color-normal"]};
      &:hover {
        border-color: ${({ theme }) => theme["primary-color"]};
      }
    }
    .ant-btn-white {
      &:hover {
        border-color: ${({ theme }) => theme["primary-color"]} !important;
      }
    }
    .ant-btn-sm {
      font-size: 12px;
      padding: 0px 18.065px;
      height: 36px;
    }
  }
`;

const CartProductsContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  gap: 16px;
`;

const SidebarInside = ({
  modalOpen,
  setModalOpen,
  children,
  modalDeleteCos,
}) => {
  const sidebarContentRef = useRef(null);
  const [width, setWidth] = useState(
    modalOpen === "user"
      ? "350px"
      : modalOpen === "heart"
      ? "550px"
      : modalOpen === "nav"
      ? "100%"
      : null
  );
  const [m, setM] = useState(null);

  const handleClickOutside = (event) => {
    if (
      sidebarContentRef.current &&
      !sidebarContentRef.current.contains(event.target) &&
      event.view.outerHeight - event.clientY > 165 &&
      !m
    ) {
      setModalOpen();
    }
  };

  useEffect(() => {
    document.removeEventListener("mousedown", handleClickOutside);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [m]);

  useEffect(() => {
    if (modalOpen === "user") {
      setWidth("350px");
    } else if (modalOpen === "heart") {
      setWidth("550px");
    } else if (modalOpen === "nav") {
      setWidth("100%");
    } else {
      const timeoutId = setTimeout(() => {
        setWidth(null);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (modalDeleteCos) {
      setM(true);
    } else {
      const timeoutId = setTimeout(() => {
        setM(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [modalDeleteCos]);

  return (
    <BarWrapper modalOpen={modalOpen}>
      <SidebarContent
        width={width}
        modalOpen={modalOpen}
        ref={sidebarContentRef}
      >
        {children}
      </SidebarContent>
    </BarWrapper>
  );
};

const Sidebar = ({
  modalOpen,
  setModalOpen,
  setModalDeleteCos,
  setAccountModal,
  modalDeleteCos,
  productsInCart,
  productsFavorite,
  setTopModalOpen,
  handleSelectNewAccountTab,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [form] = useForm();

  const [isLoadingArtificial, setIsLoadingArtificial] = useState();
  const [isProductOutOfStoc, setIsProductOutOfStoc] = useState();
  const [isMobileShopHovered, setIsMobileShopHovered] = useState();

  const {
    userInfo,
    pragTransportGratuit,
    filters,
    productsAll,
    categoryOptions,
    isLoadingUser,
    errorUser,
  } = useSelector((state) => {
    return {
      userInfo: state.userInfo,
      isLoadingUser: state.userInfo.isLoading,
      errorUser: state.userInfo?.error,
      filters: state.filter,
      productsAll: state.products.productsAll || [],
      categoryOptions: state.setariRules.category_options,
      pragTransportGratuit: state.setariRules.prag_transport_gratuit,
    };
  });

  const handleOpenProduct = (name) => {
    const currentUrl = pathname;
    setModalOpen(false);
    const enc = encodeURL(name);
    if (currentUrl?.includes("admin")) {
      router.push(`/admin/produse/${enc}`);
    } else router.push(`/magazin/${enc}`);
  };

  const handleSubmit = async (v) => {
    dispatch(updateUserInfo({ ...v, loginMe: true }));
  };

  const subtotal = (
    productsInCart?.reduce((accumulator, currentValue) => {
      const discount =
        (currentValue.discount3 &&
          currentValue.quantity >= 3 &&
          currentValue.discount3) ||
        (currentValue.discount2 &&
          currentValue.quantity >= 2 &&
          currentValue.discount2) ||
        0;

      return (
        accumulator +
        currentValue.price * currentValue.quantity -
        (currentValue.price * currentValue.quantity * discount) / 100
      );
    }, 0) || 0
  ).toFixed(2);

  useEffect(() => {
    const fetchPFStock = async () => {
      for (const prodFav of productsFavorite) {
        const r = await isProductOutOfStock(prodFav.id);
        setIsProductOutOfStoc((prev) => ({
          ...prev,
          [prodFav.id]: r,
        }));
      }
    };
    if (productsFavorite) fetchPFStock();
  }, [productsFavorite]);

  const isLogged = userInfo?.isLogged;

  return (
    <SidebarInside
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      // modalDeleteCos={modalDelete}
    >
      {modalOpen === "cart" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <Heading as="h3">Coșul dvs de cumpărături</Heading>
            <FeatherIcon
              icon="x"
              onClick={() => setModalOpen()}
              style={{ cursor: "pointer" }}
            />
          </div>
          <CartProductsContainer>
            {productsInCart.map((product) => {
              const discount =
                (product.discount3 &&
                  product.quantity >= 3 &&
                  product.discount3) ||
                (product.discount2 &&
                  product.quantity >= 2 &&
                  product.discount2);
              return (
                <CartSingleProduct key={product.id}>
                  <img
                    onContextMenu={(event) => event.preventDefault()}
                    src={product.fileDownloadURL}
                    onClick={() => handleOpenProduct(product.name)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      border: `1px solid #48ACF0`,
                      borderRadius: 4,
                      background: "white",
                      padding: 10,
                    }}
                    alt="produsul ales"
                  />
                  <CartSingleProductNameAndQ>
                    <Text
                      as="p4"
                      style={{ fontWeight: 700, cursor: "pointer" }}
                      onClick={() => handleOpenProduct(product.name)}
                    >
                      {product.name}
                    </Text>
                    <div style={{ marginTop: 16 }}>
                      <span
                        style={{
                          display: "inline-block",
                          marginRight: 16,
                          fontWeight: 500,
                        }}
                      >
                        Nr. bucati:
                      </span>

                      <InputNumber
                        size="small"
                        value={product.quantity}
                        onChange={(value) => {
                          if (value > product.quantity) {
                            dispatch(
                              cartUpdateQuantity(
                                product.id,
                                value,
                                productsInCart
                              )
                            );
                          } else if (value < product.quantity) {
                            if (value && value >= 1)
                              dispatch(
                                cartUpdateQuantity(
                                  product.id,
                                  value,
                                  productsInCart
                                )
                              );
                          }
                        }}
                      />
                    </div>
                    <p>
                      <span
                        style={{
                          display: "inline-block",
                          marginRight: 16,
                          fontWeight: 500,
                          marginTop: 4,
                        }}
                      >
                        Sub-total:
                      </span>
                      {product.quantity} x {product.price} RON
                    </p>
                    {discount && (
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <p>
                          <span
                            style={{
                              display: "inline-block",
                              marginRight: 16,
                              fontWeight: 500,
                              marginTop: 4,
                            }}
                          >
                            Reducere pentru achizitionarea a mai multor produse
                            de acelasi fel:{" "}
                          </span>{" "}
                        </p>
                        <p>
                          {(
                            (product.quantity * product.price * discount) /
                            100
                          )?.toFixed(2)}{" "}
                          RON ({discount}%)
                        </p>
                      </div>
                    )}
                  </CartSingleProductNameAndQ>

                  <FeatherIcon
                    icon="x"
                    size={18}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: 16,
                      right: 8,
                    }}
                    onClick={() => setModalDeleteCos(product)}
                  />
                </CartSingleProduct>
              );
            })}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {productsInCart && productsInCart.length ? (
                <Text
                  as="p4"
                  style={{
                    textAlign: "end",
                    marginTop: 32,
                    display: "flex",
                    width: "100%",
                    gap: 12,
                    fontWeight: 600,
                  }}
                >
                  <span>Sub-total:</span>{" "}
                  <span style={{ color: theme["primary-color"] }}>
                    {subtotal} RON
                  </span>
                </Text>
              ) : (
                <Text as="p4">Momentan coșul tău de cumpărături este gol</Text>
              )}
            </div>
            {pragTransportGratuit && (
              <PragTransportGratuitContainer>
                {pragTransportGratuit - subtotal > 0 ? (
                  <Text as="p4">
                    Adauga produse in valoare de inca{" "}
                    <span style={{ color: theme["primary-color"] }}>
                      {(pragTransportGratuit - subtotal)?.toFixed(2)}
                    </span>{" "}
                    lei pentru a beneficia de livrare gratuită
                  </Text>
                ) : (
                  <Text as="p4">Felicitări! Ai câștigat livrare gratuită!</Text>
                )}
                <Progress
                  success={{ strokeColor: theme["primary-color"] }}
                  strokeColor={theme["primary-color"]}
                  percent={
                    subtotal
                      ? pragTransportGratuit > subtotal
                        ? ((subtotal / pragTransportGratuit) * 100).toFixed(0)
                        : 100
                      : 0
                  }
                />
              </PragTransportGratuitContainer>
            )}
            {productsInCart && productsInCart.length ? (
              <Button
                onClick={() => {
                
                  router.push("/checkout");
                }}
                type="primary"
              >
                Continuă către următorul pas
              </Button>
            ) : (
              <Button onClick={() => setModalOpen()} type="primary">
                Continuă să explorezi
              </Button>
            )}
          </CartProductsContainer>
        </>
      )}
      {modalOpen === "heart" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <Heading as="h3">Produsele dvs favorite</Heading>
            <FeatherIcon
              icon="x"
              onClick={() => setModalOpen()}
              style={{ cursor: "pointer" }}
            />
          </div>
          <CartProductsContainer>
            {productsFavorite.map((product) => {
              return (
                <CartSingleProduct key={product.id}>
                  {isProductOutOfStoc[product.id] && (
                    <Text
                      as="p6"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 1,
                        borderRadius: 4,
                        backgroundColor: `${theme["primary-color"]}80`,
                        padding: 10,
                        zIndex: 1,
                      }}
                    >
                      Stoc epuizat
                    </Text>
                  )}
                  <img
                    onContextMenu={(event) => event.preventDefault()}
                    src={product.fileDownloadURL}
                    onClick={() => handleOpenProduct(product.name)}
                    style={{
                      width: "100%",
                      border: `1px solid #48ACF0`,
                      borderRadius: 4,
                      background: "white",
                      padding: 10,
                      cursor: "pointer",
                    }}
                    alt="produsul ales"
                  />

                  <CartSingleProductNameAndQ>
                    <Text
                      as="p4"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenProduct(product.name)}
                    >
                      {product.name}
                    </Text>
                    <Text style={{ marginTop: 8 }} as="p5">
                      Pret: {product.price} RON
                    </Text>
                    <HartSingleProductCta>
                      <div className="circle-ctas">
                        <div
                          className="btn-heart"
                          onClick={() =>
                            dispatch(favoritesUpdate({ ...product }))
                          }
                        >
                          <FeatherIcon
                            icon="heart"
                            size={14}
                            fill={theme["secondary-color"]}
                          />
                        </div>
                        <div
                          className="btn-eye"
                          onClick={() => handleOpenProduct(product.name)}
                        >
                          <FeatherIcon icon="eye" size={14} />
                        </div>
                      </div>

                      <div className="product-single-action">
                        <Button
                          size="small"
                          type="primary"
                          disabled={isProductOutOfStoc[product.id]}
                          isLoading={isLoadingArtificial === product.id}
                          onClick={() => {
                            setIsLoadingArtificial(product.id);
                            dispatch(cartAdd({ ...product }));
                            setTimeout(() => {
                              setIsLoadingArtificial();
                            }, 500);
                          }}
                        >
                          <FeatherIcon icon="shopping-cart" size={14} />
                          Adauga in coș
                        </Button>

                        <Button
                          size="small"
                          type="secondary"
                          outlined
                          onClick={() =>
                            dispatch(favoritesUpdate({ ...product }))
                          }
                        >
                          <FeatherIcon icon="heart" size={14} />
                          Scoate de la favorite
                        </Button>
                      </div>
                    </HartSingleProductCta>
                  </CartSingleProductNameAndQ>
                </CartSingleProduct>
              );
            })}

            {productsFavorite && !productsFavorite.length && (
              <Text as="p4">Momentan nu ai produse favorite</Text>
            )}
            {productsFavorite && !productsFavorite.length && (
              <Button
                onClick={() => {
                  setModalOpen();
                }}
                type="primary"
              >
                Continuă să explorezi
              </Button>
            )}
          </CartProductsContainer>
        </>
      )}
      {modalOpen === "user" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <Heading as="h3">
              {isLogged ? "Contul dvs" : "Intră în contul tău"}
            </Heading>
            <FeatherIcon
              icon="x"
              onClick={() => setModalOpen()}
              style={{ cursor: "pointer" }}
            />
          </div>
          {isLogged ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <FeatherIcon icon="user" />
                <Heading
                  as="h5"
                  onClick={() => handleSelectNewAccountTab("date-generale")}
                  style={{ cursor: "pointer" }}
                >
                  Contul tău
                </Heading>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <FeatherIcon icon="truck" />
                <Heading
                  as="h5"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleSelectNewAccountTab("date-livrare");
                    setAccountModal(true);
                    setModalOpen();
                  }}
                >
                  Adresa ta de livrare
                </Heading>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <FeatherIcon icon="align-justify" />
                <Heading
                  as="h5"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleSelectNewAccountTab("date-facturare");
                    setAccountModal(true);
                    setModalOpen();
                  }}
                >
                  Adresa ta de facturare
                </Heading>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <FeatherIcon icon="repeat" />
                <Heading
                  as="h5"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleSelectNewAccountTab("istoric-comenzi");
                    setAccountModal(true);
                    setModalOpen();
                  }}
                >
                  Comenzile tale
                </Heading>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <FeatherIcon icon="percent" />
                <Heading
                  as="h5"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectNewAccountTab("reducerile-mele")}
                >
                  Reducerile tale
                </Heading>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 64,
                }}
              >
                <FeatherIcon icon="mail" />
                <Heading
                  as="h5"
                  onClick={() => handleSelectNewAccountTab("formular-contact")}
                  style={{ cursor: "pointer" }}
                >
                  Trimite-ne un mesaj
                </Heading>
              </div>

              {userInfo.loPoints && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 64,
                  }}
                >
                  <Text as="p4">
                    Ai{" "}
                    <span style={{ color: theme["nav-green"] }}>
                      {userInfo.loPoints} de puncte
                    </span>{" "}
                    rămase de fidelitate. Echivalentul a reduceri de aproximativ{" "}
                    <span style={{ color: theme["nav-green"] }}>
                      {(userInfo.loPoints * 0.2)?.toFixed(2)} RON.
                    </span>
                  </Text>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {userInfo.loPoints ? (
                  <Button
                    type="success"
                    icon={<FeatherIcon icon="percent" />}
                    style={{ marginBottom: 8 }}
                  >
                    Vreau să îmi consum punctele
                  </Button>
                ) : (
                  <Button
                    type="success"
                    icon={<FeatherIcon icon="percent" />}
                    style={{ marginBottom: 8 }}
                    onClick={() => setModalOpen()}
                  >
                    Continuă să explorezi
                  </Button>
                )}
                {userInfo.isAdmin ? (
                  <>
                    <Button
                      onClick={() => router.push("/admin")}
                      icon={
                        <FeatherIcon
                          icon="shield"
                          style={{ cursor: "pointer" }}
                        />
                      }
                      style={{ marginBottom: 8 }}
                      type="primary"
                    >
                      Du-mă la panoul de admin
                    </Button>
                  </>
                ) : null}
                <Button
                  onClick={async () => {
                    setModalOpen();
                    await logout();
                    window.location.reload();
                  }}
                  type="danger"
                  outlined
                  icon={<FeatherIcon icon="log-out" />}
                >
                  Log out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Form
                name="login"
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="email"
                  rules={[{ message: "", required: true }]}
                  label="Adresa de email"
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ message: "", required: true }]}
                  label="Parola"
                >
                  <Input.Password size="large" />
                </Form.Item>
                <Form.Item name="keepMeLogged">
                  <Checkbox>Păstrează-mă logat</Checkbox>
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    width: "100",
                    marginTop: 16,
                    marginBottom: 12,
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Form.Item style={{ margin: 0 }}>
                    <Button
                      className="btn-signin"
                      htmlType="submit"
                      type="primary"
                    >
                      {isLoadingUser ? "Se incarca..." : "Intră în cont"}
                    </Button>
                  </Form.Item>

                  <Button
                    type="primary"
                    outlined
                    onClick={() => {
                      router.push("/am-uitat-parola");
                      setModalOpen();
                    }}
                  >
                    Ai uitat parola?
                  </Button>
                </div>
                <Button
                  type="primary"
                  className="btn-signin"
                  outlined
                  onClick={() => {
                    router.push("/creeaza-cont");
                    setModalOpen();
                  }}
                >
                  Creează un cont nou
                </Button>

                {errorUser && (
                  <Text
                    as="p6"
                    style={{
                      color: theme["secondary-color"],
                      marginTop: 16,
                    }}
                  >
                    {errorReformatted(errorUser)}
                  </Text>
                )}
              </Form>
            </>
          )}
        </>
      )}
      {modalOpen === "nav" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <Heading as="h3">Meniul principal</Heading>
            <FeatherIcon
              icon="x"
              onClick={() => setModalOpen()}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: 32,
            }}
          >
            <Image
              src={home}
              style={{ alignSelf: "center", justifySelf: "center" }}
              className="c_icon"
              alt="acasa"
            />
            <Heading
              as="h5"
              onClick={() => {
                router.push("/");
                setModalOpen();
              }}
              style={{ cursor: "pointer" }}
            >
              Acasă
            </Heading>
          </div>

          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: 32,
            }}
          >
            <Image
              src={jucaria_lunii}
              style={{ alignSelf: "center", justifySelf: "center" }}
              className="c_icon"
              alt="jucarie"
            />
            <Heading
              as="h5"
              onClick={() => {
                if (pathname === "/")
                  router.push("/?popular", undefined, { shallow: true });
                else router.push("/?popular");
                setModalOpen();
              }}
              style={{ cursor: "pointer" }}
            >
              Produsul lunii
            </Heading>
          </div>

          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: 4,
            }}
          >
            <Image
              src={cart}
              style={{ alignSelf: "center", justifySelf: "center" }}
              className="c_icon"
              alt="magazin"
            />

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Heading
                as="h5"
                onClick={() => {
                  router.push(`/magazin?categorie=all`);
                  setModalOpen();
                }}
                style={{ cursor: "pointer" }}
              >
                Magazin
              </Heading>

              <FeatherIcon
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  setIsMobileShopHovered((prev) => !prev);
                }}
                style={{ cursor: "pointer" }}
                icon={"chevron-down"}
                color={theme["primary-color"]}
                size={22}
              />
            </div>
          </div>

          {isMobileShopHovered ? (
            <div style={{ position: "relative", left: "6vw", marginTop: 16 }}>
              <ul
                className="under-hover-categories-on-mobile"
                style={{
                  width: "fit-content",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <li
                  style={{
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push(`/magazin?categorie=all`);
                    setModalOpen();
                  }}
                >
                  <Text
                    as="p5"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 14,
                      width: "100%",
                      textTransform: "capitalize",
                      color:
                        pathname.includes("magazin") &&
                        Object.values(filters)?.find(
                          (x) =>
                            x.name === "category" && x.value?.includes("all")
                        )
                          ? theme["primary-color"]
                          : "initial",
                    }}
                  >
                    <span> Toate produsele</span>
                    <span>{productsAll?.length}</span>
                  </Text>
                </li>

                {categoryOptions?.map((category) => {
                  return (
                    <li
                      key={category}
                      onClick={() => {
                        router.push(
                          `/magazin?categorie=${category.toLowerCase()}`
                        );

                        setModalOpen();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Text
                        as="p5"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 30,
                          textTransform: "capitalize",
                          color:
                            pathname?.includes("magazin") &&
                            Object.values(filters)?.find(
                              (x) =>
                                x.name === "category" &&
                                x.value?.includes(category?.toLowerCase())
                            )
                              ? theme["primary-color"]
                              : "initial",
                        }}
                      >
                        <span> {category}</span>
                        <span>
                          {
                            productsAll?.filter(
                              (product) =>
                                product.category === category?.toLowerCase()
                            ).length
                          }
                        </span>
                      </Text>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: 32,
              marginTop: 32,
            }}
          >
            <FeatherIcon
              icon="grid"
              style={{ alignSelf: "center", justifySelf: "center" }}
              className="c_icon"
              alt="blog"
            />

            <Heading
              as="h5"
              onClick={() => {
                router.push("/blog");
                setModalOpen();
              }}
              style={{ cursor: "pointer" }}
            >
              Blog
            </Heading>
          </div>

          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: 32,
            }}
          >
            <FeatherIcon
              icon="search"
              style={{
                color: theme["nav-green"],
                justifySelf: "center",
                alignSelf: "center",
              }}
            />
            <Heading
              as="h5"
              onClick={() => {
                setModalOpen();
                setTopModalOpen("search");
              }}
              style={{ cursor: "pointer" }}
            >
              Caută un produs
            </Heading>
          </div>

          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: 32,
            }}
          >
            <FeatherIcon
              icon="shopping-cart"
              style={{
                color: theme["nav-yellow"],
                justifySelf: "center",
                alignSelf: "center",
              }}
            />
            <Heading
              as="h5"
              onClick={() => {
                setModalOpen("cart");
              }}
              style={{ cursor: "pointer" }}
            >
              Coșul dvs de cumpărături
            </Heading>
          </div>
          {userInfo.isLogged && (
            <div
              style={{
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: "1fr 4fr",
                marginBottom: 32,
              }}
            >
              <FeatherIcon
                style={{ alignSelf: "center", justifySelf: "center" }}
                icon="user"
              />

              <Heading
                as="h5"
                onClick={() => handleSelectNewAccountTab("date-generale")}
                style={{ cursor: "pointer" }}
              >
                Contul tău
              </Heading>
            </div>
          )}

          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 4fr",
              marginBottom: 32,
            }}
          >
            <FeatherIcon
              icon="heart"
              style={{
                color: theme["secondary-color"],
                justifySelf: "center",
                alignSelf: "center",
              }}
            />
            <Heading
              as="h5"
              onClick={() => {
                setModalOpen("heart");
              }}
              style={{ cursor: "pointer" }}
            >
              Favorite
            </Heading>
          </div>

          {userInfo.isLogged ? (
            <Button
              onClick={async () => {
                setModalOpen();
                await logout();
                window.location.reload();
              }}
              type="danger"
              outlined
              icon={<FeatherIcon icon="log-out" />}
            >
              Log out
            </Button>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "fit-content",
                paddingLeft: "8%",
              }}
            >
              <Button
                type="primary"
                outlined
                onClick={() => {
                  setModalOpen();
                  router.push("/creeaza-cont");
                }}
              >
                Creează un cont nou
              </Button>
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setModalOpen();
                  router.push("/login");
                }}
              >
                Ai deja un cont?
              </Button>
            </div>
          )}

          {userInfo.loPoints && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 32,
              }}
            >
              <Text as="p4">
                Ai{" "}
                <span style={{ color: theme["nav-green"] }}>
                  {userInfo.loPoints} de puncte
                </span>{" "}
                rămase de fidelitate. Echivalentul a reduceri de aproximativ{" "}
                <span style={{ color: theme["nav-green"] }}>
                  {(userInfo.loPoints * 0.2)?.toFixed(2)} RON.
                </span>
              </Text>
            </div>
          )}
        </>
      )}
    </SidebarInside>
  );
};

export default Sidebar;
