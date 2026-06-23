"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

import { postContact } from "@/api/contact";

import { isValidEmail } from "@/components/organisms/modals/modal-account";

import Text from "../Text";
import Button from "../Button";
import theme from "../theme";
import { errorReformatted } from "../errorReformatted";

const ContactForm = ({ messageForm, linkOpened }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { user, errorUser } = useSelector((state) => ({
    user: state.userInfo,
    errorUser: state.userInfo.error,
  }));

  const handleSubmitMsg = async (vals) => {
    if (isValidEmail(vals.email)) {
      setIsLoading((prev) => ({ ...prev, contact: true }));

      const msg = {
        email: vals.email,
        name: vals.fullName,
        phone: vals.phone || "",
        subject: vals.title,
        message: vals.message,
        status: "asteapta un raspuns",
      };

      await postContact(msg);

      setIsLoading((prev) => ({ ...prev, contact: false }));
      alert("Mesaj trimis cu succes!");
      window?.location?.reload();
    } else alert("Te rugam sa introduci o adresa de email valida!");
  };

  return (
    <>
      <Form
        form={messageForm}
        onFinish={handleSubmitMsg}
        onFinishFailed={() =>
          alert("Salutare! Ai uitat să completezi un câmp!")
        }
        initialValues={
          user
            ? typeof linkOpened?.sentFromAnother === "object"
              ? {
                  ...user,
                  fullName: `${user.firstName} ${user.lastName}`,
                  ...linkOpened?.sentFromAnother,
                }
              : { ...user, fullName: `${user.firstName} ${user.lastName}` }
            : {}
        }
        name="account-contact"
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[{ message: "", required: true }]}
          label="Adresa ta de email"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item name="phone" label="Numarul tau de telefon ( Optional )">
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="fullName"
          rules={[{ message: "", required: true }]}
          label="Cum te numești"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="title"
          rules={[{ message: "", required: true }]}
          label="Despre ce vrei să ne scrii"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="message"
          rules={[{ message: "", required: true }]}
          label="Ce vrei să ne zici"
        >
          <TextArea />
        </Form.Item>
        <Form.Item style={{ margin: 0, marginTop: 16 }}>
          <Button
            className="btn-signin"
            htmlType="submit"
            isLoading={isLoading?.["contact"]}
            type="primary"
          >
            {isLoading?.["contact"] ? "Se incarca..." : "Trimite mesajul"}
          </Button>
        </Form.Item>
        {errorUser && (
          <Text
            as="p6"
            style={{ color: theme["secondary-color"], marginTop: 16 }}
          >
            {errorReformatted(errorUser)}
          </Text>
        )}
      </Form>
    </>
  );
};

export default ContactForm;
