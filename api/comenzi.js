"use client";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
  orderBy,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import dayjs from "dayjs";
import axios from "axios";

import { fetchSingleProductFirestore, getImgFromRef } from "./products";
import { auth, db } from "../public/firebase";
import { getUserToken } from "./account";

const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const getAllOrders = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, "orders"), orderBy("timestamp", "desc"))
  );
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push({
      ...doc.data(),
      docId: doc.id,
      originalStatus: doc.data().status,
    });
  });

  return res;
};

export const getUserOrders = async () => {
  const currentUser = auth?.currentUser;

  const res = [];

  if (!currentUser) return res;

  const q = query(
    collection(db, "orders"),
    where("uid", "==", currentUser.uid)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res.push({ ...doc.data(), docId: doc.id });
  });

  return res;
};

export const getUidOrders = async (uid) => {
  const q = query(collection(db, "orders"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push({ ...doc.data(), docId: doc.id });
  });
  return res;
};

export const updateStatusComanda = async (id, val) => {
  const ref = doc(db, "orders", id);

  const order = (await getDoc(ref)).data();

  let statusHistory = order?.statusHistory || [];
  statusHistory.push({
    status: val,
    time: dayjs().format("DD.MM.YYYY, HH:mm"),
  });

  await updateDoc(ref, {
    status: val,
    statusHistory,
  });
};

export const updateStatuses = async (orders) => {
  for (const order of orders) {
    if (order.status !== order.originalStatus) {
      await setDoc(
        doc(db, "orders", order.docId),
        { status: order.status },
        { merge: true }
      );
    }
  }
};

export const deleteOrder = async (id) => {
  await cancelOrder(id, false);
  await deleteDoc(doc(db, "orders", id));
};

export const getOrder = async (id) => {
  const docRef = doc(db, "orders", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id };
  } else {
    return null;
  }
};

export const getPretAchizitie = async (code) => {
  const q = query(collection(db, "products"), where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().pretAchizitie;
  } else {
    return null; // Nu s-a găsit produsul cu codul dat
  }
};

export const checkOrder = async (products) => {
  const productsIds = makeUniqueListFromProperty(products, "id");

  const productsById = new Map();

  for (const id of productsIds) {
    const p = await fetchSingleProductFirestore(id);
    if (p) productsById.set(id, p);
  }

  products = products
    .filter((x) => x)
    .filter((item) => productsById.has(item.id));

  const noStockMessages = [];

  const quantityByProductId = new Map();

  for (const product of products) {
    if (!quantityByProductId.has(product.id)) {
      quantityByProductId.set(product.id, product.quantity);
    } else {
      quantityByProductId.set(
        product.id,
        quantityByProductId.get(product.id) + product.quantity
      );
    }
  }

  products = await Promise.all(
    products.map(async (product) => {
      const qt = product?.quantity;
      const _product = { ...productsById.get(product.id) };

      _product.fullPrice = product.price;

      if (_product.discount3 && quantityByProductId.get(product.id) >= 3)
        _product.price *= (100 - _product.discount3) / 100;
      else if (_product.discount2 && quantityByProductId.get(product.id) >= 2)
        _product.price *= (100 - _product.discount2) / 100;

      _product.price = Math.round(_product.price * 100) / 100;

      _product.quantity = qt;
      if (_product.fileRefs?.length)
        _product.img = await getImgFromRef(_product.fileRefs[0]);

      if (_product.stock < qt)
        noStockMessages.push(`${_product.name} are stoc insuficient`);

      return _product;
    })
  );

  return { products, noStockMessages };
};

const makeUniqueListFromProperty = (list, property) => {
  const res = list.filter((x) => x).map((item) => item[property]);
  return res.filter((item, index) => res.indexOf(item) === index && item);
};

export const cancelOrder = async (orderId, canceledByUser) => {
  let userToken = await getUserToken();
  await axios
    .post(
      baseUrl + "/cancel_order",
      { orderId, canceledByUser },
      { headers: { Authorization: userToken } }
    )
    .then(() => {})
    .catch(() => {
      alert("A apărut o eroare. Vă rugăm să încercați din nou mai târziu.");
    });
};

export const resendOrderEmail = async (orderId) => {
  let userToken = await getUserToken();

  await axios
    .post(
      baseUrl + "/resend_order_email",
      { orderId },
      { headers: { Authorization: userToken } }
    )
    .then(() => {
      alert("Actiune realizata cu succes.");
    })
    .catch(() => {
      alert("A apărut o eroare. Vă rugăm să încercați din nou mai târziu.");
    });
};

export const updateOrderFinishDate = async (orderId) => {
  await updateDoc(doc(db, "orders", orderId), {
    finishDate: serverTimestamp(),
  });
};
