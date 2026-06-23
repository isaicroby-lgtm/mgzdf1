import Styled from "styled-components";

const FigureCart = Styled.figure`

    display: inline-flex;
    img, video, .produsul-ales {
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 15px;
    }
`;

const Sidebar = Styled.div`
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    .ant-card-body{
        padding: 20px 25px 25px !important
    }
    .ant-card-head-title{
        padding: 14px 0 !important;
        span{
            ${({ theme }) => (!theme.rtl ? "margin-left" : "margin-right")}: 0;
            font-size: 16px;
            font-weight: 500;
            color: ${({ theme }) => theme["dark-color"]};
            svg{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 12px;
            }
        }
    }
    .ant-slider-rail{
        background-color:#48ACF030 !important;
    }
`;

const NotFoundWrapper = Styled.div`
    text-align: center;
    margin-top: 60px;
    h1{
        border-bottom: 1px solid ${({ theme }) =>
          theme["border-color-normal"]};;
        border-top: 1px solid ${({ theme }) => theme["border-color-normal"]};;
        padding: 15px 0 20px;
        color: ${({ theme }) => theme["dark-color"]};
    }
`;

const SidebarSingle = Styled.div`
    margin-bottom:32px;

    h1{
        font-size: 15px;
        margin-bottom: 20px;
        color: ${({ theme }) => theme["dark-color"]};
    }
    .ant-slider{
        margin-bottom: 15px;
    }
    .price-range-text{
        font-weight: 500;
        height:fit-content;
        margin-bottom:0px;
    }
    span{
        position:relative !important;
        top:0px !important;
    }
    .atbd-category-list{
        li{
            &:not(:last-child){
                margin-bottom: 10px;
            }
            a, text{
                width: 100%
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                color: ${({ theme }) => theme["gray-color"]};
                .category-count{
                    font-size: 12px;
                    color: ${({ theme }) => theme["light-color"]};
                    margin-left: 4px;
                }
            }
        }
    }
    .btn-seeMore{
        font-size: 13px;
        font-weight: 500;
        display: inline-block;
        margin-top: 8px;
        color: ${({ theme }) => theme["primary-color"]};
    }
    .ant-checkbox-group{
        .ant-checkbox-group-item{
            display: flex;
            align-items: center;
            color: ${({ theme }) => theme["gray-color"]};
            &:not(:last-child){
                margin-bottom: 10px;
            }
            &.ant-checkbox-wrapper{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 0;
            }
            >span + span{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                ${({ theme }) =>
                  theme.rtl ? "padding-left" : "padding-right"}: 0;
                .brand-count{
                    font-size: 12px;
                    color: ${({ theme }) => theme["light-color"]};
                }
                .rating-left{
                    margin-top: -4px;
                    min-width: 150px;
                    @media only screen and (max-width: 1792px){
                        min-width: 130px;
                    }
                    .ant-rate{
                        ${({ theme }) =>
                          theme.rtl ? "margin-left" : "margin-right"}: 10px;
                    }
                }
                .rating-right{
                    text-align: ${({ theme }) =>
                      theme.rtl ? "left" : "right"};
                    min-width: 60px;
                    font-size: 12px;
                    color: ${({ theme }) => theme["light-color"]};
                    @media only screen and (max-width: 1792px){
                        min-width: 26.5px;
                    }
                }
            }
        }
    }
    .ant-checkbox-group{
        width: 100%;
        display: flex;
        flex-direction:column;
    }
`;

