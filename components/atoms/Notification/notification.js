import React from "react";
import styled, { keyframes } from "styled-components";
import theme from "../theme";

const Notification = ({ children, visible }) => {
  return (
    <>
      <PopupContainer visible={visible}>
        <PopupContent>{children}</PopupContent>
      </PopupContainer>
    </>
  );
};

const slideInAnimation = keyframes`
  from {
    right: -100%;
  }
  to {
    right: 4%;
  }
`;

const slideOutAnimation = keyframes`
  from {
    right: 4%;
  }
  to {
    right: -100%;
  }
`;

const PopupContainer = styled.div`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  position: fixed;
  margin-top: 18vh;
  right: -4%;
  padding: 10px;
  width: 250px;
  min-height: 150px;
  height: fit-content;
  z-index: 999999;
  border-radius: 8px;
  display: ${(props) => (props.visible ? "block" : "none")};
  animation: ${(props) =>
      props.visible ? slideInAnimation : slideOutAnimation}
    0.2s ease-out;
  animation-fill-mode: forwards;
`;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 5px;
//   right: 5px;
//   padding: 5px;
//   background: none;
//   border: none;
//   font-size: 16px;
//   cursor: pointer;
//   color: ${theme["border-color-deep"]};
// `;

const PopupContent = styled.div`
  margin-top: 30px;
`;

export default Notification;
