import React, { useState, useEffect } from "react";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../commonComponents/Button";
import liveUsers from "../assets/svg-icons/user_live_icon.svg";
//imports from Common components..
import Image from "../commonComponents/Image";
// import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import PropTypes from "prop-types";
//import hooks...
import useWindowDimensions from "../commonComponents/useWindowDimensions";
//import assets and styles...
import "./GameCard.scss";
import {logEvent} from '../Analytics/AnalyticsEvent';
import {screen, events} from '../Analytics/EventName';
import { reactLocalStorage } from "reactjs-localstorage";


function TrendingCard({ data, handleClick, text, lang }) {
  const [onlineUsers, setOnlineUsers] = useState("20");
  const coin_icon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const tempObj = reactLocalStorage.getObject("tempObj");
  /**
   * Set height of the game cards dynamically with varying screen width
   */
  const dimensions = useWindowDimensions();
  if (dimensions.width <= 500) {
    document.documentElement.style.setProperty("--vw", `${dimensions.width}px`);
  } else {
    document.documentElement.style.setProperty("--vw", "500px");
  }

  useEffect(() => {
    const num = Math.floor(Math.random() * 251) + 20;
    setOnlineUsers(num);
  }, []);

  return (
    <div className="p-2 relative" onClick={() => {
        logEvent(
            {
              screen: screen.home_p,
              event: events.trendingClick
            }, 
            {
              title: "Trending Card Clicked",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                gameId: data.gameId,
                gameName : data.name,
              }
            });
        handleClick(data.gameId)
      }}>

      {data && (
        <Image
          styles={"squareImage aspect-w-1 aspect-h-1 rounded-2xl"}
          url={data["trendingImage"]}
        />
      )}
      <div className="flex flex-col w-full absolute bottom-4 right-0 left-0 z-10 px-2">
        <div className="flex items-center mx-2 py-4">
          <Image
            url={coin_icon}
            styles={"rounded-full"}
          />
          <div className="flex items-center">
            <Text
              tag="h2"
              scale={true}
              text={"50,000"}
              fontweight="bold"
              textColor={"text-white font-bold px-1"}
            />
            <Text
              tag="span"
              scale={true}
              text={text.won[lang]}
              textColor={"text-white"}
              styles="font-medium"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-between mb-2 px-2">
          <div className="mr-1 flex items-center px-2 bg-black-50 rounded-full">
            <Image
              url={liveUsers}
              styles={
                "w-8 h-8 2xs:w-7 2xs:h-7 3xs:w-6 3xs:h-6 z-5 overflow-hidden"
              }
            />
            <div className="py-1  mx-1 2xs:py-1 3xs:py-1 flex flex-col">
              <span className="font-bold text-white text-lg 2xs:text-base 3xs:text-base leading-none">
                {onlineUsers}
              </span>
              <Text
                tag="span"
                scale={true}
                text={text.liveUsers[lang]}
                textColor={"text-white"}
              />
            </div>
          </div>
          <div>
            <Button
              faIcon={faPlay}
              iconClass={"text-purple-600 text-lg pl-1"}
              label={text.playNow[lang]}
              shape={"pill"}
              fullWidth={false}
              styles={"py-2 px-2 2xs:px-1 py-1 bg-white text-purple-600"}
              textStyles={"font-bold uppercase ml-2"}
              eventHandler={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
TrendingCard.propTypes = {
  data: PropTypes.object,
  handleClick: PropTypes.func,
  text: PropTypes.object,
  lang: PropTypes.string,
};
export default TrendingCard;
