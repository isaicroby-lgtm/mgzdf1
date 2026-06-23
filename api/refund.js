"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../public/firebase";
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";

const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const postRefund = async (refund, files) => {
  const _refund = { ...refund };
  _refund.files = [];
  for (const file of files) {
    const originalFile = file.originFileObj;

    if (!originalFile) continue;

    const storagePath = `images/refund/${uuidv4()}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, originalFile);
    _refund.files.push(storagePath);
  }
  _refund.timestamp = serverTimestamp();

  if (auth?.currentUser) {
    _refund.uid = auth.currentUser.uid;
  }

  const docRef = await addDoc(collection(db, "refund"), _refund);

  await axios.post(baseUrl + "/create_form", {
    type: "retur",
    name: _refund.name,
    email: _refund.email,
    retur_number: docRef.id,
  });

  return docRef.id;
};

export const getAllRefunds = async () => {
  //use firebase order by timestamp
  const refundsRef = collection(db, "refund");
  const q = query(refundsRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  const refunds = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return refunds;
};

export const getUserRefunds = async (uid) => {
  const refundsRef = collection(db, "refund");
  const q = query(refundsRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const refunds = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return refunds;
};

export const getFiles = async (files) => {
  const urls = [];
  if (!files.length) return urls;

  for (const file of files) {
    const url = await getDownloadURL(ref(storage, file));

    const metadata = await getMetadata(ref(storage, file));

    urls.push({ fileDownloadURL: url, name: metadata.name });
  }
  return urls;
};

export const deleteRefund = async (id) => {
  await deleteDoc(doc(db, "refund", id));
};
