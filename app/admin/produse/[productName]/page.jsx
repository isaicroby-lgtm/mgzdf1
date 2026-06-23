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
