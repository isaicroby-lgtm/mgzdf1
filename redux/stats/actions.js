const actions = {
  FETCH_STATS_BEGIN: 'FETCH_STATS_BEGIN',
  FETCH_STATS_SUCCESS: 'FETCH_STATS_SUCCESS',
  FETCH_STATS_ERR: 'FETCH_STATS_ERR',

  fetchStatsBegin: () => {
    return {
      type: actions.FETCH_STATS_BEGIN,
    };
  },

  fetchStatsSuccess: (data) => {
    const toBeReturned = {
      type: actions.FETCH_STATS_SUCCESS,
      data,
    };
    return toBeReturned;
  },

  fetchStatsErr: (err) => {
    return {
      type: actions.FETCH_STATS_ERR,
      err,
    };
  },
};

export default actions;
