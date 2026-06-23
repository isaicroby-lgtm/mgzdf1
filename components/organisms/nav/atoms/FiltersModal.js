import React from "react";
import FeatherIcon from "feather-icons-react";

import Filters from "../../products/filters";

const FiltersModal = ({ filtersModalOpen, setFiltersModalOpen }) => {
  if (!filtersModalOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "white",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        overflowY: "scroll",
      }}
    >
      <FeatherIcon
        icon="x"
        style={{
          position: "absolute",
          top: "4%",
          right: "4%",
          cursor: "pointer",
          zIndex: 99,
        }}
        onClick={() => setFiltersModalOpen()}
      />
      <Filters closeFilterModal={() => setFiltersModalOpen()} />
    </div>
  );
};

export default FiltersModal;
