import { useState } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";

const useGameHistory = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);
  const deviceId = reactLocalStorage.getObject("userProfile").deviceId;
  const gameHistory = (id, type) => {
    const header = config.get("headers");
    const body = {
      deviceId: deviceId,
      uniqueId: id,
      gameType: type,
    };
    const url = config.get("base") + config.get("gameHistory");
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

  return { status, data, gameHistory };
};

export default useGameHistory;
