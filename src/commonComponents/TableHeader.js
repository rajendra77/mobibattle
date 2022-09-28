import React from "react";
import Text from "../commonComponents/Text";

function TableHeader({text, lang}) {
  return (
    <div className="w-full flex justify-between py-2">
      <div className="flex w-full">
        <div className="w-1/7">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={text.rank[lang]}
          fontweight="bold"
          alignment="center"
          textTransform="uppercase"
        />
        </div>
        <div className="w-3/5">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={text.playerName[lang]}
          fontweight="bold"
          alignment="center"
          textTransform="uppercase"
        />
        </div>
        <div className="w-1/4">
          <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={text.scoreText[lang]}
          fontweight="bold"
          alignment="center"
          textTransform="uppercase"
        />
      </div>

      <div className="w-1/6">
      <Text
        tag={"h5"}
        scale={true}
        styles="text-white"
        text={text.prizes[lang]}
        fontweight="bold"
        alignment="center"
        textTransform="uppercase"
      />
      </div>
      </div>
    </div>
  );
}
export default TableHeader;
