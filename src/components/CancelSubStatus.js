import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import Button from "../commonComponents/Button";
import { Context } from "../context/Context";
import { cancelSubSuccess, cancelSubFailure} from "../Database/Text";
import { useHistory } from "react-router-dom";
import useSubscribe from "../network/useSubscribe";
import { reactLocalStorage } from "reactjs-localstorage";
import ProcessingPage from "../commonComponents/ProcessingPage";
import { Base64 } from "js-base64";


export default function CancelSubStatus() {
  const [showProcessing, setShowProcessing] = useState(false);
  const history = useHistory();
  const { search, location } = useLocation();
  let { status } = queryString.parse(search);
  status = status && Base64.decode(status);
  status = status ? status.toUpperCase() : "";
  const { getLanguage } = useContext(Context);
  const [lang, setLang] = useState("en");
  const { unSubscribe } = useSubscribe();

  const success =
    require("../assets/mtncongo/successfully_subscribe_tick_icon.png").default;
  const low_bal = require("../assets/mtncongo/low_balance_icon.png").default;
  const failed =
    require("../assets/mtncongo/subscription_failure_icon.png").default;
  const error =
    require("../assets/mtncongo/subscription_failed_icon.png").default;

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
  }, []);

  const handleSubmit = () => {
    if (status === "FAILURE") {
      const activeObj = reactLocalStorage.getObject("currItem");
      setShowProcessing(true)
      unSubscribe(activeObj)
      .then((res) => {
          setShowProcessing(false)
          history.replace({ pathname: location.pathname, search: status });       
          //history.push(`/cancelSubStatus?status=${status}`)    
      })
      .catch((err) => {
        console.log(">>>>> SUBSCRIBE API ERROR >>>>>", err)
        setShowProcessing(false)
      });
    }else {
      history.push("/home");
    }
    }

  return (
    <>
     {showProcessing ? (
        <ProcessingPage />
      ) : 
      <div className="flex flex-col text-center justify-center items-center min-h-screen p-4">
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
            ? cancelSubSuccess.status[lang]
            : status === "FAILURE"
            ? cancelSubFailure.status[lang]
            : cancelSubSuccess.errorTitle[lang]
        }
        styles="text-white text-center font-bold py-4"
      />
      <Text
        tag="h6"
        text={
          status === "SUCCESS"
            ? cancelSubSuccess.msg[lang]
            : status === "FAILURE"
            ? cancelSubFailure.msg[lang]
            : cancelSubSuccess.msg[lang]
        }
        styles="text-white text-center"
      />
      {status !== "SUCCESS" && (
        <Text
          tag="h6"
          text={cancelSubFailure.tryAgain[lang]}
          styles="text-yellow-500 text-center py-3"
        />
      )}
      <Button
        type="button"
        label={
          status === "SUCCESS"
            ? cancelSubSuccess.buttonText[lang]
            : status === "FAILURE"
            ? cancelSubFailure.buttonText[lang]
            : cancelSubSuccess.errorButton[lang]
        }
        // action={"addMoney"}
        size={"medium"}
        styles={`font-bold text-lg capitalize text-white ${status === "SUCCESS" ? "bg-tabsColor" : "bg-green-500"} mt-6`}
        eventHandler={handleSubmit}
        // isDisabled={disabled}
      />
      { status !== "SUCCESS" && <Button
        type="button"
        label={cancelSubSuccess.buttonText[lang]}
        size={"medium"}
        styles={"font-bold text-lg capitalize text-white bg-tabsColor mt-6"}
        eventHandler={()=>history.push("/home")}
      />}
    </div> }
    </>
  );
}

