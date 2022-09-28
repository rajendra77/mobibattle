import React from "react";
import Image from "./Image";
import Text from "./Text";
import { useHistory } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { SendGuiDataEvents } from "../commonScript";

const TournamentHomeCard = ({
  image,
  won,
  tournamentSummaryId,
  tournamentName,
  background,
  noOfDaysShown,
  text,
  lang,
}) => {
  const history = useHistory();
  const coinIcon = require("../assets/mtncongo/battle_arena_won_coins_icon.png").default;
  const prizeIcon = require("../assets/tImages/prize_icon.svg").default;
  const gameImg = require("../assets/placeholder_bg2.png").default;
  const tempObj = reactLocalStorage.getObject("tempObj");

  const handleViewMatches = () => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'homepage';
    guiDataEvent['event'] = 'tour_click';
    guiDataEvent['tour_name'] = tournamentName;
    SendGuiDataEvents(guiDataEvent);

    logEvent(
      {
        screen: screen.home_p,
        event: events.viewMatches,
      },
      {
        title: "View Matches Button Clicked",
        date: new Date(),
        code: tempObj.code,
        mobile: tempObj.number,
        others: {
          tournamentName: tournamentName,
          tournamentId: tournamentSummaryId,
        },
      }
    );
      reactLocalStorage.set("tournamentName", tournamentName);
      reactLocalStorage.set("tournamentSummaryId", tournamentSummaryId);
      reactLocalStorage.set("noOfDaysShown", noOfDaysShown);
      history.push("/tournaments");
  };

  return (
    <div className="px-2 py-2 1xs:py-2 2xs:py-2 mb-40 xs:mb-40 2xs:mb-36 3xs:mb-36 sm:mb-32">
      <div className={`relative`}>
        <Image
          url={image ? image : gameImg}
          styles="h-full w-full object-contain rounded-t-xl"
          objectCover={false}
          objectContain={false}
          handleClick={handleViewMatches}
        />

        <div className=" w-full absolute top-40 2xs:top-32 3xs:top-32 rounded-2xl ">
          <div
            className={`relative mx-2 px-3 pb-2 pt-8 flex flex-col justify-center items-center ${background} rounded-xl pt-1`}
          >
            <Image url={prizeIcon} styles="h-12 w-12 mr-1 absolute -top-6" />
            <div className="w-full flex justify-center items-center ">
              <Image
                url={coinIcon}
                styles="h-8 w-8 mr-1"
              />
              <Text
                tag={"h3"}
                scale={true}
                text={won}
                styles="text-white font-black"
              />
              <Text
                tag={"lable"}
                scale={true}
                text={text.wonThisWeek[lang]}
                styles="text-white font-bold text-xs pt-2 pl-1 1xs:text-2xs 2xs:text-2xs"
              />
            </div>

            <div
              className="w-full py-2 mx-6 mb-1 rounded-xl bg-tBlue mt-5"
              onClick={handleViewMatches}
            >
              <Text
                tag="h4"
                text={text.viewMatches[lang]}
                textTransform="uppercase"
                styles=" text-white font-extrabold text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentHomeCard;
