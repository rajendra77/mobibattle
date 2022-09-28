import { useState } from "react";
import config from "../config/Config";
const usePushRegister = () => {
  const [status, setStatus] = useState("idle");

  const pushRegistration = (oneSignalToken, fcmToken,uniqueId, mobile) => {
    const header = config.get("headers");
    const body = {
      deviceId: mobile ,
      deviceToken: fcmToken,
      osid: oneSignalToken,
      deviceType: "WEB",
      userId: uniqueId
    };

    const url = config.get("base") + config.get("pushRegistration");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            let data = await response.json();
            if (data.status.toUpperCase() === "SUCCESS") {
              setStatus("fetched");
              resolve(data);
            } else {
              console.error("push register API failure ", data);
              reject(response);
            }
          } else {
            console.error("push register error ", response);
            reject(response);
          }
        })
        .catch((err) => {
          console.error("push register API error ", err);
          reject(err);
        });
    });
  };

  return { status, pushRegistration };
};

export default usePushRegister;
