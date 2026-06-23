"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { min } from "lodash";
import { getUserToken } from "@/api/account";
import { getSetariRules } from "@/api/setari-rules";
import { getFanBoxes } from "@/api/shipping";
import { consumeCoupon } from "@/api/cupoane";
import { countCurrentUserOrders } from "@/api/users";
import theme from "@/components/atoms/theme";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";

const orase_dupa_judete_romania = require("../checkout/orase-dupa-judet.json");

/* ─────────────────────────── Styled ─────────────────────────── */

const QuickButton = styled.button`
  width: 255px;
  min-height: 43px;
  display: flex;
  align-items: stretch;
  border: none;
  border-radius: 8px;
  background: ${(p) =>
    p.$hovered ? "linear-gradient(to right, #f03e2f, #fa8b0c)" : "#F03E2F"};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: ${(p) => (p.$hovered ? "scale(1.02)" : "scale(1)")};
  box-shadow: ${(p) =>
    p.$hovered
      ? "0 4px 12px rgba(240,62,47,0.4)"
      : "0 2px 6px rgba(240,62,47,0.25)"};

  .icon-side {
    background-color: #fa8b0c;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    flex-shrink: 0;
  }

  .text-side {
    flex: 1;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.2;
  }
`;

const ModalBody = styled.div`
  padding: 4px 0 0;
`;

const ProductPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: #f8f9fb;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #eee;

  img {
    width: 72px;
    height: 72px;
    object-fit: contain;
    border-radius: 6px;
    background: white;
    padding: 4px;
    border: 1px solid #eee;
    flex-shrink: 0;
  }

  .pname {
    font-weight: 700;
    font-size: 14px;
    color: #272b41;
    margin-bottom: 3px;
  }

  .pprice {
    color: #f03e2f;
    font-weight: 700;
    font-size: 17px;
  }
`;

const FieldRow = styled.div`
  display: flex;
  gap: 12px;

  > .ant-form-item {
    flex: 1;
    min-width: 0;
  }
`;

const SectionLabel = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: #272b41;
  margin-bottom: 8px;
  margin-top: 4px;
`;

const DeliveryOption = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 2px solid ${(p) => (p.$active ? "#2699FB" : "#eee")};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  margin-bottom: 8px;
  background: ${(p) => (p.$active ? "#f0f7ff" : "white")};

  input {
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: #2699FB;
  }

  .label-text {
    font-weight: 500;
    font-size: 14px;
    color: #272b41;
  }
  .label-sub {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 1px;
  }
`;

const PayOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 2px solid ${(p) => (p.$active ? "#2699FB" : "#eee")};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  margin-bottom: 8px;
  background: ${(p) => (p.$active ? "#f0f7ff" : "white")};

  input {
    flex-shrink: 0;
    accent-color: #2699FB;
  }
  .label-text {
    font-weight: 500;
    font-size: 14px;
    color: #272b41;
  }
`;

const SubmitBtn = styled.button`
  flex: 1;
  min-height: 44px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.disabled ? "#ccc" : "#F03E2F")};
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #d63527;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner {
    width: 15px;
    height: 15px;
    border: 2px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
`;

const SuccessScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 16px;
  text-align: center;
  gap: 14px;

  .check-circle {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: #52c41a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-size: 21px;
    font-weight: 700;
    color: #272b41;
    margin: 0;
  }
  p {
    color: #5a5f7d;
    font-size: 14px;
    margin: 0;
    max-width: 300px;
  }
`;

const CouponRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const DiscountLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #52c41a;
  margin-bottom: 4px;
`;

/* ─────────────────────── QuickOrderButton (export) ─────────────────────── */

