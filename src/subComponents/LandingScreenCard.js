import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import PropTypes from "prop-types";

function LandingScreenCard({ data }) {
  return (
    <div className="flex flex-col w-full h-full justify-around items-center">
      <Image url={data.image} styles="w-full" />
      <div className="w-full flex justify-center items-center mb-8">
        <Text
          tag="div"
          text={data.title}
          textColor="text-white"
          textTransform="capitalize"
          fontweight="bold"
          styles={`pr-2 text-xl 1xs:text-lg 2xs:text-base 3xs:text-sm`}
        />
        <Text
          tag="div"
          text={data.subtitle}
          textTransform="capitalize"
          fontweight="bold"
          styles={`text-xl 1xs:text-lg 2xs:text-base 3xs:text-sm ${data.color}`}
        />
      </div>
    </div>
  );
}

LandingScreenCard.propTypes = {
  data: PropTypes.object,
};

export default LandingScreenCard;
