"use client";

import React from "react";
import dynamic from "next/dynamic";

const GroupProducts = dynamic(
  () => import("@/components/organisms/admin/group-products"),
  { ssr: false }
);

const AdminGroupProductsPage = () => {
  return (
    <>
      <GroupProducts />
    </>
  );
};

export default AdminGroupProductsPage;
