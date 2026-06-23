import actions from './actions';

const { FETCH_SETARI_RULES_BEGIN, FETCH_SETARI_RULES_SUCCESS, FETCH_SETARI_RULES_ERR } = actions;

const setariRulesReducer = (state = [], action) => {
  const { type, err, data } = action;

  switch (type) {
    case FETCH_SETARI_RULES_BEGIN:
      return {
        isLoading: true,
      };
    case FETCH_SETARI_RULES_SUCCESS:
      return {
        ...data,
        isLoading: true,
      };
    case FETCH_SETARI_RULES_ERR:
      return {
        error: err,
        isLoading: true,
      };
    default:
      return state;
  }
};

export default setariRulesReducer;
