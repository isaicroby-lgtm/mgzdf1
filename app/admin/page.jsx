import React from "react";
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () => import("@/components/organisms/dashboard"),
  { ssr: false, loading: () => <></> }
);

const AdminPage = () => {
  return (
    <>
      <AdminDashboard />
    </>
  );
};

export default AdminPage;
