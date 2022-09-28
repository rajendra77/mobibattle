import React, {useState, useEffect, useContext} from 'react';
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import SubscriptionLoader from "../commonComponents/SubscriptionLoader";
import { useHistory } from "react-router-dom";
import useSubscribe from "../network/useSubscribe";
import { reactLocalStorage } from "reactjs-localstorage";
import { ProcessingPageText } from '../Database/Text';
import { Context } from '../context/Context';
import { Base64 } from "js-base64";


function CancelSubProcessing() {
    const history = useHistory();
    const { unSubscribe } = useSubscribe();
    const [loading, setLoading] = useState(true);
    const { getLanguage } = useContext(Context);
    const [lang, setLang] = useState("en");
    const activeObj = reactLocalStorage.getObject("currItem");
    console.log("activeObj::", activeObj);


    
    useEffect(() => {
      setLang(getLanguage());
      unSubscribe(activeObj)
      .then((res) => {
          console.log("res::", res);
          const status = res.status.toLowerCase();
            setTimeout(() => {
            history.push(`/cancelSubStatus?status=${Base64.encode(status)}`)
            }, 3000);        
        console.log(">>>>> SUBSCRIBE API SUCCESS >>>>>", res);
      })
      .catch((err) => {
        console.log(">>>>> SUBSCRIBE API ERROR >>>>>", err)
      });
  }, [])
    useEffect(() => {
    window.scrollTo(0, 0);
    // setTimeout(() => {
    //   history.push("/subStatus?status=success")
    // }, 5000);
  }, []);
//     if (loading) {
//     return (
//       <div className="w-screen h-screen">
        
//       </div>
//     );
//   }
    return(
        <div className="flex flex-col h-screen items-center">
            <SubscriptionLoader />
            <Text 
                tag="h4"
                text={ProcessingPageText.processingPage[lang]}
                textColor="text-white"
                styles="text-white mb-2 font-bold"
            />
            <Text 
                tag="div"
                text={ProcessingPageText.line1[lang]}
                textColor="text-white"
                styles="text-lightPurple"
            />
            <Text 
                tag="div"
                text={ProcessingPageText.line2[lang]}
                textColor="text-white"
                styles="text-lightPurple"
            />
        </div>
    )
}

export default CancelSubProcessing;
