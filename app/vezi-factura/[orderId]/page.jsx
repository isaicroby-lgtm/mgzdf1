"use client";

import React, { useEffect } from "react";

import { getFactura } from "@/api/smartbill";

const page = ({ params }) => {
  const { orderId } = params;

  useEffect(() => {
    const gf = async (orderId) => {
      await getFactura(orderId);
    };
    gf(orderId);
  }, []);

  return <div style={{ minHeight: "40vh" }}></div>;
};

export default page;
