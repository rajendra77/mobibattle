import { useState, useContext } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import { Base64 } from "js-base64";
import { Context } from "../context/Context";
import { useHistory } from "react-router-dom";
// import { Context } from "../context/Context";
// import { Base64 } from "js-base64";

const useGameDetails = () => {
  const [status, setStatus] = useState("idle");
  // const { handleShowModal } = useContext(Context);
  const { uniqueId, deviceId, name } = reactLocalStorage.getObject("userProfile");
  const { handleShowModal } = useContext(Context);
  const history = useHistory();

  const getGameDetails = (gameId) => {
    const header = config.get("headers");
    const body = {
      // language: "en",
      gameId: gameId,
      uniqueId: uniqueId,
      deviceId: deviceId,
      guest : name === "Guest" ? "1" : "0"
    };
    const url = config.get("base") + config.get("gameDetails");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 200) {
            if (data.status.toUpperCase() === "SUCCESS") {
              console.log("GEMAE DETAILS API RES :: SUCCESS :: ", data);
              setStatus("fetched");
              resolve(data);
            } else {
              console.error("Game details API failure ", data);
              reject(response);
            }
          } else {
            console.error("Game details API error ", response);
            reject(response);
            //handleShowModal(true);
          }
        })
        .catch((err) => {
          console.error("Game details API error ", err);
          reject(err);
          // handleShowModal(true);
        });
    });
  };

  return { status, getGameDetails };
};

export default useGameDetails;
