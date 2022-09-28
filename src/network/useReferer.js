import { useState } from "react";
import config from "../config/Config";
import ReactGA from 'react-ga'

const useReferer = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);

  const referer = (branchData) => {
    if(Object.entries(branchData).length === 0 ){
        let url = window.location.href
        url= url.replace('#/','');
        console.log("url is", url)
        let keyArr = url.split('?')[1].split("&")
        // let keyArr = url.split('#')[0].split('?')[1].split("&")

        const params={}
        keyArr.forEach((x)=>{
          params[x.split("=")[0]] = x.split("=")[1]
        })
        if(Object.entries(params).length === 0 ){
          return
        }else{
          branchData = params
        }
    }
    console.log("Referral data >>>>>>>>>>", branchData)
    const header = config.get("headers");
    const body = {
      deviceType: "WEB",
      requestSource: "WEB",
      referralSource : branchData
    };
    const url = config.get("base") + config.get("sendReferer");
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
            // reactLocalStorage.setObject("otp", data);
            resolve(data);
            ReactGA.event({
              category: "Landing_page_Referer",
              action: `status - ${response.status},  date-${new Date()},`,
            });
          } else {
            console.log('----1response1--->', response);
            reject(response);
          }
        })
        .catch(async (err) => {
          console.log("Error in send otp!!", err);
          reject(err);
        });
    });
  };

  return { status, data, referer };
};

export default useReferer;