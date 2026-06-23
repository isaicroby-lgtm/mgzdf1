"use client";

import React, { createRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import styled from "styled-components";
import { Divider, Rate } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { isProductOutOfStock } from "@/api/stock";
import { encodeURL } from "@/utility/urlFormatting";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import theme from "@/components/atoms/theme";
import Button from "@/components/atoms/Button";
import { favoritesUpdate } from "@/redux/favorites/actionCreator";
import { cartAdd } from "@/redux/cart/actionCreator";

import GridOfProducts from "../products/grid-of-products";


const AddToCartButton = ({
  handleAddInCart,
  isProductOutOfStoc,
  isLoadingArtificial,
  theme,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = isProductOutOfStoc || isLoadingArtificial;

  const buttonStyle = {
   width: "200px", // ✅ redus ca să nu se suprapună cu inima
    minHeight: "38px",
    display: "flex",
    alignItems: "stretch",
    border: "none",
    borderRadius: "12px",
    background: isHovered
      ? `linear-gradient(to right, ${theme["secondary-color"]}, ${theme["primary-color"]})`
      : theme["primary-color"],
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    padding: 0,
    overflow: "hidden",
    transition: "all 0.3s ease",
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered
      ? "0 4px 12px rgba(0, 0, 0, 0.15)"
      : "0 2px 6px rgba(0, 0, 0, 0.05)",
  };

  const iconStyle = {
    backgroundColor: theme["secondary-color"],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
    borderTopRightRadius: "30px",
    borderBottomRightRadius: "30px",
    flexShrink: 0,
  };

  const textStyle = {
    flex: 1,
    padding: "7px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    wordBreak: "break-word",
    lineHeight: "1.2",
  };

  const handleClick = () => {
    if (!isDisabled) {
      handleAddInCart();
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
      disabled={isDisabled}
    >
      <span style={iconStyle}>
        {isLoadingArtificial ? (
          <span
            style={{
              width: 13,
              height: 13,
              border: "2px solid #fff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        ) : (
          <FeatherIcon icon="shopping-cart" size={13} color="#fff" />
        )}
      </span>
      <span style={textStyle}>
        {isProductOutOfStoc
          ? "Stoc epuizat"
          : isLoadingArtificial
          ? "Se adaugă..."
          : "Adaugă în coș"}
      </span>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

const HomeWrapper = styled.div`
z-index: 999;
  width: 100%;
  position: relative;
  height: fit-content;
  padding: 0 10%;
  margin-top: 24px;

  @media only screen and (max-width: 750px) {
    padding: 0 4%;
    margin-top: -120px;
  }
`;

const WrapperProduct = styled.div`
  padding: 0 20%;
  margin-bottom: 128px;

  @media only screen and (max-width: 750px) {
    padding: 0;
  }
`;

const WrapperIndProduct = styled.div`
  border: 1px solid #fff;
  box-shadow: 0px 0px 4px 0px #48acf0;

  display: grid;
  grid-template-columns: 1fr 1fr;

  position: relative;

  padding: 4%;
  gap: 4%;
  column-gap: 8%;

  height: fit-content;

  place-items: center;

  overflow: hidden;

  .product-single-price {
    margin-top: 5px;
    margin-bottom: 5px;
    del {
      margin: 0 5px;
    }
  }
  .product-single-price__new {
    font-weight: 700;
    color: ${({ theme }) => theme["secondary-color"]};
  }

  .product-single-price__offer {
    color: ${({ theme }) => theme["secondary-color"]};
    font-weight: 500;
    font-size: 16px;
  }

  .product-single-rating {
    font-size: 12px;
    font-weight: 500;
    .ant-rate {
      ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 5px;
    }

    .ant-rate-star:not(:last-child) {
      margin-left: 2px !important;
    }
    .total-reviews {
      font-weight: 400;
      ${({ theme }) => (!theme.rtl ? "margin-left" : "margin-right")}: 6px;
      color: ${({ theme }) => theme["light-color"]};
    }
  }

  .ind-product {
    display: flex;
    flex-direction: column;

    justify-self: flex-start;

    max-width: 100%;
  }

  .button-group {
    margin-top: 4%;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    gap: 10px;

    @media only screen and (max-width: 750px) {
      align-items: flex-start;
      flex-direction: column;
      gap: 0;

      button {
        margin: 6px 0 !important;
      }
    }
  }

  @media only screen and (max-width: 1200px) {
    grid-template-rows: 1fr 0.5fr;
    grid-template-columns: 1fr;
    height: fit-content;
  }

  @media only screen and (max-width: 750px) {
    grid-template-rows: 1fr 0.7fr;
    padding: 5% 4% !important;
  }

  @media only screen and (max-width: 480px) {
    grid-template-rows: 1fr 1fr;
  }

  .btn-heart {
    z-index: 1;

    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;

    right: 24px;

    background-color: #fff;
    border-radius: 50%;

    box-shadow: 0 0px 10px ${({ theme }) => theme["border-color-normal"]};
    transition: all 300ms ease-in-out;
  }

  .btn-heart {
    color: ${({ theme }) => theme["secondary-color"]};
  }

  .btn-heart-favorite path {
    fill: ${({ theme }) => theme["secondary-color"]};
  }

  .btn-heart-favorite:hover path {
    fill: white;
  }

  .btn-heart:hover {
    background-color: ${({ theme }) => theme["secondary-color"]};
    color: white !important;
  }
`;

const HomeProductsSection = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isProductOutOfStoc, setIsProductOutOfStoc] = useState();
  const [isLoadingArtificial, setIsLoadingArtificial] = useState();

  const popularProductRef = createRef();

  const { mostPopularProduct, favorite } = useSelector((state) => {
    const mostPopularProduct = state.products?.productMostPopular;
    const id = mostPopularProduct?.id;

    return {
      mostPopularProduct: mostPopularProduct,
      favorite: !!state.favorites.products?.find((prod) => prod.id === id),
    };
  });

  useEffect(() => {
    if (searchParams.get("popular") !== null && mostPopularProduct) {
      popularProductRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchParams, mostPopularProduct]);

  const handleAddMostPopularInCart = () => {
    setIsLoadingArtificial(true);

    dispatch(cartAdd({ ...mostPopularProduct }));

    setTimeout(() => {
      setIsLoadingArtificial(false);
    }, 500);
  };

  const handleOpenMostPopularProduct = () => {
    const currentUrl = location.pathname;
    const enc = encodeURL(mostPopularProduct.name);
    if (!currentUrl.includes("admin")) router.push(`/magazin/${enc}`);
    else if (currentUrl.includes("admin")) router.push(`/admin/produse/${enc}`);
  };

  const reviews =
    mostPopularProduct?.reviews?.filter((x) => x.status === "accepted") || [];

  const rate =
    (
      reviews?.reduce((acc, value) => {
        return acc + value?.rate;
      }, 0) / reviews.length
    )?.toFixed(2) || 0;

  useEffect(() => {
    const fetch = async () => {
      const r = await isProductOutOfStock(mostPopularProduct.id);
      setIsProductOutOfStoc(r);
    };
    if (mostPopularProduct?.id) fetch();
  }, [mostPopularProduct]);

  return (
    <>
      <HomeWrapper>
        <Divider>
          <span ref={popularProductRef} />
          <Heading
            as="h5"
            style={{ color: "#48ACF0", whiteSpace: "nowrap", margin: 0 }}
          >
            Cel mai popular produs
          </Heading>
          <span />
        </Divider>
        <WrapperProduct theme={theme}>
          {mostPopularProduct && (
            <WrapperIndProduct theme={theme}>
              {isProductOutOfStoc && (
                <Text
                  as="p5"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    borderRadius: 4,
                    backgroundColor: "white",
                    boxShadow: `0 0 8px ${theme["border-color-base"]}`,
                    padding: "12px 16px",
                    zIndex: 1,
                  }}
                >
                  Stoc epuizat
                </Text>
              )}

              <figure
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Image
                  fill
                  unoptimized={true}
                  onContextMenu={(event) => event.preventDefault()}
                  onClick={() => handleOpenMostPopularProduct()}
                  src={mostPopularProduct?.fileDownloadURL}
                  style={{
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                  alt=""
                />
              </figure>
              <div className="ind-product">
                <Heading
                  as="h3"
                  onClick={() => handleOpenMostPopularProduct()}
                  style={{ cursor: "pointer", marginBottom: 8 }}
                >
                  {mostPopularProduct.name}
                </Heading>

                {!isProductOutOfStoc ? (
                  <Text
                    as="p6"
                    style={{
                      fontWeight: 500,
                      color: theme["nav-green"],
                      marginBottom: 8,
                    }}
                  >
                    ✦ In stoc
                  </Text>
                ) : (
                  <Text
                    as="p6"
                    style={{
                      fontWeight: 500,
                      color: theme["secondary-color"],
                      marginBottom: 8,
                    }}
                  >
                    ✦ Stoc epuizat
                  </Text>
                )}
                <div className="product-single-rating">
                  <Rate allowHalf value={rate} disabled />
                  {typeof rate === "number" && rate > 0 && (
                    <span> {rate} </span>
                  )}

                  <span className="total-reviews">
                    {reviews.length}{" "}
                    {reviews.length == 1 ? "Recenzie" : "Recenzii"}
                  </span>
                </div>
                <Text
                  as="p1"
                  className="product-single-price"
                  style={{ marginTop: 12 }}
                >
                  <span className="product-single-price__new">
                    {mostPopularProduct?.price} RON
                  </span>
                  {mostPopularProduct?.oldPrice && (
                    <>
                      <del className="product-single-price__old">
                        {" "}
                        {mostPopularProduct?.oldPrice} RON
                      </del>
                      <span className="product-single-price__offer">
                        {Math.floor(
                          100 -
                            (mostPopularProduct?.price * 100) /
                              mostPopularProduct?.oldPrice
                        )}
                        % reducere
                      </span>
                    </>
                  )}
                </Text>

                <div className="button-group">
                
                     <AddToCartButton
                              handleAddInCart={handleAddMostPopularInCart}
                              isProductOutOfStoc={isProductOutOfStoc}
                              isLoadingArtificial={isLoadingArtificial}
                              theme={{
                                "primary-color": "#2699FB", // albastru
                                "secondary-color": "#F03E2F", // roșu
                              }}
                            />

                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      dispatch(favoritesUpdate({ ...mostPopularProduct }))
                    }
                    className={
                      favorite
                        ? "btn-heart" + " btn-heart-favorite"
                        : "btn-heart"
                    }
                  >
                    <FeatherIcon icon="heart" size={18} />
                  </div>
                </div>
              </div>
            </WrapperIndProduct>
          )}
        </WrapperProduct>

        <Divider>
          <span />
          <Heading
            as="h5"
            style={{ color: "#48ACF0", whiteSpace: "nowrap", margin: 0 }}
          >
            Mai multe produse
          </Heading>
          <span />
        </Divider>

        <GridOfProducts isOnHomePage={true} />
      </HomeWrapper>
    </>
  );
};

export default HomeProductsSection;
