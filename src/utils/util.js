import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";

export const clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    console.log("cache cleard");
  };

  export const setStartTimes = () => {
    if(!localStorage.getItem("localStartTime")){
      localStorage.setItem("localStartTime", new Date().getTime())
    } 
    if(!sessionStorage.getItem("sessionStartTime")) {
      sessionStorage.setItem("sessionStartTime", new Date().getTime()) 
      sessionStorage.setItem("sessionRandom", Math.ceil(Math.random()*1000) ) 
    }
  };

  export const getTotalDuration = (storageType) => {
    let totalDuraction
    if(storageType === "local"){
      totalDuraction= new Date().getTime() - localStorage.getItem("localStartTime")
    }else if(storageType === "session"){
      totalDuraction= new Date().getTime() - sessionStorage.getItem("sessionStartTime")
    }
    return totalDuraction
  };

  export const  detectBrowser = () => {
    if (
      (navigator.userAgent.indexOf("Opera") ||
        navigator.userAgent.indexOf("OPR")) != -1
    ) {
      return "Opera";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    } else if (
      navigator.userAgent.indexOf("MSIE") != -1 ||
      !!document.documentMode == true
    ) {
      return "IE"; //crap
    } else {
      return "Unknown";
    }
  }
  
  export const checkReturningUser = () =>{
    const userProfile = reactLocalStorage.getObject("userProfile");
    if (_.isEmpty(userProfile) === false && _.has(userProfile, "uniqueId")) {
       return 0
    }else{
      return 1
    }
  }
