"use client";

import React from "react";

import { BasicWrapperForLegal } from "@/components/atoms/other-styled-components";
import ViewStaticPage from "@/components/organisms/static-pages/view-static-page";

const CancelOrderPage = () => {
  return (
    <>
      <BasicWrapperForLegal>
        <ViewStaticPage title={"politica-de-anulare-comanda"} />
      </BasicWrapperForLegal>
    </>
  );
};

export default CancelOrderPage;
