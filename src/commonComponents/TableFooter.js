import React from "react";
import PropTypes from "prop-types";
import Badge from "../assets/svg-icons/badge.svg";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";

function TableFooter({ data }) {
  return (
    <div className="max-w-500px w-full flex fixed bottom-0 m-auto justify-around items-center bg-shinyPurple border-4 border-borderColor rounded-t-lg">
      <div className="flex w-4/6 items-center">
        <div className="bg-leaderboardfooterbg w-1/5 border-2 border-leaderboardfooterborder rounded-lg p-2 mx-1">
          <Image url={Badge} styles="" />
        </div>

        <Text
          tag={"h2"}
          scale={true}
          styles="text-white"
          text={"Great Going !"}
          fontweight="bold"
          alignment="center"
        />
      </div>
      <div className="w-1/3 flex flex-col">
        <Text
          tag={"h6"}
          scale={true}
          styles="text-white"
          text={"You are in"}
          fontweight="bold"
          alignment="center"
        />
        <Text
          tag={"h2"}
          scale={true}
          styles="text-resendYellow"
          text={data}
          fontweight="bold"
          alignment="center"
        />
        <Text
          tag={"h6"}
          scale={true}
          styles="text-white"
          text={"of the scorers"}
          fontweight="bold"
          alignment="center"
        />
      </div>
    </div>
  );
}

TableFooter.propTypes = {
  data: PropTypes.string,
};

export default TableFooter;
