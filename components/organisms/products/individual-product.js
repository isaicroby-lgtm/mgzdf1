"use client";

import React, { useEffect, Suspense, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { Row, Col, Skeleton, Modal } from "antd";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";

import { decodeURL, encodeURL } from "@/utility/urlFormatting";
import { storage } from "@/public/firebase";
import { Main } from "@/components/style";
import Cards from "@/components/atoms/Cards";
import { ProductDetailsWrapper } from "@/components/organisms/style";
import Heading from "@/components/atoms/Heading";
import ProductCards from "@/components/organisms/products/product-cards";
import theme from "@/components/atoms/theme";
import PageHeader from "@/components/atoms/PageHeader";
import DetailsRight from "./details-right";

const VideoYtResponsive = styled.div`
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;

  iframe {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
`;

const MainImageContainer = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
  padding: 0;
  position: relative; /* Asigură poziționarea absolută a săgeților */

  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  @media (min-width: 768px) {
    height: 500px;
    padding: 0 20px;
  }

  @media (max-width: 767px) {
    height: 80vh; /* Crește înălțimea imaginii pe telefoane */
  }
`;

const ChevronContainer = styled.div`
  cursor: pointer;
  padding: 1%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute; /* Poziționează săgețile fix deasupra imaginii */
  top: 50%;
  z-index: 91100; /* Asigură că săgețile sunt deasupra imaginii */
  
  svg {
    color: #333;
    stroke-width: 3px;
  }

  &.left {
    left: 20px; /* Săgeata stângă */
  }

  &.right {
    right: 20px; /* Săgeata dreaptă */
  }
`;


const ModalImageContainer = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.9);
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 91100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  svg {
    color: #333;
    stroke-width: 3px;
  }
`;

const ModalNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.9);
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 91100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  svg {
    color: #333;
    stroke-width: 3px;
  }

  &.left {
    left: 20px;
  }

  &.right {
    right: 20px;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #333;
  font-size: 16px;
  background-color: rgba(255,255,255,0.9);
  padding: 6px 16px;
  border-radius: 20px;
  z-index: 91100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #eee;
`;

const CompactCard = styled(Cards)`
  .ant-card-body {
    padding: 0 !important;
    
    @media (max-width: 767px) {
      padding-bottom: 0 !important;
    }
  }
`;

export const YoutubeEmbed = ({ embedId, style }) => (
  <VideoYtResponsive style={style}>
    <iframe
      style={{ width: "100%", height: "100%" }}
      src={`https://www.youtube.com/embed/${
        embedId.match(/youtu\.be\/(.+)/)?.[1]
      }`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </VideoYtResponsive>
);

function IndividualProduct({ productName }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { products, productsFavorite } = useSelector((state) => ({
    products: state.products.productsAll,
    productsFavorite: state.favorites.products,
  }));

  const name = decodeURL(productName);

  const product =
    products?.find((pr) => pr?.encoded_url?.toLowerCase() === productName?.toLowerCase()) || {};

  const handleDownIndex = () => {
    setCurrentFileIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const handleUpIndex = () => {
    setCurrentFileIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleUpIndex,
    onSwipedRight: handleDownIndex,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const modalSwipeHandlers = useSwipeable({
    onSwipedLeft: handleUpIndex,
    onSwipedRight: handleDownIndex,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setFiles([]);

      for (const f of product?.fileRefs || []) {
        if (isMounted) {
          const fileDownloadURL = await getDownloadURL(ref(storage, f));
          const obj = {
            fileDownloadURL,
            fileRef: product?.fileRefs?.[0],
          };
          if (isMounted) setFiles((prev) => [...prev, obj]);
        } else break;
      }
    };
    if (name && product) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [product?.id]);

  const extraProducts = products
    ?.filter(
      (prod) =>
        prod.name.toLowerCase() !== product.name?.toLowerCase() &&
        prod.category === product.category
    )
    ?.map((product) => ({ ...product, image: product?.files?.[0] }));

  const favorite = !!productsFavorite.find(
    (prod) => prod.name?.toLowerCase() === name?.toLowerCase()
  );

  const handleOpenProduct = (name) => {
    const encName = encodeURL(name);
    if (!pathname.includes("admin")) router.push(`/magazin/${encName}`);
    else if (pathname.includes("admin")) router.push(`/admin/produse/${encName}`);
  };

  const variantProducts = products
    ?.filter((p) => p?.groupId == product?.groupId && product?.groupId)
    .map((x) => ({
      image: x?.fileDownloadURL,
      name: x?.name,
      stock: x?.stock,
    }));

  return (
    <>
      <PageHeader ghost />
      <Main theme={theme}>
        {product ? (
          <CompactCard bodypadding="0" headless is="n-individual-product" border={true}>
            <ProductDetailsWrapper theme={theme}>
              <div
                className="product-details-box"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Row gutter={40} style={{ width: "100%" }}>
                  <Col
                    className="sticky-column-inside"
                    xs={24}
                    lg={10}
                    style={{
                      height: "fit-content",
                      position: "sticky",
                      padding: "0",
                      top: 100,
                      zIndex: 50,
                    }}
                  >
                    {files && files.length ? (
                      <div
                        className="product-details-box__left pdbl"
                        style={{ width: "100%", userSelect: "none" }}
                        {...swipeHandlers}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                 
                          <MainImageContainer onClick={showModal}>
                            <img
                              src={files[currentFileIndex]?.fileDownloadURL}
                              alt="produsul ales"
                              onContextMenu={(event) => event.preventDefault()}
                            />
                          </MainImageContainer>
                        
                        </div>
                        <Row gutter={5} className="pdbl__slider pdbs" style={{ padding: "10px 0" }}>
                          {files.map((value, index) => (
                            <Col md={4} key={index}>
                              <div
                                className="pdbl__image"
                                onClick={() => setCurrentFileIndex(index)}
                              >
                                <figure>
                                  <img
                                    src={files[index]?.fileDownloadURL}
                                    alt=""
                                    onContextMenu={(event) => event.preventDefault()}
                                  />
                                </figure>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ) : null}
                  </Col>
                  <Col xs={24} lg={14}>
                    <Suspense
                      fallback={
                        <Cards headless>
                          <Skeleton active />
                        </Cards>
                      }
                    >
                      {product && (
                        <DetailsRight
                          product={{ favorite, ...product }}
                          variantProducts={variantProducts}
                          handleOpenProduct={handleOpenProduct}
                        />
                      )}
                    </Suspense>
                  </Col>
                </Row>
              </div>
            </ProductDetailsWrapper>
          </CompactCard>
        ) : (
          <div style={{ minHeight: "70vh", padding: "0% 3%" }}>
            <Heading as="h6">Se încarcă</Heading>
          </div>
        )}

        {extraProducts && extraProducts.length ? (
          <Cards
            headStyle={{ marginTop: 88 }}
            title={
              <Heading as="h4">Mai multe produse din această categorie</Heading>
            }
          >
            <ProductDetailsWrapper>
              <Row className="extra-products" gutter={[30, 30]}>
                {extraProducts.map((product, index) => (
                  <Col
                    xs={24}
                    lg={12}
                    xl={8}
                    key={index}
                    onClick={() => {
                      handleOpenProduct(product.name);
                    }}
                    style={{
                      cursor: "pointer",
                      background: "white",
                      height: "fit-content",
                    }}
                  >
                    <ProductCards
                      product={{ ...product, file: product.image }}
                    />
                  </Col>
                ))}
              </Row>
            </ProductDetailsWrapper>
          </Cards>
        ) : null}

        {/* Image Modal */}
        <Modal
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width="90%"
          style={{ top: 20 }}
          bodyStyle={{ padding: 0, backgroundColor: "white" }}
          closeIcon={null}
          centered
        >
          <div {...modalSwipeHandlers}>
            <ModalCloseButton onClick={handleCancel}>
              <FeatherIcon icon="x" size={24} />
            </ModalCloseButton>
            
            <ModalNavButton className="left" onClick={handleDownIndex}>
              <FeatherIcon icon="chevron-left" size={24} />
            </ModalNavButton>
            
            <ModalImageContainer>
              <img
                src={files[currentFileIndex]?.fileDownloadURL}
                alt="produsul ales"
                onContextMenu={(event) => event.preventDefault()}
              />
            </ModalImageContainer>
            
            <ModalNavButton className="right" onClick={handleUpIndex}>
              <FeatherIcon icon="chevron-right" size={24} />
            </ModalNavButton>
            
            <ImageCounter>
              {currentFileIndex + 1} / {files.length}
            </ImageCounter>
          </div>
        </Modal>
      </Main>
    </>
  );
}

export default IndividualProduct;