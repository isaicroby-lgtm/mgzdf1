"use client";

import { getAnalytics, getStatsFirestore, getProductsViews } from "@/api/stats";
import actions from "./actions";

const { fetchStatsBegin, fetchStatsSuccess, fetchStatsErr } = actions;

const fetchStats = (info) => {
  return async (dispatch) => {
    try {
      dispatch(fetchStatsBegin());
      const res = await getStatsFirestore();
      const res2 = await getAnalytics();
      const res3 = await getProductsViews();

      dispatch(fetchStatsSuccess({ ...res, ...res2, ...res3 }));
    } catch (err) {
      alert(err);
      dispatch(fetchStatsErr(err));
    }
  };
};

export { fetchStats };
