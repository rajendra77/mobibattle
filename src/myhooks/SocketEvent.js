import { disconnect } from "./SocketManagerIO";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
// import ReactGA from "react-ga";
import {logEvent} from '../Analytics/AnalyticsEvent';
import {screen, events} from '../Analytics/EventName';



const SocketEvent = () => {
  const tempObj = reactLocalStorage.getObject("tempObj");
  const GameInit = (iframe, gameName) => {
    console.log('game loaded');
    logEvent(
              {
                screen: screen.game_p,
                event: events.gameInit
              }, 
              {
                title: "game loaded",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  game_name : gameName,
                }
              }
            );
    if (iframe.current == null) return;
    iframe.current.contentWindow.postMessage(
      {
        type: "game.init",
        player_id: 1,
        browser : true
      },
      "*"
    );
  };
  const socketDisconnect = (gameId) => {
    const userDataD = {
      id: reactLocalStorage.getObject("userProfile").uniqueId,
      gameId: gameId,
    };
    if (userDataD && _.has(userDataD, "id")) {
      disconnect(userDataD);
    }
  };
  return { GameInit, socketDisconnect };
};

export default SocketEvent;
