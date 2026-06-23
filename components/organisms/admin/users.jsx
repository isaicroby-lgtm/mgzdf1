"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Col, Input, InputNumber, Row, Table } from "antd";
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import FeatherIcon from "feather-icons-react";
import styled from "styled-components";
import dayjs from "dayjs";

import Editor from "ckeditor5-cb/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { getUidOrders } from "@/api/comenzi";
import { getUserRefunds } from "@/api/refund";
import { getUserContacts } from "@/api/contact";
import { auth } from "@/public/firebase";
import { getAllUsers, setPoints } from "@/api/users";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import PageHeader from "@/components/atoms/PageHeader";
import { Main, TableWrapper } from "@/components/style";
import theme from "@/components/atoms/theme";
import Cards from "@/components/atoms/Cards";
import Modal from "@/components/atoms/Modal";

import { TopToolBox } from "../style";
import { ModalMessage } from "../modals/modal-message";
import { ModalPane } from "../modals/modal-account";
import Orders from "./orders";
import { sendEmail } from "@/api/email";
import { filterList } from "@/utility/utils";

const OrdersForUtilizatori = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .ant-card-body,
  .sc-eldPxv {
    padding: 0 !important;
  }
`;

const TableWithAlignEnd = styled(Table)`
  .ant-table-cell:last-child {
    text-align: end;
  }
