import React, { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { getToken } from "./firebase";
import OneSignalComponent from "./oneSignal";
import firebase from "firebase/app";
import "firebase/database";
import { clearCacheData } from "./util";

const Notifications = () => {
  const [isTokenFound, setTokenFound] = useState(false);
  const {initializeOneSignal}  = OneSignalComponent()

  // console.log("FCM Token found", isTokenFound);

  useEffect(() => {   
    const checkAppVersion = () =>{
        const appVersionFirebase = firebase.database().ref("version-gbattle")
      appVersionFirebase.on('value', (snapshot)=>{
          const version = snapshot.val()
          const appVersion = localStorage.getItem("appVersion")
          console.log("app-version",version, appVersion)  
          if(appVersion !== version){
            clearCacheData()
            localStorage.setItem("appVersion", version)
          }
      })
    }

    checkAppVersion()

    let data;
    async function tokenFunc() {
      data = await getToken(setTokenFound);
      if (data) {
        reactLocalStorage.set("fcmToken", data);
        console.log("FCM Token", data);
        initializeOneSignal(data)
      }
      return data;
    }
    tokenFunc();
  }, [setTokenFound]);
  return <></>;
};

Notifications.propTypes = {};

export default Notifications;

//use this function in app.js in case of showing inapp notification

// onMessageListener()
// .then((payload) => {
//   console.log("recieved")
//   setNotification({
//     title: payload.notification.title,
//     body: payload.notification.body,
//   });
//   console.log(payload);
// })
// .catch((err) => console.log("failed: ", err));

