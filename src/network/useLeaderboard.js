import { useState, useContext } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "../context/Context";
import { Base64 } from "js-base64";

const useLeaderboard = () => {
  const [status, setStatus] = useState("idle");
  const { handleShowModal } = useContext(Context);
  const { number, uniqueId } = reactLocalStorage.getObject("userProfile");

  const getLeaderboard = () => {
    const header = config.get("headers");
    const body = {
      uniqueId: uniqueId,
      deviceId: number,
      limit: 5,
      type: "battle",
    };
    const url = config.get("base") + config.get("leaderboard");
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
            if (data.status.toUpperCase() === "SUCCESS") {
              setStatus("fetched");
              resolve(data);
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
                console.error("Leaderboard API failure ", data);
                reject(response);
                // handleShowModal(true, {
                //   body: Base64.decode(data.reason),
                // });
              }
            }
          } else {
            console.error("Leaderboard API error ", response);
            reject(response);
            // handleShowModal(true);
          }
        })
        .catch((err) => {
          console.error("Leaderboard API error ", err);
          reject(err);
          // handleShowModal(true);
        });
    });
  };

  return { status, getLeaderboard };
};

export default useLeaderboard;
