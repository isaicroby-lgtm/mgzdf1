"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getBytes, ref, uploadString } from "firebase/storage";

import { encodeStaticURL } from "@/utility/urlFormatting";
import { db, storage } from "@/public/firebase";

export const postStaticPage = async (title, content) => {
  const contentPath = `static-pages/${encodeStaticURL(title)}`;
  const contentRef = ref(storage, contentPath);

  await uploadString(contentRef, content);
  await setDoc(doc(db, "static-pages", encodeStaticURL(title)), {
    title,
    contentPath,
  });
};

export const updateStaticPage = async (title, content) => {
  const contentPath = `static-pages/${encodeStaticURL(title)}`;
  const contentRef = ref(storage, contentPath);

  const snap = await getDoc(doc(db, "static-pages", encodeStaticURL(title)));
  let storeInDb = false;
  if (snap.exists()) {
    if (snap.data().storeInDb === true) {
      storeInDb = true;
    }
  }

  await uploadString(contentRef, content);
  if (storeInDb) {
    await updateDoc(doc(db, "static-pages", encodeStaticURL(title)), {
      content,
    });
  }
};

export const getStaticPage = async (title) => {
  const encodedTitle = encodeStaticURL(title);

  const page = {};

  const snapshot = await getDoc(doc(db, "static-pages", encodedTitle));

  if (snapshot.exists) {
    const pageData = snapshot.data();
    if (!pageData) return null;
    page.title = pageData.title;

    if (pageData.storeInDb === true) {
      page.content = pageData.content;
      return page;
    }

    const contentRef = ref(storage, pageData.contentPath);
    const content = await getBytes(contentRef);

    const encoding = "utf-8";
    const decoder = new TextDecoder(encoding);
    const contentAsString = decoder.decode(content);

    page.content = contentAsString;
    return page;
  }
  return null;
};

export const getAllStaticPages = async () => {
  const snapshot = await getDocs(collection(db, "static-pages"));
  const pages = [];
  snapshot.forEach((doc) => {
    pages.push(doc.data().title);
  });
  return pages;
};
