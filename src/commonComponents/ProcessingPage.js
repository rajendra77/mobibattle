import React, { useContext, useEffect, useState } from 'react';
import Text from "./Text";
import SubscriptionLoader from "./SubscriptionLoader";
import {ProcessingPageText as text} from '../Database/Text'
import { Context } from '../context/Context';

function ProcessingPage({guest}) {
    const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);

  useEffect(()=>{
    setLang(getLanguage())
  },[])
    return(
        <div className="flex flex-col h-screen items-center">
            <SubscriptionLoader />
            <Text 
                tag="h3"
                text={guest ? "" : text.processingPage[lang]}
                textColor="text-white"
                styles="text-white mb-2 font-bold tracking-wider text-center"
            />
            <Text 
                tag="div"
                text={guest ? text.creatingGuestProfile[lang] : text.line1[lang]}
                textColor="text-white text-center"
                styles={guest ? "text-white" : "text-lightPurple"}
            />
            <Text 
                tag="div"
                text={guest ? "" : text.line2[lang]}
                textColor="text-white"
                styles={guest ? "text-white text-center" : "text-lightPurple text-center"}
            />
        </div>

    )
}

export default ProcessingPage;
