import React from "react";
import styled from "styled-components";
import theme from "@/components/atoms/theme";

export const BadgeStyle = styled.div`
  border-radius: 16px;
  border: 1px solid;
  width: fit-content;
  height: fit-content;
  padding: 2px 16px;
  border-color: ${({ color }) => color};
  color: ${({ color }) => color};
`;

export const badgeKeys = [
  "plasata",
  "trimisa",
  "plata online efectuata",
  "asteptare plata online",
  "plata online esuata",
  "livrata",
  "respinsa",
  "in lucru",
  "returnata",
  "livrare respinsa",
  "anulata de client",
  "anulata de doifrati",
];

const renderBadge = (statusL) => {
  let color;
  switch (statusL) {
    case "plasata":
      color = theme["rate-star-color"];
      break;
    case "in lucru":
      color = theme["primary-color"];
      break;
    case "trimisa":
      color = theme["nav-yellow"];
      break;
    case "asteptare plata online":
      color = theme["secondary-color"];
      break;
    case "plata online efectuata":
      color = theme["rate-star-color"];
      break;
    case "plata online esuata":
      color = theme["secondary-color"];
      break;
    case "livrata":
      color = theme["nav-green"];
      break;
    case "respinsa":
      color = theme["border-color-deep"];
      break;
    case "returnata":
      color = theme["border-color-deep"];
      break;
    default:
      color = "black";
  }

  return <BadgeStyle color={color}>{statusL}</BadgeStyle>;
};

export default renderBadge;
