import actions from './actions';

const {
  favoritesUpdateBegin,
  favoritesUpdateSuccess,
  favoritesUpdateErr,

  favoritesDeleteBegin,
  favoritesDeleteSuccess,
  favoritesDeleteErr,

  favoritesOpenNotification,
  favoritesCloseNotification,
} = actions;

const favoritesUpdate = (product) => {
  return async (dispatch) => {
    try {
      dispatch(favoritesUpdateBegin());

      dispatch(favoritesUpdateSuccess(product));
    } catch (err) {
      dispatch(favoritesUpdateErr(err));
    }
  };
};

const favoritesDelete = (id, favoritesProducts) => {
  return async (dispatch) => {
    try {
      dispatch(favoritesDeleteBegin());
      const data = favoritesProducts.filter((item) => item.id !== id);

      dispatch(favoritesDeleteSuccess(data));
    } catch (err) {
      dispatch(favoritesDeleteErr(err));
    }
  };
};

export { favoritesUpdate, favoritesDelete, favoritesOpenNotification, favoritesCloseNotification };
