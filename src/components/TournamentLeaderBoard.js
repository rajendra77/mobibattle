import React, { useState, useEffect} from "react";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import coin from "../assets/svg-icons/mbc_coin_icon.svg";
import Table from "../commonComponents/TournamentTable";
// import data from "../Database/TournamentLeaderBoardData";
import { reactLocalStorage } from "reactjs-localstorage";
import useTournament from "../network/useTournament";
import PropTypes from "prop-types";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import {SendGuiDataEvents} from '../commonScript';


function TournamentLeaderBoard() {
  const { getLeaderboard } = useTournament();
  const number = reactLocalStorage.getObject("userProfile").number;
  const resultData = reactLocalStorage.getObject("tournamentResData");
  const [winners, setWinners] = useState([]);
  const [runnerUps, setRunnerUps] = useState([]);
  const [fullResult, setFullResult] = useState([]);
  const [loader, showLoader] = useState(true);
  let { search } = useLocation();
  const { gId, tId } = queryString.parse(search);
   
  useEffect(() => {
     window.scrollTo(0, 0);
    getLeaderboard(number, gId, tId).then(
      (res) => {
        console.log("------gId------>", gId);
        console.log("------res------>", res);
        setWinners(res.details.result.winners);
        setRunnerUps(res.details.result.runnerUps);
        setFullResult(res.details.result.fullResult);
        setTimeout(function() {
          showLoader(false);
        }, 1000);
      },
      (err) => {
        console.log("Promise rejected...", err);
      }
    );
            let guiDataEvent = {}
            guiDataEvent['page'] = 'tournament_result';
            guiDataEvent['event'] = 'open';
            SendGuiDataEvents(guiDataEvent);
  }, []);
  // const header = resultData;
  // const stats = data.stats;

  let loaderClass = cx({
    'visible': loader === false,
    'invisible': loader === true,
  });

  return (
    <>
    {loader && <Loader />}
      <div className={`${loaderClass} flex flex-col items-center bg-primary min-w-screen min-h-screen`}>
      <div className="flex flex-col items-center justify-center bg-shinyPurple w-11/12 border-2 border-borderColor py-2 rounded-lg">
        <Text
          tag={"h4"}
          scale={true}
          styles="text-white"
          text={resultData.title}
          fontweight="bold"
          alignment="center"
        />
        <Text
          tag={"h6"}
          scale={true}
          styles="text-lightgray"
          text={`Organised on ${resultData.date} at ${resultData.time}`}
          fontweight="normal"
          alignment="center"
        />
      </div>
      <div className="flex w-11/12 mt-5 bg-dullPurple border border-lightPurple rounded-lg justify-between px-4 py-3">
        <div className="flex flex-col">
          <Text
            tag={"h6"}
            scale={true}
            styles="text-lightPurple"
            text={"PRIZE POOL"}
            fontweight="normal"
            alignment="center"
          />
          <div className="flex items-center justify-center pt-1">
            <Image url={coin} styles="w-4 mr-1" />
            <Text
              tag={"h6"}
              scale={true}
              styles="text-white"
              text={resultData.info[0].value}
              fontweight="bold"
              alignment="center"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <Text
            tag={"h6"}
            scale={true}
            styles="text-lightPurple"
            text={"PER KILL"}
            fontweight="normal"
            alignment="center"
          />
          <div className="flex items-center justify-center pt-1">
            <Image url={coin} styles="w-4 mr-1" />
            <Text
              tag={"h6"}
              scale={true}
              styles="text-white"
              text={resultData.info[1].value}
              fontweight="bold"
              alignment="center"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <Text
            tag={"h6"}
            scale={true}
            styles="text-lightPurple"
            text={"ENTRY FEE"}
            fontweight="normal"
            alignment="center"
          />
          <div className="flex items-center justify-center pt-1">
            <Image url={coin} styles="w-4 mr-1" />
            <Text
              tag={"h6"}
              scale={true}
              styles="text-white"
              text={resultData.info[2].value}
              fontweight="bold"
              alignment="center"
            />
          </div>
        </div>
      </div>
      
      {winners && (
        <div className="flex flex-col w-11/12">
          <Text
            tag={"h3"}
            scale={true}
            styles="text-white border rounded-t-lg py-2 mt-3 bg-dullPurple border-dullPurple"
            text={"WINNER CHICKEN DINNER"}
            fontweight="bold"
            alignment="center"
          />
          <Table data={winners} />
        </div>
      )}
      {runnerUps && (
        <div className="flex flex-col w-11/12">
          <Text
            tag={"h3"}
            scale={true}
            styles="text-white border rounded-t-lg py-2 mt-3 bg-dullPurple border-dullPurple"
            text={"RUNNER UPS"}
            fontweight="bold"
            alignment="center"
          />
          <Table data={runnerUps} />
        </div>
      )}
      {fullResult && (
        <div className="flex flex-col w-11/12">
          <Text
            tag={"h3"}
            scale={true}
            styles="text-white border rounded-t-lg py-2 mt-3 bg-dullPurple border-dullPurple"
            text={"FULL RESULT"}
            fontweight="bold"
            alignment="center"
          />
          <Table data={fullResult} />
        </div>
      )}
    </div>
    </>
    
  );
}

TournamentLeaderBoard.propTypes = {
  gameId: PropTypes.string,
};

export default TournamentLeaderBoard;
