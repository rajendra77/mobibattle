import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import useWindowDimensions from "../commonComponents/useWindowDimensions";
import liveUsers from "../assets/svg-icons/user_live_icon.svg";
import "./GameCard.scss";
import { reactLocalStorage } from "reactjs-localstorage";
import {screen, events} from '../Analytics/EventName';
import {logEvent} from '../Analytics/AnalyticsEvent';
import { Base64 } from "js-base64";

function GameCard(props) {
  let { data } = props;
  const coin_icon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const history = useHistory();
  const tempObj = reactLocalStorage.getObject("tempObj");

  /**
   * Set height of the game cards dynamically with varying screen width.
   */
  const dimensions = useWindowDimensions();
  if (dimensions.width <= 500) {
    document.documentElement.style.setProperty("--vw", `${dimensions.width}px`);
  } else {
    document.documentElement.style.setProperty("--vw", "500px");
  }

  return (
    <div className="w-1/2 p-2 mb-1">
      <div
        className="w-full relative"
        onClick={() => {
          logEvent(
            {
              screen: screen.home_p,
              event: events.bannerClick
            }, 
            {
              title: "Game Card Clicked",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                gameId: data.gameId,
                gameName : data.name,
              }
            });

          history.push(`/battleinfo?id=${Base64.encode(data.gameId)}`);
        }}
      >
        {data && (
          <Image
            styles={"aspect-w-1 aspect-h-1 rounded-2xl"}
            url={data.gameImage}
          />
        )}
        <div
          className="p-2 3xs:p-1 w-full flex justify-between rounded-b-2xl absolute z-10 bottom-0"
          style={{ backgroundColor: data.colorCode, opacity: "80%" }}
        >
          <div className="flex items-center">
            <Image
              url={coin_icon}
              styles={"3xs:w-4 3xs:h-4 2xs:w-5 2xs:h-5 w-6 h-6 rounded-full"}
            />
            <div className="pl-1 flex items-center justify-between 2xs:flex-col">
              <Text
                tag="h5"
                scale={true}
                text={"50,000"}
                fontweight="bold"
                textColor={"text-white"}
              />
              {/* <span className="text-2xs pl-1 2xs:pl-0 text-white font-bold">
                {text.won[lang]}
              </span> */}
            </div>
          </div>
          <div className="flex items-center bg-black-50 p-1 rounded-full">
            <Image
              url={liveUsers}
              styles={"3xs:w-3 3xs:h-3 2xs:w-4 2xs:h-4 w-5 h-5"}
            />
            <Text
              tag="h6"
              scale={true}
              text={data.playedCount}
              textColor={"text-white"}
              styles="px-1 2xs:pl-0 font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

GameCard.propTypes = {
  data: PropTypes.shape({
    gameId: PropTypes.any,
    name: PropTypes.string,
    x512x512: PropTypes.string,
    colorCode: PropTypes.string,
    playedCount: PropTypes.number,
  }),
};

export default GameCard;
