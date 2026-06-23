"use client";

import React from "react";
import dynamic from "next/dynamic";

const WebsiteSettings = dynamic(
  () => import("@/components/organisms/admin/website-settings"),
  { ssr: false }
);

const AdminWebsiteSettingsPage = () => {
  return (
    <>
      <WebsiteSettings />
    </>
  );
};

export default AdminWebsiteSettingsPage;
