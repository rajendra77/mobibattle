import React from "react";
import Text from "./Text";

function StatsHeader({text, lang}) {
  return (
    <div className="w-full flex justify-between py-2">
      <div className="flex justify-between w-full">
        <div className="flex justify-center w-10">
        <Text
          tag={"h6"}
          scale={true}
          styles="text-white"
          text={"S.No."}
          fontweight="bold"
          alignment="center"
          textTransform="uppercase"
        />
        </div>
        <div className="w-24 2xs:w-36 xs:w-36 sm:w-36 justify-center">
        <Text
          tag={"h6"}
          scale={true}
          styles="text-white"
          text={text.gameName[lang]}
          fontweight="bold"
          alignment="center"
          textTransform="uppercase"
        />
        </div>
        <div className="w-24 2xs:w-14 xs:w-14 sm:w-14 3xs:pl-2">
          <Text
          tag={"h6"}
          scale={true}
          styles="text-white"
          text={text.status[lang]}
          fontweight="bold"
          alignment="center"
          textTransform="uppercase"
        />
      </div>

      <div className="w-12 3xs:pr-2 pl-1">
      <Text
        tag={"h6"}
        scale={true}
        styles="text-white"
        text={text.score[lang]}
        fontweight="bold"
        alignment="center"
        textTransform="uppercase"
      />
      </div>
      <div className="w-20">
      <Text
        tag={"h6"}
        scale={true}
        styles="text-white"
        text={text.date[lang]}
        fontweight="bold"
        alignment="center"
        textTransform="uppercase"
      />
      </div>
      </div>
    </div>
  );
}
export default StatsHeader;
