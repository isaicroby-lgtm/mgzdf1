"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Input, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";

import { sendEmail } from "@/api/email";
import { getAllRefunds, getFiles } from "@/api/refund";
import { getAllContacts } from "@/api/contact";
import { filterList } from "@/utility/utils";
import Text from "@/components/atoms/Text";
import { Main, TableWrapper } from "@/components/style";
import theme from "@/components/atoms/theme";
import { TopToolBox } from "@/components/organisms/style";
import Cards from "@/components/atoms/Cards";
import PageHeader from "@/components/atoms/PageHeader";
import { ModalMessage } from "@/components/organisms/modals/modal-message";

const TableWithAlignEnd = styled(Table)`
  .ant-table-cell:last-child {
    text-align: end;
  }
`;

const columnsRetur = [
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Data",
    dataIndex: "date_created",
    key: "date_created",

    sorter: (a, b) => {
      return b.timestamp - a.timestamp;
    },
  },

  {
    title: "Nume",
    dataIndex: "name",
    key: "name",

    sorter: (a, b) => {
      return b.name?.localeCompare(a.name);
    },
  },
  {
    title: "Nr. telefon",
    dataIndex: "phone",
    key: "phone",

    sorter: (a, b) => {
      return b.phone?.localeCompare(a.phone);
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",

    sorter: (a, b) => {
      return b.email?.localeCompare(a.email);
    },
  },
  {
    title: "Dorinta",
    dataIndex: "wish",
    key: "wish",

    sorter: (a, b) => {
      return b.wish?.localeCompare(a.wish);
    },
  },
  {
    title: "Nr. comanda",
    dataIndex: "orderNumber",
    key: "orderNumber",

    sorter: (a, b) => {
      return b.orderNumber?.localeCompare(a.orderNumber);
    },
  },
];

const columnsEmails = [
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },

  {
    title: "Data",
    dataIndex: "date_created",
    key: "date_created",

    sorter: (a, b) => {
      return b.timestamp - a.timestamp;
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",

    sorter: (a, b) => {
      return b.email?.localeCompare(a.email);
    },
  },

  {
    title: "Subiect",
    dataIndex: "subject",
    key: "subject",

    sorter: (a, b) => {
      return b.subject?.localeCompare(a.subject);
    },
  },

  // also it should have an id field for searching through the list
];

const columnsContact = [
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },

  {
    title: "Data",
    dataIndex: "date_created",
    key: "date_created",

    sorter: (a, b) => {
      return b.timestamp - a.timestamp;
    },
  },

  {
    title: "Nume",
    dataIndex: "name",
    key: "name",

    sorter: (a, b) => {
      return b.name?.localeCompare(a.name);
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",

    sorter: (a, b) => {
      return b.email?.localeCompare(a.email);
    },
  },
  {
    title: "Nr. telefon",
    dataIndex: "phone",
    key: "phone",

    sorter: (a, b) => {
      return b.phone?.localeCompare(a.phone);
    },
  },
  {
    title: "Titlu",
    dataIndex: "title",
    key: "title",

    sorter: (a, b) => {
      return b.title?.localeCompare(a.title);
    },
  },
];

export const filterKeyContact = [
  "asteapta un raspuns",
  "conversatie incheiata",
];

const filterEmailsKeys = ["citite", "necitite"];

