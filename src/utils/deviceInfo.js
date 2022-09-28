import React, { useEffect, useState } from "react";
import Text from "../commonComponents/Text";

function DeviceInfo() {

  const [ip, setIp] = useState('')
  const [userAgent, setUserAgent] = useState('')

  useEffect(() => {
    setUserAgent(navigator.userAgent)
    fetch("https://api.ipify.org?format=json").then((response) => {
      return response.json()
    }).then((res) => {
      console.log("ip ", res.ip)
      setIp(res.ip);
    })
  }, [])

  return (
    <div className="bg-primary justify-center items-center p-8">
      <Text
        tag="h6"
        text={`User Agent : ${userAgent}`}
        textTransform="capitalize"
        textColor="text-white"
        fontweight="bold"
      />
      <Text
        tag="h6"
        text={`IP Address : ${ip}`}
        textTransform="capitalize"
        textColor="text-white"
        fontweight="bold"
        styles="mt-5"
      />
    </div>
  );
}

export default DeviceInfo;
