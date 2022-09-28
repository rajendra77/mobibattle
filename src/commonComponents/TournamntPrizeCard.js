import React from "react";
import Image from "./Image";
import Text from "./Text";
import PropTypes from "prop-types";

function TournamntPrizeCard({ data }) {
  return (
    <div className="mr-2 h-full bg-gradient-to-t from-dullPurple to-shinyPurple rounded-2xl py-1 border-2 border-borderColor">
      <div className="p-2 h-full flex flex-col items-center justify-end  w-full relative">
        <div className="">
          <Image url={data.img} styles={`${data.imgSize}`} />
        </div>
        <div className="text-center">
          <Text tag="h3" text={data.title} styles="pt-3 font-bold text-white" />
        </div>
      </div>
    </div>
  );
}

TournamntPrizeCard.propTypes = {
  data: PropTypes.object,
};

export default TournamntPrizeCard;
