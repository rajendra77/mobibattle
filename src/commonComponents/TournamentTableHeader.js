import React from "react";
import Text from "../commonComponents/Text";

function TournamentTableHeader() {
  return (
    <div className="w-full flex px-2 py-3 bg-gradient-to-t from-leaderBoardDark to-leaderBoardLight">
      <div className="flex justify-between w-full">
        <div className="w-1/12">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={"Pos."}
          fontweight="bold"
          alignment="center"
        />
        </div>
        <div className="w-2/5">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={"Player Name"}
          fontweight="bold"
          alignment="center"
        />
        </div>
        <div className="w-1/12">
          <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={"Kills"}
          fontweight="bold"
          alignment="center"
        />
      </div>

      <div className="w-1/5">
      <Text
        tag={"h5"}
        scale={true}
        styles="text-white"
        text={"Winning"}
        fontweight="bold"
        alignment="center"
      />
      </div>
      </div>
    </div>
  );
}
export default TournamentTableHeader;
