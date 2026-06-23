"use client";

import { getSetariRules } from "@/api/setari-rules";
import actions from "./actions";

const { fetchSetariRulesBegin, fetchSetariRulesSuccess, fetchSetariRulesErr } =
  actions;

const fetchSetariRules = (id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchSetariRulesBegin());
      const res = await getSetariRules();
      dispatch(fetchSetariRulesSuccess({ ...res, id }));
    } catch (err) {
      dispatch(fetchSetariRulesErr(err));
    }
  };
};

export { fetchSetariRules };
