import React from "react";
import Text from "./Text";
import PropTypes from "prop-types";

function ResultTableHeader({ text, lang }) {
  return (
    <div className="w-full flex justify-between py-2">
      <div className="flex w-full items-center justify-between">
        <div className="w-1/12">
          <Text
            tag={"span"}
            scale={true}
            styles="text-white pl-2"
            text={text.rank[lang]}
            fontweight="bold"
            alignment="center"
          />
        </div>
        <div className="flex justify-center items-center w-4/12">
          <Text
            tag={"span"}
            scale={true}
            styles="text-white"
            text={text.playerName[lang]}
            fontweight="bold"
            alignment="center"
          />
        </div>
        <div className="w-3/12 flex items-center justify-center">
          <Text
            tag={"span"}
            scale={true}
            styles="text-white"
            text={text.gameLeft[lang]}
            fontweight="bold"
            alignment="center"
          />
        </div>

        <div className="w-4/12 flex items-center justify-center">
          <Text
            tag={"span"}
            scale={true}
            styles="text-white"
            text={text.score[lang]}
            fontweight="bold"
            alignment="center"
          />
        </div>
      </div>
    </div>
  );
}

ResultTableHeader.propTypes = {
  text: PropTypes.object,
  lang: PropTypes.string,
};

export default ResultTableHeader;
