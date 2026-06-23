"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import {
//   getAnalytics,
//   isSupported as isSupportedAnalytics,
// } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyBKehbenHP14OhFTa-T62OMw5WscervEt4",
  authDomain: "doi-frati.firebaseapp.com",
  projectId: "doi-frati",
  storageBucket: "doi-frati.appspot.com",
  messagingSenderId: "244421632309",
  appId: "1:244421632309:web:2dc6623e225b62eaca6c7c",
  measurementId: "G-T0EYJ4BVER",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

// export const analytics = isSupportedAnalytics().then((yes) =>
//   yes ? getAnalytics(app) : null
// );

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);

export const messaging = isSupported().then((yes) =>
  yes ? getMessaging(app) : null
);
