"use client";

import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import dayjs from "dayjs";
import axios from "axios";
import { auth, db } from "../public/firebase";
import { getUserToken } from "./account";

const apiBaseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const getAllUsers = async () => {
  const usersRef = query(
    collection(db, "users"),
    orderBy("userCreatedAt", "desc")
  );
  const snapshot = await getDocs(usersRef);
  const users = snapshot.docs.map((doc) => {
    return { ...doc.data(), uid: doc.id };
  });

  for (const user of users) {
    if (!user.lastActivity) continue;

    user.lastActivityTimestamp = user.lastActivity;
    user.userCreatedAtTimestamp = user.userCreatedAt;

    user.lastActivity = dayjs(user.lastActivity.toDate())
      .format("DD.MM.YYYY, HH:mm")
      .toString();
    user.userCreatedAt = dayjs(user.userCreatedAt?.toDate())
      ?.format("DD.MM.YYYY, HH:mm")
      ?.toString();
  }
  return users;
};

export const countCurrentUserOrders = async () => {
  const currentUser = auth?.currentUser;

  if (!currentUser) return -1;

  const q = query(
    collection(db, "orders"),
    where("uid", "==", currentUser.uid)
  );
  const querySnapshot = await getCountFromServer(q);

  return querySnapshot.data().count;
};

export const awardPoints = async (
  orderId,
  hasAwardedPoints,
  userId,
  points
) => {
  const userRef = doc(db, "users", userId);

  const userDoc = await getDoc(userRef);
  const user = userDoc.data();
  let currentPoints = user.puncte_fidelitate;

  currentPoints += points * (hasAwardedPoints ? -1 : 1);

  if (!hasAwardedPoints) {
    await sendPointEmail(orderId, points);
  }

  await updateDoc(doc(db, "orders", orderId), {
    hasAwardedPoints: !hasAwardedPoints,
  });
  await updateDoc(userRef, { puncte_fidelitate: currentPoints });
};

export const setPoints = async (userId, points) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { puncte_fidelitate: points });
};

const sendPointEmail = async (orderId, points) => {
  const userToken = await getUserToken();
  axios
    .post(
      apiBaseUrl + "/award_points",
      { orderId, points },
      { headers: { Authorization: userToken } }
    )
    .then(() => {
      alert("Email trimis cu succes!");
    })
    .catch((e) => {
      alert("Eroare la trimitere email pentru puncte!");
    });
};
