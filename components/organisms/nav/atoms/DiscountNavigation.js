import React from "react";

import { useSelector } from "react-redux";
import styled from "styled-components";

import Text from "@/components/atoms/Text";

const DiscountNavigationWrapper = styled.div`
  width: 100%;

  background: 80;

  padding: ${({ isUnPadded }) => (isUnPadded ? "8px 40px" : "8px 10%")};
  min-height: 38px;

  transition: padding 400ms ease;

  background-image: url("/img/DiscountNav.png");

  background-size: cover;
  background-position: 0% 0%;
  background-repeat: no-repeat;

  * {
    color: white !important;
  }
  @media only screen and (max-width: 1200px) {
    padding: 8px 4%;
  }
`;

export const DiscountNavigation = ({ isUnPadded, discountNavigation }) => {
  const { discountNavbar } = useSelector((state) => {
    return {
      discountNavbar: state.setariRules.discount_navbar,
    };
  });

  return (
    <DiscountNavigationWrapper isUnPadded={isUnPadded}>
      {discountNavbar && <Text as="p5">{discountNavbar}</Text>}
    </DiscountNavigationWrapper>
  );
};
