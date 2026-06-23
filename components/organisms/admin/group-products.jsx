"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { Checkbox, Table } from "antd";
import { usePathname } from "next/navigation";
import Modal from "@/components/atoms/Modal";
import PageHeader from "@/components/atoms/PageHeader";
import Button from "@/components/atoms/Button";
import { Main } from "@/components/style";
import theme from "@/components/atoms/theme";
import Text from "@/components/atoms/Text";
import {
  CreateGroup,
  DeleteGroup,
  UpdateGroup,
  fetchGroups,
} from "@/api/groups";

const GroupProducts = () => {
  const pathname = usePathname();

  const [openModalCreeazaGrupare, setOpenModalCreeazaGrupare] = useState();
  const [grouped, setGrouped] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editing, setEditing] = useState(false);

  const { isAdmin, products } = useSelector((state) => {
    const toReturn = {
      products: state.products.productsAll?.map((p) => ({
        name: p.name,
        id: p.id,
        groupId: p.groupId,
      })),
      isAdmin: state.userInfo.isAdmin,
    };

    return toReturn;
  });

  const handleSendGroup = async () => {
    if (editing) {
      if (grouped.length > 1) {
        await UpdateGroup(editing, grouped);
        setGroups((prev) => {
          const foundedItemIndex = prev.findIndex((x) => x.id === editing);
          const prevCopy = [...prev];
          prevCopy[foundedItemIndex] = {
            ...prevCopy[foundedItemIndex],
            products: grouped,
          };

          return prevCopy;
        });
        setOpenModalCreeazaGrupare();
        setEditing(false);
      } else
        alert(
          "Trebuie sa selectati mai mult de un produs pentru a putea crea o grupare"
        );
    } else {
      if (grouped.length > 1) {
        await CreateGroup(grouped);
        setOpenModalCreeazaGrupare();
      } else
        alert(
          "Trebuie sa selectati mai mult de un produs pentru a putea crea o grupare"
        );
    }
  };

  const handleDeleteGrooup = async () => {
    await DeleteGroup(editing);

    setGroups((prev) => {
      return prev.filter((x) => x.id !== editing);
    });
    setEditing(false);
    setOpenModalCreeazaGrupare();
  };

  const groupsWithKeys = groups.map((g) => ({
    ...g,
    key: g.id,
    name: g.products?.[0]?.name,
  }));

  const columnsGroups = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Numele primului produs din grup",
      dataIndex: "name",
      key: "name",
    },
  ];

  useEffect(() => {
    const _fetchGroups = async () => {
      const r = await fetchGroups();
      setGroups([...r]);
    };

    _fetchGroups();
  }, []);

  const checked = grouped?.map((x) => x.id);

  return (
    <>
      <Modal
        visible={openModalCreeazaGrupare}
        onCancel={() => {
          setOpenModalCreeazaGrupare();
          setGrouped([]);
          setEditing(false);
        }}
        extraFooter={
          editing
            ? [
                <Button
                  key={1}
                  type="warning"
                  outlined
                  onClick={handleDeleteGrooup}
                >
                  Sterge aceasta grupare
                </Button>,
              ]
            : []
        }
        type="primary"
        onOk={handleSendGroup}
        okText="Grupeaza produsele"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {products
            ?.filter((p) => !p?.groupId || p?.groupId === editing)
            .map((product) => {
              return (
                <div key={product.id}>
                  <Checkbox
                    checked={checked?.includes(product.id)}
                    onChange={(e) => {
                      const { checked } = e.target;

                      if (checked) {
                        setGrouped((prev) => [...prev, { ...product }]);
                      } else {
                        setGrouped((prev) => {
                          const newGrouped = [...prev];
                          const index = newGrouped.findIndex(
                            (prod) => prod.id === product.id
                          );
                          newGrouped.splice(index, 1);
                          return newGrouped;
                        });
                      }
                    }}
                  >
                    <Text as="p5" style={{ cursor: "pointer" }}>
                      {product.name}
                    </Text>
                  </Checkbox>
                </div>
              );
            })}
        </div>
      </Modal>
      <PageHeader
        title="Grupare Produse"
        buttons={
          isAdmin && pathname.includes("admin")
            ? [
                <div key="1" className="GroupProducts-header-actions">
                  <Button
                    key="4"
                    type="success"
                    onClick={() => setOpenModalCreeazaGrupare(true)}
                  >
                    <FeatherIcon icon="plus" size={14} />
                    Adauga o grupare
                  </Button>
                </div>,
              ]
            : []
        }
      />
      <Main theme={theme}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Table
            dataSource={groupsWithKeys}
            columns={columnsGroups}
            onRow={(record) => {
              return {
                onClick: () => {
                  setEditing(record.id);
                  setOpenModalCreeazaGrupare(true);
                  setGrouped(record.products);
                },
              };
            }}
          />
        </div>
      </Main>
    </>
  );
};

export default GroupProducts;
