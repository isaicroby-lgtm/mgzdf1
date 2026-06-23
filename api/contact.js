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
  updateDoc,
  where,
} from "firebase/firestore";
import axios from "axios";
import { auth, db } from "../public/firebase";

const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const postContact = async (contact) => {
  const _contact = { ...contact };
  _contact.timestamp = serverTimestamp();

  if (auth?.currentUser) {
    _contact.uid = auth.currentUser.uid;
  }

  const docRef = await addDoc(collection(db, "contact"), _contact);

  await axios.post(baseUrl + "/create_form", {
    type: "contact",
    name: _contact.name,
    email: _contact.email,
  });

  return docRef.id;
};

export const getAllContacts = async () => {
  const contactsRef = collection(db, "contact");
  const q = query(contactsRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  const contacts = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return contacts;
};

export const getUserContacts = async (uid) => {
  const contactsRef = collection(db, "contact");
  const q = query(contactsRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const contacts = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return contacts;
};

export const updateMessageStatus = async (id, type, status) => {
  let docRef;

  if (type === "retur") {
    docRef = doc(db, "refund", id);
  } else if (type === "formular-contact") {
    docRef = doc(db, "contact", id);
  } else return;

  await updateDoc(docRef, {
    status,
  });
};

export const deleteContact = async (id, type) => {
  if (type === "retur") {
    await deleteDoc(doc(db, "refund", id));
  } else if (type === "formular-contact") {
    await deleteDoc(doc(db, "contact", id));
  } else return;
};
