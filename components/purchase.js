"use client";

import ReactPixel from "react-facebook-pixel";

export default function trackPurchase({ value, currency = "RON", contentName = "", contentType = "product" }) {
  if (typeof window === "undefined") return;

  ReactPixel.track("Purchase", {
    value: Number(value),
    currency,
    content_ids: contentIds,
    content_type: contentType,
  });
}
