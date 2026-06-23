"use client";

import React from "react";
import dynamic from "next/dynamic";

const UsersPage = dynamic(() => import("@/components/organisms/admin/users"), {
  ssr: false,
});

const AdminUsersPage = () => {
  return (
    <>
      <UsersPage />
    </>
  );
};

export default AdminUsersPage;
