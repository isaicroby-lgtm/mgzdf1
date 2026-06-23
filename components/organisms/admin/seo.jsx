"use client";

import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Form, Input, Select, message } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { useForm } from "antd/lib/form/Form";
import { getSeoData, postSeoData } from "@/api/seo";
import PageHeader from "@/components/atoms/PageHeader";
import { Main } from "@/components/style";
import theme from "@/components/atoms/theme";
import Cards from "@/components/atoms/Cards";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";

const Seo = () => {
  const [filesBlog, setFilesBlog] = useState([]);
  const [filesHome, setFilesHome] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [seoValues, setSeoValues] = useState({});

  const [form] = useForm();

  const fileBlogUploadProps = {
    name: "filesBlog",
    multiple: false,
    accept: ".jpg, .png",
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "removed") {
        if (!filesBlog.length || filesBlog.length === 1) {
          form.setFieldValue("filesBlog", null);
          setFilesBlog(info.fileList);
        } else {
          setFilesBlog(info.fileList);
        }
      } else {
        form.setFieldValue("filesBlog", info.file);
        form.validateFields(["filesBlog"]);

        setFilesBlog(info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} fisierul a fost uploadat cu succes`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} fisierul nu a fost uploadat. A aparut o eroare`
        );
      }
    },
    fileList: filesBlog?.map((file, i) => ({
      ...file,
      url: file.fileDownloadURL,
      thumbUrl: file.fileDownloadURL,
      status: "done",
      uid: file.fileDownloadURL,
    })),
    listType: "picture",
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" onClick={(e) => {}} />,
    },
  };

  const fileHomeUploadProps = {
    name: "filesHome",
    multiple: false,
    accept: ".jpg, .png",
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "removed") {
        if (!filesHome.length || filesHome.length === 1) {
          form.setFieldValue("filesHome", null);
          setFilesHome(info.fileList);
        } else {
          setFilesHome(info.fileList);
        }
      } else {
        form.setFieldValue("filesHome", info.file);
        form.validateFields(["filesHome"]);

        setFilesHome(info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} fisierul a fost uploadat cu succes`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} fisierul nu a fost uploadat. A aparut o eroare`
        );
      }
    },
    fileList: filesHome?.map((file, i) => ({
      ...file,
      url: file.fileDownloadURL,
      thumbUrl: file.fileDownloadURL,
      status: "done",
      uid: file.fileDownloadURL,
    })),
    listType: "picture",
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" onClick={(e) => {}} />,
    },
  };

  const handleAddSeoInFirestore = async (values) => {
    setIsLoading(true);
    const nonUndefinedValues = {};

    if (values) {
      for (const v of Object.keys(values)) {
        if (values[v] !== undefined) nonUndefinedValues[v] = values[v];
      }

      await postSeoData(nonUndefinedValues);
    } else alert("Eroare!");

    setIsLoading(false);
  };

  useEffect(() => {
    const _getSeoData = async () => {
      setIsLoading(true);
      const data = await getSeoData();
      setSeoValues({ ...data });

      setFilesBlog([{ fileDownloadURL: data.blogImg }]);
      setFilesHome([{ fileDownloadURL: data.homeImg }]);
      setIsLoading(false);
    };
    _getSeoData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...seoValues });
  }, [seoValues]);

  return (
    <>
      <PageHeader title="SEO" />
      <Main theme={theme}>
        <Cards headless>
          <Form
            form={form}
            initialValues={{ ...seoValues }}
            layout="vertical"
            onFinish={handleAddSeoInFirestore}
            onFinishFailed={() => {
              alert("Salutare! Ai uitat sa completezi un camp!");
            }}
          >
            <Form.Item name="homeTitle" label="Titlu pagina de acasa">
              <Input size="large" />
            </Form.Item>
            <Form.Item name="homeDesc" label="Descriere scurta pagina de acasa">
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="homeKeywords"
              label="Adauga cuvinte cheie pentru pagina de acasa"
            >
              <Select mode="tags" />
            </Form.Item>
            <Form.Item
              name="homeImg"
              label="Imagine pagina de acasa"
              className="add-product-content"
            >
              <Dragger {...fileHomeUploadProps}>
                <p className="ant-upload-drag-icon">
                  <FeatherIcon icon="upload" size={40} />
                </p>
                <Heading as="h4" className="ant-upload-text">
                  Trage o imagine in acest dreptunghi
                </Heading>
                <p className="ant-upload-hint">
                  Sau <span>apasă</span> pentru a alege un fișier
                </p>
              </Dragger>
            </Form.Item>
            <Form.Item name="blogTitle" label="Titlu blog">
              <Input size="large" />
            </Form.Item>
            <Form.Item name="blogDesc" label="Descriere scurta blog">
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="blogKeywords"
              label="Adauga cuvinte cheie pentru pagina de blog"
            >
              <Select mode="tags" />
            </Form.Item>
            <Form.Item
              name="blogImg"
              label="Imagine pagina de blog"
              className="add-product-content"
            >
              <Dragger {...fileBlogUploadProps}>
                <p className="ant-upload-drag-icon">
                  <FeatherIcon icon="upload" size={40} />
                </p>
                <Heading as="h4" className="ant-upload-text">
                  Trage o imagine in acest dreptunghi
                </Heading>
                <p className="ant-upload-hint">
                  Sau <span>apasă</span> pentru a alege un fișier
                </p>
              </Dragger>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                isLoading={isLoading}
                outlined
              >
                Salveaza modificarile!
              </Button>
            </Form.Item>
          </Form>
        </Cards>
      </Main>
    </>
  );
};

export default Seo;
