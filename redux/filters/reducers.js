import actions from './actions';

const { FILTER_UPDATE } = actions;

const initialState = {};

const filterReducer = (state = initialState, action) => {
  const { type, data } = action;

  switch (type) {
    case FILTER_UPDATE:
      return {
        ...state,
        ...data,
      };

    default:
      return state;
  }
};

export default filterReducer;