const ProductCard = Styled.div`
    overflow:hidden;
    border: 1px solid #fff;
    box-shadow: 0px 0px 2px 0px #48acf0;

    position: relative;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    border-radius:4px;

    height: 550px;


    figure{
        margin-top:20px;
        width: 100%;

        img, video, .produsul-ales{
            width: 90% !important;
            border-radius:4px;
        }
        position:absolute;
        top: 0;

        display:flex;
        justify-content:center;
        align-items:center;
    }


    
    @media only screen and (max-width: 767px){
        max-width: 350px;
        margin: 0 auto;
        height: 445px;
        figure{
            img, video, .produsul-ales{
                height: 200px !important;
                width: auto !important;
            }
        }   
        figcaption{
            top: 220px !important;
        }
    }

    @media only screen and (max-width:300px){
        height: 515px;
    }

    figure{
        margin-bottom: 0;
        img, video, .produsul-ales{
            width: auto;
            height: 250px;
            object-fit:cover;
        }
    }
    figcaption{
        position: absolute;
        top: 270px;
        width: 100%;
        padding: 16px 16px 24px;
    }

    .admin-btn-container{
        position: absolute;
        bottom: 16px;
        left: 16px;

        display:flex;
        gap:4px;

        .btn-edit, .btn-delete{
            z-index: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;

            background-color: #fff;
            border-radius: 4px;

            box-shadow: 0 0px 10px ${({ theme }) =>
              theme["border-color-normal"]};
            transition: all 300ms ease-in-out;
        }

        .btn-delete{
            color: ${({ theme }) => theme["secondary-color"]} ;
        }

        .btn-delete:hover {
            background-color: ${({ theme }) => theme["secondary-color"]};
            color: white !important;
        } 

        .btn-edit:hover {
            background-color: ${({ theme }) => theme["primary-color"]};
            color: white !important;
        } 
    }


    .btn-heart{

        z-index: 1;

        /* position: absolute; */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;

        /* bottom: 28px;
        right: 16px; */

        background-color: #fff;
        border-radius: 50%;

        box-shadow: 0 0px 10px ${({ theme }) => theme["border-color-normal"]};
        transition: all 300ms ease-in-out;
    } 

    .btn-heart {
        color: ${({ theme }) => theme["secondary-color"]};
    }

    .btn-heart-favorite path{
        fill: ${({ theme }) => theme["secondary-color"]}; 
    }

    .btn-heart-favorite:hover path{
        fill: white; 
    }

    .btn-heart:hover {
        background-color: ${({ theme }) => theme["secondary-color"]};
        color: white !important;
    } 

    .product-single-title{
        width: fit-content;
        margin-bottom: 8px;
        font-size: 15px;
        font-weight: 500;
        color: ${({ theme }) => theme["dark-color"]};
        cursor:pointer;
        
    }
        .product-single-price{
        margin-top:5px;
        margin-bottom: 5px;
        del{
            margin: 0 5px;
        }

        @media only screen and (max-width:750px){
            margin-top:4px !important;
            .product-single-price__new{
                font-size:16px;
            }

            .product-single-price__old, .product-single-price__offer{
                font-size:15px;
            }
        }
    }
    .product-single-price__new{
        font-weight: 700;
        color: ${({ theme }) => theme["secondary-color"]};
    }

    
    .product-single-price__offer{
        color: ${({ theme }) => theme["secondary-color"]};
        font-weight: 500;
        font-size: 16px;
    }

    .product-single-rating{
        font-size: 12px;
        font-weight: 500;
        .ant-rate{
            ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 5px;
        }
        .ant-rate-star:not(:last-child) {
            ${({ theme }) =>
              !theme.rtl ? "margin-right" : "margin-left"}: 2px !important;
        }
        .total-reviews{
            font-weight: 400;
            ${({ theme }) =>
              !theme.rtl ? "margin-left" : "margin-right"}: 6px;
            color: ${({ theme }) => theme["light-color"]};
        }
    }
    .product-single-action{
        width: 100%;

        display: flex;
        align-items:center;
        justify-content:space-between;

        gap:5px;

        position: absolute;
        bottom: 0;
        left:0;
        padding:0 16px 20px 16px;

 
        button{
            margin: 0;

            padding: 12px 32px;

            @media only screen and (max-width:767px){
                padding:8px 24px;
            }
        }
        .ant-btn-default{
            border-color: ${({ theme }) => theme["border-color-normal"]};
            &:hover{
                border-color: ${({ theme }) => theme["primary-color"]};
            }
        }
        .ant-btn-white{
            &:hover{
                border-color: ${({ theme }) =>
                  theme["primary-color"]} !important;
            }
        }
        .ant-btn-sm{
            font-size: 12px;
            padding: 0px 18.065px;
            height: 36px;
        }
    }
`;

