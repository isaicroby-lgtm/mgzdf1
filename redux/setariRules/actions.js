const actions = {
  FETCH_SETARI_RULES_BEGIN: 'FETCH_SETARI_RULES_BEGIN',
  FETCH_SETARI_RULES_SUCCESS: 'FETCH_SETARI_RULES_SUCCESS',
  FETCH_SETARI_RULES_ERR: 'FETCH_SETARI_RULES_ERR',

  fetchSetariRulesBegin: () => {
    return {
      type: actions.FETCH_SETARI_RULES_BEGIN,
    };
  },

  fetchSetariRulesSuccess: (data) => {
    return {
      type: actions.FETCH_SETARI_RULES_SUCCESS,
      data,
    };
  },

  fetchSetariRulesErr: (err) => {
    return {
      type: actions.FETCH_SETARI_RULES_ERR,
      err,
    };
  },
};

export default actions;
