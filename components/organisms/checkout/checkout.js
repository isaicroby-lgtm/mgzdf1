"use client";

import React, { useEffect, useMemo, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { min } from "lodash";
import styled from "styled-components";
import { Checkbox, Form, Input, Progress, Radio, Select, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import FeatherIcon from "feather-icons-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const trackPurchase = dynamic(() => import("@/components/purchase"), {
  ssr: false,
});

import {
  createUser,
  getUserToken,
  updateUserInfoFirestore,
} from "@/api/account";
import { getSetariRules } from "@/api/setari-rules";
import { checkOrder } from "@/api/comenzi";
import { countCurrentUserOrders } from "@/api/users";
import { getFanBoxes } from "@/api/shipping";
import theme from "@/components/atoms/theme";
import Text from "@/components/atoms/Text";
import Modal from "@/components/atoms/Modal";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import { cartDelete, cartInfoAdd } from "@/redux/cart/actionCreator";
import { encodeURL } from "@/utility/urlFormatting";
import Logo from "@/static/img/LogoTransparent.svg";

import { isValidEmail } from "../modals/modal-account";
import {
  CartSingleProduct,
  CartSingleProductNameAndQ,
} from "../nav/atoms/Sidebar";
import { consumeCoupon } from "@/api/cupoane";
import Script from "next/script";

const CartExtraInfo = styled.div`
  width: 100%;

  background-color: white;
  padding: 8px;

  position: relative;

  border-bottom: 1px solid ${theme["border-color-base"]};

  padding-top: 16px;
  padding-bottom: 16px;

  padding-left: 8px;
`;

const FormEmailSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 32px;
`;

const FormContactSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 750px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const Inner2 = styled.div`
  padding: 2rem 8%;

  @media only screen and (max-width: 750px) {
    padding: 2rem 4%;
  }
  background-color: ${theme["bg-color-light"]};
`;

const Inner1 = styled.div`
  padding: 2rem 8%;

  @media only screen and (max-width: 750px) {
    padding: 2rem 4%;

    order: 2;
  }
`;

const NavBread = styled.div`
  display: flex;
  gap: 1%;
  align-items: center;

  margin-bottom: 16px;

  p {
    cursor: pointer;
  }

  @media only screen and (max-width: 750px) {
    margin-bottom: 32px;
  }
