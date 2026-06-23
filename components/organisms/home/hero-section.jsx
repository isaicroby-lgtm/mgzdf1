"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styled from "styled-components";

import HeroLogo from "@/static/img/HeroImg.svg";

import theme from "@/components/atoms/theme";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";

import PB from "@/static/img/PB.jpg";

const WrapperHeroContainer = styled.div`
  width: 100%;
  position: relative;
  height: fit-content;

  min-height: 620px;
  max-height: 900px;

  grid-template-columns: 1fr 1fr;
  gap: 4%;
  padding: 4rem 10%;
  display: grid;
  place-items: center;

  padding-bottom: 148px;

  .next-image-bck {
    object-fit: cover;
    object-position: 80% 0%;
  }

  @media only screen and (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 30px;

    place-items: center;

    p {
      width: 100% !important;
    }
  }

  @media only screen and (max-width: 500px) {
    grid-template-rows: 1.5fr 1fr;
  }

  @media only screen and (max-width: 400px) {
    grid-template-rows: 2fr 1fr;

    max-height: 800px;
  }
`;

const WrapperHero1 = styled.div`
  place-items: flex-start;
  z-index: 1;

  .button-group {
    display: flex;
    flex-wrap: wrap;
    row-gap: 8px;
    column-gap: 16px;
    margin-top: 24px;

    @media only screen and (max-width: 450px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .button-left {
    background-color: white;
    color: ${theme["primary-color"]};

    &:hover {
      background-color: #ffffff95;
    }
  }
`;

// const ChevronContainer = styled.div`
//   width: 100vw;
//   position: absolute;
//   display: flex;
//   z-index: 5;
//   justify-content: space-between;
//   align-items: center;
//   top: 400px;
//   padding: 0 1vw;

//   color: white;
//   cursor: pointer;

//   svg {
//     background-color: #00000020;
//     border-radius: 8px;
//   }

//   svg:hover {
//     background-color: #00000030;
//   }
// `;

// const CircleContainer = styled.div`
//   z-index: 2;
//   position: relative;
//   bottom: 4vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 1vw;
//   div {
//     width: 16px;
//     height: 16px;
//     border-radius: 50%;
//     cursor: pointer;
//   }
// `;

// const ContainerButtons1 = styled.div`
//   position: absolute;
//   right: 3%;
//   z-index: 1;
//   top: 380px;
//   width: fit-content;

//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;

//   text-align: end !important;
//   * {
//     text-align: end !important;
//   }

//   .button-group {
//     display: flex;
//     flex-wrap: wrap;
//     row-gap: 8px;
//     column-gap: 16px;
//     margin-top: 24px;

//     @media only screen and (max-width: 450px) {
//       flex-direction: column;
//       align-items: flex-end;
//     }
//   }

//   @media only screen and (max-width: 950px) {
//     top: 500px;
//     right: 18vw;
//   }

//   @media only screen and (max-width: 500px) {
//     top: 560px;
//   }

//   @media only screen and (max-width: 350px) {
//     top: 580px;
//   }
// `;

// const ContainerButtons3 = styled.div`
//   position: absolute;
//   z-index: 1;
//   top: 280px;

//   right: 400px;

//   @media only screen and (max-width: 450px) {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-end;

//     text-align: end !important;
//     * {
//       text-align: end !important;
//     }
//   }

//   .button-group {
//     display: flex;
//     flex-wrap: wrap;
//     row-gap: 8px;
//     column-gap: 16px;
//     margin-top: 24px;

//     @media only screen and (max-width: 450px) {
//       flex-direction: column;
//       align-items: flex-end;
//     }
//   }

//   @media only screen and (max-width: 950px) {
//     top: 540px;
//     right: 20vw;
//   }

//   @media only screen and (max-width: 500px) {
//     top: 560px;
//   }

//   @media only screen and (max-width: 350px) {
//     top: 580px;
//   }
// `;

// const ContainerButtons0 = styled.div`
//   position: absolute;
//   left: 10%;
//   z-index: 1;
//   top: 280px;

