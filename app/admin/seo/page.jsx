"use client";

import dynamic from "next/dynamic";
import React from "react";

const Seo = dynamic(() => import("@/components/organisms/admin/seo"), {
  ssr: false,
});

const AdminSeoPage = () => {
  return (
    <>
      <Seo />
    </>
  );
};

export default AdminSeoPage;
