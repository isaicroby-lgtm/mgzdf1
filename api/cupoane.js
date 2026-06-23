"use client";

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../public/firebase";

export const getAllCoupons = async () => {
  const querySnapshot = await getDocs(collection(db, "cupoane"));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ docId: doc.id, ...doc.data() });
  });
  return data;
};

export const createCoupon = async (values) => {
  const res = await addDoc(collection(db, "cupoane"), {
    nume: values.nume,
    cod: values.cod,
    tip: values.tip,
    valoare: values.valoare,
    data_expirare: values.dataExpirare ? new Date(values.dataExpirare) : null,
    valoare_minima_comanda: values.valoareMinimaComanda || null,
  });

  return res;
};

export const deleteCoupon = async (id) => {
  await deleteDoc(doc(db, "cupoane", id));
};

export const updateCoupon = async ({ id, values }) => {
  const theRef = doc(db, "cupoane", id);

  if (values)
    await updateDoc(theRef, {
      nume: values.nume,
      cod: values.cod,
      tip: values.tip,
      valoare: values.valoare,
      data_expirare: values.dataExpirare ? new Date(values.dataExpirare) : null,
      valoare_minima_comanda: values.valoareMinimaComanda || null,
    });
};

export const fetchCoupon = async (code) => {
  const q = query(collection(db, "cupoane"), where("cod", "==", code));
  const querySnapshot = await getDocs(q);
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push({ docId: doc.id, ...doc.data() });
  });
  return res[0] ?? null;
};

export const consumeCoupon = async (code, subtotal) => {
  const coupon = await fetchCoupon(code);
  if (!coupon) return { accepted: false, error: "Cupon invalid" };
  const currentTimestamp = Timestamp.fromDate(new Date());
  if (
    coupon.data_expirare &&
    coupon.data_expirare.seconds < currentTimestamp.seconds
  )
    return { accepted: false, error: "Cupon expirat" };
  if (coupon.valoare_minima_comanda && subtotal < coupon.valoare_minima_comanda)
    return {
      accepted: false,
      error: `Comanda minimă pentru acest cupon este de ${coupon.valoare_minima_comanda}`,
    };
  if (coupon.tip === "bani") coupon.discount = parseFloat(coupon.valoare);
  else if (coupon.tip === "procentaj")
    coupon.discount = (subtotal * coupon.valoare) / 100;

  return { accepted: true, coupon };
};
