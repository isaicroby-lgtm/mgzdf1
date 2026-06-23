"use client";

import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../public/firebase";
import { getSetariRules } from "./setari-rules";
import axios from "axios";

export async function deleteUserF(password, setErrorDeletingAccount, close) {
  const user = auth?.currentUser;
  const credential = EmailAuthProvider.credential(user?.email, password);

  reauthenticateWithCredential(user, credential)
    .then(() => {
      deleteDoc(doc(db, "users", user?.uid))
        .then(() => {
          deleteUser(user)
            .then(() => {
              setErrorDeletingAccount();
              close();
              alert("Contul tău a fost șters cu succes");
            })
            .catch((error) => {
              console.log("error from inside", error);
              alert(
                "A apărut o eroare. Încearcă din nou, iar dacă eroarea persistă te rugăm să ne scrii"
              );
            });
        })
        .catch((error) => {
          console.log("error from outside", error);
          alert(
            "A apărut o eroare. Încearcă din nou, iar dacă eroarea persistă te rugăm să ne scrii"
          );
        });
    })
    .catch((error) => {
      console.log("error from outside v2", error);
      setErrorDeletingAccount(error);
    });
}

export async function createUser({ email, password, firstName, lastName }) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const setariRules = await getSetariRules();

  const userInfo = {
    puncte_fidelitate: setariRules?.conturi_noi?.puncte_fidelitate || 0,
    uid: user.uid,
    email,
    firstName,
    lastName,
  };

  await axios.post("https://api-ekfyledvua-ew.a.run.app/create_user_doc", {
    id: user.uid,
    data: userInfo,
  });

  await axios.post("https://api-ekfyledvua-ew.a.run.app/new_user_email", {
    email,
  });

  return userInfo;
}

export const userAddExtraInfoFirestore = async ({ id, extraInfo }) => {
  await setDoc(doc(db, "users", id), {
    ...extraInfo,
  });
};

export const updateUserInfoFirestore = async ({ id, extraInfo }) => {
  if (!id) return;
  return await updateDoc(doc(db, "users", id), {
    ...extraInfo,
    lastActivity: serverTimestamp(),
  });
};

export const login = async ({ email, password }) => {
  await signInWithEmailAndPassword(auth, email, password);
  await updateUserInfoFirestore({ id: auth?.currentUser?.uid, extraInfo: {} });
};

export const logout = async () => {
  await signOut(auth);
};

export const getUserToken = async () => {
  let userToken = "";

  const currentUser = auth?.currentUser;

  if (currentUser)
    await currentUser.getIdToken(false).then((token) => {
      userToken = token;
    });

  return userToken;
};
