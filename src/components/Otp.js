import React, { useState, useEffect, useContext } from "react";
import Config from "../Database/newConfig";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import CountryCodes from "../Database/CountryCodes.json";
import { Context } from "../context/Context";
import useRegister from "../network/useRegister";
import Title from "../commonComponents/LoginTitle";
import Form from "../commonComponents/LoginForm";
import Image from "../commonComponents/Image";
import { reactLocalStorage } from "reactjs-localstorage";
import { LoginPageText as text } from "../Database/Text";
import ProcessingPage from "../commonComponents/ProcessingPage";
import useSubscribe from "../network/useSubscribe";
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';


function Otp() {
  const [lang, setLang] = useState("en");
  const [otpNum, setOtpNum] = useState("");
  const [timeLeft, setTimeLeft] = useState(59);
  const [config, setConfig] = useState({});
  const [number, setNumber] = useState("");
  const [showProcessing, setShowProcessing] = useState(false);
  let { search, pathname } = useLocation();
  let { mode } = queryString.parse(search);
  mode = mode && Base64.decode(mode);
  const history = useHistory();
  const { register } = useRegister();
  const { subscribe, checkSubscription } = useSubscribe();
  const { saveUniqueId, code, getLanguage } = useContext(Context);
  const isInitiallyVisible = false;
  const [isKeyboardVisible, setKeyboardVisible] = useState(isInitiallyVisible);

  useEffect(() => {
    // toggle isKeyboardVisible on event listener triggered
    window.visualViewport.addEventListener("resize", () => {
      setKeyboardVisible(!isKeyboardVisible);
    });
  }, [isKeyboardVisible]);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    const lang = getLanguage();
    setLang(lang);
    setConfig(Config.otpScreen);
    setNumber(reactLocalStorage.get("mobileNumber"));
    let guiDataEvent = {}
    guiDataEvent['page'] = 'otp';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(timer);
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  const handleOtpVerification = () => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'otp';
    guiDataEvent['event'] = 'verifyotp_click';
    guiDataEvent['otp'] = otpNum;
    SendGuiDataEvents(guiDataEvent);
    register(number, "OTP", code, otpNum)
      .then(
        (res) => {
          if (res.status.toUpperCase() === "SUCCESS") {
            saveUniqueId(res.uniqueId);
            // history.push("/home")
            if (mode === "subscribe") {
              setShowProcessing(true);
              checkSubscription(res.uniqueId).then((response) => {
                reactLocalStorage.set(
                  "subStatus",
                  response.currentStatus.toLowerCase()
                );
                if (response.status.toUpperCase() === "SUCCESS") {
                  history.push(`/home?mode=${Base64.encode("subscribe")}`);
                } else {
                  const activeObj = reactLocalStorage.getObject("currItem");
                    subscribe(activeObj, res.uniqueId)
                      .then((res) => {
                        console.log(">>>>> SUBSCRIBE API SUCCESS >>>>>", res);
                        setShowProcessing(false);
                        history.push(`/subStatus?status=${Base64.encode(res.status)}`);
                      })
                      .catch((err) => {
                        console.log(">>>>> SUBSCRIBE API ERROR >>>>>", err);
                      });
                }
              });
            }else if(mode === "subscribed") {
                checkSubscription(res.uniqueId).then((response) => {
                if (response.status.toUpperCase() === "SUCCESS") {
                      history.push(`/home?mode=${Base64.encode("subscribe")}`)
                      } else {
                        // localStorage.clear()
                        history.push(`/subscription?mode=${Base64.encode("registered")}`);
                      }
                    });
            }else {
              if (res.isProfile) {
                history.push("/home");
              } else {
                reactLocalStorage.setObject("subscribed", false);
                history.push("/mojiavatar");
              }
            }
          }
        },
        (err) => {
          setOtpNum("");
          console.log("Promise rejected...", err);
        }
      )
      .catch((err) => {
        setOtpNum("");
        console.log("error is", err);
      });
  };
  const otp_icon =
    require("../assets/svg-icons/login_otp_verify_page_icon1.svg").default;
  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-centerbg-cover bg-no-repeat">
      {showProcessing ?  <ProcessingPage /> : 
      <>
      <div className="flex flex-col items-center justify-center mt-12">
        <Image url={otp_icon} styles={"2xs:h-28 2xs:w-28 h-32 w-32"} />
        <Title
          title={text.verifyMsg[lang]}
          subTitleColor={"lightPurple"}
          titleTag={"h2"}
        />
      </div>
      <div>
        <Form
          isOtp={true}
          otpNum={otpNum}
          updateOtpNum={(data) => setOtpNum(data)}
          config={config.cardText}
          countryCode={CountryCodes}
          handleEvent={handleOtpVerification}
          number={number}
          timeLeft={timeLeft}
          resetTimer={() => setTimeLeft(59)}
          text={text}
          lang={lang}
          isKeyboardVisible={isKeyboardVisible}
        />
      </div> 
      </>}
    </main>
  );
}

export default Otp;
