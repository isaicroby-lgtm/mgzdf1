import React, { useEffect, useRef } from "react";

import Search from "antd/lib/input/Search";
import FeatherIcon from "feather-icons-react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

import theme from "@/components/atoms/theme";
import { BarWrapper } from "./BarWrapper";

export const TopBarContent = styled.div`
  padding: 20px;
  z-index: 1000;

  width: 100%;
  height: 100px;
  background-color: white;
  position: fixed;
  border-radius: 0 0px 10px 10px;
  top: 0;
  right: 0;
  transform: translateY(${(props) => (props.modalOpen ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;

  display: flex;
  align-items: center;
  justify-content: center;

  .close-icon {
    transition: color 0.2s ease-in-out;
    color: ${theme["gray-color"]} !important;
  }
  .close-icon:hover {
    color: ${theme["primary-color"]} !important;
  }

  form {
    flex-direction: row !important;
  }

  .form-item {
    width: 100% !important;
    max-width: 750px !important;

    margin: 0 !important;
  }

  .form-item .ant-form-item-control-input-content {
    width: 100% !important;
  }
`;

export const TopBarInside = ({ modalOpen, setModalOpen, children }) => {
  const topBarContentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        topBarContentRef.current &&
        !topBarContentRef.current.contains(event.target) &&
        event.view.outerHeight - event.clientY > 165
      ) {
        setModalOpen();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <BarWrapper modalOpen={modalOpen}>
      <TopBarContent modalOpen={modalOpen} ref={topBarContentRef}>
        {children}
      </TopBarContent>
    </BarWrapper>
  );
};

const TopBar = ({ topModalOpen, setTopModalOpen }) => {
  const router = useRouter();

  const handleSearch = async (filter) => {
    router.push(`/magazin?filter-nume=${filter}`);

    setTopModalOpen();
  };

  return (
    <TopBarInside modalOpen={topModalOpen} setModalOpen={setTopModalOpen}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          gap: "1%",
        }}
      >
        <Search
          style={{ width: 820, maxWidth: "90%" }}
          onSearch={handleSearch}
          allowClear
          placeholder="Caută un produs după numele sau codul său"
        />
        <FeatherIcon
          icon="x"
          onClick={() => setTopModalOpen()}
          className="close-icon"
          style={{ cursor: "pointer" }}
        />
      </div>
    </TopBarInside>
  );
};

export default TopBar;
