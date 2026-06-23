"use client";

import { useEffect, useState } from "react";

import {
  deleteObject,
  getBytes,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { db, storage } from "@/public/firebase";

import { decodeURL, encodeURL } from "@/utility/urlFormatting";
import { getUserToken } from "./account";

const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const fetchSingleProductFirestore = async (id) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  return { ...docSnap?.data(), id };
};

export const fetchProductFirestoreByName = async (name) => {
  const decodedName = decodeURL(name);
  const productsRef = collection(db, "products");

  const q = query(productsRef, where("encoded_url", "==", decodedName));

  const querySnapshot = await getDocs(q);
  return { ...querySnapshot[0].data(), id: querySnapshot[0].id };
};

export const useFirestoreProductsListener = (admin) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let q = collection(db, "products");
    if (!admin) {
      q = query(q, where("status", "==", "published"));
    }
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedProducts = [];
      querySnapshot.forEach((doc) => {
        updatedProducts.push({ ...doc?.data(), id: doc.id });
      });
      setProducts(updatedProducts);
      setIsLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [admin]);

  return { products, isLoading };
};

export const createProductFirestore = async (values, filelist) => {
  const arrayOfReferences = [];

  for (const file of filelist) {
    const originalFile = file.originFileObj;

    const newRandomId = uuidv4();
    const imagesRef = ref(storage, `images/products/${newRandomId}`);

    if (originalFile) {
      arrayOfReferences.push(`images/products/${newRandomId}`);
      await uploadBytes(imagesRef, originalFile).then(() => {});
    }
  }

  let fileDownloadURL;
  if (arrayOfReferences.length) {
    fileDownloadURL = await getDownloadURL(ref(storage, arrayOfReferences[0]));
  }

  const date_created = serverTimestamp();

  const { data, id } = await addDoc(collection(db, "products"), {
    name: values.name || null,
    encoded_url: encodeURL(values.name?.toLowerCase()) || null,
    code: values.code || null,
    age: values.age || null,
    weight: values.weight || null,
    deliveryPrice: values.deliveryPrice || null,
    lungime: values.lungime || null,
    latime: values.latime || null,
    inaltime: values.inaltime || null,
    gender: values.gender || null,
    oldPrice: values.oldPrice || null,
    pretAchizitie: values.pretAchizitie || null,
    greenTax: values.greenTax || null,
    category: values.category || null,
    easyboxAvailability: values.easyboxAvailability || null,
    superPret: values.superPret || false,
    mDescription: values.mDescription || null,
    keywords: values.keywords || null,
    stock: values.stock || null,
    mTitle: values.mTitle || null,
    price: values.price || null,
    status: values.status || null,
    youtubeLink: values.youtubeLink || null,
    fileRefs: arrayOfReferences || [],
    date_created: date_created,
    reviews: [],
    discount2: values.reducere2 || 0,
    discount3: values.reducere3 || 0,
    fileDownloadURL: fileDownloadURL || null,
  });

  if (values.desc) {
    const descRef = ref(storage, `products/${id}/description`);
    await uploadString(descRef, values.desc || null);
  }

  return { ...data, id };
};
export const updateProductFirestore = async ({
  oldProduct,
  fileList,
  updateWithThese2,
}) => {
  const productRef = doc(db, "products", oldProduct.id);

  const updateWithThese = { ...updateWithThese2 };

  const fileListChanged =
    fileList.length !== oldProduct.fileRefs?.length ||
    fileList.findIndex((x) => !x.fileDownloadURL) !== -1;

  const arrayOfReferences = [];

  if (fileListChanged) {
    for (const file of fileList) {
      if (!file.fileRef) {
        const originalFile = file.originFileObj;

        const newRandomId = uuidv4();
        const imagesRef = ref(storage, `images/products/${newRandomId}`);

        if (originalFile) {
          arrayOfReferences.push(`images/products/${newRandomId}`);
          await uploadBytes(imagesRef, originalFile).then(() => {});
        }
      } else arrayOfReferences.push(file.fileRef);
    }

    const deleteThese = oldProduct.fileRefs
      .map((f) => (!arrayOfReferences.includes(f) ? f : undefined))
      .filter((x) => x !== undefined);

    for (const deleteThis of deleteThese) {
      const deleteRef = ref(storage, deleteThis);
      await deleteObject(deleteRef);
    }

    updateWithThese.fileRefs = [...arrayOfReferences];
  } else if (fileList.length > 1) {
    updateWithThese.fileRefs = [...fileList.map((f) => f.fileRef)];
  }

  if (updateWithThese.desc) {
    const descRef = ref(storage, `products/${oldProduct.id}/description`);
    await uploadString(descRef, updateWithThese.desc || null);
    delete updateWithThese.desc;
  }

  if (updateWithThese.fileRefs?.length) {
    const fileDownloadURL = await getDownloadURL(
      ref(storage, updateWithThese.fileRefs[0])
    );
    updateWithThese.fileDownloadURL = fileDownloadURL;
  }

  if (updateWithThese.name) {
    updateWithThese.encoded_url = encodeURL(updateWithThese?.name);
  } else {
    updateWithThese.encoded_url = encodeURL(oldProduct?.name);
  }

  if (Object.keys(updateWithThese).length)
    await updateDoc(productRef, {
      ...updateWithThese,
    });
};

export const addReviewProduct = async ({ id, values, reviews }) => {
  await axios.post(baseUrl + "/create_review", {
    values,
    productId: id,
  });
};

export const updateReviewStatus = async (productId, reviews) => {
  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    reviews: [...reviews],
  });
};

export const sendReviewEmail = async (acceptedReviews, refusedReviews) => {
  const userToken = await getUserToken();

  await axios
    .post(
      baseUrl + "/send_reviews_verdict",
      {
        acceptedReviews,
        refusedReviews,
      },
      {
        headers: { Authorization: userToken },
      }
    )
    .then(() => {
      alert("Emailuri trimise cu succes.");
    })
    .catch(() => {
      alert("Eroare la trimitere emailuri.");
    });
};

export const deleteProductFirestore = async (id) => {
  await deleteObject(ref(storage, `products/${id}/description`));

  await deleteDoc(doc(db, "products", id));
};

export const getImgFromRef = async (imgRef) => {
  const fileDownloadURL = await getDownloadURL(ref(storage, imgRef));

  const obj = {
    fileDownloadURL,
    fileRef: imgRef,
  };

  return obj;
};

export const fetchAllProductsForList = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));

  const products = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  const _products = [];

  for (const product of products) {
    _products.push({
      name: product.name,
      id: product.id,
      code: product.code,
      price: product.price,
    });
  }

  return _products;
};

export const fetchProductDescription = async (id) => {
  const descRef = ref(storage, `products/${id}/description`);

  let content = null;
  try {
    content = await getBytes(descRef);
  } catch {
    return null;
  }

  if (!content) return null;

  const encoding = "utf-8";
  const decoder = new TextDecoder(encoding);
  const desc = decoder.decode(content);

  return desc;
};

export const updatePrice = async (id, oldPrice, newPrice, greenTax) => {
  await updateDoc(doc(db, "products", id), {
    oldPrice: oldPrice,
    price: newPrice,
    greenTax: greenTax,
  });
};
