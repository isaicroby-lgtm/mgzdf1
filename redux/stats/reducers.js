import actions from './actions';

const { FETCH_STATS_BEGIN, FETCH_STATS_SUCCESS, FETCH_STATS_ERR } = actions;

const statsReducer = (state = {}, action) => {
  const { type, err, data } = action;

  switch (type) {
    case FETCH_STATS_BEGIN:
      return {
        isLoading: true,
      };

    case FETCH_STATS_SUCCESS:
      return {
        ...data,
        isLoading: false,
      };

    case FETCH_STATS_ERR:
      return {
        error: err,
        isLoading: false,
      };

    default:
      return state;
  }
};

export { statsReducer };
