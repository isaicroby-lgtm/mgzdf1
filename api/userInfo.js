"use client";

import { doc, getDoc } from "firebase/firestore";

import { db } from "../public/firebase";

export const getFirestoreUser = async (userFromAuth) => {
  if (userFromAuth && userFromAuth.uid) {
    const docRef = doc(db, "users", userFromAuth.uid);
    const data = (await getDoc(docRef))?.data();

    return { ...data };
  }
  return {};
};
