"use client";

import { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";

export function trackPurchase({ value, currency = "RON", contentName = "", contentType = "product" }) {
  if (typeof window === "undefined") return;

  ReactPixel.track("Purchase", {
    value: Number(value),
    currency,
    content_name: contentName,
    content_type: contentType,
  });
}

export default function FacebookPixelClient() {
  useEffect(() => {
    ReactPixel.init("589942830217081", {}, { autoConfig: true, debug: false });
    ReactPixel.pageView();
  }, []);

  return null;
}
