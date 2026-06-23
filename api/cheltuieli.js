"use client";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../public/firebase";

const expensesDocRef = doc(db, "setari", "cheltuieli");

// Fetch cheltuieli (get data)
export const fetchExpenses = async () => {
  try {
    const docSnap = await getDoc(expensesDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Create the document with empty data if it doesn't exist
      await setDoc(expensesDocRef, {});
      return {};
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return {};
  }
};

// Update cheltuieli (update data)
export const updateExpenses = async (newExpensesData) => {
  try {
    // Use setDoc with merge: FALSE to completely replace the document
    await setDoc(expensesDocRef, newExpensesData, { merge: false });
    return newExpensesData;
  } catch (error) {
    console.error("Error updating expenses:", error);
    throw error;
  }
};