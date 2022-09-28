import React, { useEffect, useState } from "react";
import Loader from "../commonComponents/Loader";
import Text from "../commonComponents/Text";
import useReferCode from '../network/useReferCode'
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import config from "../config/Config";
import Button from "../commonComponents/Button";
import Input from "../commonComponents/Input";

function GetAndroidApk() {

  const [ip, setIp] = useState('')
  const [loader, showLoader] = useState(true);
  const [userAgent, setUserAgent] = useState('')
  const { createDeviceDetailsCode } = useReferCode()
  let { search } = useLocation();
  const [refer, setReferCode] = useState('')
  const [errorMesg , setErrorMsg] = useState('')
  const { referCode } = queryString.parse(search);


  useEffect(() => {
    console.log(navigator.userAgent)
    setUserAgent(navigator.userAgent)
    setReferCode(referCode)
    fetch("https://api.ipify.org?format=json").then((response) => {
      return response.json()
    }).then((res) => {
      console.log("ip ", res.ip)
      showLoader(false)
      setIp(res.ip);
    }).catch((err) => {
      showLoader(false)
    })
  }, [])

  const downloadApk = () => {
    const deviceInfo = userAgent.split("(")[1].split(")")[0].split("; ")
    let deviceDetail = `${ip}~${deviceInfo[1]}~${deviceInfo[2]}`
    deviceDetail = deviceDetail.replace(/ /g, '')
    createDeviceDetailsCode(deviceDetail, refer)
      .then((res) => {
        console.log("response is", res)
        setErrorMsg("")
        window.open(config.get("androidApkBaseUrl") + "mobibattle.apk");
      }).catch((err) => {
        console.log(err)
        setErrorMsg("Something went wrong")
      })
  }

  return (
    <>
      {loader ? <Loader /> :
        <div className="bg-primary justify-center items-center p-8 text-center mt-32">
          <Text
            tag={"h3"}
            scale={true}
            text={"Refer Code"}
            fontweight="normal"
            alignment="center"
            styles="text-white font-bold"
          />
          <Input
            type={"text"}
            value={refer}
            eventHandler={(e) => setReferCode(e.target.value)}
            styles=" mb-4 w-full h-12 font-bold outline-none border-b border-moneyBorder text-3xl bg-white pl-10"
          />

          <Button
            tag="h4"
            label="Download APK"
            text={"Download APK"}
            textTransform="uppercase"
            styles=" text-white font-extrabold text-center w-full py-2 mb-1 rounded-full bg-tBlue"
            eventHandler={() => downloadApk()}
          />
          <Text
            tag={"h3"}
            scale={true}
            text ={errorMesg}
            fontweight="normal"
            alignment="center"
            styles="text-red-500 font-bold mt-5"
          />
        </div>
      }

    </>


  );
}

export default GetAndroidApk;
