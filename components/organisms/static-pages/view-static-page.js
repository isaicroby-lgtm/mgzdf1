"use client";

import React, { useEffect, useRef, useState } from "react";

import { getStaticPage } from "@/api/static-pages";
import theme from "@/components/atoms/theme";
import { Main } from "@/components/style";

const ViewStaticPage = ({ title, preFetchedPage }) => {
  const [page, setPage] = useState({});
  const [editorLoaded, setEditorLoaded] = useState(false);

  const editorRef = useRef();
  const { CKEditor, Editor } = editorRef.current || {};

  useEffect(() => {
    const fetchPage = async () => {
      if (!preFetchedPage) {
        if (!title) return;
        const _page = await getStaticPage(title);

        if (!_page) return;
        setPage({ ..._page });
      } else setPage(preFetchedPage);
    };
    fetchPage();

    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("ckeditor5-cb/build/ckeditor"),
    };

    setEditorLoaded(true);
  }, []);

  return editorLoaded && Object.keys(page)?.length ? (
    <>
      <Main theme={theme} style={{ padding: 0, minHeight: 0 }}>
        <CKEditor
          editor={Editor}
          data={page.content}
          disabled={true}
          onReady={() => {
            const ckeditor = document.querySelector(".ck-editor__editable");
            ckeditor.style.border = "none";

            const toolbarElement = document.querySelector(".ck-editor__top");
            toolbarElement.style.display = "none";
            toolbarElement.style.padding = 0;
            toolbarElement.style.width = "100%";
          }}
        />
      </Main>
    </>
  ) : null;
};

export default ViewStaticPage;
