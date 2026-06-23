"use client";

import { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";

import Editor from "ckeditor5-cb/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { deleteContact, updateMessageStatus } from "@/api/contact";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import theme from "@/components/atoms/theme";
import Text from "@/components/atoms/Text";
import { BadgeStyle } from "@/utility/renderBadge";

import { filterKeyContact } from "../admin/messages-forms";

const ComponentaDeStatus = ({ options, message, closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSaveStatus = async (status) => {
    setLoading(true);

    await updateMessageStatus(message.id, message.type, status.status);

    window?.location?.reload();

    closeModal();

    setLoading(false);
  };

  if (!options || !message) return;
  return (
    <>
      <Form
        layout="inline"
        style={{ rowGap: 14, marginTop: 12 }}
        initialValues={message}
        onFinish={handleSaveStatus}
      >
        <Form.Item name="status">
          <Select style={{ width: 224 }}>
            {options.map((status) => {
              let color;
              switch (status) {
                case "asteapta un raspuns":
                  color = theme["rate-star-color"];
                  break;
                case "conversatie incheiata":
                  color = theme["nav-green"];
                  break;

                default:
                  color = "black";
              }

              return (
                <Select.Option
                  key={status}
                  value={status}
                  label={status}
                  style={{ height: "fit-content" }}
                >
                  <BadgeStyle color={color}>{status}</BadgeStyle>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ padding: "8px 20px" }}
            isLoading={loading}
          >
            Schimbă statusul mesajului
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export const ModalMessage = ({
  message,
  setMessage,
  recipientEmail,
  setRecipientEmail,
  emailSubject,
  setEmailSubject,
  emailContent,
  setEmailContent,
  setRefunds,
  setContacts,
  handleSendEmail,
  hideStatusComponent,
  hideFooter,
}) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!message) return;

  return (
    <Modal
      visible={message}
      onCancel={() => setMessage()}
      footer={
        hideFooter ? null : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Input
              size="large"
              placeholder="Email la care se trimite mesajul"
              value={recipientEmail}
              onChange={(v) => setRecipientEmail(v)}
            />
            <Input
              size="large"
              placeholder="Subiectul mesajului"
              value={emailSubject}
              onChange={(v) => {
                setEmailSubject(v);
              }}
            />

            <CKEditor
              editor={Editor}
              data={emailContent}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEmailContent(data);
              }}
            />

            <Button
              type="primary"
              outlined
              isLoading={loading2}
              onClick={async () => {
                setLoading2(true);
                await handleSendEmail();
                setLoading2(false);
              }}
            >
              Trimite email
            </Button>

            {hideStatusComponent ? null : (
              <ComponentaDeStatus
                options={filterKeyContact}
                message={message}
                closeModal={setMessage}
              />
            )}

            <Button
              type="danger"
              outlined
              loading={loading1}
              style={{ width: "fit-content", padding: "8px 20px" }}
              onClick={() => {
                setConfirmDelete(true);
              }}
            >
              Sterge acest mesaj
            </Button>
            <Modal
              visible={confirmDelete}
              title="Esti sigur ca vrei sa stergi acest mesaj?"
              onCancel={() => setConfirmDelete()}
              onOk={async () => {
                setLoading1(true);

                await deleteContact(message.id, message.type);
                setLoading1(false);

                if (message.type === "retur") {
                  setRefunds((prev) => prev.filter((x) => x.id !== message.id));
                } else if (message.type === "formular-contact") {
                  setContacts((prev) =>
                    prev.filter((x) => x.id !== message.id)
                  );
                }

                setConfirmDelete();
                setMessage();
              }}
            />
          </div>
        )
      }
    >
      {message.type === "formular-contact" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Data:
            </span>
            {message?.date_created}
          </Text>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Nume:
            </span>
            {message?.name}
          </Text>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Email:
            </span>
            {message?.email}
          </Text>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Nr. tel:
            </span>
            {message?.phone || "nespecificat"}
          </Text>
          <Text as="p5" style={{ marginBottom: 16 }}>
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Titlu:
            </span>
            {message?.title}
          </Text>
          <Text as="p5" style={{ fontWeight: 600 }}>
            Mesaj:
          </Text>
          <Text as="p5">{message?.message}</Text>
        </div>
      ) : message.type === "retur" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Data:
            </span>
            {message?.date_created}
          </Text>

          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Email:
            </span>
            {message?.email}
          </Text>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Nume:
            </span>
            {message?.name}
          </Text>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Nr. tel:
            </span>
            {message?.phone}
          </Text>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Nr. factura:
            </span>
            {message?.orderNumber}
          </Text>
          <Text as="p5" style={{ marginBottom: 16 }}>
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Dorinta:
            </span>
            {message?.wish}
          </Text>
          <Text as="p5" style={{ marginBottom: 16 }}>
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Motiv:
            </span>
            {message?.reason}
          </Text>
          <Text as="p5" style={{ fontWeight: 600 }}>
            Mesaj:
          </Text>

          <Text as="p5">{message?.message}</Text>
          {message?.files?.length ? (
            <>
              <Text as="p5">
                <span
                  style={{
                    fontWeight: 600,
                    display: "inline-block",
                    marginRight: 6,
                  }}
                >
                  Fisiere incarcate:
                </span>
              </Text>

              <div>
                {message.files.map((file) => {
                  return (
                    <div key={file.fileDownloadURL}>
                      <a
                        href={file.fileDownloadURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.name}
                      </a>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      ) : message.type === "email" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Text as="p5">Email:</Text>

          <Input
            size="large"
            placeholder="Email la care se trimite mesajul"
            value={recipientEmail}
            readOnly={true}
          />

          <Text as="p5">Subiect:</Text>

          <Input
            size="large"
            placeholder="Subiectul e-mailului initial"
            value={message.subject}
            readOnly={true}
          />

          <Text as="p5">Continut:</Text>
          <CKEditor editor={Editor} data={message.content} disabled={true} />

          <Text as="p5">Raspuns:</Text>

          <CKEditor
            editor={Editor}
            data={emailContent}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEmailContent(data);
            }}
          />

          <Button
            type="primary"
            outlined
            isLoading={loading2}
            onClick={async () => {
              setLoading2(true);
              await handleSendEmail();
              setLoading2(false);
            }}
          >
            Trimite raspunsul
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              Titlu:
            </span>{" "}
            {message?.titlu}
          </Text>

          <Text as="p5">
            <span style={{ fontWeight: 600, display: "inline-block" }}>
              Mesaj:
            </span>
          </Text>

          <Text as="p5">
            <span
              style={{
                fontWeight: 600,
                display: "inline-block",
                marginRight: 6,
              }}
            >
              {message.message}
            </span>
          </Text>
        </div>
      )}
    </Modal>
  );
};
