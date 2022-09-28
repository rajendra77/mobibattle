import { useState } from "react";
import config from "../config/Config";

const useReferCode = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);

  const createDeviceDetailsCode = (deviceDetail, referCode) => {
    const header = config.get("headers");
    const body = {
        deviceDetails : deviceDetail,
        referCode : referCode      
    };
    const url = config.get("base") + config.get("createDeviceDetailsAndReferCode");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return { status, data, createDeviceDetailsCode };
};

export default useReferCode;
