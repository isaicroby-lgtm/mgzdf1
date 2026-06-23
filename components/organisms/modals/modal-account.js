"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Form, Input, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import ContactForm from "@/components/atoms/Forms/contact-form";
import Modal from "@/components/atoms/Modal";
import theme from "@/components/atoms/theme";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import { auth } from "@/public/firebase";
import { cancelOrder, getUserOrders } from "@/api/comenzi";
import { deleteUserF, logout, updateUserInfoFirestore } from "@/api/account";
import { getFactura } from "@/api/smartbill";
import { RomaniaCounties } from "@/utility/counties";
import { updateUserInfo } from "@/redux/userInfo/actionCreator";
import { errorReformatted } from "@/components/atoms/errorReformatted";

const CountyContainer = styled.div`
  margin-bottom: 28px;
  display: flex;
  gap: 16px;
`;

export const ModalPaneContainer = styled.div`
  display: flex;
  width: 95%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media only screen and (max-width: 750px) {
    flex-direction: column;
    align-items: flex-start;

    gap: 24px;
  }
`;

export const ModalPane = ({ links, handleClick }) => {
  return (
    <ModalPaneContainer>
      {links?.map((link) => (
        <div
          key={link.title}
          onClick={() => handleClick(link.name)}
          style={{
            color: link.active ? theme["primary-color"] : "inherit",
            cursor: "pointer",
            height: "100%",
            fontWeight: 400,
          }}
        >
          {link.title}
        </div>
      ))}
    </ModalPaneContainer>
  );
};

