import Styled from "styled-components";

const Div = Styled.div`
    position: relative;
    overflow-x: scroll;

    .ant-layout-sider-children{
        height: 90%;
        overflow-y: scroll;
    }

    .ant-menu-submenu-title {
        .ant-menu-item-icon + span {
            margin-left: 20px;
        }
    }
    header{

        background-color: white !important;

        box-shadow: 0 2px 30px ${({ theme }) => theme["gray-solid"]}10;
        z-index: 999;

        @media print {
            display: none;
        }


        .ant-menu-sub.ant-menu-vertical{
            .ant-menu-item{
                a{
                    color: ${({ theme }) => theme["gray-color"]};
                }
            }
        }
        .ant-menu.ant-menu-horizontal{
            display: flex;
            align-items: center;
            margin: 0 -16px;
            li.ant-menu-submenu{
                margin: 0 16px;
            }
            .ant-menu-submenu{
                &.ant-menu-submenu-active,
                &.ant-menu-submenu-selected,
                &.ant-menu-submenu-open{
                    .ant-menu-submenu-title{
                        color:  "#5A5F7D";
                        svg,
                        i{
                            color: "#5A5F7D";
                        }
                    }
                }
                .ant-menu-submenu-title{
                    font-size: 14px;
                    font-weight: 500;
                    color: "#5A5F7D";
                    svg,
                    i{
                        color: "#5A5F7D";
                    }
                    .ant-menu-submenu-arrow{
                        font-family: "FontAwesome";
                        font-style: normal;
                        ${({ theme }) =>
                          theme.rtl ? "margin-right" : "margin-left"}: 6px;
                        &:after{
                            color: ${({ darkMode }) =>
                              darkMode ? `#ffffff90;` : "#9299B8"};
                            content: '\f107';
                            background-color: transparent;
                        }
                    }
                }
            }
        }
       

    }


    /* Sidebar styles */
    .ant-layout-sider{
        box-shadow: 0 0 30px #9299B810;
        @media (max-width: 991px){
            box-shadow: 0 0 10px #00000020;
        }
        @media print {
            display: none;
        }

        
        .ant-layout-sider-children{
            padding-bottom: 15px;
            >.sidebar-nav-title{
                margin-top: 8px;
            }

            .ant-menu{
                overflow-x: hidden;
                .ant-menu-sub.ant-menu-inline{
                    background-color: #fff;
                }
                ${({ theme }) =>
                  theme.rtl ? "border-left" : "border-right"}: 0 none;
                .ant-menu-submenu, .ant-menu-item{
                    .feather,
                    img{
                        width: 16px;
                        font-size: 16px;
                        color: ${({ theme }) => theme["extra-light-color"]};
                    }
                    span{
                        display: inline-block;

                        transition: 0.3s ease;
                        a{
                            ${({ theme }) =>
                              !theme.rtl
                                ? "padding-left"
                                : "padding-right"}: 10px;
                        }
                    }
                 
                }
                .ant-menu-submenu{
                    span.ant-menu-title-content{
                        margin: 0;
                        ${({ theme }) =>
                          !theme.rtl ? "padding-left" : "padding-right"}: 20px;
                    }
                    .ant-menu-sub .ant-menu-item{
                        span.ant-menu-title-content{
                            ${({ theme }) =>
                              !theme.rtl ? "padding-left" : "padding-right"}: 0;
                        }
                    }
                }
                .ant-menu-item{
                    .menuItem-iocn{
                        width: auto;
                    }
                }
                .ant-menu-item,
                .ant-menu-submenu-title{
                    a{
                        position: relative;
                    }
                    >span{
                        width: 100%;
                        .pl-0{
                            ${({ theme }) =>
                              theme.rtl
                                ? "padding-right"
                                : "padding-left"}: 0px;
                        }
                    }
                    .badge{
                        position: absolute;                        
                        ${({ theme }) => (theme.rtl ? "left" : "right")}: 30px;
                        top: 50%;
                        transform: translateY(-50%);
                        display: inline-block;
                        height: auto;
                        font-size: 10px;
                        border-radius: 3px;
                        padding: 3px 4px 4px;
                        line-height: 1;
                        letter-spacing: 1px;
                        color: #fff;
                        &.badge-primary{
                            background-color: ${({ theme }) =>
                              theme["primary-color"]};
                        }
                        &.badge-success{
                            background-color: ${({ theme }) =>
                              theme["success-color"]};
                        }
                    }
                }
                .ant-menu-submenu{
                    .ant-menu-submenu-title{
                        display: flex;
                        align-items: center;
                        .title{
                            padding-left: 0;
                        }
                        .badge{
                            ${({ theme }) =>
                              theme.rtl ? "left" : "right"}: 45px;
                        }
                    }
                }
                .ant-menu-submenu-inline{
                    > .ant-menu-submenu-title{
                        display: flex;
                        align-items: center;
                        padding: 0 15px !important;
                        svg,
                        img{
                            width: 16px;
                            height: 16px;
                        }
                                                
                        .ant-menu-submenu-arrow{
                            right: auto;
                            ${({ theme }) =>
                              theme.rtl ? "left" : "right"}: 24px;
                            &:after,
                            &:before{
                                width: 7px;
                                background: #868EAE;
                                height: 1.25px;
                            }
                            &:before{
                                transform: rotate(45deg) ${({ theme }) =>
                                  !theme.rtl
                                    ? "translateY(-3.3px)"
                                    : "translateY(3.3px)"};
                            }
                            &:after{
                                transform: rotate(-45deg) ${({ theme }) =>
                                  theme.rtl
                                    ? "translateY(-3.3px)"
                                    : "translateY(3.3px)"};
                            }
                        }
                    }
                    &.ant-menu-submenu-open{
                        > .ant-menu-submenu-title{
                            .ant-menu-submenu-arrow{
                                transform: translateY(2px);
                                &:before{
                                    transform: rotate(45deg) translateX(-3.3px);
                                }
                                &:after{
                                    transform: rotate(-45deg) translateX(3.3px);
                                }
                            }
                        }
                    }
                    .ant-menu-item{
                        ${({ theme }) =>
                          theme.rtl
                            ? "padding-right"
                            : "padding-left"}: 0px !important;
                        ${({ theme }) =>
                          theme.rtl
                            ? "padding-left"
                            : "padding-right"}: 0 !important;
                        transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
                        a{
                            ${({ theme }) =>
                              theme.rtl
                                ? "padding-right"
                                : "padding-left"}: 50px !important;
                        }
                    }
                }
                .ant-menu-item{
                    display: flex;
                    align-items: center;
                    padding: 0 15px !important;
                    &.ant-menu-item-active{
                        border-radius: 4px;
                        ${({ darkMode }) =>
                          darkMode
                            ? `background-color: rgba(255, 255, 255, .05);`
                            : ""};
                    }
                    a{
                        width: 100%;
                        display: flex !important;
                        align-items: center;
                        .feather{
                            width: 16px;
                            color: ${({ theme }) => theme["extra-light-color"]};
                        }
                        span{
                            ${({ theme }) =>
                              !theme.rtl
                                ? "padding-left"
                                : "padding-right"}: 20px;
                            display: inline-block;
                            color: ${({ theme }) => theme["dark-color"]};
                        }
                    }
                    &.ant-menu-item-selected{
                        svg,
                        i{
                            color: ${({ theme }) => theme["primary-color"]};
                        }
                    }
                }
                .ant-menu-submenu,
                .ant-menu-item{
                    ${({ theme }) => theme.rtl && `padding-right: 5px;`}
                    
                    &.ant-menu-item-selected{
                        border-radius: 4px;
                        &:after{
                            content: none;
                        }
                    }
                    &.ant-menu-submenu-active{
                        border-radius: 4px;
                        ${({ darkMode }) =>
                          darkMode
                            ? `background-color: rgba(255, 255, 255, .05);`
                            : ""};
                    }
                }
                .sidebar-nav-title{
                    margin-top: 40px;
                    margin-bottom: 24px;
                }
                &.ant-menu-inline-collapsed{
                    .ant-menu-submenu{
                        text-align: ${({ theme }) =>
                          !theme.rtl
                            ? "left"
                            : "right"};                        
                        .ant-menu-submenu-title{
                            padding: 0 20px;
                            justify-content: center;
                        }
                    }
                    .ant-menu-item{
                        padding: 0 20px !important;
                        justify-content: center;
                    }
                    .ant-menu-submenu, .ant-menu-item{
                        span{
                            display: none;
                        }
                    }
                }
            }
        }
        .sidebar-nav-title{
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            ${({ darkMode }) =>
              darkMode
                ? `color: rgba(255, 255, 255, .38);`
                : "color: #9299B8;"};
            padding: 0 ${({ theme }) => (theme.rtl ? "20px" : "15px")};
            display: flex;
        }
        &.ant-layout-sider-collapsed{
            padding: 15px 0px 55px !important;
            .sidebar-nav-title{
                display: none;
            }
            & + .atbd-main-layout{
                ${({ theme }) =>
                  !theme.rtl ? "margin-left" : "margin-right"}: 80px;
            }
            .ant-menu-item{
                color: #333;
                .badge{
                    display: none;
                }
            }
        }
    }
    @media only screen and (max-width: 1150px){
        .ant-layout-sider.ant-layout-sider-collapsed{
            ${({ theme }) => (!theme.rtl ? "left" : "right")}: -80px !important;
        }

    }

    .atbd-main-layout{
        margin-left: 280px;
        margin-top: 64px;
        transition: 0.3s ease;

        @media only screen and (max-width: 800px){
            margin-left:auto !important;
        }

    }

    /* Mobile Actions */
    .mobile-action{
        position: absolute;
        ${({ theme }) => (theme.rtl ? "left" : "right")}: 20px;
        top: 50%;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        @media only screen and (max-width: 767px){
            ${({ theme }) => (theme.rtl ? "left" : "right")}: 0;
        }
        a{
            display: inline-flex;
            color: ${({ theme }) => theme["light-color"]};
            &.btn-search{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 18px;
            }
            svg{
                width: 20px
                height: 20px;
            }
        }
    }
    .admin-footer{
        @media print {
            display: none;
        }
        .admin-footer__copyright{
            display: inline-block;
            width: 100%;
            color: ${({ theme }) => theme["light-color"]};
            @media only screen and (max-width: 767px){
                text-align: center;
                margin-bottom: 10px;
            }
        }
        .admin-footer__links{
            text-align: ${({ theme }) => (theme.rtl ? "left" : "right")};
            @media only screen and (max-width: 767px){
                text-align: center;
            }
            a{
                color: ${({ theme }) => theme["light-color"]};
                &:not(:last-child){
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 15px;
                }
                &:hover{
                    color: ${({ theme }) => theme["primary-color"]};
                }
            }
        }
    }    
