import { useState, useContext } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import config from "../config/Config";
import { Base64 } from "js-base64";
import { Context } from "../context/Context";
import { useHistory } from "react-router-dom";


const useMojiAvatar = () => {
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const { handleShowModal } = useContext(Context);
  const history = useHistory();
  const { uniqueId, deviceId } = reactLocalStorage.getObject("userProfile");

  const getMojiAvatarData = (uid) => {
    const header = config.get("headers");
    const body = {
      uniqueId: uid,
      requestSource: config.get("requestSource"),
      deviceId: deviceId,
      operatorId : config.get("operatorId")
    };

    const url = config.get("base") + config.get("getAvatarList");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers: header,
        // body: JSON.stringify(body),
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

  const sendMojiAvatarData = (avatarUrl) => {
    console.log("MOJI AVATAR HOOK ____ ", avatarUrl);
    const header = config.get("headers");
    const body = {
      uniqueId: uniqueId,
      deviceId: deviceId,
      avatarUrl: avatarUrl,
      requestSource: config.get("requestSource"),
    };

    const url = config.get("base") + config.get("createProfile");
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          console.log("res", response);
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

  return { status, data, getMojiAvatarData, sendMojiAvatarData };
};

export default useMojiAvatar;