export function QuickOrderButton({ product, isProductOutOfStock }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  if (isProductOutOfStock) return null;

  return (
    <>
      <QuickButton
        $hovered={hovered}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        <span className="icon-side">
          <FeatherIcon icon="zap" size={13} color="#fff" />
        </span>
        <span className="text-side">Comandă rapidă</span>
      </QuickButton>

      <QuickOrderModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/* ─────────────────────────── QuickOrderModal ─────────────────────────── */

function QuickOrderModal({ product, open, onClose }) {
  const router = useRouter();
  const [form] = Form.useForm();

  /* redux */
  const { userInfo, reduxSetariRules } = useSelector((state) => ({
    userInfo: state.userInfo,
    reduxSetariRules: state.setariRules,
  }));

  /* address */
  const [county, setCounty] = useState("");

  /* delivery */
  const [deliveryType, setDeliveryType] = useState("livrare-curier-sameday");
  const [easyboxAvail, setEasyboxAvail] = useState(true);

  /* easybox / locker */
  const [lockerInstance, setLockerInstance] = useState(null);
  const [lockerId, setLockerId] = useState("");
  const [lockerName, setLockerName] = useState("");
  const [lockerAddress, setLockerAddress] = useState("");
  const [lockerCounty, setLockerCounty] = useState("");
  const [lockerCity, setLockerCity] = useState("");
  const [lockerPostalCode, setLockerPostalCode] = useState("");
  const [lockerPayment, setLockerPayment] = useState(false);

  /* fanbox */
  const [fanBoxes, setFanBoxes] = useState([]);
  const [fanboxCounty, setFanboxCounty] = useState("");

  /* payment */
  const [payment, setPayment] = useState("ramburs");

  /* pricing */
  const [setariRules, setSetariRules] = useState({});
  const [courierPrice, setCourierPrice] = useState(0);
  const [easyboxPrice, setEasyboxPrice] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  /* coupon */
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState({});
  const [couponMessage, setCouponMessage] = useState("");

  /* loyalty points */
  const [usedPoints, setUsedPoints] = useState(0);
  const [isUsedPoints, setIsUsedPoints] = useState(false);
  const [pointsRate, setPointsRate] = useState(0);
  const [currentUserOrders, setCurrentUserOrders] = useState(-1);
  const [client1, setClient1] = useState({});
  const [client3, setClient3] = useState({});

  /* submit */
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── derived: loyalty points ── */
  const availablePointsDiscount = useMemo(
    () => (userInfo?.puncte_fidelitate ?? 0) / (pointsRate || 1),
    [userInfo, pointsRate]
  );

  const minDiscount = useMemo(
    () => product.price * ((setariRules?.procent_minim_puncte ?? 0) / 100),
    [product.price, setariRules]
  );

  const maxDiscount = useMemo(
    () => product.price * ((setariRules?.procent_maxim_puncte ?? 0) / 100),
    [product.price, setariRules]
  );

  /* ── city options ── */
  const optionsForCity = useMemo(
    () => [
      ...new Set(
        orase_dupa_judete_romania?.[county]
          ?.sort((a, b) => (a.nume < b.nume ? -1 : 1))
          ?.map((c) => c.nume) || []
      ),
    ],
    [county]
  );

  const filteredFanBoxes = useMemo(() => {
    if (!fanboxCounty) return fanBoxes;
    return fanBoxes.filter(
      (fb) =>
        fb.address.county
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        fanboxCounty
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );
  }, [fanBoxes, fanboxCounty]);

  /* ── total ── */
  const pointsDiscount = usedPoints && pointsRate ? usedPoints / pointsRate : 0;
  const couponDiscount = coupon?.discount ?? 0;

  const total = useMemo(() => {
    let t = product.price - pointsDiscount - couponDiscount + deliveryPrice;
    if (t < 0) t = 0;
    if (
      payment === "ramburs" &&
      setariRules?.ramburs_payment_tax &&
      deliveryType !== "ridicare-sediu" &&
      !freeDelivery
    ) {
      t += setariRules.ramburs_payment_tax;
    }
    return t;
  }, [
    product.price,
    pointsDiscount,
    couponDiscount,
    deliveryPrice,
    payment,
    setariRules,
    deliveryType,
    freeDelivery,
  ]);

  /* ── load settings when modal opens ── */
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const rules = await getSetariRules();
      setSetariRules(rules);
      setCourierPrice(rules.delivery_price ?? 0);
      setEasyboxPrice(rules.delivery_price_easybox ?? 0);
      setPointsRate(rules.indice_conversie_puncte ?? 0);
      setClient1(rules.client_1 ?? {});
      setClient3(rules.client_3 ?? {});

      /* free delivery check */
      const isFree = product.price >= (rules.prag_transport_gratuit ?? Infinity);
      setFreeDelivery(isFree);
      setDeliveryPrice(isFree ? 0 : rules.delivery_price ?? 0);

      if (product.easyboxAvailability === false) setEasyboxAvail(false);

      /* count user orders for client_1 / client_3 bonus */
      const count = await countCurrentUserOrders();
      setCurrentUserOrders(count);

      /* init locker plugin */
      if (
        rules.boxProvider !== "fanbox" &&
        typeof window !== "undefined" &&
        window.LockerPlugin
      ) {
        window.LockerPlugin.init({
          clientId: "2ac6bfe7-95b0-4e79-8544-a2acf5cfa78e",
          apiUsername: "doifratiAPI",
          langCode: "ro",
          theme: "light",
        });
        const inst = window.LockerPlugin.getInstance();
        inst.subscribe((msg) => {
          setLockerPayment(msg.supportedPayment === 1);
          setLockerId(msg.lockerId);
          setLockerName(msg.name);
          setLockerAddress(msg.address);
          setLockerCounty(msg.county);
          setLockerCity(msg.city);
          setLockerPostalCode(msg.postalCode);
          window.LockerPlugin.getInstance().close();
        });
        setLockerInstance(inst);
      }
    };

    load();
  }, [open]);

  /* ── re-evaluate free delivery when orders count loaded ── */
  useEffect(() => {
    if (currentUserOrders === -1) return;
    const hasClientFreeShip =
      (currentUserOrders === 0 && client1?.transport_gratuit) ||
      (currentUserOrders === 2 && client3?.transport_gratuit);
    if (hasClientFreeShip) {
      setFreeDelivery(true);
      setDeliveryPrice(0);
    }
  }, [currentUserOrders, client1, client3]);

  /* ── delivery type change ── */
  const handleDeliveryChange = async (type) => {
    setDeliveryType(type);
    if (type === "ridicare-sediu") {
      setDeliveryPrice(0);
    } else if (type === "ridicare-easybox") {
      setDeliveryPrice(freeDelivery ? 0 : easyboxPrice);
      if (setariRules.boxProvider === "fanbox" && fanBoxes.length === 0) {
        const fb = await getFanBoxes();
        setFanBoxes(fb);
      }
    } else {
      setDeliveryPrice(freeDelivery ? 0 : courierPrice);
    }
  };

  /* ── coupon ── */
  const submitCoupon = async () => {
    if (!couponInput) return;
    const { accepted, error, coupon: _coupon } = await consumeCoupon(
      couponInput,
      product.price
    );
    if (accepted) {
      setCoupon(_coupon);
      setCouponMessage("");
    } else {
      setCoupon({});
      setCouponMessage(error);
    }
  };

  /* ── reset ── */
  const handleClose = () => {
    form.resetFields();
    setCounty("");
    setFanboxCounty("");
    setDeliveryType("livrare-curier-sameday");
    setPayment("ramburs");
    setLockerId("");
    setLockerName("");
    setLockerAddress("");
    setLockerCounty("");
    setLockerCity("");
    setLockerPostalCode("");
    setCoupon({});
    setCouponInput("");
    setCouponMessage("");
    setUsedPoints(0);
    setIsUsedPoints(false);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  /* ── submit ── */
  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }

    if (deliveryType === "ridicare-easybox") {
      if (setariRules.boxProvider !== "fanbox" && !lockerId) {
        alert("Vă rugăm să selectați un easybox pentru livrare.");
        return;
      }
      if (
        setariRules.boxProvider === "fanbox" &&
        !form.getFieldValue("fanboxLocation")
      ) {
        alert("Vă rugăm să selectați un Fanbox pentru livrare.");
        return;
      }
      if (
        !lockerPayment &&
        payment === "ramburs" &&
        setariRules.boxProvider !== "fanbox"
      ) {
        alert("Easybox-ul selectat nu suportă plată ramburs.");
        return;
      }
    }

    const values = form.getFieldsValue();
    setLoading(true);

    try {
      const customerData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        county: values.county,
        city: values.city,
        adress: values.address,
        apartment: "-",
        zipCode: "000000",
        email: userInfo?.email || "comanda-rapida@doifrati.ro",
        notes: values.notes || "Comandă rapidă",
        isCompany: false,
        companyName: "",
        companyCUI: "",
        delivery_firstName: values.firstName,
        delivery_lastName: values.lastName,
        delivery_county: values.county,
        delivery_city: values.city,
        delivery_adress: values.address,
        delivery_apartment: "-",
        delivery_zipCode: "000000",
      };

      if (deliveryType === "ridicare-easybox") {
        customerData.boxProvider = setariRules.boxProvider;
        if (setariRules.boxProvider !== "fanbox") {
          customerData.lockerId = lockerId;
          customerData.lockerName = lockerName;
          customerData.lockerAddress = lockerAddress;
          customerData.lockerCounty = lockerCounty;
          customerData.lockerCity = lockerCity;
          customerData.lockerPostalCode = lockerPostalCode;
        } else {
          const box = filteredFanBoxes.find(
            (fb) => fb.name === values.fanboxLocation
          );
          if (box) {
            customerData.lockerId = box.id;
            customerData.lockerName = box.name;
            customerData.lockerAddress =
              box.address.street + " " + box.address.streetNo;
            customerData.lockerCounty = box.address.county;
            customerData.lockerCity = box.address.locality;
            customerData.lockerPostalCode = box.address.zipCode;
          }
        }
      }

      const orderObject = {
        customerData,
        payment,
        total_price: total,
        deliveryType,
        couponId: coupon?.docId ?? null,
        points_used: usedPoints ?? 0,
        products: [
          {
            id: product.id,
            name: product.name,
            code: product.code,
            quantity: 1,
            price: product.price,
          },
        ],
      };

      const userToken = await getUserToken();
      const res = await axios.post(
        "https://api-ekfyledvua-ew.a.run.app/create_order",
        orderObject,
        { headers: { Authorization: userToken } }
      );

      const { orderId } = res.data;

      /* GA4 / localStorage — același format ca CheckoutScreen */
      const tvaRate =
        (reduxSetariRules?.taxa_tva ??
          reduxSetariRules?.tva ??
          reduxSetariRules?.TVA) ?? 0.21;
      const codFee =
        payment === "ramburs" &&
        setariRules?.ramburs_payment_tax &&
        deliveryType !== "ridicare-sediu" &&
        !freeDelivery
          ? Number(setariRules.ramburs_payment_tax)
          : 0;
      const shipping = freeDelivery ? 0 : deliveryPrice + codFee;
      const taxAmount =
        Math.round((product.price + shipping) * Number(tvaRate) * 100) / 100;

      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          products: orderObject.products,
          value: product.price,
          tax: taxAmount,
          shipping: Math.round(shipping * 100) / 100,
          total: Math.round(total * 100) / 100,
          orderId,
          currency: "RON",
          user_data: {
            email_address: customerData.email,
            phone_number: customerData.phone || "",
            first_name: customerData.firstName || "",
            last_name: customerData.lastName || "",
            address: {
              street: customerData.adress || "",
              city: customerData.city || "",
              region: customerData.county || "",
              postal_code: customerData.zipCode || "",
              country: "RO",
            },
          },
          is_new_customer: currentUserOrders === 0,
          user_id: userInfo?.uid || userInfo?.id || null,
        })
      );

      if (payment === "card") {
        const cardRes = await axios.post(
          "https://api-ekfyledvua-ew.a.run.app/card_payment",
          { orderId }
        );
        const { data } = cardRes;
        router.push(
          `/plata-card/?url=${encodeURIComponent(
            data.url
          )}&data=${encodeURIComponent(data.data)}&envKey=${encodeURIComponent(
            data.env_key
          )}`
        );
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("A apărut o eroare. Vă rugăm încercați din nou.");
    } finally {
      setLoading(false);
    }
  };

  const isFreeShip = freeDelivery || deliveryType === "ridicare-sediu";
  const rambursTax = setariRules?.ramburs_payment_tax ?? 0;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.sameday.ro/locker-plugin/lockerpluginsdk.js"
      />

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={700}
        style={{ top: 40 }}
        styles={{
          body: {
            padding: "12px 28px 24px",
            overflowY: "unset",
            maxHeight: "unset",
          },
          mask: { zIndex: 99998 },
          wrapper: { zIndex: 99999 },
        }}
        title={
          !success ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FeatherIcon icon="zap" size={18} color="#F03E2F" />
              Comandă rapidă
            </span>
          ) : null
        }
        centered
      >
        {success ? (
          <SuccessScreen>
            <div className="check-circle">
              <FeatherIcon icon="check" size={34} color="#fff" />
            </div>
            <h3>Comandă plasată!</h3>
            <p>
              Te vom contacta în scurt timp pe numărul furnizat pentru
              confirmarea comenzii.
            </p>
            <Button
              type="primary"
              onClick={handleClose}
              style={{ marginTop: 8 }}
            >
              Închide
            </Button>
          </SuccessScreen>
        ) : (
          <ModalBody>
            {/* ── Product preview ── */}
            <ProductPreview>
              {product.fileDownloadURL && (
                <img
                  src={product.fileDownloadURL}
                  alt={product.name}
                  onContextMenu={(e) => e.preventDefault()}
                />
              )}
              <div>
                <div className="pname">{product.name}</div>
                <div className="pprice">{product.price} RON</div>
                <Text as="p6" style={{ color: "#8c8c8c", marginTop: 2 }}>
                  Cod: {product.code}
                </Text>
              </div>
            </ProductPreview>

            {/* ── Form ── */}
            <Form form={form} layout="vertical" requiredMark={false}>
              <FieldRow>
                <Form.Item
                  name="firstName"
                  label="Prenume"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input size="large" placeholder="Ion" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Nume"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input size="large" placeholder="Popescu" />
                </Form.Item>
              </FieldRow>

              <Form.Item
                name="phone"
                label="Număr de telefon"
                rules={[{ required: true, message: "" }]}
              >
                <Input size="large" placeholder="07xx xxx xxx" />
              </Form.Item>

              <FieldRow>
                <Form.Item
                  name="county"
                  label="Județ"
                  rules={[{ required: true, message: "" }]}
                >
                  <Select
                    showSearch
                    placeholder="Selectează județ"
                    getPopupContainer={(t) => t.parentNode}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(v) => {
                      setCounty(v);
                      setFanboxCounty(v);
                      form.setFieldValue("city", undefined);
                    }}
                    options={Object.keys(orase_dupa_judete_romania).map(
                      (c) => ({ value: c, label: c })
                    )}
                  />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="Oraș"
                  rules={[{ required: true, message: "" }]}
                >
                  <Select
                    key={county}
                    showSearch
                    placeholder={county ? "Selectează oraș" : "Alege mai întâi județul"}
                    disabled={!county}
                    getPopupContainer={(t) => t.parentNode}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={optionsForCity.map((c) => ({
                      value: c,
                      label: c,
                    }))}
                  />
                </Form.Item>
              </FieldRow>

              <Form.Item
                name="address"
                label="Adresă (stradă, număr)"
                rules={[{ required: true, message: "" }]}
              >
                <Input size="large" placeholder="Str. Exemplu, nr. 1" />
              </Form.Item>

              <Form.Item name="notes" label="Observații (opțional)">
                <Input
                  size="large"
                  placeholder="Ex: sună înainte de livrare"
                />
              </Form.Item>

              {/* ── Delivery ── */}
              <SectionLabel>Modalitate de livrare</SectionLabel>

              {easyboxAvail && (
                <>
                  <DeliveryOption $active={deliveryType === "ridicare-easybox"}>
                    <input
                      type="radio"
                      checked={deliveryType === "ridicare-easybox"}
                      onChange={() => handleDeliveryChange("ridicare-easybox")}
                    />
                    <div>
                      <div className="label-text">
                        <span style={{ textTransform: "capitalize" }}>
                          {setariRules?.boxProvider || "Easybox"}
                        </span>{" "}
                        ({isFreeShip ? "Gratuit" : `${easyboxPrice} RON`})
                      </div>
                      {deliveryType === "ridicare-easybox" &&
                        lockerId &&
                        setariRules?.boxProvider !== "fanbox" && (
                          <div className="label-sub">
                            Selectat: {lockerName}
                          </div>
                        )}
                    </div>
                  </DeliveryOption>

                  {deliveryType === "ridicare-easybox" &&
                    setariRules?.boxProvider !== "fanbox" && (
                      <div style={{ marginBottom: 10, marginTop: -2 }}>
                        <button
                          type="button"
                          onClick={() => lockerInstance?.open()}
                          style={{
                            padding: "6px 18px",
                            border: "1px solid #2699FB",
                            borderRadius: 6,
                            background: "white",
                            color: "#2699FB",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: 13,
                          }}
                        >
                          Alege Easybox
                        </button>
                      </div>
                    )}

                  {deliveryType === "ridicare-easybox" &&
                    setariRules?.boxProvider === "fanbox" && (
                      <Form.Item
                        name="fanboxLocation"
                        rules={[
                          {
                            required: deliveryType === "ridicare-easybox",
                            message: "",
                          },
                        ]}
                        style={{ marginBottom: 10 }}
                      >
                        <Select
                          showSearch
                          placeholder="Selectează Fanbox"
                          getPopupContainer={(t) => t.parentNode}
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
                            let label = `${county}, ${locality}, ${street}, Nr: ${streetNo}`;
                            if (floor) label += `, Etaj: ${floor}`;
                            label += ` | Cod postal: ${zipCode}`;
                            if (reference) label += ` | Reper: ${reference}`;
                            return { value: fb.name, label };
                          })}
                        />
                      </Form.Item>
                    )}
                </>
              )}

              <DeliveryOption $active={deliveryType === "livrare-curier-sameday"}>
                <input
                  type="radio"
                  checked={deliveryType === "livrare-curier-sameday"}
                  onChange={() => handleDeliveryChange("livrare-curier-sameday")}
                />
                <div className="label-text">
                  Livrare prin curier rapid (
                  {isFreeShip ? "Gratuit" : `${courierPrice} RON`})
                </div>
              </DeliveryOption>

              <DeliveryOption $active={deliveryType === "ridicare-sediu"}>
                <input
                  type="radio"
                  checked={deliveryType === "ridicare-sediu"}
                  onChange={() => handleDeliveryChange("ridicare-sediu")}
                />
                <div className="label-text">Ridică de la sediu (Gratuit)</div>
              </DeliveryOption>

              {/* ── Payment ── */}
              <SectionLabel style={{ marginTop: 12 }}>
                Modalitate de plată
              </SectionLabel>

              <PayOption $active={payment === "ramburs"}>
                <input
                  type="radio"
                  checked={payment === "ramburs"}
                  onChange={() => setPayment("ramburs")}
                />
                <div>
                  <div className="label-text">
                    Ramburs{" "}
                    {isFreeShip || deliveryType === "ridicare-sediu"
                      ? "(fără taxă)"
                      : `(+${rambursTax?.toFixed(2)} RON)`}
                  </div>
                  {!isFreeShip && deliveryType !== "ridicare-sediu" && (
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                      Taxă de procesare ramburs: {rambursTax?.toFixed(2)} RON
                    </div>
                  )}
                </div>
              </PayOption>

              <PayOption $active={payment === "card"}>
                <input
                  type="radio"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="label-text">Card bancar</div>
                  <Image
                    unoptimized
                    src="/img/NetopiaLogo.png"
                    alt="Netopia"
                    width={100}
                    height={19}
                  />
                </div>
              </PayOption>
            </Form>

  
           
            {/* ── Total + Submit ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "#8c8c8c" }}>
                  Total estimat
                </div>
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#272b41" }}
                >
                  {total.toFixed(2)} RON
                </div>
                {(couponDiscount > 0 || pointsDiscount > 0) && (
                  <div style={{ fontSize: 11, color: "#52c41a" }}>
                    Economisești{" "}
                    {(couponDiscount + pointsDiscount).toFixed(2)} RON
                  </div>
                )}
              </div>

              <SubmitBtn onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" /> Se trimite...
                  </>
                ) : (
                  <>
                    <FeatherIcon icon="zap" size={15} /> Plasează comanda
                  </>
                )}
              </SubmitBtn>
            </div>

            <Text
              as="p6"
              style={{ color: "#bbb", marginTop: 10, textAlign: "center" }}
            >
              Prin plasarea comenzii ești de acord cu{" "}
              <a
                href="/termeni-si-conditii"
                target="_blank"
                style={{ color: "#2699FB" }}
              >
                termenii și condițiile
              </a>{" "}
              DoiFrati.ro.
            </Text>
          </ModalBody>
        )}
      </Modal>
    </>
  );
}