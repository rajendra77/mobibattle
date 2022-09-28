import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import coin from "../assets/svg-icons/mbc_coin_icon.svg";
import PropTypes from "prop-types";

function TournamentTableItem({ data }) {
 // console.log("------data----->", data);
  return (
    <div className="flex justify-between items-center bg-dullPurple w-full p-2 mb-1 border border-dullPurple">
      {/* <div className="w-8 mr-1"></div> */}
      <div className="w-1/12">
        <Text
          tag={"h4"}
          scale={true}
          styles="truncate text-white"
          text={data.pos}
          fontweight="bold"
          alignment="center"
        />
      </div>
      <div className="w-2/5">
        <Text
          tag={"h4"}
          scale={true}
          styles="truncate text-white"
          text={data.playerName}
          fontweight="bold"
          alignment="center"
        />
      </div>

      <div className="w-1/12">
        <Text
          tag={"h4"}
          scale={true}
          styles="text-white"
          text={data.kills}
          fontweight="bold"
          alignment="center"
        />
      </div>
      <div className="flex justify-center items-center w-1/5">
        <Image url={coin} styles="w-4 mr-1" />
        <Text
            tag={"h6"}
            scale={true}
            styles="text-white"
            text={data.winning}
            fontweight="bold"
            alignment="center"
        />
      </div>
    </div>
  );
}

TournamentTableItem.propTypes = {
  data: PropTypes.object
};

export default TournamentTableItem;