`;

const CheckoutFooter = styled.footer`
  display: flex;
  margin-top: 64px;
  gap: 2%;

  div {
    cursor: pointer;
  }

  @media only screen and (max-width: 750px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    row-gap: 1rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  min-height: 90vh;

  display: grid;
  grid-template-columns: 1.3fr 1fr;

  @media only screen and (max-width: 750px) {
    display: flex;
    flex-direction: column;
  }
`;

export const CheckoutScreen = () => {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [payment, setPayment] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [openPickFanbox, setOpenPickFanbox] = useState();

  const [isPersoanaJuridica, setIsPersoanaJuridica] = useState();
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [createAccount, setCreateAccount] = useState();

  const [products, setProducts] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const [goodToGo, setGoodToGo] = useState(false);
  const [deliveryType, setDeliveryType] = useState();

  const [usedPoints, setUsedPoints] = useState(0);
  const [isUsedPoints, setIsUsedPoints] = useState(false);
  const [pointsRate, setPointsRate] = useState(0);

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const [courierDeliveryPrice, setCourierDeliveryPrice] = useState(0);
  const [easyboxDeliveryPrice, setEasyboxDeliveryPrice] = useState(0);

  const [modalDeleteCos, setModalDeleteCos] = useState();

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState({});
  const [couponMessage, setCouponMessage] = useState("");

  const [step, setStep] = useState(1);
  const [noStockMessages, setNoStockMessages] = useState([]);

  const [currentUserOrders, setCurrentUserOrders] = useState(-1);
  const [client1, setClient1] = useState({});
  const [client3, setClient3] = useState({});
  const [lockerPlugin, setLockerPlugin] = useState();

  const [lockerInstance, setLockerInstance] = useState();
  const [lockerName, setLockerName] = useState("");
  const [lockerId, setLockerId] = useState("");
  const [lockerAddress, setLockerAddress] = useState("");
  const [lockerCounty, setLockerCounty] = useState("");
  const [lockerCity, setLockerCity] = useState("");
  const [lockerPostalCode, setLockerPostalCode] = useState("");
  const [lockerPayment, setLockerPayment] = useState(false);

  const [easybox, setEasybox] = useState(false);
  const [fanBoxes, setFanBoxes] = useState([]);

  const [county, setCounty] = useState("");
  const [deliveryCounty, setDeliveryCounty] = useState("");

  const orase_dupa_judete_romania = require("./orase-dupa-judet.json");

  const filteredFanBoxes = useMemo(() => {
    return fanBoxes.filter((fanbox) => {
      return (
        fanbox.address.county.toLowerCase() ===
          form
            .getFieldValue(deliveryCounty ? "delivery_county" : "county")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") ||
        !form.getFieldValue(deliveryCounty ? "delivery_county" : "county")
      );
    });
  }, [deliveryCounty, county, fanBoxes]);

  const setDeliveryDetails = async () => {
    const {
      delivery_price,
      delivery_price_easybox,
      prag_transport_gratuit: freeShiping,
      indice_conversie_puncte: _pointsRate,
      client_1,
      client_3,
    } = await getSetariRules();

    setCourierDeliveryPrice(delivery_price);
    setEasyboxDeliveryPrice(delivery_price_easybox);

    setFreeDeliveryThreshold(freeShiping);

    setPointsRate(_pointsRate);
    setClient1(client_1);
    setClient3(client_3);
  };

  const { productsInCart, userInfo, setariRules, pragTransportGratuit } =
    useSelector((state) => {
      return {
        productsInCart: state.cart.products,
        isLoading: state.cart.isLoading,
        userInfo: state.userInfo,
        setariRules: state.setariRules,
        pragTransportGratuit: state.setariRules.prag_transport_gratuit,
      };
    });

  const checkProducts = async () => {
    const { products: checkedProducts, noStockMessages: noStockMes } =
      await checkOrder(productsInCart);

    let canEasybox = true;
    for (const p of checkedProducts) {
      if (!p.easyboxAvailability) {
        canEasybox = false;
        break;
      }
    }
    setEasybox(canEasybox);

    setProducts(checkedProducts);
    setNoStockMessages(noStockMes);
  };

  const getUserOrdersCount = async () => {
    const count = await countCurrentUserOrders();
    setCurrentUserOrders(count);
    return count;
  };
  

  const easyboxCallback = (msg) => {
    setLockerPayment(msg.supportedPayment == 1 ? true : false);
    setLockerId(msg.lockerId);
    setLockerName(msg.name);
    setLockerAddress(msg.address);
    setLockerCounty(msg.county);
    setLockerCity(msg.city);
    setLockerPostalCode(msg.postalCode);

    window.LockerPlugin.getInstance().close();
  };

  const handleFinish = async (abc) => {
    if (!goodToGo) {
      if (!abc?.values?.deliveryType) {
        alert("Ati uitat sa completati campul de modalitate de livrare.");
      } else if (!abc?.values?.paymentType) {
        alert("Ati uitat sa completati campul de modalitate de plata.");
      } else alert("Ati uitat sa completati un camp obligatoriu.");

      return;
    }

    if (deliveryType === "ridicare-easybox") {
      if (
        (setariRules.boxProvider !== "fanbox" && !lockerId) ||
        (setariRules.boxProvider === "fanbox" && !abc.fanboxLocation)
      ) {
        alert("Va rugam sa selectati un box pentru livrare1");
        return;
      }
    }
    if (deliveryType === "ridicare-easybox" && !easybox) {
      alert("Livrarea in box este indisponibila pentru aceste produse");
      return;
    }
    if (
      deliveryType === "ridicare-easybox" &&
      !lockerPayment &&
      payment === "ramburs" &&
      setariRules.boxProvider !== "fanbox"
    ) {
      alert("Easybox-ul selectat nu suporta plata ramburs");
      return;
    }

    if (isValidEmail(abc.email)) {
      let newUser;
      if (createAccount) {
        newUser = {
          email: abc.email,
          firstName: abc.firstName,
          lastName: abc.lastName,
          password: abc.accountPassword,
        };
        if (newUser.password.length < 8) {
          alert("Parola trebuie sa aiba macar 8 caractere");
          return;
        }
        let hasError = false;
        try {
          const createdUser = await createUser({ ...newUser });
          newUser.uid = createdUser.uid;
        } catch (e) {
          alert("Eroare la creare utilizator");
          console.log(e);
          hasError = true;
          return;
        }
        if (hasError) return;
      }

      setLoadingSubmit(true);
      dispatch(cartInfoAdd(abc.values));
      let _customerData;
      if (step == 1) {
        _customerData = {
          firstName: abc.firstName,
          lastName: abc.lastName,
          county: abc.county,
          city: abc.city,
          adress: abc.address,
          apartment: abc.apartment,
          zipCode: abc.zipCode,
          phone: abc.phone,
          email: abc.email,
          notes: abc.notes || "",
          isCompany: abc.persoanaJuridica || false,
          companyName: abc.companyName || "",
          companyCui: abc.companyCUI || "",
        };
        if (abc.sameFactura) {
          _customerData = {
            ..._customerData,
            delivery_firstName: abc.firstName,
            delivery_lastName: abc.lastName,
            delivery_county: abc.county,
            delivery_city: abc.city,
            delivery_adress: abc.address,
            delivery_apartment: abc.apartment,
            delivery_zipCode: abc.zipCode,
          };
        } else {
          _customerData = {
            ..._customerData,
            delivery_firstName: abc.delivery_firstName,
            delivery_lastName: abc.delivery_lastName,
            delivery_county: abc.delivery_county,
            delivery_city: abc.delivery_city,
            delivery_adress: abc.delivery_adress,
            delivery_apartment: abc.delivery_apartment,
            delivery_zipCode: abc.delivery_zipCode,
          };
        }
      }

      if (deliveryType === "ridicare-easybox") {
        _customerData.boxProvider = setariRules.boxProvider;
        if (setariRules.boxProvider !== "fanbox") {
          _customerData.lockerId = lockerId;
          _customerData.lockerName = lockerName;
          _customerData.lockerAddress = lockerAddress;
          _customerData.lockerCounty = lockerCounty;
          _customerData.lockerCity = lockerCity;
          _customerData.lockerPostalCode = lockerPostalCode;
        } else {
          const box = filteredFanBoxes.find((fanbox) => {
            return fanbox.name === abc.fanboxLocation;
          });

          _customerData.lockerId = box.id;
          _customerData.lockerName = box.name;
          _customerData.lockerAddress =
            box.address.street + " " + box.address.streetNo;
          _customerData.lockerCounty = box.address.county;
          _customerData.lockerCity = box.address.locality;
          _customerData.lockerPostalCode = box.address.zipCode;
        }
      }

      if (noStockMessages?.length) {
        alert("Exista produse cu stoc insuficient");
        setLoadingSubmit(false);

        return;
      }
      if (products.length == 0) {
        alert("Nu exista produse valide in cos");
        setLoadingSubmit(false);

        return;
      }

      const orderObject = {};
      orderObject.customerData = _customerData;
      orderObject.payment = payment;
      orderObject.total_price = totalPrice;
      orderObject.couponId = coupon?.docId ?? null;
      orderObject.points_used = usedPoints ?? 0;
      orderObject.deliveryType = deliveryType;

      orderObject.products = products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          code: product.code,
          quantity: product.quantity,
          price: product.price * product.quantity,
        };
      });

      const nonUndefinedExtraCustomerData = {};

      for (const x of Object.keys(_customerData)) {
        nonUndefinedExtraCustomerData[x] = _customerData[x];
      }

      try {
        if (createAccount) {
          await updateUserInfoFirestore({
            extraInfo: _customerData,
            id: newUser.uid,
          });
        } else {
          await updateUserInfoFirestore({
            extraInfo: _customerData,
            id: userInfo.uid,
          });
        }
      } catch (error) {
        console.log(error);
      }

      let userToken = await getUserToken();

      const apiBaseUrl = "https://api-ekfyledvua-ew.a.run.app";

      await axios
        .post(apiBaseUrl + "/create_order", orderObject, {
          headers: { Authorization: userToken },
        })
        .then(async (res) => {
          //ReactGA.event("purchase");
          console.log("trimis");

          // în interiorul .then(async (res) => { ... })
          const orderId = res.data.orderId;

          // CALCULE PENTRU LOCALSTORAGE (pentru evenimentul purchase)
          const productsValue = orderObject.products.reduce(
            (acc, p) => acc + Number(p.price || 0),
            0
          );

          // determină rata TVA (fallback 21%)
          const tvaRate =
            (setariRules &&
              (setariRules.taxa_tva ?? setariRules.tva ?? setariRules.TVA)) ??
            0.21;

          // calculează taxa ramburs dacă e cazul (aceeași logică folosită la total)
          const codFee =
            payment === "ramburs" &&
            setariRules?.ramburs_payment_tax &&
            deliveryType !== "ridicare-sediu" &&
            !freeDelivery
              ? Number(setariRules.ramburs_payment_tax)
              : 0;

          // shipping = deliveryPrice (dacă nu e gratuit) + codFee
          const shipping = freeDelivery
            ? 0
            : Number(deliveryPrice || 0) + codFee;

          // taxă = TVA aplicată la (produse + shipping + alte taxe incluse în shipping)
          const taxAmount =
            Math.round(
              (productsValue + shipping) * Number(tvaRate || 0) * 100
            ) / 100;

          // total calculat (pentru referință) — poate conține deja TVA în orderObject.total_price
          const totalStored =
            Math.round(Number(orderObject.total_price || 0) * 100) / 100;

        // funcție robustă pentru formatarea numărului de telefon (România)
   
// construim user_data din datele deja colectate
const user_data = {
  email_address:
    _customerData?.email ||
    newUser?.email ||
    userInfo?.email ||
    "unknown@example.com",
  phone_number: _customerData?.phone || userInfo?.phone || "",
  first_name:
    _customerData?.firstName ||
    newUser?.firstName ||
    userInfo?.firstName ||
    "",
  last_name:
    _customerData?.lastName ||
    newUser?.lastName ||
    userInfo?.lastName ||
    "",
  address: {
    street: _customerData?.adress || "",
    city: _customerData?.city || "",
    region: _customerData?.county || "",
    postal_code: _customerData?.zipCode || "",
    country: "RO",
  },
};
const ordersCount = await getUserOrdersCount();
const is_new_customer = ordersCount === 0;


console.log("is_new_customer:", is_new_customer, "currentUserOrders:", currentUserOrders);


const user_id = newUser?.uid || userInfo?.uid || userInfo?.id || null;
// salvăm totul într-un singur obiect în localStorage
localStorage.setItem(
  "lastOrder",
  JSON.stringify({
    products: orderObject.products,
    value: Math.round(productsValue * 100) / 100,
    tax: taxAmount,
    shipping: Math.round(shipping * 100) / 100,
    total: totalStored,
    orderId: orderId,
    currency: "RON",
    user_data, // 🔹 inclus aici
    // 🔹 câmpurile suplimentare
    is_new_customer,
    user_id,
  })
);

          trackPurchase({
            value: totalPrice,
            currency: "RON",
            contentName: "Comanda noua",
          });
          if (payment === "ramburs") {
            router.push("/comanda-finalizata");
          } else if (payment === "card") {
            await axios
              .post("https://api-ekfyledvua-ew.a.run.app/card_payment", {
                orderId,
              })
              .then((response) => {
                const { data } = response;
                router.push(
                  `/plata-card/?url=${encodeURIComponent(
                    data.url
                  )}&data=${encodeURIComponent(
                    data.data
                  )}&envKey=${encodeURIComponent(data.env_key)}`
                );
              });
          }
          setLoadingSubmit(false);
        })
        .catch(async (error) => {
          alert("A apărut o eroare. Vă rugăm încercați din nou.");
          await setDeliveryDetails();
          await checkProducts();
          await getUserOrdersCount();
          setCoupon({});
          setUsedPoints(0);
          setIsUsedPoints(false);
          setLoadingSubmit(false);
          console.log(error);
        });
    } else alert("Te rugam sa introduci o adresa de email valida!");

    setLoadingSubmit(false);
  };

  const handleFinishFailed = (abc) => {
    if (abc?.values?.zipCode?.length !== 6) {
      alert(
        "Campul de cod postal este obligatoriu si trebuie sa containa exact 6 caractere."
      );
    } else if (
      abc?.values?.delivery_zipCode !== undefined &&
      abc?.values?.delivery_zipCode?.length !== 6
    ) {
      alert(
        "Campul de cod postal este obligatoriu si trebuie sa containa exact 6 caractere."
      );
    } else {
      if (!abc?.values?.deliveryType) {
        alert("Ati uitat sa completati campul de modalitate de livrare.");
      } else if (!abc?.values?.paymentType) {
        alert("Ati uitat sa completati campul de modalitate de plata.");
      } else alert("Ati uitat sa completati un camp obligatoriu.");
    }
  };

  const submitCoupon = async () => {
    if (!couponInput) return;
    const {
      accepted,
      error,
      coupon: _coupon,
    } = await consumeCoupon(couponInput, totalProducts);

    if (accepted) {
      setCoupon(_coupon);
      setCouponMessage("");
    } else {
      setCoupon({});
      setCouponMessage(error);
    }
  };

  const handleOpenProduct = (name) => {
    const enc = encodeURL(name);
    if (pathname?.includes("admin")) {
      router.push(`/admin/produse/${enc}`);
    } else router.push(`/magazin/${enc}`);
  };

  let fullDiscount = 0;

  const availablePointsDiscount = useMemo(() => {
    return userInfo?.puncte_fidelitate / setariRules.indice_conversie_puncte;
  }, [userInfo, setariRules]);

  const minDiscount = useMemo(() => {
    return totalProducts * (setariRules?.procent_minim_puncte / 100);
  }, [totalProducts, setariRules]);

  const maxDiscount = useMemo(() => {
    return totalProducts * (setariRules?.procent_maxim_puncte / 100);
  }, [totalProducts, setariRules]);

  useEffect(() => {
    let _subtotal = products?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0
    );

    setTotalProducts(_subtotal);

    if (pointsRate) _subtotal -= usedPoints / pointsRate;
    _subtotal -= coupon?.discount || 0;

    let _total = _subtotal;

    if (_subtotal >= freeDeliveryThreshold) {
      setFreeDelivery(true);
    } else if (
      (currentUserOrders == 0 && client1?.transport_gratuit) ||
      (currentUserOrders == 2 && client3?.transport_gratuit)
    ) {
      setFreeDelivery(true);
    } else {
      setFreeDelivery(false);
      _total += deliveryPrice;
    }

    if (
      payment === "ramburs" &&
      setariRules.ramburs_payment_tax &&
      deliveryType !== "ridicare-sediu" &&
      !freeDelivery
    )
      _total += setariRules.ramburs_payment_tax;

    setTotalPrice(_total);
    setSubTotal(_subtotal);
  }, [
    coupon?.discount,
    freeDeliveryThreshold,
    deliveryPrice,
    pointsRate,
    usedPoints,
    products,
    currentUserOrders,
    client1,
    client3,
    payment,
  ]);

  useEffect(() => {
    checkProducts();
    setDeliveryDetails();
    getUserOrdersCount();

    if (setariRules.boxProvider !== "fanbox") {
      window.LockerPlugin?.init({
        clientId: "2ac6bfe7-95b0-4e79-8544-a2acf5cfa78e",
        apiUsername: "doifratiAPI",
        langCode: "ro",
        theme: "light",
      });

      const instance = window.LockerPlugin?.getInstance();
      instance?.subscribe(easyboxCallback);

      setLockerInstance(instance);
    }
  }, [lockerPlugin]);
  const [beginCheckoutSent, setBeginCheckoutSent] = useState(false);

  useEffect(() => {
    if (
      !beginCheckoutSent &&
      typeof window !== "undefined" &&
      productsInCart?.length > 0 &&
      subTotal > 0
    ) {
      window.dataLayer = window.dataLayer || [];

      // Curățăm ecommerce precedent (bună practică GA4)
      window.dataLayer.push({ ecommerce: null });

      // Trimitem evenimentul begin_checkout
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "RON",
          value: Number(subTotal.toFixed(2)),
          items: productsInCart.map((p) => ({
            item_id: p.id,
            item_name: p.name,
            item_variant: p.code,
            price: Number(p.price.toFixed(2)), // ✅ preț unitar rotunjit
            quantity: p.quantity,
          })),
        },
      });

      console.log("[GA4] begin_checkout pushed to dataLayer");
      setBeginCheckoutSent(true);
    }
  }, [subTotal, productsInCart, beginCheckoutSent]);

  const optionsForCity = [
    ...new Set(
      orase_dupa_judete_romania?.[county]
        ?.sort((a, b) => {
          if (a?.nume === b?.nume) return 0;
          else return a?.nume < b?.nume ? -1 : 1;
        })
        ?.map((city) => {
          return city?.nume;
        }) || []
    ),
  ];

  const optionsForDeliveryCity = [
    ...new Set(
      orase_dupa_judete_romania?.[deliveryCounty]
        ?.sort((a, b) => {
          if (a?.nume === b?.nume) return 0;
          else return a?.nume < b?.nume ? -1 : 1;
        })
        ?.map((city) => {
          return city?.nume;
        }) || []
    ),
  ];

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.sameday.ro/locker-plugin/lockerpluginsdk.js"
        onLoad={() => {
          console.log("loading");
        }}
        onReady={() => {
          console.log("ready");

          setLockerPlugin(window.LockerPlugin);
        }}
        onError={() => console.log("error")}
      />

      <Modal
        visible={openPickFanbox}
        onCancel={() => setOpenPickFanbox()}
        type="primary"
        okText="Salveaza fanbox"
      ></Modal>

      <Modal
        title="Esti sigur ca vrei sa scoti acest produs din cos?"
        visible={modalDeleteCos}
        onOk={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(cartDelete(modalDeleteCos.id, productsInCart));
          setModalDeleteCos();
          window.location.reload();
        }}
        onCancel={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setModalDeleteCos();
        }}
      />

      <Wrapper>
        <Inner1>
          <div>
            <Image
              unoptimized={true}
              onClick={() => router.push("/")}
              onContextMenu={(event) => event.preventDefault()}
              src={Logo}
              alt="logo"
              style={{
                minWidth: 220,
                maxWidth: 620,
                width: "50%",
                height: "auto",
                marginBottom: 64,
                cursor: "pointer",
              }}
            />

            <Form
              initialValues={{
                ...userInfo,
                address: userInfo?.adress,
                emailNews: true,
                textNews: true,
                sameFactura: true,
              }}
              form={form}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
            >
              <FormContactSection>
                <Heading as="h5" style={{ fontWeight: 500 }}>
                  1. Cum vrei să fii contactat?
                </Heading>
                {userInfo.isLogged ? null : (
                  <Text as="p6">
                    <span>Ai deja un cont? </span>
                    <Link
                      href="/login"
                      style={{
                        color: theme["secondary-color"],
                        cursor: "pointer",
                      }}
                    >
                      Logheaza-te
                    </Link>
                  </Text>
                )}
              </FormContactSection>
              <FormEmailSection>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message:
                        "Unde vrei să primești noutăți despre comanda ta?",
                    },
                  ]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="email"
                >
                  <Input size="large" placeholder="Adresa ta de email" />
                </Form.Item>
                {createAccount ? (
                  <Form.Item
                    style={{
                      margin: 0,
                      marginTop: 16,
                      padding: 0,
                      width: "100%",
                    }}
                    name="accountPassword"
                  >
                    <Input
                      type="password"
                      size="large"
                      placeholder="Parola pentru contul tau"
                    />
                  </Form.Item>
                ) : null}
                {userInfo.isLogged ? null : (
                  <Form.Item
                    valuePropName="checked"
                    style={{
                      margin: 0,
                      marginTop: 24,
                      marginBottom: 10,
                      padding: 0,
                      width: "100%",
                    }}
                    name="emailNews"
                  >
                    <Checkbox>
                      Vreau să fiu primul care primește noutăți și reduceri
                    </Checkbox>
                  </Form.Item>
                )}
                {userInfo.isLogged ? null : (
                  <Form.Item
                    valuePropName="checked"
                    style={{ marginTop: 0, padding: 0, width: "100%" }}
                    name="creeazaCont"
                  >
                    <Checkbox
                      onChange={(e) => {
                        const { checked } = e.target;

                        setCreateAccount(checked);
                      }}
                    >
                      Creeaza un cont cu aceasta adresa de email pentru o
                      experienta imbunatatita la urmatoarea livrare si reduceri
                      surpriza.
                    </Checkbox>
                  </Form.Item>
                )}
              </FormEmailSection>
              <Heading as="h5" style={{ marginBottom: 16, fontWeight: 500 }}>
                2. Adresa de facturare
              </Heading>

              <Form.Item
                valuePropName="checked"
                name="sameFactura"
                style={{
                  margin: 0,
                  padding: 0,
                  width: "100%",
                  marginBottom: 4,
                }}
              >
                <Checkbox
                  onChange={(e) => {
                    const { checked } = e.target;
                    setIsSameAddress(checked);
                  }}
                >
                  Adresa de facturare este identica cu adresa de livrare
                </Checkbox>
              </Form.Item>
              <Form.Item
                valuePropName="checked"
                style={{
                  margin: 0,
                  padding: 0,
                  width: "100%",
                  marginBottom: 16,
                }}
                name="persoanaJuridica"
              >
                <Checkbox
                  onChange={(e) => {
                    const { checked } = e.target;
                    setIsPersoanaJuridica(checked);
                  }}
                >
                  Sunt persoana juridica
                </Checkbox>
              </Form.Item>
              <div style={{ display: "flex", marginBottom: 16, gap: 16 }}>
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
              </div>
              {isPersoanaJuridica ? (
                <div style={{ display: "flex", marginBottom: 16, gap: 16 }}>
                  <Form.Item
                    rules={[{ required: isPersoanaJuridica, message: "" }]}
                    name="companyName"
                    style={{ margin: 0, padding: 0, width: "100%" }}
                  >
                    <Input size="large" placeholder="Nume companie" />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: isPersoanaJuridica, message: "" }]}
                    name="companyCUI"
                    style={{ margin: 0, padding: 0, width: "100%" }}
                  >
                    <Input size="large" placeholder="CUI companie" />
                  </Form.Item>
                </div>
              ) : null}

              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%" }}
                name="address"
              >
                <Input size="large" placeholder="Adresa" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{ margin: 0, padding: 0, width: "100%", marginTop: 16 }}
                name="apartment"
              >
                <Input size="large" placeholder="Apartament, nr, etc" />
              </Form.Item>

              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="county"
                >
                  <Select
                    showSearch
                    placeholder="Judet"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setCounty(e);
                    }}
                    options={Object.keys(orase_dupa_judete_romania).map(
                      (county) => {
                        return {
                          value: county,
                          label: county,
                        };
                      }
                    )}
                  ></Select>
                </Form.Item>

                <Form.Item
                  rules={[{ required: true, message: "" }]}
                  style={{ margin: 0, padding: 0, width: "100%" }}
                  name="city"
                >
                  <Select
                    showSearch
                    placeholder="Oras"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      console.log(e);
                    }}
                    options={optionsForCity?.map((city) => {
                      return { value: city, label: city };
                    })}
                  ></Select>
                </Form.Item>
              </div>

              <Form.Item
                rules={[
                  {
                    required: true,
                    len: 6,
                    message:
                      "Acest camp este obligatoriu si trebuie sa contina exact 6 caractere.",
                  },
                ]}
                style={{ margin: 0, marginTop: 16, width: "100%" }}
                name="zipCode"
              >
                <Input size="large" placeholder="Cod postal" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "" }]}
                style={{
                  margin: 0,
                  marginTop: 16,
                  padding: 0,
                  width: "100%",
                }}
                name="phone"
              >
                <Input size="large" placeholder="Număr telefon" />
              </Form.Item>

              <Form.Item
                style={{
                  margin: 0,
                  marginTop: 16,
                  marginBottom: 32,
                  padding: 0,
                  width: "100%",
                }}
                name="notes"
              >
                <TextArea rows={4} placeholder="Alte detalii (optional)" />
              </Form.Item>

              {!isSameAddress ? (
                <>
                  <Heading
                    as="h5"
                    style={{ marginBottom: 16, fontWeight: 500 }}
                  >
                    Unde vrei sa iti livram coletul?
                  </Heading>

                  <div style={{ display: "flex", marginBottom: 16, gap: 16 }}>
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
                    style={{
                      margin: 0,
                      padding: 0,
                      width: "100%",
                      marginTop: 16,
                    }}
                    name="delivery_apartment"
                  >
                    <Input size="large" placeholder="Apartament, nr, etc" />
                  </Form.Item>

                  <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                    <Form.Item
                      rules={[{ required: true, message: "" }]}
                      style={{ margin: 0, padding: 0, width: "100%" }}
                      name="delivery_county"
                    >
                      <Select
                        showSearch
                        placeholder="Judet"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          setDeliveryCounty(e);
                        }}
                        options={Object.keys(orase_dupa_judete_romania).map(
                          (county) => {
                            return {
                              value: county,
                              label: county,
                            };
                          }
                        )}
                      ></Select>
                    </Form.Item>
                    <Form.Item
                      rules={[{ required: true, message: "" }]}
                      style={{ margin: 0, padding: 0, width: "100%" }}
                      name="delivery_city"
                    >
                      <Select
                        showSearch
                        placeholder="Oraș"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          console.log(e);
                        }}
                        options={optionsForDeliveryCity?.map((city) => {
                          return { value: city, label: city };
                        })}
                      ></Select>
                    </Form.Item>
                  </div>

                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message:
                          "Acest camp este obligatoriu si trebuie sa contina exact 6 caractere.",
                        len: 6,
                      },
                    ]}
                    style={{
                      margin: 0,
                      marginTop: 16,
                      marginBottom: 32,
                      width: "100%",
                    }}
                    name="delivery_zipCode"
                  >
                    <Input size="large" placeholder="Cod postal" />
                  </Form.Item>
                </>
              ) : (
                <></>
              )}

              <Heading as="h5" style={{ fontWeight: 500 }}>
                3. Alege modalitatea de livrare
              </Heading>

              <Form.Item
                name="deliveryType"
                rules={[{ required: true, message: "" }]}
              >
                <Radio.Group
                  value={deliveryType}
                  onChange={async (e) => {
                    setDeliveryType(e.target.value);
                    if (e.target.value === "ridicare-easybox") {
                      setDeliveryPrice(freeDelivery ? 0 : easyboxDeliveryPrice);
                      if (
                        setariRules.boxProvider === "fanbox" &&
                        fanBoxes.length === 0
                      ) {
                        const fb = await getFanBoxes();

                        setFanBoxes(fb);
                      }
                    } else if (e.target.value === "livrare-curier-sameday") {
                      setDeliveryPrice(freeDelivery ? 0 : courierDeliveryPrice);
                    } else {
                      setDeliveryPrice(0);
                    }
                  }}
                >
                  <Space direction="vertical" style={{ marginTop: "24px" }}>
                    {easybox &&
                      deliveryType === "ridicare-easybox" &&
                      lockerId && (
                        <Text as="p5">
                          <span style={{ textTransform: "capitalize" }}>
                            {setariRules.boxProvider}{" "}
                          </span>
                          selectat: {lockerName}
                        </Text>
                      )}
                    {easybox && (
                      <Radio value="ridicare-easybox">
                        <span style={{ textTransform: "capitalize" }}>
                          {setariRules.boxProvider}{" "}
                        </span>
                        (
                        {freeDelivery
                          ? "Gratuit"
                          : `${easyboxDeliveryPrice} RON`}
                        )
                      </Radio>
                    )}

                    {easybox &&
                      deliveryType === "ridicare-easybox" &&
                      setariRules.boxProvider !== "fanbox" && (
                        <Button
                          style={{ padding: "4px 20px" }}
                          type="primary"
                          outlined
                          onClick={() => {
                            lockerInstance?.open();
                          }}
                        >
                          Alege Easybox
                        </Button>
                      )}
                    {easybox &&
                      deliveryType === "ridicare-easybox" &&
                      setariRules.boxProvider === "fanbox" && (
                        <Form.Item
                          rules={[{ required: true, message: "" }]}
                          style={{
                            margin: 0,
                            padding: 0,
                            width: "100%",
                            marginBottom: 12,
                          }}
                          name="fanboxLocation"
                        >
                          <Select
                            showSearch
                            placeholder="Fanbox"
                            style={{ width: "100%" }}
                            options={filteredFanBoxes.map((fb) => {
                              const {
                                county,
                                locality,
                                street,
                                streetNo,
                                floor,
                                zipCode,
                                reference,
                              } = fb.address;
                              let label = "";

                              label = `${county}, ${locality}, ${street}, Nr: ${streetNo}`;
                              if (floor) label += `, Etaj: ${floor}`;
                              label += ` | Cod postal: ${zipCode}`;
                              if (reference)
                                label += ` | Punct de reper: ${reference}`;

                              return {
                                value: fb.name,
                                label,
                              };
                            })}
                          ></Select>
                        </Form.Item>
                      )}

                    <Radio value="livrare-curier-sameday">
                      Livrare prin curier rapid (
                      {freeDelivery ? "Gratuit" : `${courierDeliveryPrice} RON`}
                      )
                    </Radio>
                    <Radio value="ridicare-sediu">
                      Ridica de la sediu (Gratuit)
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Heading as="h5" style={{ fontWeight: 500, marginTop: 32 }}>
                4. Alege modalitatea de plată
              </Heading>
              <Form.Item
                name="paymentType"
                rules={[{ required: true, message: "" }]}
              >
                <Radio.Group
                  value={payment}
                  onChange={(e) => {
                    setPayment(e.target.value);
                  }}
                >
                  <Space direction="vertical" style={{ marginTop: "24px" }}>
                    <Radio value="ramburs">
                      <span style={{ fontWeight: 500 }}>
                        {`Ramburs ${
                          freeDelivery || deliveryType == "ridicare-sediu"
                            ? "(fără taxă)"
                            : `(${setariRules?.ramburs_payment_tax?.toFixed(
                                2
                              )} RON)`
                        }`}
                      </span>
                      <div style={{ color: theme["gray-hover"] }}>
                        {freeDelivery || deliveryType == "ridicare-sediu"
                          ? "Pentru ridicarea de la sediu sau în cazul transportului gratuit nu se percepe taxa de ramburs."
                          : `Pentru plata ramburs se percepe o extra-taxă de procesare de ${setariRules?.ramburs_payment_tax?.toFixed(
                              2
                            )} RON.`}
                      </div>
                    </Radio>

                    <Radio value="card">
                      <div>
                        <span style={{ fontWeight: 500 }}>Card bancar</span>
                        <Image
                          unoptimized={true}
                          height={23}
                          width={122}
                          style={{
                            position: "relative",
                            top: 7,
                            marginLeft: 4,
                          }}
                          src="/img/NetopiaLogo.png"
                          alt="visaAndMasterCard "
                        />
                      </div>
                      <div style={{ color: theme["gray-hover"], marginTop: 3 }}>
                        Plata cu cardul este procesata de catre Netopia
                        Payments. Este acceptat orice card Visa sau Maestro,
                        atat de debit cat si de credit. Toate tranzactiile sunt
                        securizate. Datele tale nu vor fi stocate.
                      </div>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Heading as="h5" style={{ fontWeight: 500, marginBottom: 24 }}>
                  5. Trimite comanda
                </Heading>
                <Text as="p6" style={{ marginBottom: 8 }}>
                  De regula, comenzile plasate pana la ora 14:30 (luni-vineri)
                  pleaca in aceeasi zi si se livreaza in 24h-48h (depinde de
                  zona, conditii meteo etc).
                </Text>
                <Text as="p6">
                  Sunt de acord cu trimiterea datelor conform termenii si
                  conditiile website-ului DoiFrati.ro, politica de
                  confidentialitate si GDPR.
                </Text>
              </Form.Item>
              <Form.Item
                valuePropName="checked"
                rules={[{ required: true, message: "" }]}
                name="permission"
              >
                <Checkbox onChange={(e) => setGoodToGo(e.target.checked)}>
                  Am citit si sunt de acord cu{" "}
                  <a
                    target="_blank"
                    href="https://www.doifrati.ro/termeni-si-conditii"
                    style={{ color: theme["primary-color"] }}
                  >
                    termenii si conditiile
                  </a>{" "}
                  website-ului DoiFrati.ro.
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  disabled={!goodToGo}
                  isLoading={loadingSubmit}
                >
                  Plasează comanda
                </Button>
              </Form.Item>
            </Form>
          </div>

          <CheckoutFooter>
            <Link href="/politica-de-livrare">Politica de livrare</Link>
            <Link href="/politica-de-confidentialitate">
              Politica de confidentialitate
            </Link>
            <Link href="/politica-de-retur">
              Politica de retur / Formular de retur
            </Link>
            <Link href="/politica-de-cookies">Politica de cookies</Link>
            <Link href="/termeni-si-conditii">Termeni și condiții</Link>
          </CheckoutFooter>
        </Inner1>
        <Inner2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {products?.map((product) => {
              const discount =
                (product.discount3 &&
                  product.quantity >= 3 &&
                  product.discount3) ||
                (product.discount2 &&
                  product.quantity >= 2 &&
                  product.discount2) ||
                0;

              fullDiscount +=
                (discount * product.fullPrice * product.quantity) / 100;

              return (
                <CartSingleProduct key={product.id}>
                  <Image
                    width={124}
                    height={124}
                    onContextMenu={(event) => event.preventDefault()}
                    src={product.fileDownloadURL}
                    onClick={() => handleOpenProduct(product.name)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      border: `1px solid #48ACF0`,
                      borderRadius: 4,
                      background: "white",
                      objectFit: "contain",
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
                    <p style={{ marginTop: 16 }}>
                      <span
                        style={{
                          display: "inline-block",
                          marginRight: 16,
                          fontWeight: 500,
                        }}
                      >
                        Nr. bucati:
                      </span>
                      {product.quantity}
                    </p>
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
                      {product.quantity} x {product.fullPrice} RON
                    </p>
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
            {deliveryType === "livrare-curier-sameday" ? (
              <CartExtraInfo>
                <Text as="p4" style={{ marginBottom: 8 }}>
                  Livrare prin curier rapid
                </Text>
                <Text as="p6">
                  {!freeDelivery ? `Pret: ${deliveryPrice} RON` : "Gratuit"}
                </Text>
              </CartExtraInfo>
            ) : (
              ""
            )}
            {deliveryType === "ridicare-easybox" ? (
              <CartExtraInfo>
                <Text as="p4" style={{ marginBottom: 8 }}>
                  Livrare la easybox
                </Text>
                <Text as="p6">
                  {!freeDelivery ? `Pret: ${deliveryPrice} RON` : "Gratuit"}
                </Text>
              </CartExtraInfo>
            ) : (
              ""
            )}
            {fullDiscount ? (
              <CartExtraInfo>
                <Text as="p4" style={{ marginBottom: 8 }}>
                  Reducere pentru achizitionarea a mai multor produse de acelasi
                  fel:{" "}
                </Text>
                <Text as="p6">{fullDiscount?.toFixed(2)} RON</Text>
              </CartExtraInfo>
            ) : (
              ""
            )}

            {products && products?.length && usedPoints && pointsRate ? (
              <CartExtraInfo>
                <Text as="p4" style={{ marginBottom: 8 }}>
                  Puncte de fidelitate folosite: {usedPoints?.toFixed(2)}
                </Text>
                <Text as="p6">{`-${(usedPoints / pointsRate).toFixed(
                  2
                )} RON`}</Text>
              </CartExtraInfo>
            ) : (
              ""
            )}
            {products && products?.length && coupon && coupon?.discount ? (
              <CartExtraInfo>
                <Text as="p4" style={{ marginBottom: 8 }}>
                  {`${coupon?.nume}`}
                </Text>
                <Text as="p6">{`-${coupon?.discount?.toFixed(2)} RON`}</Text>
              </CartExtraInfo>
            ) : (
              ""
            )}
            {noStockMessages?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginTop: 64,
                }}
              >
                <Text as="p4">Produsele următoare nu au stoc suficient:</Text>
                {noStockMessages.map((message, i) => {
                  return (
                    <Text key={i} as="p6">
                      {message}
                    </Text>
                  );
                })}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: 64,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text as="p4">{couponMessage}</Text>
            </div>
            <div style={{ display: "flex" }}>
              <Input
                size="large"
                placeholder="Cupon de reducere"
                style={{ borderRadius: "0" }}
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                }}
              />
              <Button
                type="primary"
                outlined
                style={{ borderRadius: "0" }}
                onClick={submitCoupon}
              >
                Aplica
              </Button>
            </div>
            {userInfo.puncte_fidelitate &&
              setariRules.indice_conversie_puncte && (
                <div>
                  {!isUsedPoints ? (
                    <Text as="p4" style={{ textAlign: "end" }}>
                      Ai puncte de fidelitate in valoare de{" "}
                      <span style={{ color: theme["nav-green"] }}>
                        {availablePointsDiscount?.toFixed(2)} lei
                      </span>{" "}
                      rămase.{" "}
                      {availablePointsDiscount < minDiscount
                        ? `Mai ai nevoie de puncte de fidelitate in valoare de ${(
                            minDiscount - availablePointsDiscount
                          )?.toFixed(2)} lei pentru a le putea folosi.`
                        : `Vrei sa le folosesti la aceasta comanda? Poți folosi puncte în valoare de ${min(
                            [availablePointsDiscount, maxDiscount]
                          )?.toFixed(2)} RON. `}
                      {availablePointsDiscount >= minDiscount && (
                        <span
                          style={{
                            fontWeight: 700,
                            color: theme["nav-green"],
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            if (availablePointsDiscount >= minDiscount) {
                              setUsedPoints(
                                parseFloat(
                                  (
                                    min([
                                      availablePointsDiscount,
                                      maxDiscount,
                                    ]) * setariRules?.indice_conversie_puncte
                                  ).toFixed(5)
                                )
                              );
                              setIsUsedPoints(true);
                            }
                          }}
                        >
                          Apasa aici daca vrei!
                        </span>
                      )}
                    </Text>
                  ) : (
                    <Text as="p4" style={{ textAlign: "end" }}>
                      Super! Costul comenzii a fost ajustat
                    </Text>
                  )}
                </div>
              )}
          </div>
          {products && products.length ? (
            <>
              <Text
                as="p4"
                style={{ textAlign: "end", fontWeight: "400", marginTop: 32 }}
              >
                <span style={{ fontWeight: "600" }}>Sub-total:</span>{" "}
                {subTotal?.toFixed(2)} RON
              </Text>
              <Text
                as="p4"
                style={{ textAlign: "end", fontWeight: "400", marginTop: 12 }}
              >
                <span style={{ fontWeight: "600" }}>Cost livrare: </span>

                {!freeDelivery
                  ? deliveryPrice === undefined
                    ? "Se incarca"
                    : deliveryPrice
                    ? `${deliveryPrice} RON`
                    : "Costul livrarii va fi calculat dupa ce veti selecta modalitatea de livrare"
                  : "Livrare Gratuita"}
              </Text>
              {payment === "ramburs" &&
              deliveryType !== "ridicare-sediu" &&
              !freeDelivery ? (
                <Text
                  as="p4"
                  style={{ textAlign: "end", fontWeight: "400", marginTop: 12 }}
                >
                  <span style={{ fontWeight: "600" }}>Taxa plata ramburs:</span>{" "}
                  {setariRules.ramburs_payment_tax.toFixed(2)} RON
                </Text>
              ) : null}
              <Text
                as="p4"
                style={{ textAlign: "end", fontWeight: "400", marginTop: 12 }}
              >
                <span style={{ fontWeight: "600" }}>Total:</span>{" "}
                {totalPrice?.toFixed(2)} RON
              </Text>
              <Text
                as="p4"
                style={{ textAlign: "end", fontWeight: "400", marginTop: 12 }}
              >
                <span style={{ fontWeight: "600" }}>TVA (inclus):</span>{" "}
                {(totalPrice * 0.19)?.toFixed(2)} RON
              </Text>
            </>
          ) : (
            <Text
              as="p4"
              style={{ textAlign: "end", fontWeight: "400", marginTop: 32 }}
            >
              Momentan coșul tău de cumpărături este gol
            </Text>
          )}
          {pragTransportGratuit && (
            <div
              style={{
                border: "1px dashed",
                borderColor: theme["border-color-base"],
                borderRadius: 6,
                marginTop: 32,
                marginBottom: 32,
                padding: 10,
                backgroundColor: "white",
              }}
            >
              {pragTransportGratuit - subTotal > 0 ? (
                <Text as="p4">
                  Adauga produse in valoare de inca{" "}
                  <span style={{ color: theme["primary-color"] }}>
                    {(pragTransportGratuit - subTotal)?.toFixed(2)}
                  </span>{" "}
                  lei pentru a beneficia de livrare gratuită.
                  <span style={{ marginTop: 8, display: "block" }}>
                    Apasă{" "}
                    <Link
                      href="/magazin"
                      style={{ color: theme["primary-color"] }}
                    >
                      {" "}
                      aici
                    </Link>{" "}
                    pentru a fi redirecționat către{" "}
                    <Link
                      href="/magazin"
                      style={{ color: theme["primary-color"] }}
                    >
                      {" "}
                      magazin.
                    </Link>
                  </span>
                </Text>
              ) : (
                <Text as="p4">Felicitări! Ai câștigat livrare gratuită!</Text>
              )}
              <Progress
                percent={
                  subTotal
                    ? pragTransportGratuit > subTotal
                      ? ((subTotal / pragTransportGratuit) * 100).toFixed(0)
                      : 100
                    : 0
                }
              />
            </div>
          )}
        </Inner2>
      </Wrapper>
    </>
  );
};
