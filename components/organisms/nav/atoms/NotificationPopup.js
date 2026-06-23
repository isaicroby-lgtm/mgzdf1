import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";

import { favoritesCloseNotification } from "@/redux/favorites/actionCreator";
import { cartCloseNotification } from "@/redux/cart/actionCreator";
import Notification from "@/components/atoms/Notification";
import Text from "@/components/atoms/Text";
import theme from "@/components/atoms/theme";
import Button from "@/components/atoms/Button";

const NotificationPopup = ({ visible, setModalOpen }) => {
  const dispatch = useDispatch();
  const { notificationPopup, cartPopup } = useSelector((state) => {
    return {
      notificationPopup: state.favorites.notification,
      cartPopup: state.cart.notification,
    };
  });

  useEffect(() => {
    let timer;
    if (notificationPopup) {
      timer = setTimeout(() => {
        dispatch(favoritesCloseNotification());
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [notificationPopup]);

  useEffect(() => {
    let timer;
    if (cartPopup) {
      timer = setTimeout(() => {
        dispatch(cartCloseNotification());
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [cartPopup]);

  return (
    <>
      {visible && (notificationPopup || cartPopup) && (
        <Notification visible={notificationPopup || cartPopup}>
          {notificationPopup ? (
            <>
              {notificationPopup === "adaugat" ? (
                <>
                  <FeatherIcon
                    icon="heart"
                    fill={theme["secondary-color"]}
                    style={{ strokeWidth: 0 }}
                  />
                  <Text as="p5">Produsul dvs a fost adăugat la favorite.</Text>
                </>
              ) : (
                <>
                  <FeatherIcon icon="heart" />
                  <Text as="p5">Produsul dvs a fost scos de la favorite.</Text>
                </>
              )}
            </>
          ) : cartPopup === "adaugat" ? (
            setModalOpen("cart")
          ) : (
            <></>
          )}
        </Notification>
      )}
    </>
  );
};

export default NotificationPopup;