//   @media only screen and (max-width: 450px) {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-end;

//     text-align: end !important;
//     * {
//       text-align: end !important;
//     }
//   }

//   .button-group {
//     display: flex;
//     flex-wrap: wrap;
//     row-gap: 8px;
//     column-gap: 16px;
//     margin-top: 24px;

//     @media only screen and (max-width: 450px) {
//       flex-direction: column;
//       align-items: flex-end;
//     }

//     .button-right {
//       background-color: white !important;
//     }
//   }

//   @media only screen and (max-width: 950px) {
//     top: 500px;
//     right: 15vw;
//   }

//   @media only screen and (max-width: 500px) {
//     top: 560px;
//   }

//   @media only screen and (max-width: 350px) {
//     top: 580px;
//   }
// `;

const WhiteBackgoundText = styled.span`
  color: ${theme["primary-color"]};
  background-color: white;
  border-radius: 4px;
  padding: 4px 16px;

  overflow: hidden;

  display: inline-block;

  width: 0;
  transition: width 1s ease;
`;

// const Wrapper = styled.div`
//   width: 100%;
//   position: relative;
//   height: fit-content;
//   background: linear-gradient(
//     180deg,
//     ${theme["primary-color"]}80 0%,
//     ${theme["primary-color"]} 80%
//   );

//   min-height: 620px;
//   max-height: 940px;

//   grid-template-columns: 1fr 1fr;
//   padding: 4rem 10%;
//   display: grid;
//   place-items: center;

//   padding-bottom: 148px;

//   .button-group {
//     display: flex;
//     flex-wrap: wrap;
//     row-gap: 8px;
//     column-gap: 16px;
//     margin-top: 24px;

//     @media only screen and (max-width: 450px) {
//       flex-direction: column;
//       align-items: flex-start;
//     }
//   }

//   .button-left {
//     background-color: white;
//     color: ${theme["primary-color"]};

//     &:hover {
//       background-color: #ffffff95;
//     }
//   }

//   img {
//     max-width: 100%;
//   }

//   @media only screen and (max-width: 1200px) {
//     grid-template-columns: 1fr;
//     grid-template-rows: 1fr 1fr;
//     gap: 30px;
//     padding: 4rem 4%;
//     padding-bottom: 148px;
//   }

//   @media only screen and (max-width: 750px) {
//     grid-template-columns: 1fr;
//     grid-template-rows: 1fr 1fr;
//     gap: 30px;

//     place-items: center;

//     p {
//       width: 100% !important;
//     }
//   }

//   @media only screen and (max-width: 500px) {
//     grid-template-rows: 1.5fr 1fr;
//   }

//   @media only screen and (max-width: 400px) {
//     grid-template-rows: 2fr 1fr;
//   }
// `;

