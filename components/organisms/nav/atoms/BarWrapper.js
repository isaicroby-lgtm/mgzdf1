import styled from "styled-components";

export const BarWrapper = styled.div`
  z-index: 1000;

  width: 100%;
  height: 100vh;

  position: fixed;

  backdrop-filter: ${(props) => (props.modalOpen ? "blur(5px)" : "")};
  background-color: ${(props) => (props.modalOpen ? "#00000080" : "")};

  pointer-events: ${(props) => (props.modalOpen ? "" : "none")};

  transition: backdrop-filter 0.3s ease-in-out;
`;