`;

const SmallScreenAuthInfo = Styled.div`
        ${({ darkMode }) =>
          darkMode ? `background: #272B41;` : "background: #fff"};
        width: 100%;
        position: fixed;
        margin-top: ${({ hide }) => (hide ? "0px" : "64px")};
        top: 0;
        ${({ theme }) => (!theme.rtl ? "left" : "right")}: 0;
        transition: .3s;
        opacity: ${({ hide }) => (hide ? 0 : 1)};
        z-index: ${({ hide }) => (hide ? -1 : 1)};
        box-shadow: 0 2px 30px #9299b810;

`;

const SmallScreenSearch = Styled.div`
        ${({ darkMode }) =>
          darkMode ? `background: #272B41` : "background: #fff"};
        width: 100%;
        position: fixed;
        margin-top: ${({ hide }) => (hide ? "0px" : "64px")};
        top: 0;
        ${({ theme }) => (!theme.rtl ? "left" : "right")}: 0;
        transition: .3s;
        opacity: ${({ hide }) => (hide ? 0 : 1)};
        z-index: ${({ hide }) => (hide ? -1 : 999)};
        box-shadow: 0 2px 30px #9299b810;

`;

const TopMenuSearch = Styled.div`
    .top-right-wrap{
        position: relative;
        float: ${({ theme }) => (theme.rtl ? "left" : "right")};
    }
    .search-toggle{
        display: flex;
        align-items: center;
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 10px;
        ${({ theme }) =>
          theme.darkMode ? `color: #A8AAB3;` : "color :#5A5F7D"};
        .feather-x{
            display: none;
        }
        .feather-search{
            display: flex;
        }
        &.active{
            .feather-search{
                display: none;
            }
            .feather-x{
                display: flex;
            }
        }
        svg,
        img{
            width: 20px;
        }
    }
    .topMenu-search-form{
        position: absolute;
        ${({ theme }) => (theme.rtl ? "left" : "right")}: 100%;
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 15px;
        top: 12px;
        background-color: #fff;
        border: 1px solid ${({ theme }) => theme["border-color-normal"]};
        border-radius: 6px;
        height: 40px;
        width: 280px;
        display: none;
        &.show{
            display: block;
        }
        .search-icon{
            width: fit-content;
            line-height: 1;
            position: absolute;
            left: 15px;
            ${({ theme }) => (theme.rtl ? "right" : "left")}: 15px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
        }
        i,
        svg{
            width: 18px;
            color: ${({ theme }) =>
              theme.darkMode ? `color: #A8AAB3;` : "color:# 9299b8"};
        }
        form{
            height: auto;
            display: flex;
            align-items: center;
        }
        input{
            position: relative;
            border-radius: 6px;
            width: 100%;
            border: 0 none;
            height: 38px;
            padding-left: 40px;
            z-index: 999;
            ${({ theme }) =>
              theme.rtl ? "padding-right" : "padding-left"}: 40px;
            &:focus{
                border: 0 none;
                box-shadow: 0 0;
                outline: none;
            }
        }
    }
`;

const NavTitle = Styled.p`
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    color: rgb(146, 153, 184);
    padding: 0px 15px;
    display: flex;
`;
export { Div, SmallScreenAuthInfo, SmallScreenSearch, TopMenuSearch, NavTitle };
