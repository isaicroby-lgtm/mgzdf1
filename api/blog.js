"use client";

import { getBytes, ref, uploadBytes, uploadString } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  deleteDoc,
  orderBy,
  updateDoc,
  getCountFromServer,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { db, storage } from "@/public/firebase";
import { encodeURL } from "@/utility/urlFormatting";
import { getUserToken } from "./account";

const _ = require("lodash");
const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const deleteBlogPost = async (id) => {
  await deleteDoc(doc(db, "blog", id));
  const comms = await fetchPostComments(id);
  for (const comm of comms) {
    await deleteDoc(doc(db, "blog_comments", comm.id));
  }
};

export const createBlogFirestore = async (values, coverImage) => {
  let coverReference = "";
  const coverBytes = coverImage.originFileObj;

  const newRandomId = uuidv4();
  const imagesRef = ref(storage, `images/blog/${newRandomId}`);

  if (coverBytes) {
    coverReference = `images/blog/${newRandomId}`;
    await uploadBytes(imagesRef, coverBytes).then(() => {});
  }

  const contentId = uuidv4();
  const contentPath = `blog/${contentId}`;

  const contentRef = ref(storage, contentPath);
  await uploadString(contentRef, values.content);

  const date_created = serverTimestamp();

  const { data } = await addDoc(collection(db, "blog"), {
    title: values.title || null,
    title_encoded: encodeURL(values.title) || null,
    category: values.category || null,
    summary: values.summary || null,
    content_reference: contentPath || null,
    cover_reference: coverReference || null,
    status: "draft",
    date_created: date_created,
    comments: [],
  });
  return data;
};

export const fetchBlogPost = async (id) => {
  const reference = doc(db, "blog", id);
  const snap = await getDoc(reference);

  if (snap.exists()) {
    const post = snap.data();

    const contentRef = ref(storage, post.content_reference);
    const content = await getBytes(contentRef);

    const encoding = "utf-8";
    const decoder = new TextDecoder(encoding);
    const contentAsString = decoder.decode(content);

    post.content = contentAsString;

    return post;
  }

  return null;
};

export const updateBlogPost = async (id, payload, newCoverImage) => {
  const oldPost = await fetchBlogPost(id);
  const updatedFields = {};

  const fieldsToCheck = ["title", "status", "summary", "category"];

  updatedFields.title_encoded = encodeURL(oldPost.title);
  for (const field of fieldsToCheck) {
    if (oldPost[field] !== payload[field]) {
      updatedFields[field] = payload[field];
      if (field === "title")
        updatedFields.title_encoded = encodeURL(updatedFields.title);
    }
  }

  if (newCoverImage != null) {
    const coverBytes = newCoverImage.originFileObj;

    const newRandomId = uuidv4();
    const imagesRef = ref(storage, `images/blog/${newRandomId}`);

    if (coverBytes) {
      updatedFields.cover_reference = `images/blog/${newRandomId}`;
      await uploadBytes(imagesRef, coverBytes).then(() => {});
    }
  }

  const contentRef = ref(storage, oldPost.content_reference);

  await uploadString(contentRef, payload.content);

  if (
    !oldPost.sentEmail &&
    payload.status === "published" &&
    payload.emailSubject &&
    payload.emailBody &&
    payload.sendEmail
  ) {
    const userToken = await getUserToken();
    await axios.post(
      baseUrl + "/send_new_blog_email",
      {
        subject: payload.emailSubject,
        content: payload.emailBody,
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );
    updatedFields.sentEmail = true;
  }

  await updateDoc(doc(db, "blog", id), { ...updatedFields });
};

export const fetchAllBlogPosts = async (isAdmin) => {
  let querySnapshot;
  if (isAdmin === true) querySnapshot = await getDocs(collection(db, "blog"));
  else {
    const q = query(collection(db, "blog"), where("status", "==", "published"));
    querySnapshot = await getDocs(q);
  }
  const allPosts = [];
  querySnapshot.forEach((doc) => {
    allPosts.push({ id: doc.id, ...doc.data() });
  });
  return allPosts;
};

export const fetchBlogPostByTitle = async (title) => {
  const reference = collection(db, "blog");
  const q = query(reference, where("title_encoded", "==", title));

  const snapshot = await getDocs(q);
  let post = null;
  snapshot.forEach((doc) => {
    post = { id: doc.id, ...doc.data() };
  });

  const contentRef = ref(storage, post.content_reference);
  const content = await getBytes(contentRef);

  const encoding = "utf-8";
  const decoder = new TextDecoder(encoding);
  const contentAsString = decoder.decode(content);

  post.content = contentAsString;

  return post;
};

export const postComment = async (comment) => {
  await addDoc(collection(db, "blog_comments"), comment);

  const snap = await getDoc(doc(db, "blog", comment.postId));

  const data = snap.data();

  await axios.post(baseUrl + "/send_new_comment_email", {
    postName: data.title,
  });
  window.location.reload();
};

export const fetchPostComments = async (postId) => {
  const reference = collection(db, "blog_comments");
  const q = query(
    reference,
    where("postId", "==", postId),
    where("approved", "==", true),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);
  let comments = [];
  snapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() });
  });

  for (const comment of comments) {
    comment.replies = comments.filter((c) => c.parentId === comment.id);

    comment.replies = comment.replies.sort((a, b) => {
      if (a.timestamp.seconds < b.timestamp.seconds) return -1;
      if (a.timestamp.seconds > b.timestamp.seconds) return 1;
      return 0;
    });
  }

  comments = comments.filter((c) => !c.parentId);
  return comments;
};

export const fetchAllPostComments = async (postId) => {
  const reference = collection(db, "blog_comments");
  const q = query(
    reference,
    where("postId", "==", postId),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);
  let comments = [];
  snapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() });
  });

  for (const comment of comments) {
    comment.replies = comments.filter((c) => c.parentId === comment.id);

    comment.replies = comment.replies.sort((a, b) => {
      if (a.timestamp.seconds < b.timestamp.seconds) return -1;
      if (a.timestamp.seconds > b.timestamp.seconds) return 1;
      return 0;
    });
  }

  comments = comments.filter((c) => !c.parentId);
  return comments;
};

export const approveComment = async (commentId) => {
  await updateDoc(doc(db, "blog_comments", commentId), { approved: true });
};

export const deleteComment = async (commentId) => {
  await deleteDoc(doc(db, "blog_comments", commentId));
};

export const getUnreadBlogComments = async (postId) => {
  const q = query(
    collection(db, "blog_comments"),
    where("postId", "==", postId),
    where("approved", "==", false)
  );
  const querySnapshot = await getCountFromServer(q);

  return querySnapshot.data().count;
};
