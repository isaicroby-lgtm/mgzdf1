"use client";

import axios from "axios";

const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const subscribeToNewsletter = async (email) => {
  await axios
    .post(`${baseUrl}/newsletter_subscribe`, { email })
    .catch((error) => {
      alert("A aparut o eroare la abonare!");
    })
    .then((response) => {
      alert("Abonare cu succes!");
    });
};
