"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "page_view",
        page_path: pathname,
        page_title: document.title,
      });

      // 👇 opțional: log pentru debugging
      // console.log("[GA4] page_view pushed:", pathname);
    }
  }, [pathname]);

  return null;
}

export default PageViewTracker;
