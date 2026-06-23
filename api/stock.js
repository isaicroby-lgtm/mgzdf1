"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../public/firebase";

export const fetchStockTableData = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  const stockData = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    const currentProd = {
      id: doc.id,
      name: data.name,
      code: data.code,
      price: data.price,
      stock: data.stock,
      oldPrice: data.oldPrice,
      greenTax: data.greenTax,
      type: "simple",
    };

    stockData.push(currentProd);
  });
  return stockData;
};

const fetchProductStock = async (id) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().stock || 0;
  } else {
    return 0;
  }
};

export const setProductStock = async (id, stock) => {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, {
    stock: stock,
  });
  return stock;
};

export const modifyProductStock = async (id, stock) => {
  const docRef = doc(db, "products", id);

  const currentStock = await fetchProductStock(id);
  const newStock = Number(currentStock) + Number(stock);

  if (newStock < 0) {
    throw new Error("Stocul nu poate fi negativ");
  }

  await updateDoc(docRef, {
    stock: newStock,
  });
  return newStock;
};

export const reduceProductStock = async (id, stock) => {
  const docRef = doc(db, "products", id);

  const currentStock = await fetchProductStock(id);
  const newStock = Number(currentStock) - Number(stock);

  await updateDoc(docRef, {
    stock: newStock,
  });
};

export const isProductInStock = async (id, stockOrdered) => {
  const currentStock = await fetchProductStock(id);
  return currentStock >= stockOrdered;
};

export const isProductOutOfStock = async (id) => {
  if (!id) return true;
  const snap = await getDoc(doc(db, "products", id));
  let product;
  if (snap.exists()) {
    product = snap.data();
  } else {
    return true;
  }

  const currentStock = await fetchProductStock(id);
  return currentStock <= 0;
};
