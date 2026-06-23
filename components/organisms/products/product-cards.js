import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Rate, Typography } from "antd";
import FeatherIcon from "feather-icons-react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { encodeURL } from "@/utility/urlFormatting";
import { cartAdd } from "@/redux/cart/actionCreator";
import { favoritesUpdate } from "@/redux/favorites/actionCreator";
import { isProductOutOfStock } from "@/api/stock";
import Heading from "@/components/atoms/Heading";
import theme from "@/components/atoms/theme";
import Button from "@/components/atoms/Button";
import Link from "next/link";

const { Text: AntText } = Typography;

const AddToCartButton = ({
  handleAddInCart,
  isProductOutOfStoc,
  isLoadingArtificial,
  theme,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isDisabled = isProductOutOfStoc || isLoadingArtificial;

  const buttonStyle = {
    width: "100%",
    minHeight: "42px",
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
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
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
    padding: "0 12px",
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
    borderTopRightRadius: "30px",
    borderBottomRightRadius: "30px",
    flexShrink: 0,
  };

  const textStyle = {
    flex: 1,
    padding: "8px 10px",
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
              width: 14,
              height: 14,
              border: "2px solid #fff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        ) : (
          <FeatherIcon icon="shopping-cart" size={14} color="#fff" />
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

// Funcție pentru calculul profitabilității
const calculateProfitability = (pretVanzare, pretAchizitie) => {
  if (!pretVanzare || !pretAchizitie) return { profitBrut: 0, profitNet: 0, tva: 0 };
  
  const profitBrut = pretVanzare - pretAchizitie;
  const tva = profitBrut * 0.21; // 21% TVA
  const profitNet = profitBrut - tva;
  
  return {
    profitBrut: Number(profitBrut.toFixed(2)),
    profitNet: Number(profitNet.toFixed(2)),
    tva: Number(tva.toFixed(2))
  };
};

const ProductCard = styled.div`
  overflow: hidden;
  border: 1px solid #fff;
  box-shadow: 0px 0px 2px 0px #48acf0;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  height: 100%;
  min-height: 450px;

  figure {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;

    img,
    video,
    .produsul-ales {
      width: 100%;
      height: 200px;
      object-fit: contain;
      border-radius: 4px;
    }
  }

  figcaption {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .product-single-title {
    width: 100%;
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme["dark-color"]};
    cursor: pointer;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 40px;
  }

  .product-single-rating {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 8px;

    .ant-rate {
      margin-right: 5px;
    }

    .ant-rate-star:not(:last-child) {
      margin-right: 2px !important;
    }

    .total-reviews {
      font-weight: 400;
      margin-left: 6px;
      color: ${({ theme }) => theme["light-color"]};
    }
  }

  .product-single-price {
    margin-top: auto;
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

  .product-single-profit {
    margin-top: 8px;
    padding: 8px;
    background: ${({ theme }) => theme["success-color"]}15;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme["success-color"]}30;
  }

  .profit-net {
    font-weight: 600;
    color: ${({ theme }) => theme["success-color"]};
  }

  .profit-negative {
    color: ${({ theme }) => theme["secondary-color"]};
  }

  .product-single-action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    padding: 0 16px 20px 16px;

    button {
      margin: 0;
      padding: 12px 16px;
      flex: 1;
    }

    .ant-btn-default {
      border-color: ${({ theme }) => theme["border-color-normal"]};

      &:hover {
        border-color: ${({ theme }) => theme["primary-color"]};
      }
    }

    .btn-heart {
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 0px 10px ${({ theme }) => theme["border-color-normal"]};
      transition: all 300ms ease-in-out;
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
  }

  @media (max-width: 992px) {
    min-height: 420px;

    figure {
      img,
      video,
      .produsul-ales {
        height: 180px;
      }
    }
  }

  @media (max-width: 768px) {
    min-height: 400px;

    figure {
      img,
      video,
      .produsul-ales {
        height: 160px;
      }
    }

    .product-single-action {
      button {
        padding: 10px 12px;
      }
    }
  }

  @media (max-width: 576px) {
    max-width: 350px;
    margin: 0 auto;
    min-height: 380px;

    figure {
      img,
      video,
      .produsul-ales {
        height: 140px;
      }
    }
  }
`;

// Componentă Text simplă pentru a înlocui cea care lipsește
const Text = ({ as, children, style, className }) => {
  const Component = as || 'span';
  
  return (
    <Component style={style} className={className}>
      {children}
    </Component>
  );
};

function ProductCards({ product, isAdmin }) {
  const { name, price, oldPrice, favorite, id, fileDownloadURL, pretAchizitie } = product;

  const reviews =
    product?.reviews?.filter((rev) => rev.status === "accepted") || [];

  const rate =
    reviews?.reduce((acc, value) => {
      return acc + value?.rate;
    }, 0) || 0;

  const [isLoadingArtificial, setIsLoadingArtificial] = useState();
  const [profitability, setProfitability] = useState({ profitBrut: 0, profitNet: 0, tva: 0 });

  const dispatch = useDispatch();

  const pathname = usePathname();
  const router = useRouter();

  // Calculează profitabilitatea când se schimbă prețurile
  useEffect(() => {
    const profitCalc = calculateProfitability(price, pretAchizitie);
    setProfitability(profitCalc);
  }, [price, pretAchizitie]);

  const handleAddInCart = () => {
    setIsLoadingArtificial(true);
    setTimeout(() => {
      setIsLoadingArtificial(false);
    }, 500);

    dispatch(cartAdd({ ...product }));
  };

  const handleOpenProduct = (name) => {
    const encName = encodeURL(name);
    if (!pathname.includes("admin")) router.push(`/magazin/${encName}`);
    else if (pathname.includes("admin"))
      router.push(`/admin/produse/${encName}`);
  };

  const [isProductOutOfStoc, setIsProductOutOfStoc] = useState();

  useEffect(() => {
    const fetch = async () => {
      const r = await isProductOutOfStock(id);
      setIsProductOutOfStoc(r);
    };
    if (id) fetch();
  }, [id]);

  return (
    <ProductCard theme={theme} style={{ position: "relative" }}>
      {product.superPret ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 8,
              borderRadius: 4,
              backgroundColor: theme["secondary-color"],
              color: "white",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "bold",
              boxShadow: `0 0 4px ${theme["border-color-base"]}`,
              zIndex: 2,
            }}
          >
            Super preț
          </div>
          {product.easyboxAvailability && (
            <div
              style={{
                position: "absolute",
                left: 8,
                top: 36,
                borderRadius: 4,
                backgroundColor: theme["primary-color"],
                color: "white",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: `0 0 4px ${theme["border-color-base"]}`,
                zIndex: 2,
              }}
            >
              Ridicare Easybox
            </div>
          )}
        </>
      ) : (
        product.easyboxAvailability && (
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 8,
              borderRadius: 4,
              backgroundColor: theme["primary-color"],
              color: "white",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "bold",
              boxShadow: `0 0 4px ${theme["border-color-base"]}`,
              zIndex: 2,
            }}
          >
            Ridicare Easybox
          </div>
        )
      )}

      <figure onClick={() => handleOpenProduct(name)}>
        <img
          style={{ objectFit: "contain" }}
          onContextMenu={(event) => event.preventDefault()}
          src={fileDownloadURL}
          alt=""
          loading="lazy"
        />
      </figure>

      <figcaption style={{ userSelect: "none" }}>
        <Heading
          className="product-single-title"
          as="h5"
          onClick={() => handleOpenProduct(name)}
        >
          {name}
        </Heading>
        
        {!isProductOutOfStoc ? (
          <div
            style={{
              fontWeight: 500,
              color: theme["nav-green"],
              marginBottom: 8,
              fontSize: '14px'
            }}
          >
            ✦ In stoc
          </div>
        ) : (
          <div
            style={{
              fontWeight: 500,
              color: theme["secondary-color"],
              marginBottom: 8,
              fontSize: '14px'
            }}
          >
            ✦ Stoc epuizat
          </div>
        )}

        <div className="product-single-rating">
          <Rate
            allowHalf
            value={reviews.length > 0 ? rate / reviews.length : 0}
            disabled
          />
          {reviews.length > 0 && (
            <span> {(rate / reviews.length).toFixed(1)} </span>
          )}
          <span className="total-reviews">
            {reviews.length} {reviews.length === 1 ? "Recenzie" : "Recenzii"}
          </span>
        </div>

        <div
          className="product-single-price"
          style={{ marginTop: 12, fontSize: '16px' }}
        >
          <span className="product-single-price__new">{price} RON</span>
          {oldPrice && (
            <>
              <del className="product-single-price__old"> {oldPrice} RON</del>
              <span className="product-single-price__offer">
                {Math.floor(100 - (price * 100) / oldPrice)}% reducere
              </span>
            </>
          )}
        </div>

        {/* Afișează profitul net doar în admin și dacă există preț de achiziție */}
        {isAdmin && pathname.includes("admin") && pretAchizitie && (
          <div className="product-single-profit">
            <div style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>
              <strong>Profitabilitate:</strong>
            </div>
            <div 
              className={`profit-net ${profitability.profitNet < 0 ? 'profit-negative' : ''}`}
              style={{ fontSize: '14px' }}
            >
              Profit net: <strong>{profitability.profitNet} RON</strong>
              {profitability.profitNet < 0 && (
                <FeatherIcon 
                  icon="alert-triangle" 
                  size={12} 
                  style={{ marginLeft: 4 }} 
                />
              )}
            </div>
            <div style={{ display: 'block', color: theme["light-color"], marginTop: 2, fontSize: '12px' }}>
              (Achiziție: {pretAchizitie} RON)
            </div>
          </div>
        )}
      </figcaption>

      {isAdmin && pathname.includes("admin") ? (
        <div className="product-single-action">
          <Link className="btn-edit" href={`/admin/produse-adauga/${id}`}>
            <Button type="primary" size="small">
              <span style={{ marginRight: 8 }}>Editează produsul</span>{" "}
              <FeatherIcon icon="edit" size={14} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="product-single-action">
          <AddToCartButton
            handleAddInCart={handleAddInCart}
            isProductOutOfStoc={isProductOutOfStoc}
            isLoadingArtificial={isLoadingArtificial}
            theme={{
              "primary-color": "#2699FB",
              "secondary-color": "#F03E2F",
            }}
          />

          <div
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(favoritesUpdate({ ...product }))}
            className={favorite ? "btn-heart btn-heart-favorite" : "btn-heart"}
          >
            <FeatherIcon icon="heart" size={18} />
          </div>
        </div>
      )}
    </ProductCard>
  );
}

export default ProductCards;