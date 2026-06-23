"use client";

import dynamic from "next/dynamic";
import { Nunito } from "next/font/google";

import { ConfigProvider } from "antd";
import CookieConsent from "react-cookie-consent";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import GoogleAnalytics from "@/components/analytics";
import PageViewTracker from "@/components/page_view";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import ReduxProvider from "@/redux/provider";
import theme from "@/components/atoms/theme";
import Script from "next/script";


import "./globals.css";

const Nav = dynamic(() => import("@/components/organisms/nav"), { ssr: false });
const Footer = dynamic(() => import("@/components/organisms/footer"), { ssr: false });

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

// ... alte importuri

const FacebookPixelClient = dynamic(() => import("@/components/pixel"), { ssr: false });

// restul codului RootLayout

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname)
  }, [pathname]);

  return (
    <html lang="en">
      <body className={nunito.className}>
        <GoogleAnalytics measurementId="G-6TPH5C237W"  gtmId="GTM-58KDM3GT" />
        <PageViewTracker />

        <FacebookPixelClient />

        <ReduxProvider>
          <StyledComponentsRegistry>
            <ConfigProvider theme={{ token: { ...theme } }}>
              {!pathname.includes("checkout") && <Nav />}
              {children}
              {!pathname.includes("checkout") && <Footer />}
            </ConfigProvider>
          </StyledComponentsRegistry>
        </ReduxProvider>

        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/564937c2af26016c1becfe20/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
