import Styled from "styled-components";

const P1 = Styled.p`
  margin:0;
  color: #2D3745;
  font-size: 19px;
  font-weight: 600;

  @media only screen and (max-width:1200px){
    font-size:18px;
  }
`;

const P2 = Styled.p`
  margin:0;
  color: #2D3745; 
  font-size: 30px;
  font-weight: 700;
`;

const P3 = Styled.p`
  margin:0;
  color: #2D3745;
  font-size: 18px;
  line-height: normal;
`;

const P4 = Styled.p`
  margin:0;
  color: #2D3745;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
`;

const P5 = Styled.p`
  margin:0;
  color: #2D3745;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  line-height: normal;

`;

const P6 = Styled.p`
  margin:0;
  color: #2D3745;
  font-size: 13px;
  font-weight: 500;
  line-height: normal;
`;

const L3 = Styled.li`
  margin:0;
  color: rgb(90, 95, 125);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  line-height: normal;
  
`;

export { P1, P2, P3, P4, P5, P6, L3 };
