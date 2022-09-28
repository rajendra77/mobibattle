import { useContext, useState } from "react";
import config from "../config/Config";
import { Context } from "../context/Context";
import { GeneralText } from "../Database/Text";

const useOtpRequest = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);
  const header = config.get("headers");
  const { handleShowModal } = useContext(Context);

  const Otp = (mobile, code) => {
    const modifiedCode = code.substring(1);
    const body = {
      deviceId: mobile,
      number: `${modifiedCode}${mobile}`,
      countryCallingCode: code,
    };
    const url = config.get("base") + config.get("getOtp");
    console.log("OTP URL IN HOOK :: ", config.get("otpUrl"));
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
            if (data.status&& data.status.toUpperCase() === "SUCCESS") {
              resolve(data);
              setData(data);
              setStatus("fetched");
            } else {
              if(data.statusCode === 0){
                const modalData = {
                  title : '',
                  body : GeneralText.wrongNumber["mg"],
                  icon : require("../assets/mtncongo/oops_busy_player.png").default,
                  buttons: [
                    {
                      label: "Үнэгүй тоглох",
                      action: "okay",
                      buttonColor: "bg-tabsColor",
                      textColor: "text-white",
                    },
                  ],
                  handleClick: function (button) {
                    if (button === "okay") {
                      handleShowModal(false);
                    }
                  },
                };
                handleShowModal(true, modalData);
              }
              // reject(data);
            }
            // reactLocalStorage.setObject("otp", data);
          } else {
            console.log("----1response1--->", response);
            reject(response);
          }
        })
        .catch(async (err) => {
          console.log("Error in send otp!!", err);
          reject(err);
        });
    });
  };

  return { status, data, Otp };
};

export default useOtpRequest;
