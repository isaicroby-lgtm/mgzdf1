"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Form, Input } from "antd";

import Editor from "ckeditor5-cb/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  getStaticPage,
  postStaticPage,
  updateStaticPage,
} from "@/api/static-pages";
import Button from "@/components/atoms/Button";
import { Main } from "@/components/style";
import theme from "@/components/atoms/theme";
import PageHeader from "@/components/atoms/PageHeader";

const NewStaticPage = ({ params }) => {
  const { pageId } = params;
  const router = useRouter();
  const [form] = Form.useForm();

  const [page, setPage] = useState({});
  const [content, setContent] = useState();

  const handleSubmit = async (values) => {
    if (pageId && page) await updateStaticPage(pageId, content);
    else await postStaticPage(values.title, content);
    router.push("/admin/pagini-statice/");
  };

  useEffect(() => {
    if (pageId) {
      const getPage = async () => {
        const _page = await getStaticPage(pageId);
        if (_page != null) {
          setPage(_page);
        } else router.push("/admin/pagini-statice/");
      };
      getPage();
    }
  }, [pageId]);

  useEffect(() => {
    form.setFieldsValue(page);

    setContent(page.content);
  }, [form, page]);

  return (
    <>
      <Main theme={theme}>
        <PageHeader
          title={
            pageId && page
              ? "Editează pagină statică"
              : "Creează pagină statică"
          }
        />
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={handleSubmit}
          initialValues={{ ...page }}
        >
          {!(pageId && page) && (
            <Form.Item
              label="Titlu"
              name="title"
              rules={[
                { required: true, message: "Care este conținutul paginii?" },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="Conținut"
            name="content"
            rules={[
              { required: true, message: "Care este continutul paginii?" },
            ]}
          >
            <CKEditor
              editor={Editor}
              data={content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
            }}
          >
            <Button type="primary" outlined htmlType="submit">
              {pageId && page
                ? "Aplică modificările"
                : "Creează pagină statică"}
            </Button>
          </Form.Item>
        </Form>
      </Main>
    </>
  );
};

export default NewStaticPage;
