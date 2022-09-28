import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "../context/Context";
import { Base64 } from "js-base64";
import moment from "moment";
import ReactGA from "react-ga";
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import usePushRegister from "./usePushRegister";
import { reject } from "lodash";
import { GeneralText, errorCodes } from "../Database/Text";

const useRegister = () => {
  const [status, setStatus] = useState("idle");
  const { handleShowModal, cleanData } = useContext(Context);
  const history = useHistory();
  const tempObj = reactLocalStorage.getObject("tempObj");
  const { pushRegistration } = usePushRegister()

  const register = (mobile, type, code, otp) => {
    console.log(otp,type);
     const modifiedCode = code.substring(1);
    const duration = moment.duration("01:35:00");
    const time = moment().add(duration).valueOf();
    const header = config.get("headers");
    const body = {
      deviceId: mobile,
      number: `${modifiedCode}${mobile}`,
      registrationMethod: type,
      registrationMode: config.get("registrationMode"),
      countryCallingCode: code,
      otp: otp,
    };

    const url = config.get("base") + config.get("register");
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
              logEvent(
                {
                  screen: screen.otp_p,
                  event: events.registerApiSuccess,
                },
                {
                  title: "register request successfull",
                  mobile : mobile,
                }
              );
              const playerId=reactLocalStorage.get("oneSignalToken");
              const fcmToken= reactLocalStorage.get("fcmToken");
              pushRegistration(playerId, fcmToken, data.uniqueId, mobile).then((res) => {
                console.log("res", res)
              }).catch((err) => {
                console.log(err)
              })
              setStatus("fetched");
              reactLocalStorage.setObject("uniqueId", data.uniqueId);
              reactLocalStorage.setObject("countDown", time);
              let userProfile = {
                name: data.displayName,
                number: mobile,
                uniqueId: data.uniqueId,
                deviceId: mobile,
              };
              if (
                Object.prototype.hasOwnProperty.call(data, "avatarUrl") 
                // Object.prototype.hasOwnProperty.call(
                //   data.profile,
                //   "avatarUrl"
                // ) &&
                // data.profile.avatarUrl.length > 0
              ) {
                // userProfile.avatarUrl = data.profile.avatarUrl;
                userProfile.avatarUrl = data.avatarUrl;

              }
              reactLocalStorage.setObject("userProfile", userProfile);
              resolve(data);
            } else {
              console.error("Register API failure ", data);
              const reason = data.reason ? data.reason : "null";
              logEvent(
                {
                  screen: screen.otp_p,
                  event: events.registerApiFailure,
                },
                {
                  title: "register request failed",
                  mobile : mobile,
                  others : {
                    reason : reason,
                    status : data.status
                  }
                }
              );
              const modalData = {
                title : '',
                body : errorCodes[data.statusCode]["mg"],
                buttons: [
                  {
                    label: GeneralText.okay["mg"],
                    action: "okay",
                    buttonColor: "bg-tabsColor",
                    textColor: "text-white",
                  },
                ],

                handleClick: function (button) {
                  if (button === "okay") {
                    handleShowModal(false);
                    cleanData();
                    if(data.statusCode===1052){
                      history.goBack();
                   }

                  }
                },
              };
              handleShowModal(true, modalData);
              reject(data)
            }
          } else {
            console.error("Register API error ", response);
            const reason = response.reason ? response.reason : "null";
            logEvent(
              {
                screen: screen.otp_p,
                event: events.registerApiFailure,
              },
              {
                title: "register request failed",
                mobile : mobile,
                others : {
                  reason : reason,
                  status : response.status
                }
              }
            );
            const modalData = {
              handleClick: function (button) {
                if (button === "close") {
                  handleShowModal(false);
                  history.push("/");
                }
              },
            };
            handleShowModal(true, modalData);
          }
        })
        .catch((err) => {
          let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
          console.log('--------3-------->');
          console.error("Register API error ", err);
          logEvent(
              {
                screen: screen.otp_p,
                event: events.registerApiFailure
              }, 
              {
                title: "register request failure",
                code: code,
                mobile: mobile,
                others: {
                  err: errObj
                } 
              }
            );
          const modalData = {
            handleClick: function (button) {
              if (button === "close") {
                handleShowModal(false);
                history.push("/");
              }
            },
          };
          handleShowModal(true, modalData);
        });
    });
  };

  const guestRegister = (mobile ) => {   
    const url = config.get("base") + config.get("guestRegister")
    const body ={
       "deviceId": mobile,
       "language": "mng",
       "operatorId": config.get("operatorId")
    }
    return new Promise((resolve) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: config.get("headers"),
        body: JSON.stringify(body)
      })

        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            if(data.status.toUpperCase() === "SUCCESS"){
              let userProfile = {
                name: "Guest",
                number: mobile,
                uniqueId: data.uniqueId,
                deviceId: mobile,
              };
              reactLocalStorage.setObject("userProfile", userProfile)
              setStatus("fetched");
              resolve(data);
            }else{
              reject(data)
            }
          }
        })
        .catch((err) => {
          console.error("guest Register API error ", err);
        });
    });
  };

  const getRegisterNumberId = (id) => {   
    const header = config.get("headers");
    const url = config.get("base") + config.get("getRegisterNumberId") + id
    return new Promise((resolve) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers : header
      })

        .then(async (response) => {
          if (response.status === 200) {
             const data = await response.json();
             setStatus("fetched");
             resolve(data);
          }
        })
        .catch((err) => {
          console.error("getRegisterNumberId API error ", err);
        });
    });
  };



  return { status, register, guestRegister, getRegisterNumberId };
};

export default useRegister;
