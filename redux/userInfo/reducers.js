import actions from "./actions";

const {
  UPDATE_USER_INFO_BEGIN,
  UPDATE_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_ERR,
} = actions;

const userInfoReducer = (state = {}, action) => {
  const { type, err, userInfo } = action;

  switch (type) {
    case UPDATE_USER_INFO_BEGIN:
      return {
        isLoading: true,
      };

    case UPDATE_USER_INFO_SUCCESS:
      return {
        ...userInfo,
        isLoading: false,
      };

    case UPDATE_USER_INFO_ERR:
      return {
        error: err,
        isLoading: false,
      };

    default:
      return state;
  }
};

export { userInfoReducer };
