"use client";

import { combineReducers } from "redux";
import { productReducer } from "./product/reducers";
import cartReducer from "./cart/reducers";
import { userInfoReducer } from "./userInfo/reducers";
import favoriteReducer from "./favorites/reducers";
import ordersReducer from "./orders/reducers";
import setariRulesReducer from "./setariRules/reducers";
import { statsReducer } from "./stats/reducers";
import filterReducer from "./filters/reducers";

const rootReducers = combineReducers({
  products: productReducer,
  cart: cartReducer,
  userInfo: userInfoReducer,
  favorites: favoriteReducer,
  orders: ordersReducer,
  setariRules: setariRulesReducer,
  stats: statsReducer,
  filter: filterReducer,
});

export default rootReducers;
