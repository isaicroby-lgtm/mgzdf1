"use client";

import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import FeatherIcon from "feather-icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import theme from "@/components/atoms/theme";

const FooterContainer = styled.footer`
  background-color: ${theme["primary-color"]};

  margin-top: 64px;
  padding: 70px 10%;

  @media only screen and (max-width: 750px) {
    padding: 70px 4%;
  }
`;

const Container = styled.div`
  max-width: 1170px;
  margin: auto;

  gap: 20px;
  display: flex;
  flex-direction: column;

  img {
    width: 180px;
    border-radius: 14px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 32px;

  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr !important;
  }

  @media only screen and (max-width: 750px) {
    grid-template-columns: 1fr !important;
  }
`;

const FooterCol = styled.div`
  width: 100%;

  h4 {
    font-size: 16px;
    color: #ffffff;
    text-transform: capitalize;
    margin-bottom: 35px;
    font-weight: 500;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: -10px;
      background-color: white;
      height: 2px;
      box-sizing: border-box;
      width: 50px;
    }
  }

  ul li:not(:last-child) {
    margin-bottom: 10px;
  }

  ul li a {
    font-size: 14px;
    text-transform: capitalize;
    color: #ffffff;
    text-decoration: none;
    font-weight: 300;
    display: block;
    transition: all 0.3s ease;

    &:hover {
      @media only screen and (min-width: 640px) {
        padding-left: 8px;
      }
    }
  }

  .social-links a {
    display: inline-flex;
    height: 40px;
    width: 40px;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0 10px 10px 0;
    border-radius: 50%;
    color: #ffffff;
    transition: all 0.5s ease;

    &:hover {
      color: #24262b;
      background-color: #ffffff;
    }
  }
`;

const Footer = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { userInfo } = useSelector((state) => ({
    userInfo: state.userInfo,
  }));

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  if (pathname.includes("admin")) return;
  return (
    <FooterContainer>
      <Container>
        <Row>
          <FooterCol>
            <h4
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                  });
                } else router.push("/");
              }}
            >
              Doi Frați.ro
            </h4>
            <ul>
              <li>
                <Link
                  href="/"
                  onClick={() => {
                    if (pathname === "/") {
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  Acasă
                </Link>
              </li>
              <li>
                <Link href="/magazin">Magazinul nostru</Link>
              </li>
              <li>
                <Link href="/termeni-si-conditii">Termeni și condiții</Link>
              </li>

              <li>
                <a
                  href="mailto: contact@doifrati.ro"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textTransform: "none" }}
                >
                  Poți să ne scrii, contact@doifrati.ro
                </a>
              </li>
              <li>
                <a
                  href="tel:40756384290"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textTransform: "none" }}
                >
                  Poti să ne suni, 0756 384 290
                </a>
              </li>

              <li>
                <Link href="/termeni-si-conditii">
                  Doi Frati V&V S.R.L, CUI: RO48071600
                </Link>
               
              </li>
              <li>
              <Link href="/termeni-si-conditii">
                  Nr. În registrul comertului: J22/1406/28.04.2023
                </Link>
              </li>
            </ul>
          </FooterCol>
          <FooterCol>
            <h4>Asistență</h4>
            <ul>
              <li>
                <a href="https://anpc.ro" target="_blank" rel="noreferrer">
                  ANPC
                </a>
              </li>
              <li>
                <a
                  href="https://anpc.ro/ce-este-sal"
                  target="_blank"
                  rel="noreferrer"
                >
                  ANPC SAl
                </a>
              </li>
              <li>
                <Link href="/politica-de-retur">
                  Politica de retur / Formular de retur
                </Link>
              </li>
              <li>
                <Link href="/politica-de-livrare">Politica de livrare</Link>
              </li>
              <li>
                <Link href="/politica-de-cookies">
                  Politica de utilizare cookies
                </Link>
              </li>
              <li>
                <Link href="/politica-de-confidentialitate">
                  Politica de confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/politica-anulare-comanda">
                  Politica de anulare comanda
                </Link>
              </li>
            </ul>
          </FooterCol>
          <FooterCol>
            <h4>Contul meu</h4>
            <ul>
              {userInfo?.isLogged ? (
                <>
                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        router.push(
                          pathname +
                            "?" +
                            createQueryString("cont", "date-generale")
                        );
                      }}
                    >
                      Contul meu
                    </a>
                  </li>

                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        router.push(
                          pathname +
                            "?" +
                            createQueryString("cont", "istoric-comenzi")
                        );
                      }}
                    >
                      Comenzile mele
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        router.push(
                          pathname +
                            "?" +
                            createQueryString("cont", "reducerile-mele")
                        );
                      }}
                    >
                      Reducerile mele
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/creeaza-cont">Creează un cont</Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/am-uitat-parola">Recuperare parolă</Link>
              </li>
              <li>
                <a href="https://sameday.ro/" target="_blank" rel="noreferrer">
                  Statusul comenzii
                </a>
              </li>
            </ul>
          </FooterCol>
          <FooterCol>
            <h4>
              Vrei să fii la curent cu ultimele noastre produse și reduceri?
            </h4>
            <div className="social-links">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/DoiFrati.ro"
              >
                <FeatherIcon icon="facebook" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://youtube.com/@DoiFratiori"
              >
                <FeatherIcon icon="youtube" />
              </a>
            </div>
          </FooterCol>
        </Row>
        <Row>
          <a href="https://anpc.ro" target="_blank" rel="noreferrer">
            <Image
              unoptimized={true}
              src="/img/ANPC1.png"
              height={46}
              width={180}
              alt="anpc"
            />
          </a>
          <a
            href="https://anpc.ro/ce-este-sal"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              height={46}
              width={180}
              src="/img/ANPC2.png"
              alt="anpc sal"
              unoptimized={true}
            />
          </a>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "fit-content",
            }}
          >
            <Image
              width={244}
              height={46}
              src="/img/NetopiaLogo.png"
              alt="visaAndMasterCard"
              unoptimized={true}
            />
          </div>
        </Row>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
