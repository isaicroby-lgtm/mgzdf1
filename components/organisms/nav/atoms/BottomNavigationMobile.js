import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";

import theme from "@/components/atoms/theme";
import Text from "@/components/atoms/Text";

const BottomNavigationMobileDiv = styled.div`
  background: white;
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 1000;
  width: 100%;

  height: 65px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6%;

  border-top: 1px solid ${theme["border-color-normal"]};

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  @media only screen and (min-width: 750px) {
    display: none;
  }
`;

const BottomNavigationMobile = ({
  setModalOpen,
  setFiltersModalOpen,
  productsFavoriteLength,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <BottomNavigationMobileDiv onClick={(event) => event.stopPropagation()}>
      <div
        onClick={() => {
          router.push("/magazin");
          setFiltersModalOpen();
          setModalOpen();
        }}
      >
        <Image
          width={28}
          height={24}
          src={"/img/SBB.png"}
          unoptimized={true}
          style={{ objectFit: "cover" }}
          alt=""
        />
        <Text as="p6">Magazin</Text>
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setModalOpen((prev) => (prev === "user" ? "" : "user"));
        }}
      >
        <FeatherIcon icon="user" />
        <Text as="p6">Contul meu</Text>
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setModalOpen((prev) => (prev === "heart" ? "" : "heart"));
        }}
      >
        <FeatherIcon icon="heart" />

        <Text as="p6">Favorite</Text>
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
          if (!pathname.includes("magazin")) router.push("/magazin");
          setFiltersModalOpen((prev) => !prev);
          setModalOpen();
        }}
      >
        <FeatherIcon icon="filter" />
        <Text as="p6">Filtre</Text>
      </div>
    </BottomNavigationMobileDiv>
  );
};

export default BottomNavigationMobile;