`;

const columnsProdusePreferate = [
  {
    title: "Nume produs",
    dataIndex: "name",
    key: "name",
  },

  {
    title: "Nr. bucati cumparate",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "Nr. comenzi completate cu acest produs in cos",
    dataIndex: "ordersCount",
    key: "ordersCount",
  },

  {
    title: "Id produs",
    dataIndex: "id",
    key: "id",
  },
];

const columnsStatisticiUser = [
  {
    title: "Nr. comenzi",
    key: "ordersCount",
    dataIndex: "ordersCount",
  },
  {
    title: "Valoarea medie a unei comenzi",
    key: "averageOrderValue",
    dataIndex: "averageOrderValue",
  },

  {
    title: "Data ultimei comenzi",
    dataIndex: "lastOrder",
    key: "lastOrder",
  },
];

const columns = [
  {
    title: "Nume familie",
    dataIndex: "lastName",
    key: "lastName",

    sorter: (a, b) => {
      return b.lastName?.localeCompare(a.lastName);
    },
  },
  {
    title: "Prenume",
    dataIndex: "firstName",
    key: "firstName",

    sorter: (a, b) => {
      return b.firstName?.localeCompare(a.firstName);
    },
  },
  {
    title: "Nr. tel",
    dataIndex: "phone",
    key: "phone",

    sorter: (a, b) => {
      return b.phone?.localeCompare(a.phone);
    },
  },

  {
    title: "Ultima accesare",
    dataIndex: "lastActivity",
    key: "lastActivity",

    sorter: (a, b) => {
      return b.lastActivityTimestamp - a.lastActivityTimestamp;
    },
  },
  {
    title: "Data crearii contului",
    dataIndex: "userCreatedAt",
    key: "userCreatedAt",

    sorter: (a, b) => {
      return b.userCreatedAtTimestamp - a.userCreatedAtTimestamp;
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
];

const columnsGeneralUser = [
  {
    title: "Nume familie",
    dataIndex: "lastName",
  },
  {
    title: "Prenume",
    dataIndex: "firstName",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  { title: "Nr. telefon", dataIndex: "phone" },
  { title: "Puncte fidelitate", dataIndex: "puncte_fidelitate" },
  { title: "Id", dataIndex: "uid" },
];

const columnsInteractiuni = [
  { title: "Tip", dataIndex: "type", key: "type" },
  { title: "Titlu", dataIndex: "title", key: "title" },
  { title: "Data", dataIndex: "date", key: "date" },
];

const UsersPage = ({ sentFromAnother, rowProps }) => {
  const [openUser, setOpenUser] = useState();
  const [openInteraction, setOpenInteraction] = useState();
  const [searchForUserText, setSearchForUserText] = useState();
  const [users, setUsers] = useState([]);

  const [emailContent, setEmailContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [openSureModal, setOpenSureModal] = useState();
  const [fidelityPoints, setFidelityPoints] = useState(0);

  const [links, setLinks] = useState([
    {
      name: "general",
      title: "Generale",
      active: true,
    },
    {
      name: "comenzi",
      title: "Istoric comenzi",
    },
    {
      name: "interactiuni",
      title: "Interactiuni cu doifrati.ro",
    },
    {
      name: "trimite email",
      title: "Trimite email",
    },
  ]);

  const handleSelectTab = (nameOfLinkClicked) => {
    setLinks((prev) => {
      const linksLocal = prev.map((link) => {
        link.active = nameOfLinkClicked === link.name;
        return link;
      });
      return linksLocal;
    });
  };

  const activeLink = links?.filter((link) => link.active)?.[0]?.name;

  const _sendEmail = async () => {
    if (!emailSubject || !emailBody || !openUser?.email) return;

    try {
      setIsLoading(true);
      await sendEmail(emailBody, emailSubject, openUser.email);
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const _users = await getAllUsers();

      setUsers(
        _users
          ?.filter((x) => x.uid !== auth?.currentUser?.uid)
          ?.map((u) => ({ ...u, key: u.uid }))
      );
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return filterList(users, searchForUserText, [
      "email",
      "phone",
      "uid",
      "firstName",
      "lastName",
    ]);
  }, [searchForUserText, users]);

  useEffect(() => {
    setFidelityPoints(openUser?.puncte_fidelitate);
  }, [openUser?.puncte_fidelitate]);

  return (
    <>
      <Modal
        visible={openSureModal}
        onCancel={() => setOpenSureModal()}
        width={"700px"}
        title={`Esti sigur ca vrei sa schimbi punctele de fidelitate a acestui
          utilizator? (utilizatorul ${openSureModal?.email} nu va fi anuntat)`}
        isLoading={isLoading}
        onOk={async () => {
          setIsLoading(true);
          await setPoints(openSureModal.uid, fidelityPoints);

          setUsers((prev) => {
            const prevUsers = [...prev];
            const uI = prevUsers.findIndex((x) => x.uid === openSureModal.uid);

            prevUsers[uI].puncte_fidelitate = fidelityPoints;

            return prevUsers;
          });

          setIsLoading(false);

          setOpenSureModal();
        }}
      ></Modal>

      <ModalMessage
        message={openInteraction}
        setMessage={setOpenInteraction}
        emailContent={emailContent}
        setEmailContent={setEmailContent}
      />

      <Modal
        visible={openUser}
        width={"1200px"}
        onCancel={() => setOpenUser()}
        title={<ModalPane handleClick={handleSelectTab} links={links} />}
        footer={null}
      >
        <div style={{ marginTop: 16 }}></div>
        {activeLink === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Cards title="Informatii client">
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <TableWithAlignEnd
                  dataSource={[openUser]}
                  columns={columnsGeneralUser}
                />
              </TableWrapper>
            </Cards>

            <Cards title="Statistici">
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <TableWithAlignEnd
                  dataSource={[openUser]}
                  columns={columnsStatisticiUser}
                />
              </TableWrapper>
            </Cards>

            <Cards title="Produsele cumparate">
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <TableWithAlignEnd
                  dataSource={openUser?.products}
                  columns={columnsProdusePreferate}
                />
              </TableWrapper>
            </Cards>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: 8,
                }}
              >
                <Text as="p5">
                  Schimba numarul de puncte de fidelitate ale utilizatorului
                </Text>

                <InputNumber
                  value={fidelityPoints}
                  onChange={(v) => setFidelityPoints(v)}
                />
                <Button
                  type="primary"
                  onClick={() => setOpenSureModal(openUser)}
                >
                  Schimba puncte
                </Button>
              </div>

              <Button
                type="danger"
                style={{ width: "fit-content" }}
                onClick={async () => {
                  const _auth = getAuth();
                  sendPasswordResetEmail(_auth, openUser.email)
                    .catch((error) => {
                      console.log(error);
                      alert("Eroare la trimiterea email-ului de resetare");
                    })
                    .then(() => {
                      alert("Email-ul de resetare a fost trimis");
                    });
                }}
              >
                Trimite email de resetare parola utilizatorului
              </Button>
            </div>
          </div>
        )}
        {activeLink === "comenzi" && (
          <OrdersForUtilizatori>
            <Orders sentFromAnother={true} filterEmail={openUser?.email} />
          </OrdersForUtilizatori>
        )}
        {activeLink === "interactiuni" && (
          <Row gutter={15}>
            <Col xs={24}>
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <TableWithAlignEnd
                  dataSource={openUser?.interactiuni}
                  columns={columnsInteractiuni}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        setOpenInteraction(
                          openUser.interactiuni.find(
                            (int) => int.id === record.id
                          )
                        );
                      },
                    };
                  }}
                />
              </TableWrapper>
            </Col>
          </Row>
        )}

        {activeLink === "trimite email" && (
          <Row gutter={15}>
            <Col xs={24}>
              <Input
                placeholder="Subiect"
                size="large"
                value={emailSubject}
                onChange={(v) => {
                  setEmailSubject(v.target.value);
                }}
                style={{ marginBottom: 12 }}
              />

              <CKEditor
                editor={Editor}
                data={emailBody}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEmailBody(data);
                }}
              />

              <Button
                type="primary"
                style={{ marginTop: 12 }}
                isLoading={isLoading}
                disabled={!emailBody || !emailSubject}
                onClick={_sendEmail}
              >
                Trimite email
              </Button>
            </Col>
          </Row>
        )}
      </Modal>
      {!sentFromAnother ? <PageHeader title="Utilizatori" /> : null}

      {!sentFromAnother ? (
        <Main theme={theme}>
          <Cards headless>
            <Row gutter={15}>
              <Col xs={24}>
                <TopToolBox theme={theme}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <Input
                      onChange={(e) => setSearchForUserText(e.target.value)}
                      size="large"
                      style={{ width: "50%", minWidth: 300 }}
                      suffix={<FeatherIcon icon="search" size={18} />}
                    />
                  </div>
                </TopToolBox>
              </Col>
            </Row>
            <Row gutter={15}>
              <Col xs={24}>
                <TableWrapper
                  theme={theme}
                  className="table-order table-responsive"
                >
                  <TableWithAlignEnd
                    dataSource={filteredUsers}
                    columns={columns}
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: async (event) => {
                          const user = filteredUsers.find(
                            (us) => us.uid === record.uid
                          );

                          const orders = await getUidOrders(user.uid);

                          user.ordersCount = orders.length;
                          if (
                            orders.filter((order) => order.status === "livrata")
                              .length > 0
                          )
                            user.averageOrderValue =
                              orders.reduce((acc, order) => {
                                return (
                                  acc +
                                  order.price *
                                    (order.status === "livrata" ? 1 : 0)
                                );
                              }, 0) /
                              orders.filter(
                                (order) => order.status === "livrata"
                              ).length;
                          else user.averageOrderValue = 0;

                          let maxTs = orders[0]?.timestamp;
                          for (const o of orders) {
                            if (o.timestamp.seconds > maxTs.seconds)
                              maxTs = o.timestamp;
                          }

                          user.lastOrder =
                            dayjs(maxTs?.toDate())
                              .format("DD.MM.YYYY, HH:mm")
                              .toString() ?? "N/A";

                          const productsById = new Map();

                          for (const order of orders) {
                            if (!order.products) continue;

                            for (const product of order.products) {
                              if (!productsById.has(product.id)) {
                                productsById.set(product.id, {
                                  name: product.name,
                                  count: product.quantity,
                                  ordersCount: 1,
                                  id: product.id,
                                });
                              } else {
                                const p = productsById.get(product.id);
                                p.count += product.quantity;
                                p.ordersCount++;
                                productsById.set(product.id, p);
                              }
                            }
                          }
                          const products = [...productsById.values()];
                          user.products = products;

                          const refunds = await getUserRefunds(user.uid);
                          const contacts = await getUserContacts(user.uid);

                          for (const refund of refunds) {
                            refund.type = "retur";
                            refund.date = dayjs(refund.timestamp?.toDate())
                              .format("DD.MM.YYYY, HH:mm")
                              .toString();
                            refund.title = "Formular retur " + refund.id;
                          }
                          for (const contact of contacts) {
                            contact.type = "formular-contact";
                            contact.date = dayjs(contact.timestamp?.toDate())
                              .format("DD.MM.YYYY, HH:mm")
                              .toString();
                            contact.title = contact.subject;
                          }

                          user.interactiuni = [...refunds, ...contacts];

                          setOpenUser(user);
                        },
                      };
                    }}
                  />
                </TableWrapper>
              </Col>
            </Row>
          </Cards>
        </Main>
      ) : (
        <Row gutter={15}>
          <Col xs={24}>
            <TableWrapper
              theme={theme}
              className="table-order table-responsive"
            >
              <TableWithAlignEnd
                rowSelection={sentFromAnother === "emails" ? rowProps : {}}
                dataSource={filteredUsers}
                columns={columns}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      setOpenUser(filteredUsers[record?.key - 1]);
                    },
                  };
                }}
              />
            </TableWrapper>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UsersPage;
