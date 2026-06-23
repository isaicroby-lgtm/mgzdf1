"use client";

import axios from "axios";

import extractImageInfo from "@/utility/extractImageInfo";
import { getUserToken } from "./account";

const apiBaseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const sendEmail = async (html, subject, to) => {
  let userToken = await getUserToken();

  await axios
    .post(
      apiBaseUrl + "/send_email",
      { subject, to, ...extractImageInfo(html) },
      { headers: { Authorization: userToken } }
    )
    .then(() => {
      alert("Email trimis cu succes");
    })
    .catch((err) => {
      console.log(err);
      alert("A aparut o eroare la trimiterea emailului");
    });
};

export const sendEmailToGroup = async (html, subject, groupId) => {
  let userToken = await getUserToken();

  await axios
    .post(
      apiBaseUrl + "/send_emails",
      { groupId, subject, ...extractImageInfo(html) },
      { headers: { Authorization: userToken } }
    )
    .then(() => {
      alert("Email trimis cu succes");
    })
    .catch((err) => {
      console.log(err);
      alert("A aparut o eroare la trimiterea emailului");
    });
};
