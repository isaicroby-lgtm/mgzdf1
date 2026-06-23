"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Radio, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import Dragger from "antd/lib/upload/Dragger";
import FeatherIcon from "feather-icons-react";

import { postRefund } from "@/api/refund";
import { isValidEmail } from "@/components/organisms/modals/modal-account";
import { BasicWrapperForLegal } from "@/components/atoms/other-styled-components";
import ViewStaticPage from "@/components/organisms/static-pages/view-static-page";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";

const RefundPolicyPage = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [refundId, setRefundId] = useState("");
  const [formRetur] = useForm();

  const onFinish = async (values) => {
    if (isValidEmail(values.email)) {
      const _refund = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        invoiceNumber: values.invoiceNumber,
        request: values.request,
        reason: values.reason,
        message: values.message,
        status: "asteapta un raspuns",
      };

      setLoading(true);
      setRefundId(await postRefund(_refund, files));
      setLoading(false);
    } else alert("Te rugam sa introduci o adresa de email valida!");
  };

  const fileUploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg, .png, video/mp4",
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "removed") {
        if (!files.length || files.length === 1) {
          formRetur.setFieldValue("file", null);
          setFiles(info.fileList);
        } else {
          setFiles(info.fileList);
        }
      } else {
        formRetur.setFieldValue("file", info.file);
        formRetur.validateFields(["file"]);

        setFiles(info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} fisierul a fost uploadat cu succes`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} fisierul nu a fost uploadat. A aparut o eroare`
        );
      }
    },
    listType: "picture",
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" onClick={(e) => {}} />,
    },
  };

  useEffect(() => {
    if (refundId) {
      const el = document.getElementById("registered-refund");

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [refundId]);

  return (
    <>
      <BasicWrapperForLegal>
        <ViewStaticPage title="Politica de retur" />
        {!refundId && (
          <>
            <h5>Formular de retur</h5>
            <Form
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={() =>
                alert("Hei! Ai uitat să completezi un câmp!")
              }
            >
              <Form.Item
                name="name"
                label="Nume complet"
                rules={[
                  { required: true, message: "Acest camp este obligatoriu" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Telefon"
                rules={[
                  { required: true, message: "Acest camp este obligatoriu" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Acest camp este obligatoriu" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="invoiceNumber"
                label="Numar Factura"
                rules={[
                  { required: true, message: "Acest camp este obligatoriu" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="request"
                label="Ce se doreste"
                rules={[
                  { required: true, message: "Acest camp este obligatoriu" },
                ]}
              >
                <Radio.Group>
                  <Radio value="schimbare-produs">Schimbarea produsului</Radio>
                  <Radio value="retur-contravaloare">
                    Returnare contravaloare
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="reason"
                label="Motivul returului"
                rules={[
                  { required: true, message: "Acest camp este obligatoriu" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="message"
                label="Mesajul tău (IBAN si alte detalii)"
                rules={[
                  { required: true, message: "Acest camp este obligatoriu" },
                ]}
              >
                <TextArea />
              </Form.Item>
              <Form.Item
                name="file"
                label="Imagini sau videoclipuri cu produsul"
                className="add-product-content"
              >
                <Dragger {...fileUploadProps}>
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
                  htmlType="submit"
                  type="primary"
                  outlined
                  isLoading={loading}
                >
                  Trimite mesajul
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {refundId && (
          <>
            <h5 id="registered-refund">
              Retur înregistrat cu succes
              <br />
              Număr retur: {refundId}
            </h5>
          </>
        )}
      </BasicWrapperForLegal>
    </>
  );
};

export default RefundPolicyPage;
