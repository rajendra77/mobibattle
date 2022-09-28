import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import Button from "../commonComponents/Button";
import { Context } from "../context/Context";
import { subSuccess, subLowBalFail, subFailure} from "../Database/Text";
import { useHistory } from "react-router-dom";
import useSubscribe from "../network/useSubscribe";
import { reactLocalStorage } from "reactjs-localstorage";
import ProcessingPage from "../commonComponents/ProcessingPage";
import useRegister from "../network/useRegister";
import useOtpRequest from "../network/useOtpRequest";
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';

export default function SubStatus() {
  const [showProcessing, setShowProcessing] = useState(false);
  const [msisdn, setMsisdn] = useState("")
  const history = useHistory();
  const { search, pathname } = useLocation();
  const { subscribe } = useSubscribe();
  let { status } = queryString.parse(search);
  status = status && Base64.decode(status);
  status = status ? status.toUpperCase() : "";
  const { getLanguage } = useContext(Context);
  const [lang, setLang] = useState("en");
  const { register } = useRegister();
  const { Otp } = useOtpRequest();
  console.log("status::", status);

  // const btnText = (msisdn === undefined) ? subSuccess.buttonText[lang] : subSuccess.logIn[lang];
  // console.log(msisdn, btnText);


  const success =
    require("../assets/mtncongo/successfully_subscribe_tick_icon.png").default;
  const low_bal = require("../assets/mtncongo/low_balance_icon.png").default;
  const failed =
    require("../assets/mtncongo/subscription_failure_icon.png").default;
  const error =
    require("../assets/mtncongo/subscription_failed_icon.png").default;

  useEffect(() => {
    window.scrollTo(0, 0);
    setMsisdn(reactLocalStorage.get("msisdn"))
    setLang(getLanguage());
    let guiDataEvent = {}
    guiDataEvent['page'] = 'substatus';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  }, []);


  const handleSubmit = () => {
    if (status === "SUCCESS" || status === "FAILURE" || status === "PENDING") {
      history.push("/home");
    }else {
      setShowProcessing(true);
      const activeObj = reactLocalStorage.getObject("currItem");
      setTimeout(() => {
        subscribe(activeObj)
          .then((res) => {
            console.log(">>>>> SUBSCRIBE API SUCCESS >>>>>", res);
            setShowProcessing(false);
            history.push(`/subStatus?status=${Base64.enode(res.status)}`);
          })
          .catch((err) => {
            console.log(">>>>> SUBSCRIBE API ERROR >>>>>", err);
          });
      }, 200);
    }
    }
    // const handleHome = () => {
    //   history.push("/home");
    // }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
       {showProcessing && <ProcessingPage />}
      <Image
        url={
          status === "SUCCESS"
            ? success
            : status === "LOW_BAL"
            ? low_bal
            : status === "FAILURE"
            ? failed
            : error
        }
        styles="h-32"
      />
      <Text
        tag="h3"
        text={
          status === "SUCCESS"
            ? subSuccess.status[lang]
            : status === "LOW_BAL"
            ? subLowBalFail.status[lang]
            : status === "FAILURE"
            ? subFailure.status[lang]
            : subSuccess.errorTitle[lang]
        }
        styles="text-white font-bold py-4 text-center"
      />
      <Text
        tag="h6"
        text={
          status === "SUCCESS"
            ? subSuccess.msg[lang]
            : status === "LOW_BAL"
            ? subLowBalFail.msg[lang]
            : status === "FAILURE"
            ? subFailure.msg[lang]
            : subFailure.msg[lang]
        }
        styles="text-white text-center"
      />
      {/* {status === "SUCCESS" && (
        <Text
          tag="h6"
          text={"Commencez à gagner aujourd'hui !"}
          styles="text-white text-center"
        />
      )} */}
      {status !== "SUCCESS" && (
        <Text
          tag="h6"
          text={subLowBalFail.tryAgain[lang]}
          styles="text-white text-center"
        />
      )}
      <Button
        type="button"
        label={
          status === "SUCCESS"
            ? subSuccess.buttonText[lang]
            : status === "LOW_BAL"
            ? subLowBalFail.buttonText[lang]
            : status === "FAILURE"
            ? subFailure.buttonText[lang]
            : msisdn!== "" ? subFailure.buttonText[lang] : subSuccess.errorButton[lang]
        }
        // action={"addMoney"}
        size={"medium"}
        styles={"font-bold text-lg capitalize text-white bg-tabsColor mt-6"}
        eventHandler={handleSubmit}
        // isDisabled={disabled}
      />
      {/* {
        (status === "SUCCESS" || status === "FAILURE") &&
        <Text
          tag="h6"
          text={"Remarque : Ce service n'est disponible que pour les utilisateurs GMobile prépayés."}
          styles="text-white text-center fixed bottom-2 px-1"
        />

      } */}
      {/* { (status === null || status === "FAILURE") && <Button
        type="button"
        label={"Home"}
        size={"medium"}
        styles={"font-bold text-lg capitalize text-white bg-tabsColor mt-6"}
        eventHandler={handleHome}
        // isDisabled={disabled}
      />} */}
    </div>
  );
}
