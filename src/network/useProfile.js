import { useState } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";

const useProfile = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);
  const { number, uniqueId, name, deviceId } =
    reactLocalStorage.getObject("userProfile");

  const createProfile = (uniqueId) => {
    const header = config.get("headers");
    const body = {
      uniqueId: uniqueId,
      name: name,
      displayName: name,
      deviceId: deviceId,
      requestSource: config.get("requestSource"),
    };
    const url = config.get("base") + config.get("createProfile");
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

  const getProfile = () => {
    const header = config.get("headers");
    const body = {
      userId: uniqueId,
      
    };
    const url = config.get("base") + config.get("getProfile");
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

  return { status, data, createProfile, getProfile };
};

export default useProfile;
