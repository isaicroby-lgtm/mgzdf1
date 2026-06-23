"use client";

import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../public/firebase";

export const getUnread = async () => {
  const unread = {};

  const orderStatuses = ["plasata", "plata online efectuata"];
  const orderQuery = query(
    collection(db, "orders"),
    where("status", "in", orderStatuses)
  );
  const orderSnapshot = await getCountFromServer(orderQuery);
  unread.orders = orderSnapshot.data().count;

  const contactStatuses = ["asteapta un raspuns"];
  const contactQuery = query(
    collection(db, "contact"),
    where("status", "in", contactStatuses)
  );
  const contactSnapshot = await getCountFromServer(contactQuery);
  unread.contact = contactSnapshot.data().count;

  const refundStatuses = ["asteapta un raspuns"];
  const refundQuery = query(
    collection(db, "refund"),
    where("status", "in", refundStatuses)
  );
  const refundSnapshot = await getCountFromServer(refundQuery);
  unread.refund = refundSnapshot.data().count;

  const blogQuery = query(
    collection(db, "blog_comments"),
    where("approved", "==", "false")
  );
  const blogSnapshot = await getCountFromServer(blogQuery);
  unread.blog = blogSnapshot.data().count;

  return unread;
};

export const getUnreadReviews = (products) => {
  let unreadReviews = 0;

  if (products) {
    for (const product of products) {
      const reviews = product.reviews;
      if (reviews) {
        for (const review of reviews) {
          if (review.status === "review") unreadReviews++;
        }
      }
    }
  }

  return unreadReviews;
};
