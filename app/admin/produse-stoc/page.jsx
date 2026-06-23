"use client";

import React from "react";
import dynamic from "next/dynamic";

const ProductStock = dynamic(
  () => import("@/components/organisms/admin/product-stock"),
  { ssr: false }
);

const AdminProductStockPage = () => {
  return (
    <>
      <ProductStock />
    </>
  );
};

export default AdminProductStockPage;
