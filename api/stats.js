import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../public/firebase";
import { getUserToken } from "./account";
import axios from "axios";

const apiBaseUrl = "https://api-ekfyledvua-ew.a.run.app";

// Funcția pentru a obține datele statistice din Firestore
export const getStatsFirestore = async () => {
  const queryRef = collection(db, "orders");
  const queryUseriRef = collection(db, "users");

  const startOfMonth = new Date();
  startOfMonth.setHours(0, 0, 0, 0);
  startOfMonth.setDate(1);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);

  const startLastMonth = new Date(startOfMonth);
  startLastMonth.setMonth(startLastMonth.getMonth() - 1);

  const endLastMonth = new Date(startOfMonth);
  endLastMonth.setDate(0);

  const q = query(
    queryRef,
    where("status", "==", "livrata"),
    where("timestamp", ">=", startOfMonth),
    where("timestamp", "<=", endOfMonth)
  );
  const qTrecut = query(
    queryRef,
    where("status", "==", "livrata"),
    where("timestamp", ">=", startLastMonth),
    where("timestamp", "<=", endLastMonth)
  );

  const qUseri = query(
    queryUseriRef,
    where("userCreatedAt", ">=", startOfMonth),
    where("userCreatedAt", "<=", endOfMonth)
  );
  const qUseriTrecut = query(
    queryUseriRef,
    where("userCreatedAt", ">=", startLastMonth),
    where("userCreatedAt", "<=", endLastMonth)
  );

  const [snapshot, snapshotTrecut, snapshotUseri, snapshotUseriTrecut] =
    await Promise.all([
      getDocs(q),
      getDocs(qTrecut),
      getDocs(qUseri),
      getDocs(qUseriTrecut)
    ]);

  let weekOrdersCount = 0;
  let weekOrdersCountTrecut = 0;
  let venit = 0;
  let venitTrecut = 0;
  let useri = 0;
  let useriTrecut = 0;
  let totalProfit = 0;
  let totalProfitTrecut = 0;

  const calculateProfit = (pricePurchaseWithoutVAT, priceSaleWithVAT) => {
    const tvaRate = 21; // TVA de 19%
  
    // Calculăm prețul de vânzare fără TVA
    const priceSaleWithoutVAT = priceSaleWithVAT / (1 + tvaRate / 100);
    
    // Calculăm profitul brut
    const grossProfit = priceSaleWithoutVAT - pricePurchaseWithoutVAT;
  
    // Calculăm taxele de livrare și ambalare
    const deliveryTaxWithVAT = priceSaleWithVAT <= 150 ? 2 : (priceSaleWithVAT > 150 && priceSaleWithVAT <= 300 ? 5 : 10);
    const packagingTaxWithVAT = priceSaleWithVAT <= 180 ? 1 : (priceSaleWithVAT > 180 && priceSaleWithVAT <= 300 ? 2 : (priceSaleWithVAT > 300 && priceSaleWithVAT <= 450 ? 4 : 5));
  
    // Calculăm taxele de livrare și ambalare fără TVA
    const deliveryTaxWithoutVAT = deliveryTaxWithVAT / (1 + tvaRate / 100);
    const packagingTaxWithoutVAT = packagingTaxWithVAT / (1 + tvaRate / 100);
  
    // Ajustăm profitul brut pentru taxele de livrare și ambalare
    const totalTaxesWithoutVAT = deliveryTaxWithoutVAT + packagingTaxWithoutVAT;
    const adjustedGrossProfit = grossProfit - totalTaxesWithoutVAT;
  
    // Calculăm impozitul pe profit (1% din profitul brut ajustat)
    const profitTax = adjustedGrossProfit * 0.01;
    
    // Calculăm profitul net
    const netProfit = adjustedGrossProfit - profitTax;
    
    return netProfit;
  };
  
  

  const getProductPrice = async (productCode) => {
    console.log(calculateProfit(79.58, 131.99) + "test")
    const qProducts = query(
      collection(db, "products"),
      where("code", "==", productCode)
    );
    const querySnapshot = await getDocs(qProducts);
    if (!querySnapshot.empty) {
      const priceAchizitie = querySnapshot.docs[0].data().pretAchizitie;
      return priceAchizitie ?? 0;
    }
    return 0;
  };

  // Procesare comenzi curente
  for (const doc of snapshot.docs) {
    const data = doc.data();
    weekOrdersCount++;
    venit += data.price;

    for (const product of data.products) {
      const priceAchizitie = await getProductPrice(product.code);
      if (priceAchizitie > 0) {
        const profit = calculateProfit(priceAchizitie, product.price);
        totalProfit += profit;
      }
    }
  }

  // Procesare comenzi trecute
  for (const doc of snapshotTrecut.docs) {
    const data = doc.data();
    weekOrdersCountTrecut++;
    venitTrecut += data.price;

    for (const product of data.products) {
      const priceAchizitie = await getProductPrice(product.code);
      if (priceAchizitie > 0) {
        const profit = calculateProfit(priceAchizitie, product.price);
        totalProfitTrecut += profit;
      }
    }
  }

  // Numărare utilizatori
  useri = snapshotUseri.size;
  useriTrecut = snapshotUseriTrecut.size;

  console.log("Total profit for this period:", totalProfit);
  console.log("Total profit for previous period:", totalProfitTrecut);

  return {
    weekOrdersCount,
    weekOrdersCountTrecut,
    venit,
    venitTrecut,
    totalProfit,
    totalProfitTrecut,
    avg: weekOrdersCount ? venit / weekOrdersCount : 0,
    avgTrecut: weekOrdersCountTrecut ? venitTrecut / weekOrdersCountTrecut : 0,
    useri,
    useriTrecut,
  };
};

// Funcția pentru a obține datele de analiză
export const getAnalytics = async () => {
  const userToken = await getUserToken();

  return await axios
    .get(apiBaseUrl + "/analytics", { headers: { Authorization: userToken } })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.log(e);
      throw new Error("Failed to get analytics");
    });
};

// Funcția pentru a obține vizualizările produselor
export const getProductsViews = async () => {
  const userToken = await getUserToken();

  return await axios
    .get(apiBaseUrl + "/products_views", {
      headers: { Authorization: userToken },
    })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.log(e);
      throw new Error("Failed to get views");
    });
};
