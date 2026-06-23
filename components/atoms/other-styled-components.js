"use client";

import styled from "styled-components";

export const BasicWrapperForLegal = styled.div`
  padding: 2rem 10%;

  min-height: 60vh;

  display: flex;

  flex-direction: column;
  justify-content: center;

  h2 {
    margin-top: 24px;
    margin-bottom: 12px;
  }

  h5 {
    font-weight: 700;
    font-size: 20px;
    margin-top: 24px;
    margin-bottom: 14px;
  }

  ul {
    list-style: inside;
  }

  @media only screen and (max-width: 750px) {
    padding: 2rem 4%;
  }
`;
