import React, { useEffect, useState, useContext } from "react";
import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import PropTypes from "prop-types";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../context/Context";
import ResultTable from "../components/ResultTable";
import _ from "lodash";
import { LeaderboardResultText as text } from "../Database/Text";


function LeaderboardGameResult({
  resultData,
  title,
  handleClick,
  factor,
  lang,
  isEndGame,
}) {
  const home_icon_white = require("../assets/svg-icons/home-white.svg").default;
  const [showResultData, setShowResultData] = useState(false);
  const [resultTableData, setResultTableData] = useState([]);
  const defaultAvatar =
    require("../assets/svg-icons/animal-avatar4.png").default;
  const { battleData } = useContext(Context);

  useEffect(() => {
    if (
      resultdata.status.toUpperCase() === "SUCCESS" &&
      _.has(resultData, "isEnd") &&
      _.has(resultData, "myRank") &&
      _.has(resultData, "opRank")
    ) {
      if (resultData.isEnd === 1 && resultData.myRank.rank !== -1) {
        setShowResultData(true);
        const aParty = resultData.myRank;
        const bParty = resultData.opRank;
        const aPartyData = {
          rank: aParty.rank,
          userIcon: aParty.user ? aParty.user : defaultAvatar,
          name: aParty.displayName,
          gameLeft: 10 - resultData.play,
          score: Math.round(aParty.score * factor),
          // score: Math.round(aParty.points),
        };
        const bPartyData = {
          rank: bParty.rank,
          userIcon: bParty.user
            ? bParty.user
            : battleData.img
            ? battleData.img
            : defaultAvatar,
          name: bParty.displayName ? bParty.displayName : battleData.name,
          gameLeft: Math.floor(Math.random() * 10),
          score: Math.round(bParty.score * factor),
          // score: Math.round(bParty.points),
        };
        setResultTableData([aPartyData, bPartyData]);
      }
    }
  }, [resultData]);

  return (
    <>
      {!showResultData && (
        <div className="my-8 w-full flex flex-col items-center justify-center">
          <Text
            tag="h1"
            scale={true}
            styles="text-neonGreen text-green-500"
            text={title}
            fontweight="bold"
            textColor={"text-neonGreen"}
          />
        </div>
      )}
      {showResultData && (
        <div className="w-full">
          <div className="my-8 w-full flex flex-col items-center justify-center">
            <Text
              tag="h1"
              scale={true}
              styles="text-neonGreen text-green-500"
              text={title}
              fontweight="bold"
              textColor={"text-neonGreen"}
            />
          </div>
          <ResultTable
            data={resultTableData}
            text={text.resultTable}
            lang={lang}
          />
          <Text
            tag="h6"
            scale={true}
            text={`${10 - resultData.play}/10 ${text.gamesLeft[lang]}`}
            fontweight="normal"
            textColor="text-lightPurple"
            styles="m-auto mt-2 mb-1 text-center"
          />
        </div>
      )}
      <div className="w-full px-1">
        <Button
          type="button"
          faIcon={faPlay}
          label={text.playAgain[lang]}
          iconClass="text-sm mr-2"
          action="playAgain"
          eventHandler={handleClick}
          size="medium"
          styles="font-bold text-lg uppercase my-2 bg-button-green text-white"
        />
        <Button
          type="button"
          label={text.leaderboard[lang]}
          action="leaderboard"
          eventHandler={handleClick}
          size="medium"
          textStyles="ml-2"
          styles="font-bold text-md uppercase border-2 border-border-orange text-white bg-button-purple"
        />
        <Button
          type="button"
          icon={home_icon_white}
          label={text.home[lang]}
          action={"home"}
          eventHandler={handleClick}
          size={"medium"}
          textStyles="ml-2"
          styles={
            "font-bold text-md uppercase border-2 border-border-orange my-2 bg-button-purple text-white"
          }
        />
      </div>
    </>
  );
}

LeaderboardGameResult.propTypes = {
  resultData: PropTypes.object,
  title: PropTypes.string,
  handleClick: PropTypes.func,
  factor: PropTypes.number,
  lang: PropTypes.string,
  isEndGame: PropTypes.bool,
};

export default LeaderboardGameResult;
