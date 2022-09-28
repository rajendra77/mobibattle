import React, { useState, useEffect, useContext } from "react";
import StatsItem from "../commonComponents/StatsItem";
import cx from "classnames";
import StatsHeader from "../commonComponents/StatsHeader";
import ApiNotFound from "./ApiNotFound";
import useGameHistory from "../network/useGameHistory";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import Loader from "../commonComponents/Loader";
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import {GameHistoryText as text} from '../Database/Text'
import { Context } from "../context/Context";
import {SendGuiDataEvents} from '../commonScript';



function LeaderBoardStats() {
  const [live, setLive] = useState([]);
  const [image, setImage] = useState("");
  const [loader, showLoader] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [show, setShow] = useState(false);
  let { search, pathname } = useLocation();
  const { id } = queryString.parse(search);
  const userId = id ? id : reactLocalStorage.getObject("userProfile").uniqueId;
  const type = id ? "leaderboard" : "ALL";
  const { gameHistory } = useGameHistory();
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const defaultImage =
    require("../assets/svg-icons/animal-avatar4.png").default;
  const tempObj = reactLocalStorage.getObject("tempObj");

  useEffect(() => {
    setLang(getLanguage())
    gameHistory(userId, type)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
        logEvent(
              {
                screen: screen.gameHistory_p,
                event: events.apiSuccess
              }, 
              {
                title: "gameHistory request successfull",
                date: new Date(),
                code: tempObj.code, 
                mobile: tempObj.number,
                others: {
                  resStatus: res.status,
                  resReason: reason
                } 
              }
            );
        console.log(">>>>> Game History API SUCCESS >>>>>", res);
        setLive(res.live);
        res.live.length === 0 ? setShow(true) : setShow(false);
        res.image ? setImage(res.image) : setImage(defaultImage);

        showLoader(false);
        }else {
          const reason = res.reason ? res.reason : "null";
        logEvent(
              {
                screen: screen.gameHistory_p,
                event: events.apiFailure
              }, 
              {
                title: "gameHistory request failed",
                date: new Date(),
                code: tempObj.code, 
                mobile: tempObj.number,
                others: {
                  resStatus: res.status,
                  resReason: reason
                } 
              }
            );
        }
        
      })
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        logEvent(
              {
                screen: screen.gameHistory_p,
                event: events.apiFailure
              }, 
              {
                title: "gameHistory request failed",
                date: new Date(),
                code: tempObj.code, 
                mobile: tempObj.number,
                others: {
                  err: errObj
                } 
              }
            );
        console.log(">>>>> Game History API ERROR :: ", err);
        showLoader(false);
        setApiFailed(true);
      });
      let guiDataEvent = {}
      guiDataEvent['page'] = 'game_history';
      guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <React.Fragment>
      {loader && <Loader />}
      {type === "ALL" && show && (
        <div className="w-screen flex flex-col items-center justify-center pt-64">
          <h1 className="text-white font-bold">
            {text.line1[lang]}
          </h1>
          <h1 className="text-white font-bold">
          {text.line2[lang]}
          </h1>
        </div>
      )}
      {!show && (
        <div
          className={`flex flex-col justify-between h-full p-2 bg-primary ${loaderClass}`}
        >
          <StatsHeader text={text} lang={lang}/>
          {/* {loader && <Loader />} */}
          <div>
            {live &&
              live.map(function (item, i) {
                return (
                  <StatsItem data={item} image={image} key={i} index={i} text={text} lang={lang}/>
                );
              })}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default LeaderBoardStats;
