"use client";

import React, { useState } from "react";

import { Checkbox, Rate } from "antd";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import styled from "styled-components";

import theme from "@/components/atoms/theme";
import { sendReviewEmail, updateReviewStatus } from "@/api/products";
import PageHeader from "@/components/atoms/PageHeader";
import Button from "@/components/atoms/Button";
import { Main } from "@/components/style";
import Text from "@/components/atoms/Text";

const IndReview = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  border: 1px solid;
  overflow: hidden;
  border-radius: 6px;
  padding: 16px;
  padding-right: 44px;

  border-color: ${({ status }) =>
    status === "accepted"
      ? theme["nav-green"]
      : status === "refused"
      ? theme["secondary-color"]
      : theme["nav-yellow"]};
`;

const CommandReview = styled.div`
  height: 100%;
  width: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Reviews = () => {
  const [checked, setChecked] = useState({});

  const { products } = useSelector((state) => {
    return {
      products: state.products.productsAll,
    };
  });

  const useTheseProducts = products?.filter((prod) => prod?.reviews?.length);

  const handleCheck = (prod) => (date_created) => () => {
    setChecked((previousState) => {
      const newState = { ...previousState };

      if (newState.hasOwnProperty(prod)) {
        const dateIndex = newState[prod].indexOf(date_created);

        if (dateIndex !== -1) {
          newState[prod].splice(dateIndex, 1);
        } else {
          newState[prod].push(date_created);
        }
      } else {
        newState[prod] = [date_created];
      }

      return newState;
    });
  };

  const handleAcceptReviews = async (statusGiven) => {

    const acceptedReviews = [];
    const refusedReviews = [];

    for (const prodId of Object.keys(checked)) {
      const product = useTheseProducts.find((prod) => prod.id === prodId);

      const { reviews } = product;
      if (!reviews.length) continue;

      for (const revDateCreated of checked[prodId]) {
        const indexOfReview = reviews.findIndex(
          (rev) => rev.date_created === revDateCreated
        );

        if (statusGiven === "accepted")
        {
          acceptedReviews.push(reviews[indexOfReview]);
          reviews[indexOfReview].status = statusGiven;
        }
        else if (statusGiven === "refused") {
          refusedReviews.push(reviews[indexOfReview]);
          reviews.splice(indexOfReview, 1);
        }
      }

      
      await updateReviewStatus(prodId, reviews);
    }
    
    await sendReviewEmail(acceptedReviews,refusedReviews);
    setChecked({});
  };

  return (
    <>
      <PageHeader
        title="Recenzii"
        buttons={[
          <Button
            key={1}
            type="warning"
            outlined
            onClick={() => handleAcceptReviews("refused")}
          >
            Refuză recenziile selectate
          </Button>,
          <Button
            key={2}
            type="success"
            outlined
            onClick={() => handleAcceptReviews("accepted")}
          >
            Acceptă recenziile selectate
          </Button>,
        ]}
      />
      <Main theme={theme}>
        {useTheseProducts?.map((prod) => {
          const addFunction = handleCheck(prod.id);
          return (
            <div
              key={prod.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 32,
              }}
            >
              <Text as="p4">{prod.name}</Text>
              {prod.reviews.map((review) => {
                return (
                  <IndReview key={review.date_created} status={review.status}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          backgroundColor: theme["bg-color-normal"],
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FeatherIcon
                          icon="user"
                          style={{ stroke: theme["border-color-deep"] }}
                        />
                      </div>
                      <div>
                        <Text as="p5" style={{ color: "rgb(90, 95, 125)" }}>
                          {review.name}
                        </Text>
                        <Text as="p6" style={{ color: "rgb(90, 95, 125)" }}>
                          {review.desc}
                        </Text>
                      </div>
                    </div>

                    <Rate value={review.rate} disabled />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "absolute",
                        height: "100%",
                        width: 24,
                        right: 0,
                        top: 0,
                      }}
                    >
                      <CommandReview>
                        <Checkbox
                          checked={
                            checked?.[prod?.id]?.includes(
                              review.date_created
                            ) || false
                          }
                          onChange={addFunction(review.date_created)}
                        />
                      </CommandReview>
                    </div>
                  </IndReview>
                );
              })}
            </div>
          );
        })}
      </Main>
    </>
  );
};

export default Reviews;