const HeroSection = () => {
  const router = useRouter();

  // const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [windowInnerWidth, setWindowInnerWidth] = useState(false);

  // const [isDragging, setIsDragging] = useState(false);
  // const [startX, setStartX] = useState(0);
  // const [left, setLeft] = useState(0);

  // const accessShopWithFilters = (categoryName) => (value, name) => {
  //   router.push(`/magazin?categorie=${categoryName}`);
  // };

  // const handlePointerDown = (e) => {
  //   setIsDragging(true);
  //   setStartX(getXPosition(e));
  // };

  // const handlePointerMove = (e) => {
  //   if (!isDragging) return;

  //   const offsetX = getXPosition(e) - startX;
  //   setLeft((prevLeft) => prevLeft + offsetX);
  //   setStartX(getXPosition(e));
  // };

  // const handlePointerUp = () => {
  //   setIsDragging(false);

  //   if (left < -50) {
  //     setCurrent((prevIndex) => (prevIndex === 3 ? 0 : prevIndex + 1));
  //   } else if (left > 50) {
  //     setCurrent((prevIndex) => (prevIndex === 0 ? 3 : prevIndex - 1));
  //   }

  //   setLeft(0);
  // };

  // const getXPosition = (e) => {
  //   if (e.type.startsWith("touch")) {
  //     return e.touches[0].clientX;
  //   }
  //   return e.clientX;
  // };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 950);
      setWindowInnerWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* <ChevronContainer>
        <FeatherIcon
          icon="chevron-left"
          onClick={() => {
            setCurrent((prev) => {
              if (prev === 0) return 3;
              else return prev - 1;
            });
          }}
        />
        <FeatherIcon
          icon="chevron-right"
          onClick={() => {
            setCurrent((prev) => {
              if (prev === 3) return 0;
              else return prev + 1;
            });
          }}
        />
      </ChevronContainer> */}
      {/* {current === 0 ? ( */}
      <WrapperHeroContainer
      // onPointerDown={isMobile ? handlePointerDown : null}
      // onPointerMove={isMobile ? handlePointerMove : null}
      // onPointerUp={isMobile ? handlePointerUp : null}
      // onTouchStart={isMobile ? handlePointerDown : null}
      // onTouchMove={isMobile ? handlePointerMove : null}
      // onTouchEnd={isMobile ? handlePointerUp : null}
      >
        <Image
          unoptimized={true}
          alt="Blue background with stars"
          src={PB}
          className="next-image-bck"
          fill
          priority={true}
        />
        <WrapperHero1>
          <Heading
            as="h2"
            style={{
              color: theme.white,
              display: "flex",
              alignItems: "center",
              columnGap: 8,
              flexWrap: "wrap",
            }}
          >
            <WhiteBackgoundText style={{ width: "fit-content" }}>
            Magazinul Familiei Tale !
            </WhiteBackgoundText>
          </Heading>
          <Text
            as="p1"
            style={{ width: "90%", marginTop: 24, color: theme.white }}
          >
           Ești în căutarea unor produse care să aducă bucurie întregii familii? Alege articole distractive, utile și educative, care îi vor încânta pe cei mici, îi vor relaxa pe cei mari și vor transforma timpul petrecut împreună într-o experiență frumoasă și productivă!
          </Text>
          <div className="button-group">
            <Button
              type="primary"
              white="white"
              onClick={() => router.push("/magazin")}
              rounded={10}
              className="button-left"
            >
              Vezi magazinul
            </Button>

            <Button
              className="button-right"
              white="white"
              type="primary"
              rounded={10}
              outlined
              onClick={() =>
                router.push("/?popular", undefined, { shallow: true })
              }
            >
              Vezi produsul lunii
            </Button>
          </div>
        </WrapperHero1>

        <Image
          unoptimized={true}
          src={HeroLogo}
          alt="hero"
          style={{
            width: "100%",
            maxWidth: "550px",
            height: "auto",
            position: "relative",
            top: 16,
          }}
        />

        {/* <Image
            src={
              HeroImgD
              // window.innerWidth > 1200
              //   ? HeroImgD
              //   : window.innerWidth > 1000
              //   ? HeroImgT
              //   : window.innerWidth > 700
              //   ? HeroImgM
              //   : HeroImgMM
            }
            alt="hero"
            style={{
              width: "100vw",
              height: "auto",
              position: "relative",
              top: 16,
            }}
          /> */}
        {/* <Wrapper>
            <div style={{ placeItems: "flex-start" }}>
              <Heading
                as="h2"
                style={{
                  color: theme.white,
                  display: "flex",
                  alignItems: "center",
                  columnGap: 8,
                  flexWrap: "wrap",
                }}
              >
                <WhiteBackgoundText style={{ width: "fit-content" }}>
                  Magazinul Copilului Tău!
                </WhiteBackgoundText>
              </Heading>
              <Text
                as="p1"
                style={{ width: "90%", marginTop: 24, color: theme.white }}
              >
                Te-ai săturat să îți vezi copilul pe telefon tot timpul?
                Cumpără-i ceva distractiv, interactiv și educativ, ce îi va ține
                creierul sănătos și îi va ocupa productiv timpul!
              </Text>
              <div className="button-group">
                <Button
                  type="primary"
                  white="white"
                  onClick={() => router.push("/magazin")}
                  rounded={10}
                  className="button-left"
                >
                  Vezi magazinul
                </Button>

                <Button
                  className="button-right"
                  white="white"
                  type="primary"
                  rounded={10}
                  outlined
   onClick={() =>
                  router.push("/?popular", undefined, { shallow: true })
                }                >
                  Vezi produsul lunii
                </Button>
              </div>
            </div>
            <div>
              <Image
                src={HeroImg}
                alt="hero"
                style={{
                  width: isMobile ? "80vw" : "30vw",
                  position: "relative",
                  top: 16,
                }}
              />
            </div>
          </Wrapper> */}
      </WrapperHeroContainer>
      {/* ) : current === 2 ? (
        <div
          onPointerDown={isMobile ? handlePointerDown : null}
          onPointerMove={isMobile ? handlePointerMove : null}
          onPointerUp={isMobile ? handlePointerUp : null}
          onTouchStart={isMobile ? handlePointerDown : null}
          onTouchMove={isMobile ? handlePointerMove : null}
          onTouchEnd={isMobile ? handlePointerUp : null}
        > */}
      {/* {isMobile ? (
            <div style={{ height: 720, width: "100%", position: "relative" }}>
              <img
                src="/img/Banner-v1(mobile).png"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="banner2"
              />
            </div>
          ) : (
            <div style={{ height: 620, width: "100%", position: "relative" }}>
              <Image
                fill={true}
                src="/img/Banner-v1.png"
                style={{
                  objectFit: "cover",
                  objectPosition: "right",
                }}
                alt="banner2"
              />
            </div>
          )} */}
      {/* <ContainerButtons1>
            <Heading
              as="h1"
              style={{
                margin: 0,
                marginBottom: 4,
                color: theme["primary-color"],
                maxWidth: "70vw",
              }}
            >
              Truse de machiaj pentru copii
            </Heading>

            <Text
              style={{
                width: isMobile ? "70vw" : "30vw",
                marginTop: 24,
                display: windowInnerWidth <= 500 ? "none" : "block",
              }}
            >
              Te-ai săturat să îți vezi copilul pe telefon tot timpul? Cumpără-i
              ceva distractiv, interactiv și educativ, ce îi va ține creierul
              sănătos și îi va ocupa productiv timpul!
            </Text>
            <div className="button-group">
              <Button
                type="primary"
                white="white"
                onClick={accessShopWithFilters("truse de machiaj")}
                rounded={10}
                className="button-left"
              >
                <Text as="p4" style={{ color: "white" }}>
                  Vezi produsele
                </Text>
              </Button>

              <Button
                className="button-right"
                type="primary"
                rounded={10}
                outlined
                style={{ backgroundColor: "white" }}
                onClick={() =>
                  router.push("/?popular", undefined, { shallow: true })
                }
              >
                <Text as="p4" style={{ color: theme["primary-color"] }}>
                  Vezi produsul lunii
                </Text>
              </Button>
            </div>
          </ContainerButtons1>
        </div> */}
      {/* ) : current === 3 ? (
        <div
          onPointerDown={isMobile ? handlePointerDown : null}
          onPointerMove={isMobile ? handlePointerMove : null}
          onPointerUp={isMobile ? handlePointerUp : null}
          onTouchStart={isMobile ? handlePointerDown : null}
          onTouchMove={isMobile ? handlePointerMove : null}
          onTouchEnd={isMobile ? handlePointerUp : null}
        >
          {isMobile ? (
            <div style={{ height: 720, width: "100%", position: "relative" }}>
              <img
                src="/img/Banner-v3(mobile).png"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="banner1"
              />
            </div>
          ) : (
            <div style={{ height: 620, width: "100%", position: "relative" }}>
              <Image
                src="/img/Banner-3.png"
                fill={true}
                style={{
                  objectFit: "cover",
                  objectPosition: "left",
                }}
                alt="banner1"
              />
            </div>
          )}

          <ContainerButtons0>
            <Heading
              as="h1"
              style={{
                margin: 0,
                marginBottom: 4,
                color: theme["primary-color"],
              }}
            >
              Ghiozdane pentru copii
            </Heading> */}

      {/* <Text
              style={{
                width: isMobile ? "70vw" : "40vw",
                marginTop: 24,
                display: windowInnerWidth <= 500 ? "none" : "block",
              }}
            >
              Te-ai săturat să îți vezi copilul pe telefon tot timpul? Cumpără-i
              ceva distractiv, interactiv și educativ, ce îi va ține creierul
              sănătos și îi va ocupa productiv timpul!
            </Text>
            <div className="button-group">
              <Button
                type="primary"
                white="white"
                onClick={accessShopWithFilters("ghiozdane")}
                rounded={10}
                className="button-left"
              >
                <Text as="p4" style={{ color: "white" }}>
                  Vezi produsele
                </Text>
              </Button>
              <Button
                className="button-right"
                type="primary"
                rounded={10}
                outlined
                style={{ backgroundColor: "white" }}
                onClick={() =>
                  router.push("/?popular", undefined, { shallow: true })
                }
              >
                <Text as="p4" style={{ color: theme["primary-color"] }}>
                  Vezi produsul lunii
                </Text>
              </Button>
            </div>
          </ContainerButtons0> */}
      {/* </div> */}
      {/* ) : current === 1 ? (
        <div
          onPointerDown={isMobile ? handlePointerDown : null}
          onPointerMove={isMobile ? handlePointerMove : null}
          onPointerUp={isMobile ? handlePointerUp : null}
          onTouchStart={isMobile ? handlePointerDown : null}
          onTouchMove={isMobile ? handlePointerMove : null}
          onTouchEnd={isMobile ? handlePointerUp : null}
        >
          {isMobile ? (
            <div style={{ height: 720, width: "100%", position: "relative" }}>
              <img
                src="/img/Banner-v2(mobile).png"
                alt="banner1"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          ) : (
            <div style={{ height: 620, width: "100%", position: "relative" }}>
              <Image
                src="/img/Banner-v2.png"
                fill={true}
                style={{
                  objectFit: "cover",
                  objectPosition: "right",
                }}
                alt="banner1"
              />
            </div>
          )}
          <ContainerButtons3>
            <Heading
              as="h1"
              style={{
                margin: 0,
                marginBottom: 4,
                color: theme["primary-color"],
                maxWidth: "70vw",
              }}
            >
              Seturi de desenat
            </Heading>

            <Text
              style={{
                width: isMobile ? "70vw" : "450px",
                marginTop: 24,
                display: windowInnerWidth <= 500 ? "none" : "block",
              }}
            >
              Te-ai săturat să îți vezi copilul pe telefon tot timpul? Cumpără-i
              ceva distractiv, interactiv și educativ, ce îi va ține creierul
              sănătos și îi va ocupa productiv timpul!
            </Text>
            <div className="button-group">
              <Button
                type="primary"
                white="white"
                onClick={accessShopWithFilters("seturi de pictura si desen")}
                rounded={10}
                className="button-left"
              >
                <Text as="p4" style={{ color: "white" }}>
                  Vezi produsele
                </Text>
              </Button>
              <Button
                className="button-right"
                type="primary"
                rounded={10}
                outlined
                onClick={() =>
                  router.push("/?popular", undefined, { shallow: true })
                }
              >
                <Text as="p4" style={{ color: theme["primary-color"] }}>
                  Vezi produsul lunii
                </Text>
              </Button>
            </div>
          </ContainerButtons3>
        </div>
      ) : null}

      <CircleContainer>
        {[0, 1, 2, 3].map((circle) => {
          return (
            <div
              style={{
                backgroundColor:
                  circle === current
                    ? theme["primary-color"]
                    : theme["bg-color-normal"],
              }}
              key={circle}
              onClick={() => setCurrent(circle)}
            ></div>
          );
        })}
      </CircleContainer> */}
    </>
  );
};

export default HeroSection;
