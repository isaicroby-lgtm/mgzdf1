import React from "react";
import dynamic from "next/dynamic";
import { getMetadata } from "@/api/seoSsr";

const ProductsPage = dynamic(
  () => import("@/components/organisms/products/products-page"),
  { ssr: false }
);

const ShopPage = () => {
  return (
    <>
      <ProductsPage />
    </>
  );
};

export async function generateMetadata({ params }) {
  
  const metadata = await getMetadata("home");
  return metadata;
}


export default ShopPage;
