"use client";

import axios from "axios";
import { getUserToken } from "./account";

const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const makeInvoice = async (orderId, clientData) => {
  let userToken = await getUserToken();
  const response = await axios
    .post(
      baseUrl + "/create_invoice",
      {
        orderId,
        clientData,
      },
      { headers: { Authorization: userToken } }
    )
    .catch((err) => {
      console.log(err);
      alert("Eroare la crearea facturii");
    });
  return response.data;
};

export const cancelInvoice = async (orderId) => {
  let userToken = await getUserToken();
  await axios
    .put(
      baseUrl + "/cancel_invoice/" + orderId,
      {},
      { headers: { Authorization: userToken } }
    )
    .catch((err) => {
      console.log(err);
      //alert('Eroare la anularea facturii');
    });
};

export const getFactura = async (orderId) => {
  let userToken = await getUserToken();

  const url = baseUrl + "/view_invoice/" + orderId;
  try {
    const res = await axios.get(url, {
      headers: { Authorization: userToken },
      responseType: "blob",
    });

    const pdfBlob = new Blob([res.data], { type: "application/pdf" });

    const pdfUrl = window.URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");

    //document.body.appendChild(link);

    //return res;
  } catch (err) {
    console.log("Err", err);
    alert("Eroare la preluarea facturii");
  }
};

export const sendCustomerOrderOnlyEmail = async (orderId) => {
  let userToken = await getUserToken();

  const url = baseUrl + "/send_order_only_ready_email";

  await axios
    .post(url, { orderId }, { headers: { Authorization: userToken } })
    .catch((err) => {
      console.log(err);
      alert("Eroare la trimiterea email-ului");
    });

  alert("Email trimis cu succes!");
};

export const sendCustomerOrderEmail = async (orderId) => {
  let userToken = await getUserToken();

  const url = baseUrl + "/send_order_ready_email";

  await axios
    .post(url, { orderId }, { headers: { Authorization: userToken } })
    .catch((err) => {
      console.log(err);
      alert("Eroare la trimiterea email-ului");
    });

  alert("Email trimis cu succes!");
};
