import Styled from "styled-components";

const H1 = Styled.h1`
  color: #2D3745;
  line-height: normal;
  font-size: 42px;
  font-weight: 800;
  margin:0;


  @media only screen and (max-width:1200px){
    font-size:40px;
  }

  @media only screen and (max-width:750px){
    font-size:38px;
    line-height:110%;
  }

  @media only screen and (max-width:350px){
    font-size:34px;
  }
`;

const H1B = Styled.h1`
  color: #2D3745;
  line-height: normal;
  font-size: 36px;
  font-weight: 800;
  margin:0;
  
  @media only screen and (max-width:1200px){
    font-size:34px;
    font-weight:700;
  }

  @media only screen and (max-width:750px){
    font-size:30px;
  }

  @media only screen and (max-width:350px){
    font-size:28px;
  }
`;

const H2B = Styled.h1`
  color: #2D3745;
  font-size: 30px;
  font-weight: 700;
  line-height: normal;
  margin:0;  
`;

const H2 = Styled.h1`
  color: #2D3745;
  font-size: 34px;
  font-weight: 700;
  line-height: normal;
  margin:0;

  @media only screen and (max-width:1200px){
    font-size:32px;
  }

  @media only screen and (max-width:750px){
    font-size:30px;
    line-height:110%;
  }

  @media only screen and (max-width:350px){
    font-size:26px;
  }

`;

const H3 = Styled.h1`
  color: #2D3745;
  font-size: 22px;
  font-weight: 600;
  line-height: 27px;
  margin:0;

`;

const H4 = Styled.h1`
  color: #2D3745;
  font-size: 20px;
  font-weight: 600;
  margin:0;

`;

const H5 = Styled.h1`
  color: #2D3745;
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
  margin:0;

`;

const H6 = Styled.h1`
  color: #2D3745;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  margin:0;

`;

export { H1, H2, H3, H4, H5, H6, H1B, H2B };
