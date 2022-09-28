import { useState } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";

const useAllTransaction = () => {
  const [status, setStatus] = useState("idle");
  const { uniqueId } = reactLocalStorage.getObject("userProfile");

  const getAllTransaction = () => {
    const header = config.get("headers");
    const url =
      config.get("base") + config.get("getTransaction") + `/${uniqueId}`;
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers: header,
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();

            console.error("All Transaction API  SUCCESS", data);
            setStatus("fetched");
            resolve(data);
          } else {
            console.error("All Transaction API error ", response);
            reject(response);
          }
        })
        .catch((err) => {
          console.error("All Transaction API error ", err);
          reject(err);
        });
    });
  };

  return { status, getAllTransaction };
};

export default useAllTransaction;
