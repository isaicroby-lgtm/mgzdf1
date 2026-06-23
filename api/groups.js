"use client";

import {
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../public/firebase";

export const CreateGroup = async (products) => {
  const data = products.map((p) => {
    return {
      id: p.id,
      name: p.name,
    };
  });

  const response = await addDoc(collection(db, "product_groups"), {
    products: data,
    timestamp: serverTimestamp(),
  });

  const id = response.id;

  for (const product of data) {
    await updateDoc(doc(db, "products", product.id), { groupId: id });
  }

  return response;
};

export const DeleteGroup = async (id) => {
  //fetch group
  const groupDoc = doc(db, "product_groups", id);
  const snapshot = await getDoc(groupDoc);
  const data = snapshot.data();

  //remove group from products
  for (const product of data.products) {
    await updateDoc(doc(db, "products", product.id), { groupId: null });
  }
  await deleteDoc(groupDoc);
};

export const UpdateGroup = async (id, newProducts) => {
  const groupDoc = doc(db, "product_groups", id);
  const snapshot = await getDoc(groupDoc);
  const { products } = snapshot.data();

  //remove group from products
  for (const product of products) {
    //if product is not in newProducts, remove groupId
    if (!newProducts.find((p) => p.id === product.id)) {
      await updateDoc(doc(db, "products", product.id), { groupId: null });
    }
  }

  //add group to products
  for (const product of newProducts) {
    //if product is not in newProducts, remove groupId
    if (!products.find((p) => p.id === product.id)) {
      await updateDoc(doc(db, "products", product.id), { groupId: id });
    }
  }

  newProducts = newProducts.map((p) => {
    return { id: p.id, name: p.name };
  });

  await updateDoc(groupDoc, {
    products: newProducts,
  });
};

export const fetchGroups = async () => {
  const collectio = collection(db, "product_groups");
  const snapshot = await getDocs(collectio);

  const data = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return data;
};

export const fetchGroup = async (id) => {
  const groupDoc = doc(db, "product_groups", id);
  const snapshot = await getDoc(groupDoc);
  const data = snapshot.data();

  return data;
};
