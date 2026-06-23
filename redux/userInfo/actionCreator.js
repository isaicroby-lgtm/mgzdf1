"use client";

import { login } from "@/api/account";
import { updateDynamicBlacklist } from "../store";
import actions from "./actions";

const { updateUserInfoBegin, updateUserInfoSuccess, updateUserInfoErr } =
  actions;

const updateUserInfo = (info) => {
  return async (dispatch) => {
    try {
      dispatch(updateUserInfoBegin());
      if (info.loginMe) {
        await login(info).then(() => {
          if (!info.keepMeLogged) updateDynamicBlacklist("userInfo");
          alert("Ai fost logat cu succes!");
        });
      } /*else if (info.createMe) {
        //console.log("incep create");
        let res = {};
        try {
          res = await createUser(info);
        } catch (e) {
          console.log(e);
          for (const [key, value] of Object.entries(e)) {
            console.log(key);
            console.log(value);
          }
        }
        //console.log("done create");
        //console.log(res);

        dispatch(updateUserInfoSuccess({ ...res, isLogged: true }));
      }*/ else dispatch(updateUserInfoSuccess(info));
    } catch (eroare) {
      console.log(eroare);
      dispatch(updateUserInfoErr(eroare));
      alert(
        "A apărut o eroare. Încearcă din nou, iar dacă eroarea persistă te rugăm să ne scrii"
      );
    }
  };
};

export { updateUserInfo };
