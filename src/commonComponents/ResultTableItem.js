import React from "react";
import PropTypes from "prop-types";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
// import { Link } from "react-router-dom";

function ResultTableItem({ data }) {
  // console.log("------data----->", data);
  return (
      <div className="flex justify-between items-center bg-gradient-to-t from-leaderBoardDark to-leaderBoardLight w-full py-2 mb-2 border border-leaderBoardBorder rounded-lg ">
        {/* <div className="w-8 mr-1"></div> */}
        <div className="w-1/12">
          <Text
            tag={"p"}
            scale={true}
            styles="truncate text-white"
            text={data.rank}
            fontweight="bold"
            alignment="center"
          />
        </div>
        <div className="w-4/12 flex justify-start items-center pl-1">
          <Image
            url={data.userIcon}
            styles="mr-2 w-8 h-8 rounded-full border-2 border-lightPurple"
          />
          <Text
            tag={"p"}
            scale={true}
            styles="truncate text-white"
            text={data.name}
            fontweight="bold"
            alignment="center"
          />
        </div>

        <div className="w-3/12">
          <Text
            tag={"p"}
            scale={true}
            styles="text-white"
            text={`${data.gameLeft}/10`}
            fontweight="bold"
            alignment="center"
          />
        </div>
        <div className="w-4/12">
          <Text
            tag={"p"}
            scale={true}
            styles="text-white"
            text={data.score}
            fontweight="bold"
            alignment="center"
          />
        </div>
      </div>
  );
}

ResultTableItem.propTypes = {
  data: PropTypes.object,
};

export default ResultTableItem;
