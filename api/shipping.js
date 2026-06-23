"use client";

import axios from "axios";
import { getUserToken } from "./account";

const apiBaseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const samedayCreateAwb = async (orderId, parcelData, clientData) => {
  let userToken = await getUserToken();

  return await axios
    .post(
      apiBaseUrl + "/create_sameday_awb",
      { orderId, parcelData, clientData },
      { headers: { Authorization: userToken } }
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log(e);
      throw new Error("Eroare la generare awb");
    });
};

export const samedayDeleteAwb = async (orderId) => {
  let userToken = await getUserToken();
  await axios
    .delete(apiBaseUrl + "/delete_sameday_awb/" + orderId, {
      headers: { Authorization: userToken },
    })
    .catch((e) => {
      console.log(e);
      throw new Error("Eroare la stergere awb");
    });
};

export const getAwbStatus = async (orderId) => {
  let userToken = await getUserToken();
  const res = await axios
    .get(apiBaseUrl + "/awb_status/" + orderId, {
      headers: { Authorization: userToken },
    })
    .catch((e) => {
      console.log(e);
      throw new Error("Eroare la preluare status awb");
    });
  return res.data.status;
};

export const getFanBoxes = async () => {
  const res = await axios.get(apiBaseUrl + "/fan_boxes").catch((e) => {
    console.log(e);
    throw new Error("Eroare la preluare fan boxes");
  });
  return res.data;
};