const TopToolBox = Styled.div`
    margin-bottom: 20px;
    /* // Toolbox Common Styles */
    .ant-row{
        align-items: center;
    }
    .table-toolbox-menu{
        margin: -10px;
        color: ${({ theme }) => theme["gray-color"]};
        @media only screen and (max-width: 1599px){
            text-align: ${({ theme }) => (theme.rtl ? "left" : "right")};
        }
        @media only screen and (max-width: 991px){
            margin-top: 20px;
        }
        .ant-radio-button-wrapper{
            height: 40px;
            line-height: 40px;
            padding: 0 12.5px;
            &.active{
                span{
                    color: ${({ theme }) => theme["primary-color"]};
                }
            }
        }
        @media only screen and (max-width: 991px){
            text-align: center;
        }
        .toolbox-menu-title,
        .ant-radio-group-outline{
            margin: 10px;
        }
    }
    .ant-select{
        @media only screen and (max-width: 1599px){
            margin-bottom: 20px;
        }
        @media only screen and (max-width: 767px){
            max-width: 350px;
            margin: 0 auto 20px;
        }
        .ant-select-selection-search{
            @media only screen and (max-width: 991px){
                width: 100% !important;
            }
            .ant-select-selection-search-input{
                min-width: 350px;
                @media only screen and (max-width: 1792px){
                    min-width: 230px;
                }
            }
        }
    }
    .search-result{
        margin: ${({ theme }) => (theme.rtl ? "0 25px 0 0" : "0 0 0 25px")};
        color: ${({ theme }) => theme["gray-color"]};
        @media only screen and (max-width: 1599px){
            text-align: ${({ theme }) => (theme.rtl ? "left" : "right")};
            margin-bottom: 15px;
        }
        @media only screen and (max-width: 991px){
            text-align: center;
            margin-bottom: 18px;
        }
        @media only screen and (max-width: 991px){
            ${({ theme }) =>
              !theme.rtl ? "margin-left" : "margin-right"}: 0px;
        }
    }


    .ant-radio-group-outline{
        padding: 0 10px;
        border-radius: 5px;
        background: #fff;
        border: 1px solid ${({ theme }) => theme["border-color-normal"]};
        @media only screen and (max-width: 1792px){
            padding: 0 5px;
        }
        @media only screen and (max-width: 991px){
            padding: 0;
        }
    }
    .ant-radio-button-wrapper{
        height: 40px;
        line-height: 42px;
        padding: 0 12px;
        border-color: ${({ theme }) => theme["border-color-normal"]};
        border: 0 none !important;
        @media only screen and (max-width: 1792px){
            padding: 0 7.5px;
        }
        @media only screen and (max-width: 1599px){
            padding: 0 12.5px;
        }
        &.ant-radio-button-wrapper-checked{
            &:focus-within{
                box-shadow: 0 0;
            }
        }
        &:not(:first-child){
            &:before{
                display: none;
            }
        }
        &:not(:last-child){
            &:after{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                ${({ theme }) => (theme.rtl ? "left" : "right")}: 0px;
                display: block;
                box-sizing: content-box;
                width: 1px;
                height: 50%;
                padding: 1px 0;
                background-color: #F1F2F6;
                transition: background-color 0.3s;
                content: '';
                z-index: 1;
                @media only screen and (max-width: 479px){
                    display: none;
                }
            }
        }
        span{
            color: ${({ theme }) => theme["light-color"]};
            @media only screen and (max-width: 1792px){
                font-size: 13px;
            }
        }
        &.ant-radio-button-wrapper-checked{
            span{
                color: ${({ theme }) => theme["primary-color"]};
            }
        }
    }

    // Product Toolbox Styles
    .product-list-action{
        @media only screen and (max-width: 991px){
            flex-flow: column;
            justify-content: center;
        }
    }
    .product-list-action__tab{
        margin: -10px;
        color: ${({ theme }) => theme["gray-color"]};
        
        @media only screen and (max-width: 767px){
            margin-bottom: 15px;
            text-align: center;
        }
        @media only screen and (max-width: 991px) and (min-width: 768px){
            margin: -10px -10px 0;
        }
        @media only screen and (max-width: 575px){
            margin: -6px -6px 0;
        }
        @media only screen and (max-width: 344px){
            .ant-radio-group-outline{
                margin-top: 8px;
                ${({ theme }) =>
                  !theme.rtl ? "margin-left" : "margin-right"}: 0;;
            }
        }
        .toolbox-menu-title,
        .ant-radio-group{
            margin: 10px;
            @media only screen and (max-width: 575px){
                margin: 6px
            }
        }
    }

    .product-list-action__viewmode{
        display: flex;
        align-items: center;
        a, text{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: ${({ theme }) => theme["light-color"]};
            box-shadow: 0 5px 20px ${({ theme }) => theme["light-color"]}10;
            &.active{
                background-color: #fff;
                color: ${({ theme }) => theme["primary-color"]};
            }
        }
    }

    .table-search-box{
        @media only screen and (max-width: 991px){
            max-width: 600px;
            margin: 0 auto;
        }
        .ant-select{
            margin-bottom: 0;
        }
        .ant-select-selection-search{
            width: 100% !important;
            .ant-select-selection-search-input {
                border-radius: 20px;
                border: 0 none;
                background: ${({ theme }) => theme["bg-color-light"]};
                height: 40px;
                input{
                    background: ${({ theme }) => theme["bg-color-light"]};
                    height: 40px !important;
                }
            }
        }
    }
    .table-toolbox-actions{
        text-align: ${({ theme }) => (theme.rtl ? "left" : "right")};
        display: flex;
        justify-content: flex-end;
        align-items: center;
        @media only screen and (max-width: 1599px){
            margin-top: 20px;
            justify-content: center !important;
            text-align: center !important;
        }
        button{
            padding: 0px 13.4px;
            height: 38px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            svg,
            i{
                color: #fff;
            }
            &{
                +button{
                    ${({ theme }) =>
                      !theme.rtl ? "margin-left" : "margin-right"}: 8px;
                }
            }
        }
    }
`;

