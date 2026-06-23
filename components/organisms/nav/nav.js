"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "antd";
import FeatherIcon from "feather-icons-react";
import styled from "styled-components";
import { onAuthStateChanged } from "firebase/auth";

import { ModalAccount } from "../modals/modal-account";
import jucaria_lunii from "./svg/jucaria_lunii.svg";
import home from "./svg/home.svg";
import customer from "./svg/customer.svg";
import search from "./svg/search.svg";
import heart from "./svg/heart.svg";
import cart_right from "./svg/cart.svg";
import { NavStyle } from "./styled";
import BottomNavigationMobile from "./atoms/BottomNavigationMobile";
import { DiscountNavigation } from "./atoms/DiscountNavigation";

import { auth } from "@/public/firebase";

import logo from "@/static/img/LogoTransparent.svg";

import Modal from "@/components/atoms/Modal";
import Text from "@/components/atoms/Text";
import Heading from "@/components/atoms/Heading";
import theme from "@/components/atoms/theme";

import { fetchSetariRules } from "@/redux/setariRules/actionCreater";
import { fetchProducts } from "@/redux/product/actionCreator";
import { updateUserInfo } from "@/redux/userInfo/actionCreator";
import { cartDelete } from "@/redux/cart/actionCreator";

import { useFirestoreProductsListener } from "@/api/products";
import { getFirestoreUser } from "@/api/userInfo";

import NotificationPopup from "./atoms/NotificationPopup";
import TopBar from "./atoms/TopBar";
import Sidebar from "./atoms/Sidebar";

const ShoppingCartWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5%;
  border: 1px solid;
  text-align: start;
  border-radius: 32px;
  width: 100%;

  outline: 1px dashed;
  outline-offset: 2px;
  line-height: 16px;

  color: ${theme["nav-yellow"]};

  @media only screen and (max-width: 750px) {
    line-height: 12px;
    font-size: 12px;
  }
