import { reactLocalStorage } from "reactjs-localstorage";
import config from "./config/Config";
import {
  checkReturningUser,
  detectBrowser,
  getTotalDuration,
} from "./utils/util";

//----> session id generate logic
var sessionTime = localStorage.getItem("sessionTime")
  ? localStorage.getItem("sessionTime")
  : "";
var sessionId = localStorage.getItem("sessionId")
  ? localStorage.getItem("sessionId")
  : "";
if (sessionTime && sessionId && Date.now() - sessionTime > 120000) {
  // 2 min
  console.log("----- session id updated : --->" + sessionId);
  localStorage.setItem("sessionId", sessionId);
}
sessionTime = Date.now();
if (sessionId === "") {
  //set session id for first time only
  sessionId = sessionTime;
  localStorage.setItem("sessionId", sessionId);
}
localStorage.setItem("sessionTime", sessionTime);

// ----> generate device id
var deviceId = localStorage.getItem("device_id")
  ? localStorage.getItem("device_id")
  : "";
if (deviceId === "") {
  // milli seconds till generate
  deviceId = Date.now();
  console.log("----- device id set : --->" + deviceId);
  localStorage.setItem("device_id", deviceId);
}

// ----> msisdn calc

export function SendGuiDataEvents(data) {
  if((new Date().getTime() - sessionStorage.getItem("lastPublish")) > 300000){  //5mins
      sessionStorage.setItem("sessionStartTime", new Date().getTime()) 
  }
  sessionStorage.setItem("lastPublish", new Date().getTime()) 
  let msisdn = "NA";
  if (localStorage.getItem("tempObj")) {
    const { number, code } = JSON.parse(localStorage.getItem("tempObj"));
    msisdn = code + number;
  }
  var userProfile = "";
  if (localStorage.getItem("userProfile")) {
    userProfile = JSON.parse(localStorage.getItem("userProfile"));
  }
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = userName === "Guest" ? 1 : 0;
  
  const guiDataEvent = {
    domain: window.location.hostname,
    operator_id: config.get("operatorId"),
    user_agent: navigator.userAgent,
    device_id: deviceId,
    session_id: sessionStorage.getItem("sessionStartTime") + sessionStorage.getItem("sessionRandom"),
    msisdn: reactLocalStorage.get("msisdn")
      ? reactLocalStorage.get("msisdn")
      : msisdn,
    device_type: "web",
    channel: "direct",
    device_info: "NA",
    browser: detectBrowser(),
    previouspage: "NA",
    trace: "",
    display_name: userProfile.name ? userProfile.name : "NA",
    user_id: localStorage.getItem("uniqueId")
      ? localStorage.getItem("uniqueId")
      : "NA",
    guest: guest,
    referrer_info: "NA",
    he: reactLocalStorage.get("msisdn") ? 1 : 0,
    user_type: checkReturningUser(),
    user_status: reactLocalStorage.get("subStatus")
      ? reactLocalStorage.get("subStatus")
      : "NA",
    request_time: new Date().toISOString(),
    aon_time: getTotalDuration("local"),
    session_time_duration: getTotalDuration("session"),
  };

  let tracer = reactLocalStorage.get("tracer")
    ? JSON.parse(reactLocalStorage.get("tracer"))
    : "";
  guiDataEvent["previouspage"] = tracer[tracer.length - 1];
  guiDataEvent["sub_event"] = data["page"] + "_"+ data["event"]
  tracer = tracer + data["page"] + "_" + data["event"] + "|";
  reactLocalStorage.set("tracer", JSON.stringify(tracer));
  guiDataEvent["trace"] = tracer;

  let objData = { ...guiDataEvent, ...data };
  var jsonData_base64 = window.btoa(JSON.stringify(objData)); //base_64

  // let eventUrl = "https://sandboxdemoapi.mobibattle.co/mobibattle-backend-v-1";
  let eventUrl = config.get("base");
  let url = eventUrl + config.get("elasticPublish");

  fetch(url, { method: "POST", body: jsonData_base64 })
    .then((resp) => {
      console.log("resp ==>>>", resp);
    })
    .catch((error) => {
      console.log("error", error);
    });
}
