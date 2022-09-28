import { useState, useContext } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import config from "../config/Config";
import { Context } from "../context/Context";
import { Base64 } from "js-base64";
import { useHistory } from "react-router-dom";
import { RegisterModalText as modalText } from "../Database/Text";

const usePlayerRegister = () => {
  const history = useHistory();
  const { handleShowModal, gameId, tournamentId, getLanguage } =
    useContext(Context);
  const lang = getLanguage();
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const { uniqueId, deviceId, name } =
    reactLocalStorage.getObject("userProfile");
  const confirmationIcon =
    require("../assets/modal-icons/confirmation_tick_icon.svg").default;
  const getPlayerRegisterData = () => {
    console.log("PLAYER REGISTER HOOK ____ ");
    const header = config.get("headers");
    const body = {
      uniqueId: uniqueId,
      deviceId: deviceId,
    };

    const url = config.get("base") + config.get("getPlayerRegister");
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

  const sendPlayerRegisterData = (gId, tid, lineup) => {
    console.log("PLAYER REGISTER HOOK ____ ", data);
    const header = config.get("headers");
    const body = {
      uniqueId: uniqueId,
      deviceId: deviceId,
      gameId: gId,
      tid: tid,
      name: name,
      lineup: lineup,
    };

    const url = config.get("base") + config.get("sendPlayerRegister");
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
            if (data.status.toUpperCase() === "SUCCESS") {
              console.log("-----ongoing data------>", data);
              const modalData = {
                title: modalText.title[lang],
                body: modalText.body[lang],
                icon: confirmationIcon,
                buttons: [
                  {
                    label: modalText.okayButton[lang],
                    action: "close",
                    buttonColor: "bg-tabsColor",
                    textColor: "text-white",
                  },
                ],
                hideClose: true,
                handleClick: function (button) {
                  if (button === "close") {
                    handleShowModal(false);
                    history.push(`/viewmore?gId=${Base64.encode(gameId)}&tId=${Base64.encode(tournamentId)}`);
                    // window.location.reload();
                  }
                },
              };
              resolve(modalData);
            }
          } else {
            if (Base64.decode(data.reason) === "OTP validity Expires") {
              const modalData = {
                title: "OTP validity Expires",
                body: "Please contact our sales team for otp",
                buttons: [
                  {
                    label: "Okay",
                    action: "close",
                    buttonColor: "bg-tabsColor",
                    textColor: "text-white",
                  },
                ],
                hideClose: true,
                handleClick: function (button) {
                  if (button === "close") {
                    handleShowModal(false);
                    history.push("/");
                  }
                },
              };
              handleShowModal(true, modalData);
            } else {
              const modalData = {
                body: Base64.decode(data.reason),
              };
              resolve(modalData);
            }
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return { status, data, getPlayerRegisterData, sendPlayerRegisterData };
};

export default usePlayerRegister;
