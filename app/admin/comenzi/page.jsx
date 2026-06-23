"use client";

import dynamic from "next/dynamic";

const AdminOrders = dynamic(
  () => import("@/components/organisms/admin/orders"),
  {
    ssr: false,
  }
);

const AdminOrdersPage = () => {
  return (
    <>
      <AdminOrders />
    </>
  );
};

export default AdminOrdersPage;
