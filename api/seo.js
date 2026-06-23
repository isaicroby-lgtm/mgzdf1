"use client";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../public/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const postSeoData = async (data) => {
  let homeImg = null;
  let blogImg = null;

  if (typeof data?.homeImg != "string" && data?.homeImg)
    homeImg = data?.homeImg?.fileList[0];

  if (typeof data?.blogImg != "string" && data?.blogImg)
    blogImg = data?.blogImg?.fileList[0];

  if (homeImg) {
    const homeRef = ref(storage, `images/seo/home`);
    await uploadBytes(homeRef, homeImg.originFileObj);
    data.homeImg = await getDownloadURL(homeRef);
  }

  if (blogImg) {
    const blogRef = ref(storage, `images/seo/blog`);
    await uploadBytes(blogRef, blogImg.originFileObj);
    data.blogImg = await getDownloadURL(blogRef);
  }

  await setDoc(doc(db, "seo", "seo"), data);
};

//for default values
export const getSeoData = async () => {
  const snapshot = await getDoc(doc(db, "seo", "seo"));
  const data = snapshot.data();
  // delete data.homeImg;
  // delete data.blogImg;
  return data;
};

//for actual values
export const fetchSeoData = async () => {
  const snapshot = await getDoc(doc(db, "seo", "seo"));
  const data = snapshot.data();
  return data;
};
