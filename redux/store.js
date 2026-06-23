"use client";

import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createTransform, persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

import rootReducer from "./rootReducers";
import storage from "./customStorage";

const SetTransform = createTransform(
  (inboundState, key) => {
    return { ...inboundState, openCart: false };
  },
  (outboundState, key) => {
    return { ...outboundState, openCart: false };
  },
  { whitelist: ["cart"] }
);

const createDynamicPersistReducer = (config, dynamicConfig) => {
  const mergedConfig = {
    ...config,
    blacklist: [
      ...(config.blacklist || []),
      ...(dynamicConfig.blacklist || []),
    ],
  };

  return persistReducer(mergedConfig, rootReducer);
};

const persistConfig = {
  key: "root",
  storage,
  transforms: [SetTransform],
};

const dynamicPersistConfig = {
  blacklist: ["products", "singleProduct", "chartContent"],
};

const updateDynamicBlacklist = (value) => {
  dynamicPersistConfig.blacklist.push(value);
};

const persistedReducer = createDynamicPersistReducer(
  persistConfig,
  dynamicPersistConfig
);

const reduxDevTool =
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(thunk.withExtraArgument()))
    : compose(applyMiddleware(thunk.withExtraArgument()));

const store = createStore(persistedReducer, reduxDevTool);

const persistor = persistStore(store);

export { store, persistor, updateDynamicBlacklist };
