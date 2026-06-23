"use client";

import React from "react";
import dynamic from "next/dynamic";

const AdminBlog = dynamic(() => import("@/components/organisms/admin/blog"), {
  ssr: false,
});

const AdminBlogPage = () => {
  return (
    <>
      <AdminBlog />
    </>
  );
};

export default AdminBlogPage;
