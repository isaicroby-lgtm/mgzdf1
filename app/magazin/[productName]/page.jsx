import React from "react";
import IndividualProduct from "@/components/organisms/products/individual-product";

const IndividualProductPage = ({ params }) => {
  const { productName } = params;
  return (
    <>
      <IndividualProduct productName={productName} />
    </>
  );
};

export default IndividualProductPage;

export async function generateMetadata({ params }) {
  const { productName } = params;

  const metadata = fetch(
    "https://api-ekfyledvua-ew.a.run.app/product_metadata/" + productName
  ).then((response) => {
    if (response.status !== 200) return {};
    return response.json();
  });

  return metadata;
}
