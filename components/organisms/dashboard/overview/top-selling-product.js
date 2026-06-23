import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import { Cards } from "../../../components/cards/frame/cards-frame";

function TopSellingProduct() {
  const { topSaleState } = useSelector((state) => {
    return {
      topSaleState: state.chartContent.topSaleData,
    };
  });
  const [state, setState] = useState({
    products: "year",
  });

  const handleActiveChangeProducts = (value) => {
    setState({
      ...state,
      products: value,
    });
  };

  const sellingData = [];
  if (topSaleState !== null) {
    topSaleState.map((value) => {
      const { key, name, price, sold, revenue } = value;
      return sellingData.push({
        key,
        name,
        price,
        sold,
        revenue,
      });
    });
  }

  const sellingColumns = [
    {
      title: "Numele produsului",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Pret (RON)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Nr. Bucati vandute",
      dataIndex: "sold",
      key: "sold",
    },
    {
      title: "Venit (RON)",
      dataIndex: "revenue",
      key: "revenue",
    },
  ];

  return (
    <div className="full-width-table">
      <Cards
        isbutton={
          <div className="card-nav">
            <ul>
              <li
                className={state.products === "today" ? "active" : "deactivate"}
              >
                <div onClick={() => handleActiveChangeProducts("today")}>
                  Astazi
                </div>
              </li>
              <li
                className={state.products === "week" ? "active" : "deactivate"}
              >
                <div onClick={() => handleActiveChangeProducts("week")}>
                  Saptamana aceasta
                </div>
              </li>
              <li
                className={state.products === "month" ? "active" : "deactivate"}
              >
                <div onClick={() => handleActiveChangeProducts("month")}>
                  Luna aceasta
                </div>
              </li>
              <li
                className={state.products === "year" ? "active" : "deactivate"}
              >
                <div onClick={() => handleActiveChangeProducts("year")}>
                  Anul acesta
                </div>
              </li>
            </ul>
          </div>
        }
        title="Cele mai vandute produse"
        size="large"
        bodypadding="0px"
      >
        <div className="table-bordered top-seller-table table-responsive">
          <Table
            columns={sellingColumns}
            dataSource={sellingData}
            pagination={false}
          />
        </div>
      </Cards>
    </div>
  );
}

export default TopSellingProduct;
