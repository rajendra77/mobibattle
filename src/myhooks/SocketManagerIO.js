import { io } from "socket.io-client";
import _ from "lodash";
import { emitCustomEvent } from "react-custom-events";
import config from "../config/Config";
import {logEvent} from '../Analytics/AnalyticsEvent';
import {screen, events} from '../Analytics/EventName';


let socket;
const endpoint = config.get("socket_endpoint");
let updateData;
let updateData2;
let reqBody;
let updatedScore;
const userProfile = localStorage.getItem("userProfile");
const userName = userProfile ? localStorage.getItem("userProfile").name : "";
console.log(userName);
let guest = (userName === "Guest") ? 1 : 0


export const findBattle = (user, type, pot, paymentType, avatarUrl) => {
  reqBody = { ...user, userType: type, pot, paymentType, img: avatarUrl, operatorId : config.get("headers").operatorId, guest: guest};
  console.log("reqBody", reqBody);
  const userM = JSON.parse(localStorage.getItem("userProfile"));
  const tempObj = JSON.parse(localStorage.getItem("tempObj"));
  console.log('-----code---->', tempObj.code);
  console.log('------number------>', userM.number);
  const socketConfig = config.get("socketConfig");
  console.log('>>> userM:::', userM);
  console.log("FIND BATTLE ----- type", type);
  socket = io(endpoint, {
    ...socketConfig,
    query: {
      userId: userM.uniqueId,
    },
  });
  console.log(`Connecting socket...`, socket);
  console.log('-----socketId----->', socket.id);
  if (socket) {
    console.log(">>> my socket object :::", socket, " :: ReqBody :: ", reqBody);
    console.log(socket.id);
    logEvent(
              {
                screen: screen.dev_s,
                event: events.sendFindBattle
              }, 
              {
                title: "send find battle",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
              }
            );
    socket.emit("findBattle", reqBody, (response) => {
      console.log(
        ">>> $$$ findBattle event acknowledges",
        response,
        response.status,
        socket
      ); // ok
    });
    socket.on("matchfound", (data) => {
      console.log(
        ">>> ######## reciving my matchfound in match::",
        data      
      ); // ok
      updateData2 = data;
      console.log(">>> updateData2 ::", updateData2);
      socket.emit("matchConfirmation", updateData2, (response) => {
      console.log(
        ">>> $$$ matchConfirmation event acknowledges",
        updateData2,
        response
      ); // ok
    });
    });
    

    // socket.emit("matchConfirmation", updateData2, (response) => {
    //   console.log(
    //     ">>> $$$ matchConfirmation event acknowledges",
    //     updateData2,
    //     response
    //   ); // ok
    // });
    socket.on("match", (data) => {
      console.log(">>> ######## reciving my findBattle in match::", data);
      logEvent(
              {
                screen: screen.dev_s,
                event: events.matchFound
              }, 
              {
                title: "match found",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
                others: {
                  game_id : data.gameId,
                  battle_id : data.battleId,
                  a_party : data.aparty,
                  b_party : data.bparty
                }
              }
            );
      updateData = data;
      console.log(">>> updateData ::", updateData);
    });
    socket.on("scoreUpdate", (data) => {
      console.log(
        ">>> ######## reciving data in scoreUpdate::",
        data,
        new Date().getTime()
      );
      updatedScore = data;
      emitCustomEvent("scoreUp", data);
    });
    socket.on("opponentOut", (data) => {
      logEvent(
              {
                screen: screen.dev_s,
                event: events.opponentOut
              }, 
              {
                title: "opponentOut",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
                others: {
                  score : data.score,
                  isEnd : data.isEnd
                }
              }
            );
      console.log(">>> ######## reciving data in opponentOut:: 1", data);
      emitCustomEvent("oppOut", data);

    });
    socket.on("endData", (data) => {
      console.log(">>> ######## reciving data in endData:: 1", data);
      emitCustomEvent("endGameData", data);
    })
  }
};

export const updateScoreB = (data) => {
  console.log(">>> $$$ my current socket", socket, data);
  if (socket) {
    socket.emit("updateScore", data, (response) => {
      console.log(
        ">>>> $$$ updateScore event acknowledges",
        response,
        response.status
      ); // ok
    });
  }
};

