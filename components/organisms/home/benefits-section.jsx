"use client";

import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";

import { getStaticPage } from "@/api/static-pages";
import Heading from "@/components/atoms/Heading";
import theme from "@/components/atoms/theme";

import ChildHome from "@/static/img/ChildHome.svg";
import CarHome from "@/static/img/CarHome.svg";
import ToyHome from "@/static/img/ToyHome.svg";
import CloudVectorMiniSvgWhite from "@/static/img/CloudVectorMiniSvgWhite.svg";
import CloudVectorMiniSvg from "@/static/img/CloudVectorMiniSvg.svg";

import CSY from "@/static/img/CSY.jpg";

const BenefitSection = styled.div`
  position: relative;
  bottom: 100px;
  margin-bottom: 0px;

  width: 100%;
  padding: 2rem 10%;
  padding-top: 4.3rem;


  .img-curvy-section { 
    object-fit: cover;
    object-position: top center;
    z-index: 1;
  }

  .container-list {
    * {
      z-index: 2;
    }
    display: flex;
    align-items: center;
    gap: 2%;

  

  .ce-inseamna-doifrati {
    * {
      font-size: 19px;
      font-weight: 500;
    }
  }

  .alte-beneficii-daca-cumperi {
    * {
      font-size: 19px;
      font-weight: 500;
      color: white !important;
    }
  }

  ul {
    color: ${theme["primary-color"]};

    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding-left: 4%;

    li {
      img {
        margin: 12px;
        margin-bottom: 0;
        margin-top: 0;
      }
    }
    max-width: 90%;

    @media only screen and (max-width: 750px) {
      padding-left: 0;
    }
  }

  .head,
  .head2 {
    * {
      z-index: 2;
    }
    display: flex;
    align-items: center;
    gap: 1.8rem;

    @media only screen and (max-width: 750px) {
      gap: 1rem;
      margin-bottom: 2rem;
    }
  }

  .head2 {
    .custom-fill {
      fill: white !important;
    }
  }

  .container-jucarii {
    display: flex;
    flex-direction: column;
    width: fit-content;
    gap: 50px;

    img {
      width: 82px;
      height: 82px;
    }

    .middle-jucarie {
      position: relative;
      left: 56px;
    }
  }

  @media only screen and (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 30px;
    padding: ${({ yellow }) =>
      yellow ? "5rem 4% 4rem 4%" : "5rem 4% 2rem 4%"};

    .container-jucarii {
      img {
        width: 64px;
        height: 64px;
      }
    }

    place-items: center;
    min-height: ${({ yellow }) => (yellow ? "500px" : "500px")};
  }

  @media only screen and (max-width: 500px) {
    grid-template-rows: 1.5fr 1fr;

    min-height: ${({ yellow }) => (yellow ? "650px" : "650px")};
  }

  @media only screen and (max-width: 400px) {
    grid-template-rows: 2fr 1fr;
    min-height: ${({ yellow }) => (yellow ? "700px" : "700px")};
  }
`;

const BenefitsSection = () => {
  const [isMounted, setIsMounted] = useState();

  const fillNodeWithMarkupCloud = (htmlString, id, CloudVector) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;

    const listItems = tempElement?.querySelectorAll("li");

    listItems?.forEach((listItem) => {
      const imageContainer = document.createElement("div");

      const imageTag = <Image alt="nor" src={CloudVector} />;

      render(imageTag, imageContainer);

      if (listItem && imageContainer.firstChild) {
        listItem.insertBefore(imageContainer.firstChild, listItem.firstChild);
      }
    });

    const targetDiv = document.getElementById(id);

    if (targetDiv && tempElement) {
      targetDiv.insertBefore(tempElement, targetDiv.firstChild);
    }
  };

  useEffect(() => {
    const fetchPage = async () => {
      if (isMounted) return;
      const _page1 = await getStaticPage(
        "Pagina de acasa - ce inseamna doifrati.ro"
      );
      const _page2 = await getStaticPage(
        "Pagina de acasa - alte beneficii daca cumperi de la noi"
      );

      fillNodeWithMarkupCloud(
        _page1?.content,
        "ce-inseamna-doifrati",
        CloudVectorMiniSvg
      );
      fillNodeWithMarkupCloud(
        _page2?.content,
        "alte-beneficii-daca-cumperi",
        CloudVectorMiniSvgWhite
      );
      setIsMounted(true);
    };

    fetchPage();
  }, []);

  return (
    <>
      <BenefitSection>
        <Image
          alt=""
          fill
          src={"/img/CurvySection.svg"}
          className="img-curvy-section"
          unoptimized={true}
        />
        
      
      </BenefitSection>

    </>
  );
};

export default BenefitsSection;
