import Styled from "styled-components";
import { Button } from "antd";

const outline = (theme, type, white) => {
  return `
        background: transparent !important;
        border: 1px solid ${
          !white
            ? type !== "light"
              ? theme[`${type}-color`]
              : theme["border-color-normal"]
            : white
        };

        color: ${
          !white ? (type !== "default" ? theme[`${type}-color`] : "") : white
        };

        &:hover, &:focus {
          border: 1px solid ${
            type !== "default" && !white && theme[`${type}-hover`]
          } !important;
          color: ${type !== "default" && theme[`${type}-hover`]} !important;
        }
    `;
};

const ghosts = (theme) => {
  return `
          background: transparent;
          border: 1px solid ${theme["border-color-normal"]} !important;
          color: rgb(90, 95, 125) !important;
            
          &:hover, &:focus {
              background: #ffffff50 !important;
              border: 1px solid transparent !important;
            filter:saturate(200%);
          }
      `;
};

const transparents = (theme, type) => {
  return `
        background: ${type !== "default" && theme[`${type}-color`]}15;
        border-width: 0px;
        color: ${type !== "default" && theme[`${type}-color`]};
        &:hover, &:focus {
            background: ${type !== "default" && theme[`${type}-hover`]}15;
            border-width: 0px;
            color: ${type !== "default" && theme[`${type}-hover`]}; 
        }
    `;
};

const raise = (theme, type) => {
  return `
        box-shadow: 0 10px 15px ${
          type !== "white" ? theme[`${type}-color`] : "#9299B8"
        }20;
    `;
};

const square = (theme, type) => `
      background: ${type !== "default" && theme[`${type}-color`]};
      border: 1px solid ${
        type !== "default" ? theme[`${type}-color`] : theme["disabled-color"]
      };
      color: ${type !== "default" && "#ffffff"};
      border-radius: 0px;
      padding: 0px 15px;
  
      &:hover, &:focus {
          background: ${type !== "default" && theme[`${type}-hover`]};
          border: 1px solid ${type !== "default" && theme[`${type}-hover`]};
          color: ${type !== "default" && "#ffffff"};
      }
  `;

const squareOutline = (theme, type) => `
      background: transparent;
      border: 1px solid ${
        type !== "default" ? theme[`${type}-color`] : theme["disabled-color"]
      };
      color: ${type !== "default" && theme[`${type}-color`]};
      border-radius: 0px;
      padding: 0px 15px;
      &:hover, &:focus {
          background: ${type !== "default" && theme[`${type}-hover`]};
          border: 1px solid ${type !== "default" && theme[`${type}-hover`]};
          color: ${type !== "default" && "#ffffff"};
      }
  `;

const socialButton = (color, shape) => `
      background: ${color};
      background: ${color};
      border: 1px solid ${color};
      color: #ffffff;
      border-radius: ${!shape ? "4px" : "40px"};
      padding: 0px 12px;
      display: inline-flex;
      align-items: center;
      span {
          padding-left: 5px;
      }
      &:hover, &:focus {
          background: ${color}90;
          border: 1px solid ${color}90;
          color: #ffffff;
      }
  `;

const ButtonStyled = Styled(Button)`

    max-width:100%;
    height:fit-content;  
    background: ${({ type, theme, color }) =>
      type !== "default" ? theme[`${type}-color`] : color};
    border-width: 0px;

    border-style: ${({ type }) => (type !== "dashed" ? "solid" : "dashed")};
    color: ${({ type, white }) =>
      !white ? (type !== "default" ? "#ffffff" : "#5A5F7D") : white};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${({ shape, rounded }) =>
      rounded ? `${rounded}px` : !shape ? "4px" : "40px"};
    padding: 10px 20px;
    cursor:pointer;


    text-wrap:wrap;

    font-weight: 500;
    box-shadow: 0 0;
    &:hover, &:focus {
        background: ${({ type, theme }) =>
          type !== "default" && theme[`${type}-hover`]};
        color: ${({ type }) => (type !== "default" ? "#ffffff" : "#5A5F7D")};
    }
    i,
    svg,
    img{
        width: 16px;
        height: 16px;
        +span{
            ${({ theme }) => (theme.rtl ? "margin-right" : "margin-left")}: 6px;
        }
    }

    ${({ transparent, theme, type }) =>
      transparent && transparents(theme, type)};
    ${({ outlined, theme, type, white }) =>
      outlined && outline(theme, type, white)};
    ${({ ghost, theme }) => ghost && ghosts(theme)};
    ${({ raised, theme, type }) => raised && raise(theme, type)};
    ${({ squared, theme, type }) => squared && square(theme, type)};
    ${({ squared, outlined, theme, type }) =>
      squared && outlined && squareOutline(theme, type)};
    ${({ social, color, shape }) => social && socialButton(color, shape)};
`;

export { ButtonStyled };