const PaginationWrapper = Styled.div`
    display: flex;
    justify-content: flex-end;
    
    @media only screen and (max-width: 767px){
        margin-top: 0px 
    }
    @media only screen and (max-width: 1199px){
        justify-content: center;
    }
    .ant-pagination{
        .ant-pagination-item-link,
        .ant-pagination-item,
        .ant-pagination-options {
            border: 1px solid ${({ theme }) => theme["border-color-light"]} ;
            color: ${({ theme }) => theme["gray-color"]};            
        }
        .ant-pagination-item a, .ant-pagination-item text{
            color: ${({ theme }) => theme["gray-color"]};
        }
    }
    
`;

const ProductDetailsWrapper = Styled.div`

    @media only screen and (max-width:992px){
        .sticky-column-inside {
            position: relative !important;
            top:0 !important;
        }
    }

    .product-details-box__left{
        figure{
            margin-bottom: 0;  

            img, video, .produsul-ales{
                border-radius: 10px;
                width:100%;
                height:100%;    
                object-fit:cover;

            }
        }
    }
    .pdbl_big-image{
        height:fit-content;
    }
    .pdbl__slider{
        margin-top: 32px;
        row-gap:10px;

        .ant-col{
            width: 20% !important;
            max-width: 20% !important;
        }

        .ant-col-md-4 {
            flex: 0 0 20% !important;
            max-width: 20% !important;
        }
    }
    
    .pdbl__image{
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 6px;
        cursor:pointer;
        img, .produsul-ales{
            border-radius: 4px;
            box-shadow: 0 0 3px ${({ theme }) =>
              theme["light-color"]} !important;
            max-width: 100%;
            height: 60px !important;

            @media only screen and (max-width: 991px){
                margin-bottom: 10px;
            }
        }
    }

    .extra-products{   

        .ant-col{
            max-width:100% !important;
            figure{
                max-width:100% !important;
            }
            img, video, .produsul-ales{
                width:100% !important;
                height:200px;
                object-fit:cover;  
                margin-bottom:8px; 
            }
        }

        @media only screen and (max-width:800px){
            grid-template-columns:1fr 1fr;

        }

        @media only screen and (max-width:500px){
            grid-template-columns:1fr;
            gap:50px;
            .ant-col{
                img, .produsul-ales{
                    height:250px;

                }
            }
        }
        
    }
    .product-details-box__right{
        @media only screen and (max-width: 991px){
            margin-top: 20px;
        }
        .ant-rate{
            margin-bottom: 6px;
        }
        .ant-rate-star:not(:last-child){
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 2px !important;
        }

        .btn-heart, .btn-share-2{
            z-index: 1;

            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;


            background-color: #fff;
            border-radius: 50%;

            box-shadow: 0 0px 10px ${({ theme }) =>
              theme["border-color-normal"]};
            transition: all 300ms ease-in-out;
         } 

        .btn-heart {
            color: ${({ theme }) => theme["secondary-color"]};
        }

        .btn-heart-favorite path{
            fill: ${({ theme }) => theme["secondary-color"]}; 
        }

        .btn-heart:hover, .btn-share-2:hover {
            filter: saturate(150%);
        } 
    }
    .pdbr__title{
        margin-bottom: 10px;
    }

    .pdbr__rating{
        display: inline-block;
        margin-right: 5px;
        font-size: 12px;
        font-weight: 500;
        color: ${({ theme }) => theme["dark-color"]};
    }
    .pdbr__review-count{
        font-size: 12px;
        font-weight: 400;
        color: ${({ theme }) => theme["light-color"]};
    }
    .pdbr__brand-text{
        display: inline-block;
        margin-bottom: 8px;
        color: ${({ theme }) => theme["light-color"]};
    }
    .pdbr__brand-name{
        font-weight: 500;
        color: ${({ theme }) => theme["dark-color"]};
    }
    .pdbr__new-price{
        font-size: 28px;
        font-weight: 800;
        margin: 8px 8px 8px 0px;
        color: ${({ theme }) => theme["secondary-color"]};
        .pdbr__currency{
            font-size: 20px;
            margin-left:4px;
            color: ${({ theme }) => theme["light-color"]};
        }
    }
    .pdbr__desc{
        font-size: 15px;
        max-width: 580px;
    }
    .pdbr__old-price{
        display: inline-flex;
        align-items: center;
        font-weight: 600;

        font-size: 18px;

        del{
            color: ${({ theme }) => theme["extra-light-color"]};
        }

        .pdbr__offer-price{
            display: inline-block;
            ${({ theme }) =>
              !theme.rtl ? "margin-left" : "margin-right"}: 8px;
            color: ${({ theme }) => theme["secondary-color"]};
        }
    }

    .pdbr__current-status{
        margin-top: 25px;

        .current-status-title{
            font-weight: 500;
            margin-right: 24px;
            color: ${({ theme }) => theme["dark-color"]};
            @media only screen and (max-width: 1000px){
                margin-right: 15px;
            }
        }
        .stock-status{
            /* margin-bottom:4px; */
            &.in-stock{
                font-weight: 500;
                color: ${({ theme }) => theme["success-color"]};
            }

            &.out-of-stock{
                font-weight: 500;
                color: ${({ theme }) => theme["secondary-color"]};
            }
        }
        .shipping-cost{
            color: ${({ theme }) => theme["gray-color"]};
        }
    }

    .pdbr__quantity{
        font-weight: 500;
        margin: 30px 0 30px;
        color: ${({ theme }) => theme["dark-color"]};
        button{
            background-color: ${({ theme }) => theme["bg-color-normal"]};
            &.btn-inc{
                margin-right: 15px;
            }
            &.btn-dec{
                margin-left: 15px;
            }
        }
        .pdbr__availability{
            font-size: 13px;
            font-weight: 400;
            margin-left: 15px;
            color: ${({ theme }) => theme["light-color"]};
        }
    }
    .pdbr__Actions{
        border-bottom: 1px solid ${({ theme }) => theme["border-color-normal"]};
        padding-bottom: 30px;
        margin-bottom: 28px;
        @media only screen and (max-width: 1399px){
            flex-flow: column;
            align-items: flex-start;
        }
        .pdbr__product-action{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .btn-cart{
                padding: 0 26.35px;
            }
            .btn-buy{
                padding: 0 29.85px;
            }
            .btn-cart,
            .btn-buy{
                border-radius: 6px;
                height: 44px;
            }
            button,
            a, text{
                ${({ theme }) =>
                  theme.rtl ? "margin-left" : "margin-right"}: 10px;
                @media only screen and (max-width: 1399px){
                    margin-bottom: 12px;
                }
            }
            .btn-icon{
                height: 44px;
                padding: 0 13px;
                box-shadow: 0 5px 15px ${({ theme }) => theme["light-color"]}15;
                &:hover{
                    background: transparent;
                }
                i{
                    color: #707070;
                }
            }
        }
        .pdbr__socials{
            margin: 0px 0 0 5px;
            a, text{
                color: #666666;
                &:not(:last-child){
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 12px;
                }
                span{
                    font-size: 14px;
                    color: #666666;
                }
            }
        }
    }

    .pdbr__list{
        &:not(:last-child){
            margin-bottom: 10px;
        }
        li{
            span{
                &:first-child{
                    display: inline-block;
                    min-width: 66px;
                    font-weight: 500;
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 25px;
                    color: ${({ theme }) => theme["dark-color"]};
                }
            }
            span + span{
                color: ${({ theme }) => theme["gray-color"]};
            }
        }
    }
    .btn-cart span {
        ${({ theme }) => (!theme.rtl ? "margin-left" : "margin-right")}: 6px;
    }
`;

