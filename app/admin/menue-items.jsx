"use client";

import React, { useEffect } from "react";
import { Badge, Menu } from "antd";
import FeatherIcon from "feather-icons-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import theme from "@/components/atoms/theme";
import { getUnread, getUnreadReviews } from "@/api/unread";
import { useSelector } from "react-redux";

const MenuItems = ({ toggleCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();

  const pathArray = pathname.split("admin");

  const mainPath = pathArray[1];
  const mainPathSplit = mainPath.split("/");

  const [unreadAll, setUnreadAll] = React.useState({});
  const [openKeys, setOpenKeys] = React.useState([
    `${mainPathSplit.length > 2 ? mainPathSplit[1] : "dashboard"}`,
  ]);
  const [unreadReviews, setUnreadReviews] = React.useState(0);

  const { products } = useSelector((state) => {
    return {
      products: state.products.productsAll,
    };
  });

  const onOpenChange = (keys) => {
    setOpenKeys(
      keys[keys.length - 1] !== "recharts"
        ? [keys.length && keys[keys.length - 1]]
        : keys
    );
  };

  const onClick = (item) => {
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  useEffect(() => {
    const _getUnread = async () => {
      const r = await getUnread();

      setUnreadAll(r);
    };

    _getUnread();
  }, []);

  useEffect(() => {
    setUnreadReviews(getUnreadReviews(products));
  }, [products]);

  return (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={"inline"}
      defaultSelectedKeys={
        true
          ? [
              `${
                mainPathSplit.length === 1
                  ? "home"
                  : mainPathSplit.length === 2
                  ? mainPathSplit[1]
                  : mainPathSplit[2]
              }`,
            ]
          : []
      }
      defaultOpenKeys={
        true
          ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : "dashboard"}`]
          : []
      }
      overflowedIndicator={<FeatherIcon icon="more-vertical" />}
      openKeys={openKeys}
    >
      <Menu.Item key="home">
        <Link onClick={toggleCollapsed} href="/admin">
          Dashboard
        </Link>
      </Menu.Item>

      <Menu.Item key="comenzi" onClick={() => router.push("/admin/comenzi")}>
        <Badge
          key="comenzi"
          offset={[20, 7]}
          count={unreadAll?.orders}
          color={theme["primary-color"]}
        >
          <div
            onClick={toggleCollapsed}
            style={{ fontSize: 16, cursor: "pointer", paddingLeft: 10 }}
          >
            Comenzi
          </div>
        </Badge>
      </Menu.Item>

      <Menu.Item key="produse">
        <Link onClick={toggleCollapsed} href="/admin/produse">
          Produse
        </Link>
      </Menu.Item>

      <Menu.Item key="produse-adauga">
        <Link onClick={toggleCollapsed} href="/admin/produse-adauga">
          Adauga un produs
        </Link>
      </Menu.Item>

      <Menu.Item key="produse-stoc">
        <Link onClick={toggleCollapsed} href="/admin/produse-stoc">
          Produse - Stoc si Pret
        </Link>
      </Menu.Item>
      <Menu.Item key="produse-grupare">
        <Link onClick={toggleCollapsed} href="/admin/produse-grupare">
          Produse - Grupare
        </Link>
      </Menu.Item>

      <Menu.Item key="recenzii" onClick={() => router.push("/admin/recenzii")}>
        <Badge
          style={{ color: "white" }}
          offset={[20, 7]}
          count={unreadReviews}
          color={theme["primary-color"]}
        >
          <div
            onClick={toggleCollapsed}
            style={{ fontSize: 16, cursor: "pointer", paddingLeft: 10 }}
          >
            Recenzii
          </div>
        </Badge>
      </Menu.Item>

      <Menu.Item
        key="mesaje-si-formulare"
        onClick={() => router.push("/admin/mesaje-si-formulare")}
      >
        <Badge
          style={{ color: "white" }}
          offset={[20, 7]}
          count={
            unreadAll?.contact || unreadAll?.refund
              ? unreadAll?.contact + unreadAll?.refund
              : 0
          }
          color={theme["primary-color"]}
        >
          <div
            onClick={toggleCollapsed}
            style={{ fontSize: 16, cursor: "pointer", paddingLeft: 10 }}
          >
            Mesaje si formulare
          </div>
        </Badge>
      </Menu.Item>
      <Menu.Item key="email-marketing">
        <Link onClick={toggleCollapsed} href="/admin/email-marketing">
          Email Marketing
        </Link>
      </Menu.Item>

      <Menu.Item key="utilizatori">
        <Link onClick={toggleCollapsed} href="/admin/utilizatori">
          Utilizatori
        </Link>
      </Menu.Item>

      <Menu.Item key="blog">
        <Link onClick={toggleCollapsed} href="/admin/blog">
          Blog
        </Link>
      </Menu.Item>
      <Menu.Item key="pagini-statice">
        <Link onClick={toggleCollapsed} href="/admin/pagini-statice">
          Pagini statice
        </Link>
      </Menu.Item>

      <Menu.Item key="setari-website">
        <Link onClick={toggleCollapsed} href="/admin/setari-website">
          Setari website
        </Link>
      </Menu.Item>

      <Menu.Item key="seo">
        <Link onClick={toggleCollapsed} href="/admin/seo">
          SEO Doifrati.ro
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default MenuItems;
