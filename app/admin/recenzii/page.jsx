"use client";

import dynamic from "next/dynamic";
import React from "react";

const Reviews = dynamic(() => import("@/components/organisms/admin/reviews"), {
  ssr: false,
});

const AdminReviewsPage = () => {
  return (
    <>
      <Reviews />
    </>
  );
};

export default AdminReviewsPage;
