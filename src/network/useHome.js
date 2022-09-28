import { useState, useContext } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import { Base64 } from "js-base64";
import { Context } from "../context/Context";
import { useHistory } from "react-router-dom";

const useHome = () => {
  const [status, setStatus] = useState("idle");
  const { handleShowModal } = useContext(Context);
  const history = useHistory();
  const {uniqueId, name} = reactLocalStorage.getObject("userProfile");

  const getHomeData = (count) => {
    const header = config.get("headers");
    const body = {
      uniqueId: uniqueId,
      count: count,
      guest : name === "Guest" ? "1" : "0"
    };

    const url = config.get("base") + config.get("home");
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
              reactLocalStorage.setObject("homedata", data);
              setStatus("fetched");
              resolve(data);
            } else {
              if (data.statusCode ===1027) {
                  reactLocalStorage.clear()
                  history.push('/')
                 } else {
                console.error("home API failure ", data);
                reject(response);
              }
            }
          }else {
            console.error("home API error ", response);
            reject(response);
          }
        })
        .catch((err) => {
          console.error("home API error ", err);
          reject(err);
        });
    });
  };

  return { status, getHomeData };
};

export default useHome;