const ProductTable = Styled.div`
    .table-cart{
        .ant-table-content{
            padding-bottom: 10px;
        }
        .ant-table-tbody{
            .cart-single{
                figure{
                    align-items: center;
                    margin-bottom: 0;
                    img, video, .produsul-ales{
                        max-width: 80px;
                        min-height: 80px;
                        border-radius: 10px;
                        ${({ theme }) =>
                          theme.rtl ? "margin-left" : "margin-right"}: 25px;
                    }
                }
                .cart-single__info{
                    h1,
                    h2,
                    h3,
                    h4,
                    h5,
                    h6{
                        font-size: 15px;
                        font-weight: 500;
                    }
                    p{
                        margin-bottom: 0;
                    }
                }
            }
            .ant-table-row{
                &:hover{
                    box-shadow: 0 10px 15px ${({ theme }) =>
                      theme["light-color"]}15;
                    td{
                        background: #fff !important;
                    }

                }
            }
        }
    }
    .table-invoice{
        .ant-table table {
            text-align: ${({ theme }) => (theme.rtl ? "right" : "left")}
        }
        table{
            thead{
                >tr{
                    th{
                        border-top: 1px solid ${({ theme }) =>
                          theme["border-color-light"]};
                        border-bottom: 1px solid ${({ theme }) =>
                          theme["border-color-light"]};
                        &:first-child{
                            ${({ theme }) =>
                              !theme.rtl
                                ? "border-left"
                                : "border-right"}: 1px solid ${({ theme }) =>
  theme["border-color-light"]};
                        }
                        &:last-child{
                            ${({ theme }) =>
                              theme.rtl
                                ? "border-left"
                                : "border-right"}: 1px solid ${({ theme }) =>
  theme["border-color-light"]};
                            text-align: ${({ theme }) =>
                              theme.rtl ? "left" : "right"};
                        }
                    }
                }
            }
            tbody{
                >tr{
                    &.ant-table-row{
                        &:hover{
                            >td{
                                background: #fff;
                            }
                        }
                    }
                    td{
                        border-bottom: 1px solid ${({ theme }) =>
                          theme["border-color-light"]};
                        color: ${({ theme }) => theme["gray-color"]};
                        border-radius: 0 !important;
                        
                        @media print {
                            padding: 6px 16px;
                        }
                        &:last-child{
                            text-align: ${({ theme }) =>
                              theme.rtl ? "left" : "right"};
                        }
                        .product-info-title{
                            font-size: 15px;
                            font-weight: 500;
                            color: ${({ theme }) => theme["dark-color"]};
                        }
                        .product-unit{
                            ${({ theme }) =>
                              !theme.rtl
                                ? "padding-left"
                                : "padding-right"}: 40px;
                        }
                        .product-quantity{
                            ${({ theme }) =>
                              !theme.rtl
                                ? "padding-left"
                                : "padding-right"}: 50px;
                        }
                    }
                }
            }
        }
        .product-info{
            min-width: 300px;
            @media print {
                min-width: 200px;
            }
            .product-info{
                margin-bottom: 8px;
            }
        }
    }
    table{
        thead{
            tr{
                border-radius: 10px;
                th{
                    border-bottom: 0 none;
                    background:  ${({ theme }) => theme["bg-color-light"]};
                    &:first-child{
                    border-radius: ${({ theme }) =>
                      theme.rtl ? "0 10px 10px 0" : "10px 0 0 10px"} !important;
                    }
                    &:last-child{
                        border-radius: ${({ theme }) =>
                          !theme.rtl
                            ? "0 10px 10px 0"
                            : "10px 0 0 10px"} !important;
                    }
                }
            }
        }
        tbody{
            tr{
                border-radius: 10px;
                td{
                    border-bottom: 0 none;
                    &:first-child{
                        border-radius: ${({ theme }) =>
                          theme.rtl ? "0 10px 10px 0" : "10px 0 0 10px"};
                    }
                    &:last-child{
                        border-radius: ${({ theme }) =>
                          !theme.rtl
                            ? "0 10px 10px 0"
                            : "10px 0 0 10px"} !important;
                    }
                }
            }
        }

        .info-list{
            li{
                display: inline-block;
                &:not(:last-child){
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 20px;
                }
                span{
                    font-size: 14px;
                    color: ${({ theme }) => theme["gray-color"]};
                    &.info-title{
                        ${({ theme }) =>
                          theme.rtl ? "margin-left" : "margin-right"}: 5px;
                        font-weight: 500;
                        color: ${({ theme }) => theme["dark-color"]};
                    }
                }
            }
        }
        .cart-single-price{
            font-size: 15px;
            color: ${({ theme }) => theme["gray-color"]};
        }
        .cart-single-t-price{
            font-size: 15px;
            font-weight: 500;
            color: ${({ theme }) => theme["primary-color"]};
            display: inline-block;
            min-width: 80px;
        }
        .cart-single-quantity{
            button{
                background-color: ${({ theme }) => theme["bg-color-normal"]};
                i,
                img,
                svg, .produsul-ales{
                    min-width: 12px;
                    height: 12px;
                }
                &.btn-inc,
                &.btn-dec{
                    width: 36px;
                    height: 36px;
                }
                &.btn-inc{
                    ${({ theme }) =>
                      !theme.rtl ? "margin-left" : "margin-right"}: 16px;
                    @media only screen and (max-width: 575px){
                        ${({ theme }) =>
                          !theme.rtl ? "margin-left" : "margin-right"}: 10px;
                    }
                }
                &.btn-dec{
                    ${({ theme }) =>
                      theme.rtl ? "margin-left" : "margin-right"}: 16px;
                    @media only screen and (max-width: 575px){
                        ${({ theme }) =>
                          theme.rtl ? "margin-left" : "margin-right"}: 10px;
                    }
                }
            }
        }
        .table-action{
            text-align: ${({ theme }) => (theme.rtl ? "left" : "right")};
            button{
                padding: 0 11px;
                height: 38px;
                background: #fff;
                i,
                svg{
                    color: #707070;
                }
            }
            button:hover{
           

                            i,
                            svg{
                                color: ${({ theme }) => theme["danger-color"]};
                            }
                        
            }
        }
    }
`;

