"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartEmpty } from "@/redux/cart/actionCreator";
import { BasicWrapperForLegal } from "@/components/atoms/other-styled-components";
import Text from "@/components/atoms/Text";

const OrderFinished = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));

      if (lastOrder) {
        // ✅ Ne asigurăm că dataLayer există
        window.dataLayer = window.dataLayer || [];

        // Curățăm eventul eCommerce anterior (bună practică GA4)
        window.dataLayer.push({ ecommerce: null });

        // Trimitem evenimentul purchase complet
        window.dataLayer.push({
          event: "purchase",
          user_data: lastOrder.user_data,
          // 🔹 câmpurile suplimentare
          is_new_customer: lastOrder.is_new_customer,
          user_id: lastOrder.user_id,
          ecommerce: {
            transaction_id: lastOrder.orderId,
            value: lastOrder.value,
            currency: lastOrder.currency,
            tax: lastOrder.tax || 0,
            shipping: lastOrder.shipping || 0,
            coupon: lastOrder.coupon || null,
            items: lastOrder.products.map((p) => ({
              item_id: p.id,
              item_name: p.name,
              item_variant: p.code,
              price: p.price / p.quantity, // preț unitar
              quantity: p.quantity,
            })),
          },
        });

        // 🔥 Dacă vrei, poți loga să verifici
        console.log("[GA4] purchase pushed to dataLayer:", window.dataLayer);

        // Curățăm lastOrder după tracking
        localStorage.removeItem("lastOrder");
      }
    }

    dispatch(cartEmpty());
  }, [dispatch]);

  useEffect(() => {
    // Prevenim back la pagina anterioară
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };

    dispatch(cartEmpty());
  }, [dispatch]);

  return (
    <BasicWrapperForLegal>
      <div>
        <Text as="p2">
          Îți mulțumim pentru comandă! Te vom contacta pe e-mail în cel mai
          scurt timp!
        </Text>
      </div>
    </BasicWrapperForLegal>
  );
};

export default OrderFinished;
