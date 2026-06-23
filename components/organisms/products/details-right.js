import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";
import "dayjs/locale/ro";
import Image from "next/image";
import Link from "next/link";
import { Form, Input, InputNumber, Rate, Row } from "antd";
import FeatherIcon from "feather-icons-react";
import parse from "html-react-parser";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import { QuickOrderButton } from "@/components/organisms/products/quick-order-modal"
import { isProductOutOfStock } from "@/api/stock";
import {
  addReviewProduct,
  deleteProductFirestore,
  fetchProductDescription,
} from "@/api/products";
import { cartAdd } from "@/redux/cart/actionCreator";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import theme from "@/components/atoms/theme";
import WhatsappIcon from "@/static/img/IconWhatsapp.svg";

import Modal from "@/components/atoms/Modal";
import ContactForm from "@/components/atoms/Forms/contact-form";
import { favoritesUpdate } from "@/redux/favorites/actionCreator";

import { YoutubeEmbed } from "./individual-product";
import ViewStaticPage from "../static-pages/view-static-page";
import { getStaticPage } from "@/api/static-pages";
import { useRouter } from "next/navigation";

const AddToCartButton = ({
  handleAddInCart,
  isProductOutOfStoc,
  isLoadingArtificial,
  theme,
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = isProductOutOfStoc || isLoadingArtificial;

  const buttonStyle = {
    width: compact ? "160px" : "255px",
    minHeight: compact ? "36px" : "43px",
    display: "flex",
    alignItems: "stretch",
    border: "none",
    borderRadius: "8px",
    background: isHovered
      ? `linear-gradient(to right, ${theme["secondary-color"]}, ${theme["primary-color"]})`
      : theme["primary-color"],
    color: "#fff",
    fontSize: compact ? "13px" : "14px",
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
      ? "0 4px 8px rgba(0, 0, 0, 0.15)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const iconStyle = {
    backgroundColor: theme["secondary-color"],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
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

const BottomAddInCart = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  z-index: 1100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-top: 1px solid ${theme["border-color-light"]};
  gap: 12px;

  .price-stack {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .original-price {
    color: ${theme["gray-color"]};
    text-decoration: line-through;
    font-size: 14px;
    white-space: nowrap;
    line-height: 1.2;
  }

  .savings-text {
    color: #f03e2f;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    line-height: 1.2;
  }

  .actions-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }

  @media (max-width: 350px) {
    min-height: 64px;
    padding: 4px 8px;

    .original-price {
      font-size: 13px;
    }

    .savings-text {
      font-size: 14px;
    }

    .actions-wrapper {
      gap: 6px;
    }
  }
`;

const ProductDetailsContainer = styled.div`
  .product-title {
    font-size: 24px;
    margin-bottom: 12px;
    font-weight: 700;
  }

  .product-price {
    font-size: 28px;
    margin: 12px 0;
    color: ${theme["secondary-color"]};
    font-weight: 700;
  }

  .old-price {
    font-size: 18px;
    color: ${theme["gray-color"]};
    text-decoration: line-through;
    margin-left: 8px;
  }

  .discount-badge {
    color: ${theme["secondary-color"]};
    font-weight: 500;
    margin-left: 8px;
  }

  @media (max-width: 750px) {
    .product-title {
      font-size: 20px;
      margin-bottom: 8px;
    }

    .product-price {
      font-size: 22px;
      margin: 8px 0;
    }

    .old-price {
      font-size: 16px;
    }
  }
`;

const NewDetailFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;

  .new-detail-footer-container {
    background-color: ${theme["primary-color"]};
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;

    border-radius: 4px;
    cursor: pointer;
  }
`;

const IndReviewContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid;
  border-radius: 6px;
  padding: 16px;

  border-color: ${theme["border-color-normal"]};

  @media only screen and (max-width: 750px) {
    flex-direction: column-reverse !important;
  }
`;

const SuplimentareTableRow = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 6px;
  margin-bottom: 14px;
  border-bottom: 1px solid;
  border-color: ${theme["border-color-normal"]};

  text-transform: capitalize;
`;

const ContainerTabInfo = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  * {
    color: rgb(90, 95, 125);
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
`;

export const dateDisplay = () => {
  dayjs.locale("ro");

  const today = dayjs();

  let twoDaysFromNow = today.add(1, "day");

  let threeDaysFromNow = today.add(2, "day");

  if (twoDaysFromNow.day() === 0) {
    twoDaysFromNow = twoDaysFromNow.add(1, "day");
    threeDaysFromNow = threeDaysFromNow.add(1, "day");
  } else if (twoDaysFromNow.day() === 6) {
    twoDaysFromNow = twoDaysFromNow.add(2, "day");
    threeDaysFromNow = threeDaysFromNow.add(2, "day");
  }

  const formattedTwoDaysFromNow = twoDaysFromNow.format("DD");
  const formattedThreeDaysFromNow = threeDaysFromNow.format("DD");

  const formattedMonth = twoDaysFromNow.format("MMM");

  return (
    <>
      {formattedTwoDaysFromNow}-{formattedThreeDaysFromNow}, {formattedMonth}{" "}
      {today.year()}
    </>
  );
};

function DetailsRight({ product, variantProducts, handleOpenProduct }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formAddRecenzie] = useForm();

  const [activeId, setActiveId] = useState(-1);
  const [quantity, setQuantity] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState();

  const [preFetchedPages, setPreFetchedPages] = useState([]);

  const [scrollToActiveId, setScrollToActiveId] = useState(false);
  const [showBottomAddInCart, setShowBottomAddInCart] = useState();

  const [isLoadingArtificial, setIsLoadingArtificial] = useState();
  const [visibleAddReview, setVisibleAddReview] = useState(false);

  const [visibleContact, setVisibleContact] = useState(false);
  const [isProductOutOfStoc, setIsProductOutOfStoc] = useState();

  const [dontShowBottom, setDontShowBottom] = useState();

  const [desc, setDesc] = useState("");

  const { isAdmin } = useSelector((state) => {
    return {
      isAdmin: state.userInfo.isAdmin,
    };
  });

  const { name, price, oldPrice, favorite, id, greenTax } = product;

  const reviews =
    product?.reviews?.filter((rev) => rev.status === "accepted") || [];
  const rate =
    (
      reviews?.reduce((acc, value) => {
        return acc + value?.rate;
      }, 0) / reviews.length
    )?.toFixed(1) || 0;

  const handleAddInCart = async () => {
    setIsLoadingArtificial(true);

    for (let i = 1; i <= quantity; i++) {
      const productToAdd = { ...product, quantity };
      dispatch(cartAdd(productToAdd));
    }

    setTimeout(() => {
      setIsLoadingArtificial(false);
    }, 500);
  };

  const handleSubmitRecenzie = async () => {
    setVisibleAddReview(false);

    try {
      const values = formAddRecenzie.getFieldsValue();
      await addReviewProduct({ id, values, reviews });

      formAddRecenzie.resetFields();

      alert(
        "Iti multumim pentru recenzia ta! Aceasta va aparea cat de curand, imediat ce un moderator o va aproba."
      );
    } catch (error) {
      console.log(error);
      alert("Ne pare rau, dar a aparut o eroare");
    }
  };

  const handleScroll = () => {
    // Selector mai robust care găsește primul buton din containerul de acțiuni
    const element = document.querySelector(".pdbr__product-action > button");

    if (element) {
      const rect = element.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      setShowBottomAddInCart(!isVisible);
    }
  };
  useEffect(() => {
    console.log(
      "Toate butoanele în pagină:",
      document.querySelectorAll("button")
    );
    console.log(
      "Structura pdbr__product-action:",
      document.querySelector(".pdbr__product-action")?.outerHTML
    );
  }, []);
  useEffect(() => {
    if (activeId === 2 && scrollToActiveId) {
      const reviewsElement = document.getElementById("recenzii-element");

      if (reviewsElement) {
        reviewsElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setScrollToActiveId(false);
      }
    } else if (activeId === 1 && !preFetchedPages[1]) {
      const preFetchPage = async () => {
        const _page = await getStaticPage(
          "pagina-de-produs---sub-informatii-suplimentare"
        );

        if (!_page) return;
        setPreFetchedPages((prev) => {
          const prevCopy = [...prev];
          prevCopy[1] = { ..._page };
          return prevCopy;
        });
      };

      preFetchPage();
    } else if (activeId === 3 && !preFetchedPages[3]) {
      const preFetchPage = async () => {
        const _page = await getStaticPage(
          "pagina-de-produs---ambalare-si-livrare"
        );

        if (!_page) return;
        setPreFetchedPages((prev) => {
          const prevCopy = [...prev];
          prevCopy[3] = { ..._page };
          return prevCopy;
        });
      };

      preFetchPage();
    }
  }, [activeId, scrollToActiveId]);

  useEffect(() => {
    if (activeId !== -1) {
      const element = document.getElementById("descriere-element");

      element.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [activeId]);

  useEffect(() => {
    const fetchDesc = async () => {
      if (product?.id) {
        const _d = await fetchProductDescription(product?.id);
        setDesc(_d);
      }
    };
    fetchDesc();
  }, [product?.id]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const r = await isProductOutOfStock(id);
      setIsProductOutOfStoc(r);
    };
    if (id) fetch();
  }, [id]);

  return (
    <>
      <Modal
        visible={confirmDelete}
        onOk={async () => {
          await deleteProductFirestore(id);
          router.push("/admin/produse");
        }}
        onCancel={() => setConfirmDelete()}
        title="Esti sigur ca vrei sa stergi acest produs?"
      />
      <div className="product-details-box__right pdbr">
        <ProductDetailsContainer>
          <h1 className="product-title">{product.name}</h1>

          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
          >
            <Rate
              allowHalf
              value={rate}
              disabled
              style={{ marginRight: 8, fontSize: 16 }}
            />
            {rate > 0 && <span style={{ marginRight: 8 }}>{rate}</span>}
            <span style={{ color: theme["light-color"] }}>
              {reviews?.length}{" "}
              {reviews?.length === 1 ? "Recenzie" : "Recenzii"}
            </span>
          </div>

          <div className="product-price">
            {product.price} RON
            {product.oldPrice && (
              <>
                <span className="old-price">{product.oldPrice} RON</span>
                <span className="discount-badge">
                  {Math.floor(100 - (product.price * 100) / product.oldPrice)}%
                  reducere
                </span>
              </>
            )}
          </div>

          <div style={{ margin: "12px 0" }}>
            {!isProductOutOfStoc ? (
              <Text
                as="p5"
                style={{ color: theme["nav-green"], fontWeight: 500 }}
              >
                ✦ In stoc
              </Text>
            ) : (
              <Text
                as="p5"
                style={{ color: theme["secondary-color"], fontWeight: 500 }}
              >
                ✦ Stoc epuizat
              </Text>
            )}
          </div>

          {!isProductOutOfStoc && (
            <Text
              as="p5"
              style={{ color: theme["gray-color"], marginBottom: 16 }}
            >
              🚗 Livrare estimată: {dateDisplay()}
            </Text>
          )}

          {product.greenTax && (
            <Text
              as="p5"
              style={{ color: theme["success-color"], marginBottom: 16 }}
            >
              ♻️ Prețul include și taxa timbru verde = {product.greenTax} RON
            </Text>
          )}
        </ProductDetailsContainer>
        <div
          className="pdbr__Actions align-items-center"
          style={{ marginTop: 24 }}
        >
          {isAdmin && location?.pathname.includes("admin") ? (
            <div
              className="admin-btn-container"
              style={{
                marginBottom: 8,
                gap: 8,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <Link className="btn-edit" href={`/admin/produse-adauga/${id}`}>
                <Button type="primary">
                  <FeatherIcon icon="edit" size={14} />
                </Button>
              </Link>
              <Button
                type="secondary"
                onClick={() => {
                  setConfirmDelete(true);
                }}
              >
                <FeatherIcon icon="trash" size={14} />
              </Button>
            </div>
          ) : null}
         <div className="pdbr__product-action">
  <AddToCartButton
    handleAddInCart={handleAddInCart}
    isProductOutOfStoc={isProductOutOfStoc}
    isLoadingArtificial={isLoadingArtificial}
    theme={{
      "primary-color": "#2699FB",
      "secondary-color": "#F03E2F",
    }}
  />

  <QuickOrderButton
    product={product}
    isProductOutOfStock={isProductOutOfStoc}
  />

  <div
    style={{ cursor: "pointer" }}
    onClick={() => dispatch(favoritesUpdate({ ...product }))}
    className={
      favorite ? "btn-heart" + " btn-heart-favorite" : "btn-heart"
    }
  >
    <FeatherIcon icon="heart" size={16} />
  </div>
</div>
        </div>

        {variantProducts?.length ? (
          <>
            <Heading as="h5" style={{ marginBottom: 10 }}>
              Alege modelul:{" "}
            </Heading>
            <div
              style={{
                display: "flex",
                gap: 12,
                overflowX: "auto",
                whiteSpace: "nowrap",
                paddingBottom: 8,
              }}
            >
              {variantProducts?.map((productVariant) => {
                if (productVariant.image)
                  return (
                    <div
                      key={productVariant.name}
                      onClick={() => handleOpenProduct(productVariant.name)}
                      style={{
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: theme["light-gray-color"],
                        borderRadius: 8,
                        padding: 8,
                        cursor: "pointer",
                        background: product.stock
                          ? "white"
                          : theme["light-gray-color"],
                        transform:
                          product.name === productVariant.name
                            ? "scale(1.1)"
                            : "none",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={productVariant.image}
                        alt=""
                        width={74}
                        height={74}
                      />
                    </div>
                  );
                else return null;
              })}
            </div>
          </>
        ) : null}

        <div className="pdbr__current-status">
          <p>
            <span className="current-status-title">Categorie:</span>
            <span
              className="stock-status"
              style={{ textTransform: "capitalize" }}
            >
              {product.category}
            </span>
          </p>

          <p>
            <span className="current-status-title">Cod produs:</span>
            <span>{product.code}</span>
          </p>
          <p>
            <span className="current-status-title">Distribuie:</span>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <FeatherIcon
                icon="mail"
                size={16}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const emailSubject = "Recomandare produs";
                  const emailBody = "Salut! Îți recomand acest produs: ";
                  const mailToLink = `mailto:?subject=${encodeURIComponent(
                    emailSubject
                  )}&body=${encodeURIComponent(
                    emailBody + window.location.href
                  )}`;
                  window.location.href = mailToLink;
                }}
              />
              <FeatherIcon
                icon="facebook"
                style={{ cursor: "pointer" }}
                size={16}
                onClick={() => {
                  const baseUrl = `https://doifrati.ro${window.location.pathname}`;

                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${baseUrl}`,
                    "_blank"
                  );
                }}
              />
              <Image
                width={20}
                height={20}
                style={{ cursor: "pointer" }}
                src={WhatsappIcon}
                alt="whatsapp icon"
                onClick={() => {
                  const productMessage = "Vă recomand acest produs: ";
                  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    productMessage + window.location.href
                  )}`;
                  window.open(whatsappUrl, "_blank");
                }}
              />
            </span>
          </p>
        </div>
        <div style={{ marginTop: 32, marginBottom: 4 }}>
          <Text
            as="p5"
            style={{
              marginRight: 24,
              display: "inline-block",
              color: "rgb(39, 43, 65)",
              fontWeight: 500,
            }}
          >
            Nr. bucati:
          </Text>

          <InputNumber
            size="small"
            value={quantity}
            onChange={(value) => {
              if (value > 0) setQuantity(value);
            }}
          />
        </div>
        <Text as="p5" style={{ color: "rgb(39, 43, 65)", fontWeight: 500 }}>
          Ai vreo întrebare legată de acest produs?{" "}
          <span
            style={{
              color: theme["secondary-color"],
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              setVisibleContact(true);
            }}
          >
            Apasă aici!
          </span>
        </Text>

        <Text
          as="p5"
          style={{
            color: "rgb(39, 43, 65)",
            marginTop: 8,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          <span>Detii sau ai utilizat acest produs?</span>{" "}
          <span
            style={{
              color: "#FA8B0C",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => setVisibleAddReview(true)}
          >
            Adauga o recenzie!
          </span>
        </Text>

        <div className="pdbr__Actions align-items-center"></div>

        <NewDetailFooter>
          <div>
            <div
              className="new-detail-footer-container"
              style={{ color: "white" }}
              id="descriere-element"
              onClick={() => {
                setActiveId((prev) => (prev === 0 ? -1 : 0));
              }}
            >
              <span
                style={{
                  width: "100%",

                  textAlign: "center",
                }}
              >
                Descriere / Informatii de siguranta
              </span>
              {activeId === 0 ? (
                <FeatherIcon icon="chevron-up" />
              ) : (
                <FeatherIcon icon="chevron-down" />
              )}
            </div>

            {activeId === 0 && (
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                {product.youtubeLink ? (
                  <YoutubeEmbed
                    embedId={product.youtubeLink}
                    style={{ marginBottom: 24 }}
                  />
                ) : null}

                {product.discount2 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      gap: 16,
                      marginBottom: 16,
                      padding: 16,
                      boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                    }}
                  >
                    <div>
                      <Text>
                        Cumpara 2 produse si primesti {product.discount2}%
                        REDUCERE
                      </Text>
                      <Text as="p5">
                        Reducerea va fi aplicata automat pe pagina de checkout.
                      </Text>
                    </div>
                    <Button
                      onClick={async () => {
                        await handleAddInCart();
                        await handleAddInCart();
                      }}
                      type="secondary"
                      outlined
                      style={{ width: "fit-content" }}
                    >
                      Adauga 2 produse in cos
                    </Button>
                  </div>
                ) : null}
                {product.discount3 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      gap: 16,
                      marginBottom: 32,
                      padding: 16,
                      boxShadow: `0 0 8px ${theme["border-color-light"]}`,
                    }}
                  >
                    <div>
                      <Text>
                        Cumpara 3 produse si primesti {product.discount3}%
                        REDUCERE
                      </Text>
                      <Text as="p5">
                        Reducerea va fi aplicata automat pe pagina de checkout.
                      </Text>
                    </div>

                    <Button
                      onClick={async () => {
                        await handleAddInCart();
                        await handleAddInCart();
                        await handleAddInCart();
                      }}
                      type="secondary"
                      outlined
                      style={{ width: "fit-content" }}
                    >
                      Adauga 3 produse in cos
                    </Button>
                  </div>
                ) : null}

                <ContainerTabInfo>{desc && parse(desc)}</ContainerTabInfo>
              </div>
            )}
          </div>
          <div>
            <div
              className="new-detail-footer-container"
              style={{ color: "white" }}
              onClick={() => setActiveId((prev) => (prev === 1 ? -1 : 1))}
            >
              <span
                style={{
                  width: "100%",

                  textAlign: "center",
                }}
              >
                Informatii Conformitate Produs
              </span>
              {activeId === 1 ? (
                <FeatherIcon icon="chevron-up" />
              ) : (
                <FeatherIcon icon="chevron-down" />
              )}
            </div>

            {activeId === 1 && (
              <ContainerTabInfo>
                <SuplimentareTableRow>
  <Text as="p5" style={{ fontWeight: 600 }}>
    Greutate
  </Text>
  <Text as="p5">{product.weight} grame</Text>
</SuplimentareTableRow>

<SuplimentareTableRow>
  <Text as="p5" style={{ fontWeight: 600 }}>
    Dimensiuni
  </Text>
  <div>
    <Text as="p5">Lungime: {product.lungime} cm</Text>
    <Text as="p5">Latime: {product.latime} cm</Text>
    <Text as="p5">Inaltime: {product.inaltime} cm</Text>
  </div>
</SuplimentareTableRow>

<SuplimentareTableRow>
  <Text as="p5" style={{ fontWeight: 600 }}>
    Varsta
  </Text>
  <Text as="p5">{product.age}</Text>
</SuplimentareTableRow>

<SuplimentareTableRow>
  <Text as="p5" style={{ fontWeight: 600 }}>
    Categorie
  </Text>
  <Text as="p5">{product.category}</Text>
</SuplimentareTableRow>

<SuplimentareTableRow>
  <Text as="p5" style={{ fontWeight: 600 }}>
    Pentru
  </Text>
  <Text as="p5">
    {product.gender === "unisex"
      ? "baieti si fete"
      : product.gender}
  </Text>
</SuplimentareTableRow>

{/* --- Secțiune Conformitate GPSR --- */}
{(product.gpsrRepresentativeName || product.gpsrManufacturerName || product.gpsrSafetyInfo) && (
  <>
    <SuplimentareTableRow>
      <Text as="p5" style={{ fontWeight: 600, color: '#1890ff' }}>
        Conformitate și Siguranță GPSR
      </Text>
      <div style={{ width: '100%' }} />
    </SuplimentareTableRow>

    {product.gpsrRepresentativeName && (
      <SuplimentareTableRow>
        <Text as="p5" style={{ fontWeight: 600 }}>
          Reprezentant UE
        </Text>
        <div>
          <Text as="p5">{product.gpsrRepresentativeName}</Text>
          {product.gpsrRepresentativeEmail && (
            <Text as="p5">Email: {product.gpsrRepresentativeEmail}</Text>
          )}
          {product.gpsrRepresentativeAddress && (
            <Text as="p5">Adresă: {product.gpsrRepresentativeAddress}</Text>
          )}
        </div>
      </SuplimentareTableRow>
    )}

    {product.gpsrManufacturerName && (
      <SuplimentareTableRow>
        <Text as="p5" style={{ fontWeight: 600 }}>
          Producător
        </Text>
        <div>
          <Text as="p5">{product.gpsrManufacturerName}</Text>
          {product.gpsrManufacturerEmail && (
            <Text as="p5">Email: {product.gpsrManufacturerEmail}</Text>
          )}
          {product.gpsrManufacturerAddress && (
            <Text as="p5">Adresă: {product.gpsrManufacturerAddress}</Text>
          )}
        </div>
      </SuplimentareTableRow>
    )}

    {product.gpsrSafetyInfo && (
      <SuplimentareTableRow>
        <Text as="p5" style={{ fontWeight: 600 }}>
          Informații Siguranță
        </Text>
        <Text as="p5" style={{ maxWidth: '400px', whiteSpace: 'pre-wrap' }}>
          {product.gpsrSafetyInfo}
        </Text>
      </SuplimentareTableRow>
    )}
  </>
)}

                <ViewStaticPage
                  title={"pagina-de-produs---sub-informatii-suplimentare"}
                  preFetchedPage={preFetchedPages[1]}
                />
              </ContainerTabInfo>
            )}
          </div>
          <div>
            <div
              style={{ color: "white" }}
              className="new-detail-footer-container"
              onClick={() => setActiveId((prev) => (prev === 2 ? -1 : 2))}
            >
              <span
                style={{
                  width: "100%",

                  textAlign: "center",
                }}
              >
                Recenzii
              </span>
              {activeId === 2 ? (
                <FeatherIcon icon="chevron-up" />
              ) : (
                <FeatherIcon icon="chevron-down" />
              )}{" "}
            </div>
            {activeId === 2 && (
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                  }}
                >
                  {!reviews?.length && (
                    <Text as="p5" style={{ color: "rgb(90, 95, 125)" }}>
                      Nu există recenzii până acum
                    </Text>
                  )}
                  <Button
                    type="primary"
                    outlined
                    onClick={() => setVisibleAddReview(true)}
                  >
                    {reviews?.length
                      ? "Adaugă o recenzie"
                      : "Fii primul care adaugă o recenzie"}
                  </Button>
                </div>
                <div
                  id="recenzii-element"
                  style={{
                    marginTop: reviews.length ? 16 : 0,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: 8,
                  }}
                >
                  {reviews?.map((review) => {
                    const displayDate =
                      review.review_timestamp &&
                      typeof review.review_timestamp.toDate === "function"
                        ? review.review_timestamp
                            .toDate()
                            .toLocaleString("ro-RO", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                        : "N/A";

                    return (
                      <IndReviewContainer key={review.name}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            maxWidth: "80%",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: theme["bg-color-normal"],
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FeatherIcon
                              icon="user"
                              style={{ stroke: theme["border-color-deep"] }}
                            />
                          </div>
                          <div>
                            <Text
                              as="p5"
                              style={{
                                color: "rgb(90, 95, 125)",
                                marginBottom: 4,
                              }}
                            >
                              {review.name}
                            </Text>
                            <Text as="p6" style={{ color: "rgb(90, 95, 125)" }}>
                              {review.desc}
                            </Text>
                            <Text
                              as="p6"
                              style={{
                                color: "rgb(90, 95, 125)",
                                fontSize: "0.8rem",
                                marginTop: 4,
                              }}
                            >
                              {displayDate}
                            </Text>
                          </div>
                        </div>
                        <Rate value={review.rate} disabled />
                      </IndReviewContainer>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div>
            <div
              style={{ color: "white" }}
              className="new-detail-footer-container"
              onClick={() => setActiveId((prev) => (prev === 3 ? -1 : 3))}
            >
              <span
                style={{
                  width: "100%",

                  textAlign: "center",
                }}
              >
                Ambalare & Livrare
              </span>
              {activeId === 3 ? (
                <FeatherIcon icon="chevron-up" />
              ) : (
                <FeatherIcon icon="chevron-down" />
              )}{" "}
            </div>
            {activeId === 3 && (
              <ContainerTabInfo>
                <ViewStaticPage
                  title={"pagina-de-produs---ambalare-si-livrare"}
                  preFetchedPage={preFetchedPages[3]}
                />
              </ContainerTabInfo>
            )}
          </div>
        </NewDetailFooter>
      </div>

      {/* Bottom Add to Cart Button for Mobile */}
      {!isProductOutOfStoc && !dontShowBottom && showBottomAddInCart && (
        <BottomAddInCart>
          <div className="price-stack">
            <span className="original-price">{oldPrice.toFixed(2)} RON</span>
            <span className="savings-text">
              Economisești {(oldPrice - price).toFixed(0)} RON
            </span>
           </div>

          <div className="actions-wrapper">
            <AddToCartButton
              id="primary-button"
              handleAddInCart={handleAddInCart}
              isProductOutOfStoc={isProductOutOfStoc}
              isLoadingArtificial={isLoadingArtificial}
              theme={{
                "primary-color": "#2699FB",
                "secondary-color": "#F03E2F",
              }}
              compact
            />
            <FeatherIcon
              icon="x"
              onClick={() => setDontShowBottom(true)}
              size={18}
              color={theme["gray-color"]}
            />
          </div>
        </BottomAddInCart>
      )}

      <Modal
        type="primary"
        title="Lasă-ne o recenzie"
        visible={visibleAddReview}
        onCancel={() => setVisibleAddReview(false)}
        footer={null}
      >
        <Form
          onFinish={handleSubmitRecenzie}
          layout="vertical"
          form={formAddRecenzie}
        >
          <Form.Item
            style={{ marginTop: 24 }}
            label="Evaluarea ta"
            name="rate"
            rules={[
              { required: true, message: "Te rugam sa selectezi o evaluare!" },
            ]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            label="Recenzia ta"
            name="desc"
            rules={[{ required: true, message: "" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Nume"
            name="name"
            rules={[{ required: true, message: "" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Text as="p6">Adresa ta de email nu va fi publicată!</Text>
          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="primary">
              Posteaza recenzia
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={visibleContact}
        onCancel={() => setVisibleContact()}
        footer={null}
      >
        <ContactForm
          linkOpened={{
            sentFromAnother: {
              title: "Am o intrebare despre urmatorul produs: " + product.name,
            },
          }}
        />
      </Modal>
    </>
  );
}

export default DetailsRight;
