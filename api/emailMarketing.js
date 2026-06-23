"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import dayjs from "dayjs";

import { db } from "@/public/firebase";
import { encodeURL } from "@/utility/urlFormatting";

export const createUserGroup = async (name, users, selectedProducts) => {
  let emails = [];
  for (const user of users) {
    emails.push(user.email);
  }
  for (const product of selectedProducts) {
    for (const user of product.users) {
      emails.push(user);
    }
  }
  emails = [...new Set(emails)];

  await setDoc(doc(collection(db, "userGroups")), {
    name,
    users: emails.map((email) => ({
      email: email || "",
    })),
    timestamp: serverTimestamp(),
  });
};

export const fetchUserGroups = async () => {
  const userGroups = await getDocs(collection(db, "userGroups"));
  let data = userGroups.docs.map((doc) => {
    const data = {
      ...doc.data(),
      id: doc.id,
    };
    data.usersCount = data?.users?.length;
    data.date = dayjs(data?.timestamp?.toDate())
      .format("DD/MM/YYYY HH:mm")
      .toString();
    return data;
  });
  data = data.map((row) => {
    return {
      ...row,
      csvData: {
        filename: encodeURL(row?.name) + ".csv",
        data: row.users.map((user) => ({
          email: user.email,
        })),
      },
    };
  });

  return data;
};

export const fetchUsersPerProducts = async (allProducts) => {
  const ordersSnap = await getDocs(collection(db, "orders"));
  let orders = ordersSnap.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });

  let products = new Map();

  for (const order of orders) {
    for (const product of order.products) {
      if (products.has(product.id)) {
        const currentProduct = products.get(product.id);
        currentProduct.timesBought++;

        if (!currentProduct.users.includes(order.email))
          currentProduct.users.push(order.email);

        products.set(product.id, { ...currentProduct });
      } else {
        products.set(product.id, {
          name: product.name,
          timesBought: 1,
          users: [order.email],
        });
      }
    }
  }

  const productToReturn = [];

  let _key = 0;
  for (const [key, value] of products.entries()) {
    const product = allProducts.find((p) => p.id === key);
    if (product) {
      value.name = product.name;
      value.price = product.price;
      value.stock = product.stock;
      value.code = product.code;
    }
    value.timesBought = value.users.length;
    value.id = key;
    value.key = _key;
    _key++;
    productToReturn.push(value);
  }

  return productToReturn;
};

export const deleteUserGroup = async (id) => {
  await deleteDoc(doc(collection(db, "userGroups"), id));
};