`;

const Navigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const dispatch = useDispatch();

  const isUnPadded = pathname.includes("magazin");

  const [modalOpen, setModalOpen] = useState();
  const [accountModal, setAccountModal] = useState();

  const [links, setLinks] = useState([
    { title: "Contul tău", name: "date-generale" },
    { title: "Adresa ta de livrare", name: "date-livrare" },
    { title: "Adresa ta de facturare", name: "date-facturare" },
    { title: "Comenzile tale", name: "istoric-comenzi" },
    { title: "Reducerile tale", name: "reducerile-mele" },
    { title: "Contact", name: "formular-contact" },
  ]);

  const [visible, setVisible] = useState(true);
  const [topModalOpen, setTopModalOpen] = useState();
  const [modalDeleteCos, setModalDeleteCos] = useState();
  const [filtersModalOpen, setFiltersModalOpen] = useState();
  const [productsInCart, setProductsInCart] = useState([]);
  const [productsFavorite, setProductsFavorite] = useState([]);

  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isShopTargetHovered, setIsShopTargetHovered] = useState(false);

  const {
    productsInCartRaw,
    productsFavoriteRaw,
    userInfo,
    openCart,
    productsAll,
    categoryOptions,
    filters,
    filterByTheseR,
  } = useSelector((state) => {
    return {
      productsInCartRaw: state.cart.products || [],
      productsFavoriteRaw: state.favorites.products || [],
      userInfo: state.userInfo,
      openCart: state.cart.openCart,
      pragTransportGratuit: state.setariRules.prag_transport_gratuit,
      productsAll: state.products.productsAll || [],
      categoryOptions: state.setariRules.category_options,
      ageOptions: state.setariRules.age_optoins,
      filters: state.filter,
      filterByTheseR: state.products?.filterByThese || [],
    };
  });

  const filteredByName = filterByTheseR.find(
    (obj) => obj.name === "name"
  )?.value;

  let quantityOfProducts = 0;
  let totalPriceProducts = 0;

  productsInCart.forEach((pr) => {
    quantityOfProducts += pr.quantity;
    totalPriceProducts += pr.quantity * pr.price;
  });

  const linkOpened = links.find((link) => link.active === true);

  const handleSelectNewAccountTab = (nameOfLinkClicked, extraInformation) => {
    setLinks((prev) => {
      const linksLocal = prev.map((link) => {
        link.active = nameOfLinkClicked === link.name;
        link.extraInformation = extraInformation;
        return link;
      });
      return linksLocal;
    });

    if (nameOfLinkClicked === undefined && extraInformation === undefined) {
      setAccountModal();
    } else {
      setAccountModal(true);
    }
    setModalOpen();
  };

  // here we are hook listening for products change in firestore, and using userInfo.isAdmin as dependancy arry
  const { products, isLoading } = useFirestoreProductsListener(
    userInfo.isAdmin
  );

  // here we are listening for auth changes and fetching website rules
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { email, uid, emailVerified, photoURL } = user;
        const _userInfo = await getFirestoreUser(user);

        dispatch(
          updateUserInfo({
            ..._userInfo,
            isLogged: true,
            email,
            uid,
            emailVerified,
            photoURL,
          })
        );
      } else
        dispatch(
          updateUserInfo({
            isLogged: false,
          })
        );
    });

    dispatch(fetchSetariRules());

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const updatingProductsInRedux = async () => {
      if (products && !isLoading) {
        dispatch(
          fetchProducts(
            userInfo.isAdmin,
            products.map((product, i) => {
              return { ...product };
            })
          )
        );
      }
    };

    updatingProductsInRedux();
  }, [products]);

  useEffect(() => {
    const newProducts = [
      ...productsFavoriteRaw
        .map((prod) => {
          const pr = productsAll.find((p) => p.id === prod.id);
          if (pr)
            return {
              ...prod,
              ...pr,
              img: pr.files?.[0],
            };
          else return undefined;
        })
        .filter((x) => x != undefined),
    ];

    setProductsFavorite(newProducts);
  }, [productsFavoriteRaw]);

  useEffect(() => {
    const newProducts = [
      ...[...productsInCartRaw]
        .filter((p) => p !== null)
        .map((prod) => {
          const pr = productsAll.find((p) => p.id === prod.id);
          if (pr)
            return {
              ...prod,
              ...pr,
              name: pr.name,
              img: pr.files?.[0],
            };
          else return undefined;
        })
        .filter((x) => x !== undefined),
    ];

    setProductsInCart(newProducts);
  }, [productsInCartRaw]);

  useEffect(() => {
    if (!productsInCart.length && modalOpen) {
      setModalOpen();
    }
  }, [productsInCart]);

  useEffect(() => {
    if (openCart && modalOpen !== "cart") setModalOpen("cart");
  }, [openCart]);

  useEffect(() => {
    if (searchParams.get("modal")) {
      setModalOpen(searchParams.get("modal"));
    }
    if (searchParams.get("cont")) {
      handleSelectNewAccountTab(searchParams.get("cont"));
    }
  }, [searchParams]);

  useEffect(() => {
    if (modalOpen || accountModal) setVisible(false);
    else {
      let timer;
      timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [modalOpen, accountModal]);

  useEffect(() => {
    if (filtersModalOpen && pathname.includes("magazin")) {
      const el = document.getElementById("all-shop-filters");

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setFiltersModalOpen(false);
    }
  }, [filtersModalOpen, pathname]);

  if (pathname.includes("admin")) return;

  return (
    <>
      <NotificationPopup
        visible={!modalOpen && !accountModal && visible}
        setModalOpen={setModalOpen}
      />

      <Modal
        visible={modalDeleteCos}
        onOk={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(cartDelete(modalDeleteCos.id, productsInCart));
          setModalDeleteCos();
        }}
        onCancel={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setModalDeleteCos();
        }}
      >
        <Heading as="h5">
          Esti sigur ca vrei sa scoti acest produs din cos?
        </Heading>
      </Modal>

      {/* <FiltersModal
        filtersModalOpen={filtersModalOpen}
        setFiltersModalOpen={setFiltersModalOpen}
      /> */}

      <BottomNavigationMobile
        setModalOpen={setModalOpen}
        setFiltersModalOpen={setFiltersModalOpen}
        productsFavoriteLength={productsFavorite?.length || 0}
      />

      <ModalAccount
        user={userInfo}
        setAccountModal={setAccountModal}
        handleClick={handleSelectNewAccountTab}
        links={links}
        linkOpened={linkOpened}
        visible={accountModal}
      />

      <TopBar topModalOpen={topModalOpen} setTopModalOpen={setTopModalOpen} />

      <Sidebar
        setAccountModal={setAccountModal}
        setTopModalOpen={setTopModalOpen}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalDeleteCos={modalDeleteCos}
        setModalDeleteCos={setModalDeleteCos}
        handleSelectNewAccountTab={handleSelectNewAccountTab}
        productsInCart={productsInCart}
        productsFavorite={productsFavorite}
      />

      <DiscountNavigation isUnPadded={pathname.includes("magazin")} />

      <NavStyle isUnPadded={isUnPadded}>
        <div
          className="logo-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <FeatherIcon
            icon="menu"
            color={"#48ACF0"}
            className="menu-bars"
            size={32}
            onClick={() => setModalOpen("nav")}
          />
          <Image
            src={logo}
            onClick={() => {
              if (pathname === "/") {
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                });
              } else router.push("/");
            }}
            className="logo"
            alt="logo"
          />
        </div>
        <div className="links">
          <div
            className="center-icon"
            onClick={() => {
              router.push("/");
            }}
          >
            <Image src={home} className="c_icon" width={30} alt="acasa" />
            <div style={{ color: `${theme["secondary-color"]}` }}>ACASĂ</div>
          </div>
          <div
            className="center-icon"
            onClick={() => {
              if (pathname === "/")
                router.push("/?popular", undefined, { shallow: true });
              else router.push("/?popular");
            }}
          >
            <Image
              src={jucaria_lunii}
              className="c_icon"
              width={32}
              alt="jucarie"
            />
            <div style={{ color: `${theme["nav-green"]}` }}>PRODUSUL LUNII</div>
          </div>
          <div
            className="center-icon"
            onClick={() => {
              router.push("/blog");
            }}
          >
            <FeatherIcon
              icon="grid"
              style={{ color: theme["primary-color"] }}
              className="c_icon"
              size={28}
            />
            <div style={{ color: `${theme["primary-color"]}` }}>BLOG</div>
          </div>
          <div style={{ display: "flex" }}>
            <div
              onMouseEnter={() => {
                setIsShopHovered(true);
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  setIsShopHovered(false);
                }, 200);
              }}
              className="center-icon-with-dropdown"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
              onClick={() => {
                router.push(`/magazin?categorie=all`);
              }}
            >
              <div>
                <img src={"/img/SBO.png"} className="c_icon" alt="magazin" />
                <div style={{ color: `${theme["nav-yellow"]}` }}>MAGAZIN</div>
              </div>
              <FeatherIcon
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  setIsShopHovered((prev) => !prev);
                }}
                icon="chevron-down"
                color={theme["nav-yellow"]}
                size={22}
              />
            </div>

            <div
              onMouseEnter={() => {
                setIsShopTargetHovered(true);
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  setIsShopTargetHovered(false);
                }, 200);
              }}
              className={`under-hover-categories ${
                isShopHovered || isShopTargetHovered
                  ? "under-hover-categories-hover"
                  : ""
              }`}
            >
              <ul>
                <li
                  onClick={() => {
                    router.push(`/magazin?categorie=all`);
                  }}
                >
                  <Text
                    as="p6"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 14,
                      textTransform: "capitalize",
                      color:
                        pathname?.includes("magazin") &&
                        Object.values(filters)?.find(
                          (x) =>
                            x.name === "category" && x.value?.includes("all")
                        )
                          ? theme["nav-yellow"]
                          : "initial",
                    }}
                  >
                    <span> Toate produsele</span>
                    <span>{productsAll?.length}</span>
                  </Text>
                </li>

                {categoryOptions?.map((category) => {
                  return (
                    <li
                      key={category}
                      onClick={() => {
                        router.push(
                          `/magazin?categorie=${category.toLowerCase()}`
                        );
                      }}
                    >
                      <Text
                        as="p6"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 30,
                          textTransform: "capitalize",
                          color:
                            pathname?.includes("magazin") &&
                            Object.values(filters)?.find(
                              (x) =>
                                x.name === "category" &&
                                x.value?.includes(category?.toLowerCase())
                            )
                              ? theme["nav-yellow"]
                              : "initial",
                        }}
                      >
                        <span> {category}</span>
                        <span>
                          {
                            productsAll?.filter(
                              (product) =>
                                product.category === category?.toLowerCase()
                            ).length
                          }
                        </span>
                      </Text>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="buttons">
          <div
            className="r-icon r-icon-user"
            onClick={() => setModalOpen("user")}
            style={{
              background: `${theme["primary-color"]}`,
              outlineColor: `${theme["primary-color"]}`,
            }}
          >
            <Image src={customer} className="r-icon-icon" alt="avatar" />
          </div>

          <div
            className="r-icon"
            onClick={() => setModalOpen("heart")}
            style={{
              background: `${theme["secondary-color"]}`,
              outlineColor: `${theme["secondary-color"]}`,
            }}
          >
            <Badge
              color={theme["secondary-color"]}
              count={productsFavorite?.length}
              offset={[0, -20]}
              className="r-icon-icon"
            >
              <Image src={heart} alt="inima" />
            </Badge>
          </div>
          <div
            className="r-icon"
            onClick={() => setTopModalOpen("search")}
            style={{
              background: `${theme["nav-green"]}`,
              outlineColor: `${theme["nav-green"]}`,
            }}
          >
            <Badge
              color={theme["nav-green"]}
              count={filteredByName ? "!" : ""}
              offset={[0, -22]}
              className="r-icon-icon"
            >
              <Image src={search} alt="lupa" />
            </Badge>
          </div>
          <Badge
            color={theme["nav-yellow"]}
            count={quantityOfProducts}
            offset={[0, -10]}
            onClick={() => setModalOpen("cart")}
          >
            <ShoppingCartWrap>
              <div
                className="r-icon"
                style={{ background: `${theme["nav-yellow"]}` }}
              >
                <Image src={cart_right} alt="carucior" />
              </div>
              <div style={{ width: "fit-content" }}>
                {totalPriceProducts?.toFixed(0)} RON
              </div>
            </ShoppingCartWrap>
          </Badge>
        </div>
      </NavStyle>
    </>
  );
};

export default Navigation;
