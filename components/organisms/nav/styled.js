import theme from "@/components/atoms/theme";
import Styled from "styled-components";

const NavStyle = Styled.div`
  width:100%;
  background:#fff;

  z-index:999;

  position:sticky !important;
  top:0px;

  padding: ${({ isUnPadded }) =>
    isUnPadded ? "1.5rem 40px 1.1rem" : "1.5rem 10% 1rem"} ;

  display:grid;
  transition: padding 400ms ease;
  grid-template-columns:1fr 1.5fr 1fr;

  @media only screen and (max-width:1200px){
    display:flex;
    justify-content: space-between;

    padding: 1.7rem 4% 1.2rem;

  }

  gap:10%;

  .logo-container{  
    gap:2%;
    position: relative;
    bottom:3px;
  }

  .logo{
    position:sticky;
    width:100%;
    min-width:124px;
    max-width:224px;
    max-height:68px;

    cursor:pointer;
  }

  .logo:hover{
    transition:100ms;
    scale:105%;
    filter:saturate(110%);
  }

  .links{
    display:grid;
    @media only screen and (max-width:1200px){
      display:none;
    }
    grid-template-columns:1fr 1fr 1fr 1fr;
    width: 100%;
    gap:6%;
  }

  .center-icon{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    font-weight:800;
    font-size:0.75rem;
    transition:200ms;
    text-align:center;
    cursor: pointer;

    white-space:nowrap;
  }

  .center-icon-with-dropdown{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    font-weight:800;
    font-size:0.75rem;
    transition:200ms;
    text-align:center;
    cursor: pointer;

    white-space:nowrap;
  }


  .under-hover-categories-hover{
    display: block !important;
  }
  
  .under-hover-categories{
    display:none;
    position: absolute;
    top:90px;
    padding: 10px 8px 10px 12px;
    margin-top:10px;
    margin-left:10px;
    background-color: white;
    border-radius:4px;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
    border-left: 2px solid ${theme["nav-yellow"]};

    ul{
      display: flex;
      flex-direction:column;
      gap:8px;

      li{
        cursor: pointer;
      }

      li:hover{
        p{
          color:${theme["nav-yellow"]} !important;
          transition: 200ms all ease-in-out;
        }
      }
    }
  }


.menu-bars{
  display: none;
  @media only screen and (max-width:1200px){
    display:block
  }
  cursor:pointer;
}

  .center-icon:hover{
    scale:110%;
    transition:50ms;
    transform:translate(0,-2px);
    filter:saturate(110%);
  }
  
  .c_icon{
    height:60%;
    max-width:35px;
  }

  .buttons{
    display:grid;

    justify-self: flex-end;
    justify-items: flex-end;
    align-items: center;

    grid-template-columns:1fr 1fr 1fr 2fr;

    .ant-badge{
      width: 100%;
      text-align:center;
    }

    width:100%;
    max-width:280px;
    gap:4%;

    @media only screen and (max-width:750px){
      grid-template-columns:1fr 1fr;
      max-width:200px;
    }

    @media only screen and (max-width:480px){
      grid-template-columns:1fr;
      max-width:120px;
    }
  }

  .r-icon-user{
    @media only screen and (max-width:750px){
      display: none !important;
    }
  }

  .r-icon{  
    transition:100ms;
    border-radius:50%;
    outline: 1px dashed;
    padding:2px;
    outline-offset:2px;
    width:2.5rem;
    height:2.5rem;

    display:flex;
    align-items:center;
    justify-content:center;

    @media only screen and (max-width:480px){
      width:2rem;
      height:2rem;
    }

    position: relative;
    cursor: pointer;
  }

  .r-icon:last-child{
    outline: none;
  }


  .r-icon:nth-child(2){
    @media only screen and (max-width:480px){
        display:none;
    }
  }

  .r-icon:nth-child(3){
    @media only screen and (max-width:750px){
      display:none;
    }
  }

  .r-icon:hover{
    transition:100ms;
    scale:110%;
    filter:saturate(110%);
  }

  .r-icon-icon{
    position: absolute;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
  }
`;

const DiscountNavigationContainer = Styled.div`
  height: fit-content;
  background: #D6EFF9;

  color: #2D3745;
  font-size: 14px;
  font-weight: 500;


  display: flex;
  justify-content: space-between;
  @media only screen and (max-width:750px){
    justify-content: center;
    text-align:center;
    display:none;
  }
  align-items: center;
  padding: 3px 10%;
  

  .first-div{
    background:red
    display:inline-block;
    @media only screen and (max-width:750px){
      display: none;
    }
  }

  div{
    display:flex;
    justify-content:center;
    align-items: center;

    gap:20px;

    p{
      margin:0 !important;
    }
  }
`;
export { NavStyle, DiscountNavigationContainer };
