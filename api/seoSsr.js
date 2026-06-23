import axios from "axios";
const baseUrl = "https://api-ekfyledvua-ew.a.run.app";

export const getMetadata = async (where) => {
    let dat;
    await axios.get(`${baseUrl}/metadata/${where}`).then((res) => {
      dat = res.data;
    });
    return dat;
  };