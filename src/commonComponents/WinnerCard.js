import React from "react";
import PropTypes from "prop-types";
import Image from "./Image";
import Text from "./Text";

function WinnerCard({ data }) {
  const { title, subtitle, date, img } = data;

  return (
    <div className="pt-2">
      <div className=" h-full">
        <div className="flex flex-col items-center text-center">
          <Image url={img} styles="h-24 w-24 rounded-lg" />
          <Text tag="span" text={title} styles="pt-1 font-bold text-white" />
          <Text
            tag="h6"
            text={subtitle}
            styles="font-bold text-orange text-2xl"
          />
          <Text tag="span" text={date} styles="text-lightPurple" />
        </div>
      </div>
    </div>
  );
}

WinnerCard.propTypes = {
  data: PropTypes.object,
};

export default WinnerCard;
