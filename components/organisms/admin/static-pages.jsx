"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { getAllStaticPages } from "@/api/static-pages";
import PageHeader from "@/components/atoms/PageHeader";
import { Main } from "@/components/style";
import theme from "@/components/atoms/theme";
import Text from "@/components/atoms/Text";
import { encodeStaticURL } from "@/utility/urlFormatting";

const StaticPages = () => {
  const router = useRouter();
  const [staticPages, setStaticPages] = useState([]);

  useEffect(() => {
    const getPages = async () => {
      const _pages = await getAllStaticPages();
      setStaticPages([..._pages]);
    };
    getPages();
  }, []);

  return (
    <>
      <PageHeader title="Pagini statice" />
      <Main theme={theme}>
        {staticPages.map((page) => {
          return (
            <div
              key={page}
              onClick={() => {
                router.push(`/admin/pagini-statice/${encodeStaticURL(page)}`);
              }}
              style={{ padding: "16px", cursor: "pointer" }}
            >
              <Text as="p3">{page}</Text>
            </div>
          );
        })}
      </Main>
    </>
  );
};

export default StaticPages;
