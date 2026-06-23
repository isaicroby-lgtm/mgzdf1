const actions = {
  CART_ADD_BEGIN: 'CART_ADD_BEGIN',
  CART_ADD_SUCCESS: 'CART_ADD_SUCCESS',
  CART_ADD_ERR: 'CART_ADD_ERR',

  CART_UPDATE_BEGIN: 'CART_UPDATE_BEGIN',
  CART_UPDATE_SUCCESS: 'CART_UPDATE_SUCCESS',
  CART_UPDATE_ERR: 'CART_UPDATE_ERR',

  CART_DELETE_BEGIN: 'CART_DELETE_BEGIN',
  CART_DELETE_SUCCESS: 'CART_DELETE_SUCCESS',
  CART_DELETE_ERR: 'CART_DELETE_ERR',

  CART_INFO_ADD_BEGIN: 'CART_INFO_ADD_BEGIN',
  CART_INFO_ADD_SUCCESS: 'CART_INFO_ADD_SUCCESS',
  CART_INFO_ADD_ERR: 'CART_INFO_ADD_ERR',

  CART_INFO_DELETE_BEGIN: 'CART_INFO_DELETE_BEGIN',
  CART_INFO_DELETE_SUCCESS: 'CART_INFO_DELETE_SUCCESS',
  CART_INFO_DELETE_ERR: 'CART_INFO_DELETE_ERR',

  CART_OPEN: 'CART_OPEN',
  CART_CLOSE: 'CART_CLOSE',

  CART_OPEN_NOTIFICATION: 'CART_OPEN_NOTIFICATION',
  CART_CLOSE_NOTIFICATION: 'CART_CLOSE_NOTIFICATION',

  CART_CLEAR: 'CART_CLEAR',

  cartOpenNotification: () => {
    return {
      type: actions.CART_OPEN_NOTIFICATION,
    };
  },
  cartCloseNotification: () => {
    return {
      type: actions.CART_CLOSE_NOTIFICATION,
    };
  },

  cartOpen: () => {
    return {
      type: actions.CART_OPEN,
    };
  },

  cartClose: () => {
    return {
      type: actions.CART_CLOSE,
    };
  },

  cartAddBegin: () => {
    return {
      type: actions.CART_ADD_BEGIN,
    };
  },
  cartAddSuccess: (newProduct) => {
    return {
      type: actions.CART_ADD_SUCCESS,
      newProduct,
    };
  },
  cartAddErr: (err) => {
    return {
      type: actions.CART_ADD_ERR,
      err,
    };
  },

  cartUpdateBegin: () => {
    return {
      type: actions.CART_UPDATE_BEGIN,
    };
  },

  cartUpdateSuccess: (data) => {
    return {
      type: actions.CART_UPDATE_SUCCESS,
      data,
    };
  },

  cartUpdateErr: (err) => {
    return {
      type: actions.CART_UPDATE_ERR,
      err,
    };
  },

  cartDeleteBegin: () => {
    return {
      type: actions.CART_DELETE_BEGIN,
    };
  },

  cartDeleteSuccess: (data) => {
    return {
      type: actions.CART_DELETE_SUCCESS,
      data,
    };
  },

  cartDeleteErr: (err) => {
    return {
      type: actions.CART_DELETE_ERR,
      err,
    };
  },

  cartInfoAddBegin: () => {
    return {
      type: actions.CART_INFO_ADD_BEGIN,
    };
  },

  cartInfoAddSuccess: (info) => {
    return {
      type: actions.CART_INFO_ADD_SUCCESS,
      data: info,
    };
  },

  cartInfoAddErr: () => {
    return {
      type: actions.CART_INFO_ADD_ERR,
    };
  },

  cartInfoDeleteBegin: () => {
    return {
      type: actions.CART_DELETE_BEGIN,
    };
  },

  cartInfoDeleteSuccess: (info) => {
    return {
      type: actions.CART_DELETE_SUCCESS,
      data: info,
    };
  },

  cartInfoDeleteErr: () => {
    return {
      type: actions.CART_DELETE_ERR,
    };
  },

  cartClear: () => {
    return{
      type: actions.CART_CLEAR,
    };
  }
};

export default actions;
