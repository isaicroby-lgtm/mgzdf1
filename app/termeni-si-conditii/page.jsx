"use client";

import React from "react";

import { BasicWrapperForLegal } from "@/components/atoms/other-styled-components";
import ViewStaticPage from "@/components/organisms/static-pages/view-static-page";

const TermsAndConditionsPage = () => {
  return (
    <>
      <BasicWrapperForLegal>
        <ViewStaticPage title={"termeni-si-conditii"} />
      </BasicWrapperForLegal>
    </>
  );
};

export default TermsAndConditionsPage;