export const CallBot = (data) => {
  const userM = JSON.parse(localStorage.getItem("userProfile"));
  const tempObj = JSON.parse(localStorage.getItem("tempObj"));
  console.log(
    ">>> Callbot step1 : $$$ emit my current event with data :::",
    socket,
    "--- data ----",
    data
  );
  
  if (socket) {
    console.log(">>> step2 : trigger call bot event");
    logEvent(
              {
                screen: screen.dev_s,
                event: events.callBot
              }, 
              {
                title: "call bot event triggerd",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
                others: {
                  gameId : data.gameId,
                  userId : data.id
                }
              }
            );
    socket.emit("callBotEvent", data, (response) => {
      console.log(
        ">>>> $$$ Callbotevent event acknowledges",
        response,
        response.status
      ); // ok
      
    });
  }
};

export const disconnect = (user) => {
  // console.log('>>> ### disconnect socket :::', socket);
  // console.trace();
  const userM = JSON.parse(localStorage.getItem("userProfile"));
  const tempObj = JSON.parse(localStorage.getItem("tempObj"));
  if (socket && _.has(user, "id")) {
    // updateData = {};
    console.log(">>> ### disconnect socket if socket data exist :::", socket);
    logEvent(
              {
                screen: screen.dev_s,
                event: events.dis
              }, 
              {
                title: "socket disconnect event emitted",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
              }
            );
    socket.emit("disConnect", user, (response) => {
      console.log(
        ">>>> ### $$$ socket disConnect ::",
        response,
        response.status
      );
      socket.disconnect();
    });
    console.log(">>> ### udpate final socket :::", socket);
  }
};


export const endBattle = (user) => {
  const userM = JSON.parse(localStorage.getItem("userProfile"));
  const tempObj = JSON.parse(localStorage.getItem("tempObj"));
  console.log(">>>> $$$ end battle with socket obj :::", socket);
  if (socket) {
    logEvent(
              {
                screen: screen.dev_s,
                event: events.endBattle
              }, 
              {
                title: "end battle event emitted",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
              }
            );
    console.log("-----socket obj inside endBattle----->", socket);
    socket.emit("endBattle", user, (response) => {
      console.log(">>> response this endBattle :::", response, response.status);
      socket.disconnect(true);
    });
  }
};

export const startBattle = (user) => {
  const userM = JSON.parse(localStorage.getItem("userProfile"));
  const tempObj = JSON.parse(localStorage.getItem("tempObj"));
  if (socket) {
    logEvent(
              {
                screen: screen.dev_s,
                event: events.startBattle
              }, 
              {
                title: "start battle event emitted",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
              }
            );

    console.log(">>>> ### before my socket is started:::", socket, user);
    socket.emit("startBattle", user.aparty, (response) => {
      console.log(
        ">>>> $$$ startBattle event acknowledges",
        response,
        response.status
      ); // ok
    });
  }
};

export const scoreUpdate = () => {
  console.log("-------scoreUpdate function called-------->>>>>", updatedScore);
  // emitCustomEvent("scoreUp", updatedScore);
  return updatedScore;
};

export const endData = (cb) => {
  const userM = JSON.parse(localStorage.getItem("userProfile"));
  const tempObj = JSON.parse(localStorage.getItem("tempObj"));
  if (socket) {
    socket.on("endData", (data) => {
      logEvent(
              {
                screen: screen.dev_s,
                event: events.endData
              }, 
              {
                title: "receiving end data",
                date: new Date(),
                code: tempObj.code,
                mobile: userM.number,
                others: {
                  score : data.score,
                  isEnd : data.isEnd
                }
              }
            );
      console.log(">>> ######## reciving data in End data::", data);
      emitCustomEvent("endGameData", data);
      return cb(null, data);
    });
  }
};

// export const opponentOut = (cb) => {
//   console.log("opponentOut function called ::: ", cb);
//   if (socket) {
//     socket.on("opponetOut", (data) => {
//       console.log(">>> ######## reciving data in opponentOut:: 2", data);
//       emitCustomEvent("oppOut", data);
//       return cb(null, data);
//     });
//   }
// };

export const off = () => {
  socket.off("scoreUpdate");
  socket.off("opponentOut");
};

export const cleanData = () => {
  updateData = {};
  console.log(">>> :::: Update data is cleared.....", updateData);
};

export { updateData, updatedScore };


