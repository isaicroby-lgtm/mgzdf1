"use client";

import React from "react";
import dynamic from "next/dynamic";

const AddProduct = dynamic(
  () => import("@/components/organisms/admin/add-product"),
  { ssr: false }
);

const AdminAddProductPage = () => {
  return (
    <>
      <AddProduct />
    </>
  );
};

export default AdminAddProductPage;
