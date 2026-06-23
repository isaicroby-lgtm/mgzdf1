"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { Col, Form, Input, InputNumber, Row, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import Editor from "ckeditor5-cb/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  createUserGroup,
  deleteUserGroup,
  fetchUserGroups,
  fetchUsersPerProducts,
} from "@/api/emailMarketing";
import { sendEmailToGroup } from "@/api/email";

import Text from "@/components/atoms/Text";
import { Main, TableWrapper } from "@/components/style";
import theme from "@/components/atoms/theme";
import Modal from "@/components/atoms/Modal";
import UsersPage from "@/components/organisms/admin/users";
import Button from "@/components/atoms/Button";
import PageHeader from "@/components/atoms/PageHeader";
import Cards from "@/components/atoms/Cards";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? <InputNumber /> : <Input size="large" />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const columnsProduse = [
  {
    title: "Nume",
    key: "name",
    dataIndex: "name",

    sorter: (a, b) => {
      return b.name?.localeCompare(a.name);
    },
  },
  {
    title: "Pret",
    key: "price",
    dataIndex: "price",

    sorter: (a, b) => {
      return b.price - a.price;
    },
  },
  {
    title: "Nr. buc in stoc",
    key: "stock",
    dataIndex: "stock",

    sorter: (a, b) => {
      return b.stock - a.stock;
    },
  },
  {
    title: "Nr. persoane care au cumparat acest produs",
    key: "timesBought",
    dataIndex: "timesBought",

    sorter: (a, b) => {
      return b.timesBought - a.timesBought;
    },
  },
  {
    title: "Cod",
    key: "code",
    dataIndex: "code",

    sorter: (a, b) => {
      return b.code?.localeCompare(a.code);
    },
  },
];

