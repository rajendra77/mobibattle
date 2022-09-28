import React from "react";
import PropTypes from "prop-types";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";

function ScoreCard({
  name,
  image,
  score,
  setBanner = false,
  banner = "",
  scoreText,
}) {
  return (
    <div className="w-24 flex flex-col justify-start items-center relative">
      {setBanner && banner && (
        <Image
          url={banner}
          styles="absolute transform -translate-y-4 z-10 w-full"
        />
      )}
      <Image
        styles={"rounded-full h-24 w-24 border-2 border-lightPurple"}
        url={image}
      />
      <div className="bg-score-purple w-28 text-center px-2 my-2 rounded-3xl">
        <Text
          tag="span"
          scale={true}
          text={name}
          fontweight="normal"
          textColor={"text-white"}
          textTransform={"capitalize"}
        />
      </div>
      <Text
        tag="span"
        scale={true}
        text={`${scoreText} - ${score ? score : 0}`}
        fontweight="bold"
        textColor={"text-white"}
        textTransform={"uppercase"}
      />
    </div>
  );
}

ScoreCard.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setBanner: PropTypes.bool,
  banner: PropTypes.string,
  scoreText: PropTypes.string,
};

export default ScoreCard;
