"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { Col, Row, Layout as L1 } from "antd";
import { ThemeProvider } from "styled-components";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Link from "next/link";
import Image from "next/image";

import theme from "@/components/atoms/theme";
import Button from "@/components/atoms/Button";
import LeftIcon from "@/static/icons/left.svg";
import RightIcon from "@/static/icons/right.svg";

import { Div } from "./style";
import MenueItems from "./menue-items";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState();

  const { userInfo } = useSelector((state) => {
    return {
      userInfo: state.userInfo,
    };
  });

  useLayoutEffect(() => {
    if (userInfo && !userInfo.isAdmin) {
      redirect("/");
    }
  }, [userInfo]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleCollapsedMobile = () => {
    if (!window || window?.innerWidth <= 1050) {
      setCollapsed((prev) => !prev);
    }
  };

  useEffect(() => {
    if (window?.innerWidth < 1050) {
      setCollapsed(true);
    }
  }, []);

  const left = "left";

  const SideBarStyle = {
    margin: "63px 0 0 0",
    overflowY: "auto",
    height: "100vh",
    position: "fixed",
    [left]: 0,
    zIndex: 998,
  };
  const footerStyle = {
    padding: "20px 30px 18px",
    color: "rgba(0, 0, 0, 0.65)",
    fontSize: "14px",
    background: "rgba(255, 255, 255, .90)",
    width: "100%",
    boxShadow: "0 -5px 10px rgba(146,153,184, 0.05)",
  };

  return (
    <Div theme={theme}>
      <L1 className="layout">
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            position: "fixed",
            width: "100%",
            top: 0,
            left: 0,
            padding: "0 10px",
          }}
        >
          <Row>
            <Col lg={4} sm={6} xs={12} className="align-center-v">
              <Button color={"transparent"} onClick={toggleCollapsed}>
                <Image
                  width={24}
                  height={24}
                  unoptimized={true}
                  src={collapsed ? RightIcon : LeftIcon}
                  alt="amenu"
                />
              </Button>
            </Col>
          </Row>
          <Link onClick={toggleCollapsed} href="/admin">
            Dashboard
          </Link>

          <Link onClick={toggleCollapsed} href="/" style={{ marginLeft: 16 }}>
            Pagina de acasa
          </Link>
        </Header>

        <L1>
          <ThemeProvider theme={theme}>
            <Sider
              width={280}
              style={SideBarStyle}
              collapsed={collapsed}
              theme={"light"}
            >
              <p className="sidebar-nav-title">Meniul Principal</p>
              <MenueItems toggleCollapsed={toggleCollapsedMobile} />
            </Sider>
          </ThemeProvider>

          <L1 className="atbd-main-layout">
            <Content>
              {children}
              <Footer className="admin-footer" style={footerStyle}>
                <Row>
                  <Col md={12} xs={24}>
                    <span className="admin-footer__copyright">
                      2024 © Doi Frati
                    </span>
                  </Col>
                  <Col md={12} xs={24}></Col>
                </Row>
              </Footer>
            </Content>
          </L1>
        </L1>
      </L1>
    </Div>
  );
}
