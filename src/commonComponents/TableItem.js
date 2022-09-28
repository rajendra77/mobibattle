import React from "react";
import PropTypes from "prop-types";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import { Link } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';


function TableItem({ data }) {
  // console.log("------data----->", data);
  const tempObj = reactLocalStorage.getObject("tempObj");
  const handleClick = () => {
    console.log('------userId----->', data.userId);
    logEvent(
              {
                screen: screen.leaderBoard_p,
                event: events.click
              },   
              {
                title: `leaderboard list card userId - (${data.userId}) clicked`,
                date: new Date(),
                code: tempObj.code, 
                mobile: tempObj.number,
              }
            );
  };
  const defaultImage =
    require("../assets/svg-icons/animal-avatar4.png").default;
  return (
    <Link to={`/gameHistory?id=${data.userId}`} onClick={handleClick}>
      <div className="flex justify-between items-center bg-gradient-to-t from-leaderBoardDark to-leaderBoardLight w-full p-2 mb-2 border border-leaderBoardBorder rounded-lg ">
        {/* <div className="w-8 mr-1"></div> */}
        <div className="w-1/7">
          <Image url={data.medalIcon} styles="mr-1 " />
        </div>
        <div className="w-3/5 pl-2 flex justify-start items-center">
          <Image
            url={data.user ? data.user : defaultImage}
            styles="ml-2 mr-2 w-10 h-10 rounded-full"
          />
          <Text
            tag={"h4"}
            scale={true}
            styles="truncate text-white"
            text={data.displayName}
            fontweight="bold"
            alignment="center"
          />
        </div>

        <div className="w-1/4">
          <Text
            tag={"h4"}
            scale={true}
            styles="text-white"
            text={data.score}
            fontweight="bold"
            alignment="center"
          />
        </div>
        <div className="w-1/6">
          <Image url={data.prize} styles="mr-2" />
        </div>
      </div>
    </Link>
  );
}

TableItem.propTypes = {
  data: PropTypes.object,
};

export default TableItem;
