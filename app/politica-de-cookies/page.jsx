"use client";

import React from "react";

import { BasicWrapperForLegal } from "@/components/atoms/other-styled-components";
import ViewStaticPage from "@/components/organisms/static-pages/view-static-page";

const CookiesPolicyPage = () => {
  return (
    <>
      <BasicWrapperForLegal>
        <ViewStaticPage title={"politica-de-cookies"} />
      </BasicWrapperForLegal>
    </>
  );
};

export default CookiesPolicyPage;
