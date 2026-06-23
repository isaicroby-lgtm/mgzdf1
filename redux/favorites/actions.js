const actions = {
  FAVORITES_UPDATE_BEGIN: 'FAVORITES_UPDATE_BEGIN',
  FAVORITES_UPDATE_SUCCESS: 'FAVORITES_UPDATE_SUCCESS',
  FAVORITES_UPDATE_ERR: 'FAVORITES_UPDATE_ERR',

  FAVORITES_DELETE_BEGIN: 'FAVORITES_DELETE_BEGIN',
  FAVORITES_DELETE_SUCCESS: 'FAVORITES_DELETE_SUCCESS',
  FAVORITES_DELETE_ERR: 'FAVORITES_DELETE_ERR',

  FAVORITES_OPEN_NOTIFICATION: 'FAVORITES_OPEN_NOTIFICATION',
  FAVORITES_CLOSE_NOTIFICATION: 'FAVORITES_CLOSE_NOTIFICATION',

  favoritesOpenNotification: () => {
    return {
      type: actions.FAVORITES_OPEN_NOTIFICATION,
    };
  },

  favoritesCloseNotification: () => {
    return {
      type: actions.FAVORITES_CLOSE_NOTIFICATION,
    };
  },

  favoritesUpdateBegin: () => {
    return {
      type: actions.FAVORITES_UPDATE_BEGIN,
    };
  },
  favoritesUpdateSuccess: (newProduct) => {
    return {
      type: actions.FAVORITES_UPDATE_SUCCESS,
      newProduct,
    };
  },
  favoritesUpdateErr: (err) => {
    return {
      type: actions.FAVORITES_UPDATE_ERR,
      err,
    };
  },

  favoritesDeleteBegin: () => {
    return {
      type: actions.FAVORITES_DELETE_BEGIN,
    };
  },

  favoritesDeleteSuccess: (data) => {
    return {
      type: actions.FAVORITES_DELETE_SUCCESS,
      data,
    };
  },

  favoritesDeleteErr: (err) => {
    return {
      type: actions.FAVORITES_DELETE_ERR,
      err,
    };
  },
};

export default actions;