const EmailMarketing = () => {
  const [users, setUsers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [userKeys, setUserKeys] = useState([]);
  const [productsKeys, setProductsKeys] = useState([]);

  const [emailBody, setEmailBody] = useState();
  const [confirmDelete, setConfirmDelete] = useState();
  const [name, setName] = useState();
  const [emailSubject, setEmailSubject] = useState();
  const [openCreateUserList, setOpenCreateUserList] = useState();
  const [openCreateModal, setOpenCreateModal] = useState();
  const [isLoading, setIsLoading] = useState();
  const [userGroups, setUserGroups] = useState();

  const { userInfo } = useStore((x) => ({ userInfo: x.userInfo }));

  const [productsWithUsers, setProductsWithUsers] = useState([]);

  const { productsAll } = useSelector((state) => {
    let prAll = state.products?.productsAll || [];
    return {
      productsAll: prAll,
    };
  });

  const createGrupUtilizatori = async () => {
    if (
      !(
        name &&
        (users?.length || selectedProducts?.length) &&
        (userKeys || productsKeys)
      )
    )
      alert("Toate campurile sunt obligatorii!");
    else {
      await createUserGroup(name, users, selectedProducts);
      window?.location?.reload();
    }
  };

  const handleCreeazaCampanie = async () => {
    setIsLoading(true);
    try {
      if (emailBody && emailSubject && openCreateModal && openCreateModal.id) {
        await sendEmailToGroup(emailBody, emailSubject, openCreateModal.id);
        setEmailSubject("");
        setEmailBody("");
        setOpenCreateModal();
      } else alert("Toate campurile sunt obligatorii");
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columnsPastCampaigns = [
    {
      title: "Nume lista",
      dataIndex: "name",
      key: "name",

      sorter: (a, b) => {
        return b.name?.localeCompare(a.name);
      },
    },
    {
      title: "Nr. de utilizatori in lista",
      dataIndex: "usersCount",
      key: "usersCount",

      sorter: (a, b) => {
        return b.usersCount - a.usersCount;
      },
    },

    {
      title: "Data crearii",
      dataIndex: "date",
      key: "date",

      sorter: (a, b) => {
        return b.timestamp - a.timestamp;
      },
    },
    {
      title: "Actiune",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "end",
            }}
          >
            <Text
              as={"p6"}
              style={{
                color: theme["secondary-color"],
                cursor: "pointer",
              }}
              onClick={async (e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
            >
              Sterge
            </Text>
            <Modal
              visible={confirmDelete}
              onCancel={() => setConfirmDelete()}
              title={"Esti sigur ca vrei sa stergi aceasta lista?"}
              onOk={async (e) => {
                e.stopPropagation();
                await deleteUserGroup(record.id);
                setUserGroups((prev) => prev.filter((g) => g.id !== record.id));
                setConfirmDelete();
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserGroups();
      setUserGroups(data?.map((d) => ({ key: d.id, ...d })));
    };
    fetchData();
  }, []);

  return (
    <>
      <Modal
        width="1200px"
        title="Creeaza un nou grup de utilizatori"
        okText="Creeaza"
        onOk={() => createGrupUtilizatori()}
        visible={openCreateUserList}
        onCancel={() => {
          setUsers([]);
          setUserKeys([]);
          setProductsKeys([]);
          setSelectedProducts([]);
          setName("");
          setOpenCreateUserList();
        }}
        color="primary"
        type="primary"
      >
        <Form layout="vertical">
          <Form.Item label="Nume">
            <Input size="large" onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Selecteaza manual persoanele implicate">
            <UsersPage
              sentFromAnother={"emails"}
              rowProps={{
                type: "checkbox",
                selectedRowKeys: userKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                  setUsers(selectedRows);
                  setUserKeys(selectedRowKeys);
                },
                getCheckboxProps: (record) => ({
                  disabled: record.uid === userInfo,
                  name: record.name,
                }),
              }}
            />
          </Form.Item>
          <Form.Item label="Selecteaza persoane in functie de produsul cumparat">
            <TableWrapper
              className="table-order table-responsive"
              theme={theme}
            >
              <Table
                rowSelection={{
                  type: "checkbox",
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedProducts(selectedRows);
                    setProductsKeys(selectedRowKeys);
                  },
                  getCheckboxProps: (record) => ({
                    disabled: false,
                    name: record.name,
                  }),
                }}
                dataSource={productsWithUsers}
                columns={columnsProduse}
              />
            </TableWrapper>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Creeaza o noua campanie de email marketing"
        width="1200px"
        visible={openCreateModal}
        footer={
          <div>
            <Button type="danger" outlined onClick={() => setOpenCreateModal()}>
              Anuleaza
            </Button>

            <Button
              type={"success"}
              outlined
              onClick={() => {
                handleCreeazaCampanie();
              }}
              isLoading={isLoading}
            >
              Creeaza campania
            </Button>
          </div>
        }
        onCancel={() => setOpenCreateModal()}
      >
        <Text
          as="p6"
          style={{
            marginBottom: 4,
            fontWeight: 700,
            marginTop: 24,
            marginBottom: 8,
          }}
        >
          Utilizatori implicati
        </Text>
        {openCreateModal?.users?.map((user) => {
          return (
            <Text as="p6" key={user.email} style={{ marginLeft: 12 }}>
              {user.email}
            </Text>
          );
        })}
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Subiect email">
            <Input
              size="large"
              name="subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Mesaj email">
            <CKEditor
              editor={Editor}
              data={emailBody}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEmailBody(data);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <PageHeader
        title={"Email marketing"}
        buttons={[
          <div key="1" className="EmailMarketing-header-actions">
            <Button
              key="4"
              type="primary"
              onClick={async () => {
                const usersByProducts = await fetchUsersPerProducts(
                  productsAll
                );
                setProductsWithUsers(usersByProducts);
                setOpenCreateUserList(true);
              }}
            >
              <FeatherIcon icon="plus" size={14} />
              Creeaza o noua lista de utilizatori
            </Button>
          </div>,
        ]}
      />

      <Main theme={theme}>
        <Cards headless>
          <Row gutter={15}>
            <Col xs={24}>
              <TableWrapper
                theme={theme}
                className="table-order table-responsive"
              >
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        setOpenCreateModal(record);
                      },
                    };
                  }}
                  dataSource={userGroups}
                  columns={columnsPastCampaigns}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default EmailMarketing;
