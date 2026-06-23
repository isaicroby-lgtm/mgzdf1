"use client";

import React from "react";
import dynamic from "next/dynamic";

const AdminMessagesForms = dynamic(
  () => import("@/components/organisms/admin/messages-forms"),
  { ssr: false }
);

const AdminMessagesFormsPage = () => {
  return (
    <>
      <AdminMessagesForms />
    </>
  );
};

export default AdminMessagesFormsPage;
