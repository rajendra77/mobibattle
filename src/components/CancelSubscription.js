import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import Button from "../commonComponents/Button";
import { Context } from "../context/Context";
import { cancelSubscription as text } from "../Database/Text";
import { useHistory } from "react-router-dom";
import cx from "classnames";
import Loader from "../commonComponents/Loader";
import ProcessingPage from "../commonComponents/ProcessingPage";
import useSubscribe from "../network/useSubscribe";
import { reactLocalStorage } from "reactjs-localstorage";
import { Base64 } from "js-base64";
import {  SendGuiDataEvents } from "../commonScript";

export default function CancelSubscription() {
  const [showProcessing, setShowProcessing] = useState(false);
  const history = useHistory();
  const { search } = useLocation();
  const { unSubscribe } = useSubscribe();
  let { status } = queryString.parse(search);
  status = status ? status.toUpperCase() : "";
  const { getLanguage, handleShowModal } = useContext(Context);
  const [loader, showLoader] = useState(true);
  const [lang, setLang] = useState("en");
  const gbattleLogo = require("../assets/gmobileMongolia/2-min.png").default;
  const success =
    require("../assets/mtncongo/subscription_activated_icon.png").default;
    const CancelSubscription =
    require("../assets/mtncongo/cancel_subscription_icon.png").default;

  useEffect(() => {
     //send gui events
     let guiDataEvent = {}
     guiDataEvent['page'] = 'unsubscription';
     guiDataEvent['event'] = 'open';
     SendGuiDataEvents(guiDataEvent);

    window.scrollTo(0, 0);
    setLang(getLanguage());
    setTimeout(() => {
      showLoader(false);
    }, 1000)
  }, []);

  const handleClose = () => {
    history.goBack();
  }

  const handleSubmit = () => {
         //send gui events
         let guiDataEvent = {}
         guiDataEvent['page'] = 'unsubscription';
         guiDataEvent['event'] = 'unsub_click';
         SendGuiDataEvents(guiDataEvent);
      const modalData = {
          icon: CancelSubscription,
          title: text.modalTitle[lang],
          body: text.modalSubTitle[lang],
          buttons: [
            {
              label: text.no[lang],
              action: "close",
              buttonColor: "bg-tLightViolet",
              textColor: "text-white",
            },
            {
              label: text.yes[lang],
              action: "cancelSubscription",
              buttonColor: "bg-tabsColor",
              textColor: "text-white",
            },
          ],
          hideClose: false,
          handleClick: function (button) {
            if (button === "close") {
              handleShowModal(false);
            }
            else if (button === "cancelSubscription") {
              // history.push("/cancelSubProcessing")
              const activeObj = reactLocalStorage.getObject("currItem");
              handleShowModal(false);
              setShowProcessing(true);
              setTimeout(() => {
                unSubscribe(activeObj)
                  .then((res) => {
                    console.log(">>>>> UNSUBSCRIBE API SUCCESS >>>>>", res);
                    setShowProcessing(false);
                    // let status = 'success';
                    // if (res.statusCode===1000){
                    //     status = 'failure'
                    // }
                    history.push(`/cancelSubStatus?status=${Base64.encode(res.status)}`)
                  })
                  .catch((err) => {
                    console.log(">>>>> UNSUBSCRIBE API ERROR >>>>>", err);
                  });
              }, 200);
            }
          },
        };
        handleShowModal(true, modalData);
  }
  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });
  return (
    <>
    {loader && <Loader />}
    {showProcessing ? <ProcessingPage /> : 
    <div className={`flex flex-col items-center min-h-screen p-4 ${loaderClass}`}>
        <Image
        url={gbattleLogo}
        styles=""
      />
      <Image
        url={success}
        styles="h-32 mt-6"
      />
      <Text
        tag="h2"
        text={text.playmore[lang]}
        styles="text-white font-medium py-4 text-center "
        textTransform ="uppercase"
      />
      {/* <Text
        tag="h4"
        text={text.subTitle[lang]}
        styles="text-yellow-500 text-center font-medium"
      /> */}
        <Text
          tag="h6"
          text={text.subActiveMsg1[lang]}
          styles="text-tLightViolet text-center pt-3"
        />
        <Text
          tag="h6"
          text={text.subActiveMsg2[lang]}
          styles="text-tLightViolet text-center"
        />
        {/* <Text
          tag="h6"
          text={"platform, enjoy it!"}
          styles="text-tLightViolet text-center"
        />    */}
      <Button
        type="button"
        label={text.close[lang]}
        // action={"addMoney"}
        size={"medium"}
        styles={"font-bold text-lg capitalize text-white bg-green-500 mt-16"}
        eventHandler={handleClose}
        // isDisabled={disabled}
      />

      <Button
        type="button"
        label={text.buttonText[lang]}
        // action={"addMoney"}
        size={"medium"}
        styles={"font-bold text-lg capitalize text-white bg-red-500 mt-8"}
        eventHandler={handleSubmit}
        // isDisabled={disabled}
      />
      
    </div> }
    </>
  );
}
