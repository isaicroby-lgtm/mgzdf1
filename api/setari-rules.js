"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../public/firebase";

export const updateSetariRules = async ({ instance, values, inMap }) => {
  const setariRulesRef = doc(db, "setari", "setari_rules");

  let updated = {};

  if (inMap) {
    Object.keys(values).forEach((val) => {
      const lastString = `${val}.${instance}`;

      if (values[val] !== undefined) updated[lastString] = values[val];
    });
  } else {
    for (const v of Object.keys(values)) {
      if (values[v] !== undefined) updated[v] = values[v];
    }
  }

  if (Object.keys(updated))
    if (updated && Object.keys(updated).length)
      await updateDoc(setariRulesRef, {
        ...updated,
      });
};

export const getSetariRules = async () => {
  const setariRulesRef = doc(db, "setari", "setari_rules");

  const res = await getDoc(setariRulesRef);

  return res.data();
};
