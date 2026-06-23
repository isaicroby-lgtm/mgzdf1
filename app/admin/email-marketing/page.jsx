"use client";

import React from "react";
import dynamic from "next/dynamic";

const AdminEmailMarketing = dynamic(
  () => import("@/components/organisms/admin/email-marketing"),
  { ssr: false }
);

const AdminEmailMarketingPage = () => {
  return (
    <>
      <AdminEmailMarketing />
    </>
  );
};

export default AdminEmailMarketingPage;
