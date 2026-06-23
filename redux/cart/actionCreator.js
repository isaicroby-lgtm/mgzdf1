import actions from "./actions";

const {
  cartAddBegin,
  cartAddSuccess,
  cartAddErr,

  cartUpdateBegin,
  cartUpdateSuccess,
  cartUpdateErr,

  cartDeleteBegin,
  cartDeleteSuccess,
  cartDeleteErr,

  cartInfoAddBegin,
  cartInfoAddSuccess,
  cartInfoAddErr,

  cartInfoDeleteBegin,
  cartInfoDeleteSuccess,
  cartInfoDeleteErr,

  cartOpen,
  cartClose,

  cartOpenNotification,
  cartCloseNotification,

  cartClear,
} = actions;

const cartAdd = (product) => {
  return async (dispatch) => {
    try {
      dispatch(cartAddBegin());
      dispatch(cartAddSuccess(product));

      // GA4 event - Add to Cart

if (typeof window !== "undefined" && window.gtag) {
  window.dataLayer = window.dataLayer || [];

  // Curățăm ecommerce precedent (bună practică GA4)
  window.dataLayer.push({ ecommerce: null });
  
  // Trimitem evenimentul add_to_cart
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "RON",
      value: Number((Number(product.price) * (Number(product.quantity) || 1)).toFixed(2)),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_variant: product.code,
          price: Number(Number(product.price).toFixed(2)), // ✅ rotunjire preț unitar
          quantity: Number(product.quantity) || 1,
        },
      ],
    },
  });
  
}


    } catch (error) {
      dispatch(cartAddErr(error));
    }
  };
};


const cartEmpty = () => {
  return async (dispatch) => {
    try {
      dispatch(cartClear());
    } catch (error) {
      console.log(error);
    }
  };
};

const cartUpdateQuantity = (id, quantity, cartProducts) => {
  return async (dispatch) => {
    try {
      dispatch(cartUpdateBegin());

      const data = cartProducts.map((item) => {
        if (item.id === id) {
          if (quantity > item.stock) {
            alert(
              `Ne pare rau, dar mai avem doar ${item.stock} bucati in stoc din acest produs.`
            );
            item.quantity = item.stock;
          } else item.quantity = quantity;
        }

        return item;
      });

      dispatch(cartUpdateSuccess(data));
    } catch (err) {
      dispatch(cartUpdateErr(err));
    }
  };
};

const cartDelete = (id, cartProducts) => {
  return async (dispatch) => {
    try {
      dispatch(cartDeleteBegin());
      let data;

      data = cartProducts.filter((item) => item.id !== id);

      dispatch(cartDeleteSuccess(data));
    } catch (err) {
      dispatch(cartDeleteErr(err));
    }
  };
};

const cartInfoAdd = (info) => {
  return async (dispatch) => {
    try {
      dispatch(cartInfoAddBegin());

      dispatch(cartInfoAddSuccess(info));
    } catch (err) {
      dispatch(cartInfoAddErr(err));
    }
  };
};

const cartInfoDelete = (info) => {
  return async (dispatch) => {
    try {
      dispatch(cartInfoDeleteBegin());
      dispatch(cartInfoDeleteSuccess(info));
    } catch (err) {
      dispatch(cartInfoDeleteErr(err));
    }
  };
};

export {
  cartAdd,
  cartUpdateQuantity,
  cartDelete,
  cartInfoAdd,
  cartInfoDelete,
  cartOpen,
  cartClose,
  cartOpenNotification,
  cartCloseNotification,
  cartEmpty,
};
