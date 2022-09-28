import React, { useState, useEffect, useContext } from "react";
import Tab from "../subComponents/Tab";
import tabsData from "../Database/LeaderBoardTabs";
import TableItem from "../commonComponents/TableItem";
import data from "../Database/FinalTableData";
import TableHeader from "../commonComponents/TableHeader";
import TableFooter from "../commonComponents/TableFooter";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import useLeaderboard from "../network/useLeaderboard";
import User2 from "../assets/svg-icons/user2.svg";
import { useHistory } from "react-router-dom";
import ApiNotFound from "./ApiNotFound";
import { reactLocalStorage } from "reactjs-localstorage";
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import {LeaderboardResultText as text} from '../Database/Text'
import { Context } from "../context/Context";

function LeaderBoardFinalDesign() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loader, showLoader] = useState(true);
  const [footer, setFooter] = useState("");
  const [apiFailed, setApiFailed] = useState(false);
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const tempObj = reactLocalStorage.getObject("tempObj");

  let finalLeaderBoardData = [];
  const { getLeaderboard } = useLeaderboard();
  console.log("-----leaderBoardData------>", leaderBoardData);
  const history = useHistory();

  useEffect(() => {
    return () => {
      if (history.action === "POP") {
        console.log("history pop fired leaderboard");
        history.push("/home");
      }
    };
  }, []);

  useEffect(() => {
    setLang(getLanguage());
    setActiveTab("Daily");
  }, []);

  useEffect(() => {
    setTabs(tabsData);
  }, []);

  useEffect(() => {
    getLeaderboard()
      .then(
        (res) => {
          if (res.status.toUpperCase() === "SUCCESS") {
            const reason = res.reason ? res.reason : "null";
          logEvent(
              {
                screen: screen.leaderBoard_p,
                event: events.apiSuccess
              }, 
              {
                title: "leaderboard request successfull",
                date: new Date(),
                code: tempObj.code, 
                mobile: tempObj.number,
                others: {
                  resStatus: res.status,
                  resReason: reason
                } 
              }
            );

          console.log("----res---->", res);
          setFooter(res.footer);
          setLeaderBoardData(res.leaderboard);
          setTimeout(function () {
            showLoader(false);
          }, 1000);
          }else {
            const reason = res.reason ? res.reason : "null";
            logEvent(
              {
                screen: screen.leaderBoard_p,
                event: events.apiFailure
              }, 
              
              {
                title: "leaderboard request failed",
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
          
        },
        (err) => {
          console.log("Promise rejected...", err);
          setApiFailed(true);
          logEvent(
              {
                screen: screen.leaderBoard_p,
                event: events.apiFailure
              }, 
              
              {
                title: "leaderboard request failed",
                date: new Date(),
                code: tempObj.code, 
                mobile: tempObj.number,
                others: {
                  err: err
                } 
              }
            );
        }
      )
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        console.log("----err---->", err);
        logEvent(
              {
                screen: screen.leaderBoard_p,
                event: events.apiFailure
              }, 
              
              {
                title: "leaderboard request failed",
                date: new Date(),
                code: tempObj.code, 
                mobile: tempObj.number,
                others: {
                  err: errObj
                } 
              }
            )
        showLoader(false);
        setApiFailed(true);
      });
  }, []);
  if (apiFailed) {
    return <ApiNotFound />;
  }
  for (let i = 0; i < leaderBoardData.length; i++) {
    if (leaderBoardData[i].user && leaderBoardData[i].user.length === 0) {
      leaderBoardData[i].user = User2;
    }
    let obj = {
      ...leaderBoardData[i],
      ...data[i],
    };
    console.log("----obj---->", obj);
    finalLeaderBoardData.push(obj);
  }
  console.log(finalLeaderBoardData);

  function changeTab(tab) {
    setActiveTab(tab);
  }

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <React.Fragment>
      <div className="mt-16">
        <Tab data={tabs} activeTab={activeTab} changeTab={changeTab} lang={lang}/>
        <div className="flex flex-col justify-between h-full bg-primary">
          <div className="p-2">
            <TableHeader text={text.resultTable} lang={lang}/>
            {loader && <Loader />}
            <div className={loaderClass}>
              {finalLeaderBoardData.map(function (item, i) {
                return <TableItem data={item} key={i} />;
              })}
            </div>
          </div>
          {footer && <TableFooter data={footer} />}
        </div>
      </div>
    </React.Fragment>
  );
}

export default LeaderBoardFinalDesign;