const CouponForm = Styled.div`
    margin: 10px 0 20px 0;
    .coupon-form-input{
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 10px;
        input::placeholder{
            color: ${({ theme }) => theme["light-color"]};
        }
    }
    #submitCoupon{
        >.ant-row{
            align-items: center;
        }
        .ant-form-item{
            margin-bottom: 0;
        }
        .ant-form-item-control-input-content{
            
            input, .ant-select{

                max-width: 180px;
                ${({ theme }) =>
                  !theme.rtl ? "padding-left" : "padding-right"}: 20px;
                height: 44px;
                background:  ${({ theme }) => theme["bg-color-light"]};
                border-color:  ${({ theme }) => theme["border-color-light"]};
                @media only screen and (max-width: 991px){
                    max-width: 100%;
                }
                @media only screen and (max-width: 575px){
                    max-width: 200px;
                    margin-bottom: 15px;
                }
            }
        }
        button{
            border-radius: 5px;
            height: 44px;
            box-shadow: 0 3px 5px ${({ theme }) => theme["success-color"]}15;
        }
    }
`;

const AddProductForm = Styled.div`
    margin-top: 28px;

    @media only screen and (max-width: 575px){
        margin-top: 15px;
    }
    .ant-select-selection-item{

        display:flex;
        align-items:center;
    }

    .ant-form-item-explain-error {
        margin-bottom:24px;
    }
    .ant-select-arrow{
        ${({ theme }) => (theme.rtl ? "left" : "right")}: 11px;
    }
    
    .ant-table table {
        text-align: ${({ theme }) => (theme.rtl ? "left" : "right")};
    }
    .add-product-block{
        background: ${({ theme }) => theme["bg-color-light"]};
        border-radius: 20px;

        border: 1px solid ${({ theme }) => theme["bg-color-light"]};

        &:not(:last-child){
            margin-bottom: 30px;
        }
        .ant-card{
            margin-bottom: 0 !important;
            border-radius: 20px;
        }
        .add-product-content{
            box-shadow: 0 10px 30px ${({ theme }) => theme["light-color"]}10;
            border-radius: 20px;
            .ant-card-head{
                padding: 0 40px !important;
                border-radius: ${({ theme }) =>
                  theme.rtl ? "20px 0 0 20px" : "20px 20px 0 0"};
                @media only screen and (max-width: 575px){
                    padding: 0 15px !important;
                }
            }
            .ant-card-head-title{
                padding: 26px 0 25px;
            }
            .ant-card-body{
                padding: 26px 40px 40px !important;
                @media only screen and (max-width: 575px){
                    padding: 20px !important;
                }
            }
        }
        .ant-upload{
            border-spacing: 6px;
            border-width: 2px;
            border-radius: 10px;
            background: ${({ theme }) => theme["bg-color-light"]};
            border-color: ${({ theme }) => theme["border-color-deep"]};
            padding: 50px;
            @media only screen and (max-width: 575px){
                padding: 15px !important;
            }
            .ant-upload-drag-icon{
                i,
                svg{
                    color: ${({ theme }) => theme["extra-light-color"]};
                }
            }
            .ant-upload-text{
                font-weight: 500;
                margin-bottom: 8px;
            }
            .ant-upload-hint{
                font-size: 15px;
                font-weight: 500;
                color: ${({ theme }) => theme["gray-color"]};
                span{
                    color: ${({ theme }) => theme["secondary-color"]};
                }
            }
        }
        .ant-upload-list-item{
            height: 100%;
            padding: 0;
            border: 0 none;
            margin-top: 25px;
        }
        .ant-upload-list-item-info{
            height: 100%;
            >span{
                display: flex;
                align-items: center;
            }
            .ant-upload-list-item-name{
                padding: 0 10px;
                font-weight: 500;
                color: ${({ theme }) => theme["dark-color"]};
                &:hover{
                    color: ${({ theme }) => theme["primary-color"]};
                }
            }
            .ant-upload-list-item-card-actions{
                position: relative;
                top: 0;
                i,
                svg{
                    width: 15px;
                    color: ${({ theme }) => theme["danger-color"]};
                }
            }
            .ant-upload-list-item-thumbnail{
                display:flex;
                align-items:center;
                justify-content:center;
                position: relative;
                top: 0;
                min-width: 100px;
                width: auto;
                height: 100%;
                img, .produsul-ales{
                    max-width: 100px;
                    width: 100%;
                    height: 100%;
                    border-radius: 6px;
                }
            }
        }
    }
    .add-form-action{
        text-align: ${({ theme }) => (theme.rtl ? "left" : "right")};
        margin-top: 40px;
        .ant-form-item-control-input{
            button{
                height: 50px;
                padding: 0 22.82px;
            }
        }
        button{
            font-size: 15px;
            font-weight: 400;
            height: 50px;
        }
        .btn-cancel{
            border: 1px solid ${({ theme }) => theme["border-color-light"]};
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 20px;
            background: ${({ theme }) => theme["bg-color-light"]};
        }
    }
`;

export {
  FigureCart,
  Sidebar,
  NotFoundWrapper,
  SidebarSingle,
  ProductCard,
  TopToolBox,
  PaginationWrapper,
  ProductDetailsWrapper,
  ProductTable,
  CouponForm,
  AddProductForm,
};
