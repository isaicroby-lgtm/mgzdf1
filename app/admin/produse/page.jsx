"use client";

import React from "react";
import dynamic from "next/dynamic";

const ProductsPage = dynamic(
  () => import("@/components/organisms/products/products-page"),
  { ssr: false }
);

const AdminProductsPage = () => {
  return (
    <>
      <ProductsPage />
    </>
  );
};

export default AdminProductsPage;
