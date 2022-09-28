import React from "react";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import Button from "../commonComponents/Button";
import PropTypes from "prop-types";
import _ from "lodash";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { MomoResultText as text } from "../Database/Text";

function MomoGameResult({
  title,
  subtitle,
  isEndGame,
  resultData,
  handleClick,
  subtitle2,
  lang,
}) {
  const coin_icon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const home_icon_white = require("../assets/svg-icons/home-white.svg").default;
  return (
    <>
      <div className="my-4 h-40 text-center w-full flex flex-col items-center justify-center bg-stars bg-no-repeat bg-center">
        <Text
          tag="div"
          scale={true}
          styles="text-neonGreen text-green-500 text-4xl py-2"
          text={title}
          fontweight="bold"
          textColor={"text-neonGreen"}
        />
        <Text
          tag="h3"
          scale={true}
          fontweight="bold"
          text={subtitle}
          textColor={"text-white"}
        />
        <Text
          tag="h3"
          scale={true}
          fontweight="bold"
          text={subtitle2 ? subtitle2 : ""}
          textColor={"text-white"}
        />
      </div>
      {isEndGame == true &&
        _.has(resultData, "myRank") &&
        resultData.myRank.rank !== 2 && (
          <div className="flex flex-col items-center bg-button-purple text-center px-4 py-2 mb-2 rounded-xl border border-orange m-auto">
            <Text
              tag="h5"
              scale={true}
              text={
                resultData.myRank.rank === 1
                  ? text.winnerGets[lang]
                  : text.bothGet[lang]
              }
              fontweight="bold"
              textColor={"text-orange"}
              textTransform=""
              styles="pr-1"
            />
            <div className="flex items-center">
              <Image url={coin_icon} styles="h-6 w-6 mr-1" />
              <Text
                tag="h2"
                scale={true}
                text={_.has(resultData, "prize") && resultData.prize}
                fontweight="bold"
                textColor={"text-white"}
                styles="pr-1"
              />
            </div>
          </div>
        )}

      <div className="w-full px-1 py-2">
        <Button
          type="button"
          faIcon={faPlay}
          label={text.playAgain[lang]}
          iconClass="text-sm mr-2"
          action={"playAgain"}
          eventHandler={handleClick}
          size={"medium"}
          styles={"font-bold text-lg text-white bg-button-green"}
        />
        <Button
          type="button"
          label={text.home[lang]}
          action={"home"}
          eventHandler={handleClick}
          size={"medium"}
          textStyles="ml-2"
          styles={
            "font-bold text-md uppercase border-2 border-border-orange my-2 text-white bg-button-purple"
          }
        />
      </div>
    </>
  );
}

MomoGameResult.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  subtitle2: PropTypes.string,
  handleClick: PropTypes.func,
  resultData: PropTypes.object,
  isEndGame: PropTypes.bool,
  lang: PropTypes.string,
};

export default MomoGameResult;
