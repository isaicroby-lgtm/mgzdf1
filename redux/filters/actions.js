const actions = {
  FILTER_UPDATE: 'FILTER_UPDATE',

  filterUpdate: (data) => {
    return {
      type: actions.FILTER_UPDATE,
      data,
    };
  },
};

export default actions;
