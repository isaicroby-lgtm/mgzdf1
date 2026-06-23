const actions = {
  UPDATE_USER_INFO_BEGIN: "UPDATE_USER_INFO_BEGIN",
  UPDATE_USER_INFO_SUCCESS: "UPDATE_USER_INFO_SUCCESS",
  UPDATE_USER_INFO_ERR: "UPDATE_USER_INFO_ERR",

  updateUserInfoBegin: () => {
    return {
      type: actions.UPDATE_USER_INFO_BEGIN,
    };
  },

  updateUserInfoSuccess: (userInfo) => {
    const toBeReturned = {
      type: actions.UPDATE_USER_INFO_SUCCESS,
      userInfo,
    };
    return toBeReturned;
  },

  updateUserInfoErr: (err) => {
    return {
      type: actions.UPDATE_USER_INFO_ERR,
      err,
    };
  },
};

export default actions;
