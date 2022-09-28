import React, { useState,useContext,useEffect } from "react";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import {GeneralText as text} from '../Database/Text'
import { Context } from "../context/Context";

function ApiNotFound() {
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const icon = require("../assets/error_icons/api-not-found.svg").default;

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="bg-primary flex flex-col justify-center items-center p-8 pt-20">
      <Image url={icon} styles="w-48 h-48 mb-6" />
      {/* <Text
                tag="h2"
                text={"API Not Found (Failed)"}
                textTransform="capitalize"
                textColor="text-white"
                fontweight="bold"
            /> */}
      <Text
        tag="h5"
        text={text.somethingWrong[lang]}
        textTransform="capitalize"
        textColor="text-lightPurple"
        styles="my-2 text-center"
      />
      <div className="text-green-500 font-bold" onClick={refreshPage}>
        <Text
          tag="h2"
          scale={true}
          text={
            <>
              {text.retry[lang]}
              <FontAwesomeIcon
                icon={faRedo}
                color="green-500"
                className={"ml-1 text-lg"}
              />
            </>
          }
          fontweight="normal"
          alignment="center"
        />
      </div>
    </div>
  );
}

export default ApiNotFound;
