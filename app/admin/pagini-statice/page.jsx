"use client";

import dynamic from "next/dynamic";
import React from "react";

const AdminStaticPages = dynamic(
  () => import("@/components/organisms/admin/static-pages"),
  { ssr: false }
);

const AdminStaticPagesPage = () => {
  return (
    <>
      <AdminStaticPages />
    </>
  );
};

export default AdminStaticPagesPage;
