"use client";

import React from "react";

import { BasicWrapperForLegal } from "@/components/atoms/other-styled-components";
import ViewStaticPage from "@/components/organisms/static-pages/view-static-page";

const ConfidentialityPolicyPage = () => {
  return (
    <>
      <BasicWrapperForLegal>
        <ViewStaticPage title={"politica-de-confindentialitate"} />
      </BasicWrapperForLegal>
    </>
  );
};

export default ConfidentialityPolicyPage;