export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export const ModalAccount = ({
  handleClick,
  visible,
  links,
  user,
  setAccountModal,
  linkOpened,
}) => {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);

  const [errorDeletingAccount, setErrorDeletingAccount] = useState();
  const [loadingDeletingAccount, setLoadingDeletingAccount] = useState();
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState();

  const router = useRouter();

  const [messageForm] = useForm();

  const { isLoadingUser, errorUser, setariRules, products, userInfo } =
    useSelector((state) => {
      return {
        setariRules: state.setariRules,
        isLoadingUser: state.userInfo.isLoading,
        errorUser: state.userInfo.error,
        userInfo: state.userInfo,
        pragTransportGratuit: state.setariRules.prag_transport_gratuit,
        productsInCart: state.cart.products,
        products: state.products.productsAll,
      };
    });

  const ordersWithNewProducts = orders.map((order) => {
    const orderProducts = order.products.map((orderProduct) => ({
      ...products.find((x) => x.id === orderProduct.id),
      price: orderProduct.price,
      quantity: orderProduct.quantity,
    }));

    return {
      ...order,
      products: orderProducts,
    };
  });

  const handleSubmit = async (vals) => {
    if (vals.email === undefined || isValidEmail(vals.email)) {
      const objWithoutUndefined = {};

      Object.keys(vals).forEach((val) => {
        if (vals[val] !== undefined) {
          objWithoutUndefined[val] = vals[val];
        }
      });

      try {
        await updateUserInfoFirestore({
          id: auth?.currentUser?.uid,
          extraInfo: objWithoutUndefined,
        });

        dispatch(updateUserInfo({ ...userInfo, ...objWithoutUndefined }));

        alert("Modificările au fost salvate cu succes!");
      } catch (error) {
        console.log(error);
        alert(
          "A apărut o eroare. Încearcă din nou, iar dacă eroarea persistă te rugăm să ne scrii"
        );
      }
    } else {
      alert("Te rugam să introduci o adresă de email validă!");
    }
  };

  const handleDeleteAccount = async ({ password }) => {
    setLoadingDeletingAccount(true);
    await deleteUserF(
      password,
      setErrorDeletingAccount,
      (close = () => {
        setOpenDeleteAccountModal();
        setAccountModal();
      })
    );
    setLoadingDeletingAccount(false);
  };

  useEffect(() => {
    const fetchUsersLocal = async () => {
      const res = await getUserOrders();

      setOrders(res);
    };

    if (linkOpened?.name === "istoric-comenzi") {
      if (userInfo?.isLogged) fetchUsersLocal();
    }
  }, [linkOpened?.name, auth?.currentUser]);

  if (!userInfo?.isLogged) return null;
  return (
    <>
      <Modal
        footer={null}
        title={
          <div style={{ paddingRight: 6 }}>
            Ești sigur(ă) că vrei să îți ștergi contul?
          </div>
        }
        visible={openDeleteAccountModal}
        onCancel={() => setOpenDeleteAccountModal()}
      >
        <Form
          onFinish={handleDeleteAccount}
          onFinishFailed={() => setErrorDeletingAccount()}
        >
          <Form.Item
            rules={[{ required: true, message: "" }]}
            name="password"
            label="Te rugăm să introduci parola contului tău doifrati.ro."
            style={{ margin: 0, marginTop: 24 }}
          >
            <Input.Password />
          </Form.Item>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}
          >
            <Button
              type="primary"
              onClick={() => {
                setErrorDeletingAccount();
                setOpenDeleteAccountModal();
              }}
            >
              Anulează
            </Button>
            <Form.Item style={{ margin: 0 }}>
              <Button
                type="danger"
                outlined
                htmlType="submit"
                key="submit"
                isLoading={loadingDeletingAccount}
              >
                Sunt sigur
              </Button>
            </Form.Item>
          </div>
        </Form>
        {errorDeletingAccount && (
          <Text
            as="p6"
            style={{
              color: theme["secondary-color"],
              marginTop: 16,
              marginBottom: 32,
            }}
          >
            {errorReformatted(errorDeletingAccount)}
          </Text>
        )}
      </Modal>
      <Modal
        title={<ModalPane links={links} handleClick={handleClick} />}
        width={1200}
        footer={null}
        visible={visible}
        onCancel={() => handleClick()}
      >
        <div style={{ marginTop: 32 }}></div>
        {linkOpened?.name === "date-livrare" && (
          <Form initialValues={user} onFinish={handleSubmit} layout="vertical">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Form.Item name="delivery_adress" label="Adresa">
                <Input size="large" placeholder="Adresa completa" />
              </Form.Item>

              <Form.Item name="delivery_apartment" label="Apartament">
                <Input size="large" placeholder="Apartament, nr, etc" />
              </Form.Item>

              <CountyContainer>
                <Form.Item
                  label="Judet"
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
                  label="Oras"
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="delivery_city"
                >
                  <Input size="large" placeholder="Oras" />
                </Form.Item>
              </CountyContainer>

              <Form.Item label="Cod postal" name="delivery_zipCode">
                <Input size="large" placeholder="Cod postal" />
              </Form.Item>

              <Form.Item style={{ margin: 0, marginTop: 16 }}>
                <Button className="btn-signin" htmlType="submit" type="primary">
                  {isLoadingUser ? "Se incarca..." : "Salveaza modificarile"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        )}

        {linkOpened?.name === "date-facturare" && (
          <Form initialValues={user} onFinish={handleSubmit} layout="vertical">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Form.Item name="adress" label="Adresa">
                <Input size="large" placeholder="Adresa completa" />
              </Form.Item>

              <Form.Item name="apartment" label="Apartament">
                <Input size="large" placeholder="Apartament, nr, etc" />
              </Form.Item>

              <CountyContainer>
                <Form.Item
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  label="Judet"
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
                  label="Oras"
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="city"
                >
                  <Input size="large" placeholder="Oras" />
                </Form.Item>
              </CountyContainer>

              <Form.Item label="Cod postal" name="zipCode">
                <Input size="large" placeholder="Cod postal" />
              </Form.Item>

              <div style={{ display: "flex", marginBottom: 16, gap: 16 }}>
                <Form.Item
                  label="Nume companie (in cazul in care aveti)"
                  name="companyName"
                  style={{ margin: 0, padding: 0, width: "100%" }}
                >
                  <Input size="large" placeholder="Nume companie" />
                </Form.Item>
                <Form.Item
                  label="CUI companie (in cazul in care aveti)"
                  name="companyCUI"
                  style={{ margin: 0, padding: 0, width: "100%" }}
                >
                  <Input size="large" placeholder="CUI companie" />
                </Form.Item>
              </div>

              <Form.Item style={{ margin: 0, marginTop: 16 }}>
                <Button className="btn-signin" htmlType="submit" type="primary">
                  {isLoadingUser ? "Se incarca..." : "Salveaza modificarile"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        )}
        {linkOpened?.name === "date-generale" && (
          <>
            <Form
              initialValues={user}
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item name="email" label="Adresa ta de email">
                <Input
                  size="large"
                  readOnly
                  style={{
                    background: theme["border-color-light"],
                    borderColor: "#d9d9d9",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="firstName"
                rules={[{ message: "", required: true }]}
                label="Prenumele tau"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[{ message: "", required: true }]}
                label="Numele tau de familie"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item name="phone" label="Numarul tau de telefon">
                <Input size="large" />
              </Form.Item>

              {errorUser && (
                <Text
                  as="p6"
                  style={{ color: theme["secondary-color"], marginTop: 16 }}
                >
                  {errorReformatted(errorUser)}
                </Text>
              )}

              <Form.Item
                style={{
                  margin: 0,
                  marginTop: 16,
                  marginBottom: 12,
                  width: 180,
                }}
              >
                <Button className="btn-signin" htmlType="submit" type="primary">
                  {isLoadingUser ? "Se incarca..." : "Salveaza modificarile"}
                </Button>
              </Form.Item>
            </Form>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Button
                style={{
                  margin: 0,
                  display: "flex",
                  width: 180,
                }}
                onClick={() => {
                  setAccountModal();
                  router.push("/am-uitat-parola");
                }}
                type="danger"
                outlined
                disabled={isLoadingUser}
              >
                {isLoadingUser ? "Se încarcă..." : "Resetează-ți parola"}
              </Button>

              <Button
                disabled={isLoadingUser}
                icon={<FeatherIcon icon="log-out" />}
                onClick={async () => {
                  setAccountModal();
                  await logout();
                  window.location.reload();
                }}
                style={{ margin: 0, width: 180 }}
                type="danger"
                outlined
              >
                {isLoadingUser ? "Se încarcă..." : "Log out"}
              </Button>

              <Button
                style={{
                  margin: 0,
                  display: "flex",
                  width: 180,
                }}
                onClick={() => {
                  setOpenDeleteAccountModal(true);
                }}
                type="danger"
                disabled={isLoadingUser}
              >
                {isLoadingUser ? "Se încarcă..." : "Șterge-ți contul"}
              </Button>
            </div>
          </>
        )}

        {linkOpened?.name === "istoric-comenzi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ordersWithNewProducts
              ?.sort((a, b) => {
                return b.timestamp - a.timestamp;
              })
              ?.map((order) => {
                return (
                  <div
                    key={order.docId}
                    style={{
                      border: "1px solid",
                      borderColor: theme["bg-color-deep"],
                      borderRadius: 2,
                      padding: 16,
                    }}
                  >
                    <div style={{ marginBottom: 4 }}>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          gap: 4,
                          flexWrap: "wrap",
                        }}
                      >
                        <Text as="p5">
                          <span style={{ fontWeight: 700 }}>Nr. comanda: </span>{" "}
                          {order.docId}
                        </Text>
                        <Text as="p5">
                          <span style={{ fontWeight: 700 }}>Total: </span>{" "}
                          {order.price} RON
                        </Text>
                      </div>

                      <Text as="p5" style={{ marginTop: 4 }}>
                        <span style={{ fontWeight: 700 }}>Tip de plată:</span>{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {order.paymentType}
                        </span>
                      </Text>
                      <Text as="p5" style={{ marginTop: 4 }}>
                        <span style={{ fontWeight: 700 }}>Plasată pe: </span>
                        {dayjs(order.timestamp?.toDate())
                          .format("DD.MM.YYYY, HH:mm")
                          .toString()}
                      </Text>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Text
                        as="p5"
                        style={{ fontWeight: 700, marginBottom: 8 }}
                      >
                        Produse cumparate:
                      </Text>
                      <ul
                        style={{
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {order.products?.map((prod) => {
                          return (
                            <li
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                              key={prod.id}
                            >
                              <Image
                                unoptimized={true}
                                width={56}
                                height={56}
                                src={prod.fileDownloadURL}
                                alt=""
                              />
                              <div>
                                <span style={{ fontWeight: 400 }}>
                                  {prod.name}
                                </span>
                                <br />
                                <span style={{ fontWeight: 400 }}>Pret: </span>
                                <span>
                                  {(prod.price / prod.quantity).toFixed(2)} RON
                                  x {prod.quantity} buc
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <Button
                        type="primary"
                        ghost
                        style={{ cursor: "default", width: "fit-content" }}
                      >
                        Status comandă:{" "}
                        <span
                          style={{
                            fontWeight: 600,
                            textTransform: "capitalize",
                            display: "inline-block",
                            marginLeft: 4,
                          }}
                        >
                          {order.status}
                        </span>
                      </Button>

                      <div style={{ display: "flex", gap: "4%" }}>
                        <Button
                          type="primary"
                          style={{ height: "100%", width: "48%" }}
                          onClick={() =>
                            handleClick("formular-contact", {
                              title: `Informații comanda nr ${order.docId}`,
                            })
                          }
                        >
                          Contact
                        </Button>

                        {[
                          "respinsa",
                          "returnata",
                          "anulata de client",
                          "anulata de doifrati",
                        ].includes(order.status) ? null : (
                          <Button
                            type="danger"
                            outlined
                            style={{ height: "100%", width: "48%" }}
                            onClick={async () => {
                              if (
                                order.status !== "respinsa" &&
                                order.status !== "returnata"
                              ) {
                                if (order.status === "livrata") {
                                  router.push("/politica-de-retur");
                                } else {
                                  await cancelOrder(order.docId, true);
                                  window.location.reload();
                                }
                              }
                            }}
                          >
                            {["livrata"].includes(order.status)
                              ? "Returneaza comanda"
                              : "Anuleaza comanda"}
                          </Button>
                        )}
                      </div>
                      {order.invoiceId && (
                        <Button
                          type="success"
                          onClick={async () => {
                            await getFactura(order?.docId);
                          }}
                        >
                          Vezi factura
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {linkOpened?.name === "reducerile-mele" && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              {user?.puncte_fidelitate &&
                setariRules?.indice_conversie_puncte && (
                  <Text as="p4">
                    Ai{" "}
                    <span style={{ color: theme["nav-green"] }}>
                      {user.puncte_fidelitate.toFixed(2)} puncte
                    </span>{" "}
                    rămase de fidelitate. Acestea valoreaza in prezent{" "}
                    <span style={{ color: theme["nav-green"] }}>
                      {(
                        user.puncte_fidelitate /
                        setariRules.indice_conversie_puncte
                      ).toFixed(2)}{" "}
                      RON.
                    </span>
                  </Text>
                )}

              {!user?.puncte_fidelitate && (
                <Text as="p4">
                  Ne pare rău, dar momentan ai 0 puncte de fidelitate.
                </Text>
              )}
              {setariRules && (
                <Text as="p4">
                  Pentru a putea folosi puncte de fidelitate pentru a economisi
                  bani in cadrul unei comenzi, trebuie sa detii puncte de
                  fidelitate in valoare de minim{" "}
                  <span style={{ color: theme["nav-green"] }}>
                    {setariRules.procent_minim_puncte}% din valoarea comenzii
                  </span>{" "}
                  si vei avea posibilitatea sa economisesti pana la{" "}
                  <span style={{ color: theme["nav-green"] }}>
                    {setariRules.procent_maxim_puncte}%
                  </span>{" "}
                  din valoarea comenzii pe pagina de checkout.
                </Text>
              )}

              <Text as="p4">
                Poti castiga mai multe puncte de fidelitate prin comenzi si
                castigarea de promotii si oferte speciale. Punctele castigate
                datorita comenzilor vor fi atribuite dupa ce comanda va ajunge
                la tine si vor fi sustrase in cazul returnarii produselor.
              </Text>
            </div>
          </>
        )}
        {linkOpened?.name === "formular-contact" && (
          <>
            <ContactForm messageForm={messageForm} linkOpened={linkOpened} />
          </>
        )}
      </Modal>
    </>
  );
};
