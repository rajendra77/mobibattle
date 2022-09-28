import React from "react";
import { useHistory } from "react-router-dom";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
//imports from Common components..
import Image from "../commonComponents/Image";
import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import PropTypes from "prop-types";
//imports from Database..
//import hooks...
import useWindowDimensions from "../commonComponents/useWindowDimensions";
//import assets and styles...
import "./GameCard.scss";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import { Base64 } from "js-base64";

function BannerCard({ data, text, lang }) {
  const history = useHistory();
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

  return (
    <div
      className="p-2 w-full flex h-44 relative"
      onClick={() => {
        ReactGA.event({
            category: "home_p",
            action: `Banner Clicked - mobile - ${tempObj.number}, gameId - ${data.game.gameId}, gameName - ${data.game.gameName}, date - ${new Date()}`,
          });
        history.push(`/battleinfo?id=${Base64.encode(data.game.gameId)}`)}
      }
    >
      {data && data.game && (
        <Image
          url={data.game["x270x360"]}
          styles="w-full h-40 rounded-2xl"
          objectCover={false}
        />
      )}
      {data && data.game && (
        <div className="z-10 flex flex-col justify-center items-center w-1/2 rounded-r-3xl py-2 absolute top-5 right-2">
          <Text
            tag="h3"
            scale={true}
            text={data.game.gameName}
            fontweight="bold"
            styles="text-white"
          />
          <div className="flex">
            <Image url={coin_icon} styles={"w-4 h-4 rounded-full"} />
            <div className="pl-1 flex items-center">
              <Text
                tag="h6"
                scale={true}
                text={"50,000"}
                fontweight="bold"
                styles="text-white"
              />
              <Text
                tag="h6"
                scale={true}
                text={text.won[lang]}
                fontweight="bold"
                styles="ml-1 text-white"
              />
            </div>
          </div>
          <br />
          <Button
            faIcon={faPlay}
            iconClass={"text-purple-600 text-lg pl-1"}
            label={text.playNow[lang]}
            shape={"pill"}
            fullWidth={false}
            styles={"px-4 2xs:px-2 py-2 bg-white text-purple-600"}
            textStyles={"font-bold uppercase ml-2"}
            eventHandler={() => {
            }}
          />
        </div>
      )}
    </div>
  );
}

BannerCard.propTypes = {
  data: PropTypes.object,
  text: PropTypes.object,
  lang: PropTypes.string,
};

export default BannerCard;