const MessagesForms = () => {
  const [message, setMessage] = useState();

  const [searchContactValue, setSearchContactValue] = useState("");
  const [searchReturValue, setSearchReturValue] = useState("");
  const [searchEmailsValue, setSearchEmailsValue] = useState("");

  const [filterContactValue, setFilterContactValue] = useState("");
  const [filterReturValue, setFilterReturValue] = useState("");
  const [filterEmailsValue, setFilterEmailsValue] = useState();

  const [refunds, setRefunds] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [emailContent, setEmailContent] = useState("");
  const [recipientEmail, setRecipientEmail] = useState(null);
  const [emailSubject, setEmailSubject] = useState(null);

  const filteredEmails = useMemo(() => {
    return [];
  }, []);

  const filteredRefunds = useMemo(() => {
    return filterList(refunds, searchReturValue, [
      "email",
      "name",
      "orderNumber",
    ])?.filter((x) => x.status === filterReturValue || filterReturValue == "");
  }, [searchReturValue, refunds, filterReturValue]);

  const filteredContacts = useMemo(() => {
    return filterList(contacts, searchContactValue, [
      "email",
      "name",
      "title",
    ])?.filter(
      (x) => x.status === filterContactValue || filterContactValue == ""
    );
  }, [searchContactValue, contacts, filterContactValue]);

  const handleSendEmail = async () => {
    if (!emailContent) {
      alert("Continutul mesajului este gol");
      return;
    }

    const emailObj = {
      html: emailContent,
      to: recipientEmail,
      subject: emailSubject,
    };

    await sendEmail(emailObj.html, emailObj.subject, emailObj.to);

    setMessage();

    setEmailSubject(null);
    setRecipientEmail(null);
    setEmailContent("");
  };

  useEffect(() => {
    if (emailSubject === null && message) {
      if (message.type === "formular-contact")
        setEmailSubject("Raspuns la " + message.title);
      else if (message.type === "retur")
        setEmailSubject("Raspuns la formularul de retur " + message.id);
    }
    if (recipientEmail === null && message) setRecipientEmail(message.email);
  }, [message]);

  useEffect(() => {
    const fetchRefunds = async () => {
      let _refunds = await getAllRefunds();

      _refunds = _refunds.map((refund) => {
        refund.date_created = dayjs(refund.timestamp?.toDate()).format(
          "DD/MM/YYYY HH:mm"
        );
        refund.wish = refund.request;
        refund.orderNumber = refund.invoiceNumber;
        refund.key = refund.id;
        return refund;
      });

      setRefunds([..._refunds]);
    };

    const fetchContacts = async () => {
      let _contacts = await getAllContacts();

      _contacts = _contacts.map((contact) => {
        contact.date_created = dayjs(contact.timestamp?.toDate()).format(
          "DD/MM/YYYY HH:mm"
        );
        contact.title = contact.subject;
        contact.key = contact.id;
        return contact;
      });
      setContacts([..._contacts]);
    };

    fetchRefunds();
    fetchContacts();
  }, []);

  return (
    <>
      <PageHeader title="Mesaje si formulare" />
      <ModalMessage
        message={message}
        setMessage={setMessage}
        emailContent={emailContent}
        setEmailContent={setEmailContent}
        setRefunds={setRefunds}
        setContacts={setContacts}
        handleSendEmail={handleSendEmail}
        setEmailSubject={setEmailSubject}
        emailSubject={emailSubject}
        setRecipientEmail={setRecipientEmail}
        recipientEmail={recipientEmail}
        hideFooter={message?.type === "email"}
      />
      <Main theme={theme}>
        <Cards title={<Text as="p5">Formulare de contact</Text>}>
          <TopToolBox
            theme={theme}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <Input
              size="large"
              placeholder="Cauta un formular dupa email nume sau titlu."
              value={searchContactValue}
              onChange={(v) => setSearchContactValue(v.target.value)}
            />
            <Radio.Group
              onChange={(event) => {
                const { value } = event.target;
                setFilterContactValue(value);
              }}
              defaultValue=""
            >
              <Radio.Button value="">toate</Radio.Button>
              {[...new Set(filterKeyContact)].map((value) => {
                return (
                  <Radio.Button
                    key={value.toLowerCase()}
                    value={value.toLowerCase()}
                  >
                    {value}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </TopToolBox>

          <Row gutter={15}>
            <Col xs={24}>
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <TableWithAlignEnd
                  dataSource={filteredContacts}
                  columns={columnsContact}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        setMessage({
                          type: "formular-contact",
                          ...filteredContacts.find((x) => x.id === record.id),
                        });
                      },
                    };
                  }}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Cards>

        <Cards title={<Text as="p5">Formulare de retur </Text>}>
          <TopToolBox
            theme={theme}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <Input
              size="large"
              placeholder="Cauta un formular dupa email nume sau nr.comanda"
              value={searchReturValue}
              onChange={(e) => setSearchReturValue(e.target.value)}
            />
            <Radio.Group
              onChange={(event) => {
                const { value } = event.target;
                setFilterReturValue(value);
              }}
              defaultValue=""
            >
              <Radio.Button value="">toate</Radio.Button>
              {[...new Set(filterKeyContact)].map((value) => {
                return (
                  <Radio.Button
                    key={value.toLowerCase()}
                    value={value.toLowerCase()}
                  >
                    {value}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </TopToolBox>

          <Row gutter={15}>
            <Col xs={24}>
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <TableWithAlignEnd
                  dataSource={filteredRefunds}
                  columns={columnsRetur}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: async (event) => {
                        const f = await getFiles(record.files);

                        setMessage({
                          type: "retur",
                          ...filteredRefunds.find((x) => x.id === record.id),
                          files: f,
                        });
                      },
                    };
                  }}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default MessagesForms;
