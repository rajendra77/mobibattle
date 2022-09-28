import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import UserProfileData from "../Database/UserProfileData";
import PropTypes from "prop-types";
import "./UserScore.scss";

function UserScore({
  category,
  aScore,
  bScore,
  aName,
  bName,
  aImage,
  bImage,
  oppGameEnd,
}) {
  console.log("-----category-----", category, aScore, bScore, aName, bName);
  return (
    <div className="">
      {category === "battle" ? (
        <div className="max-w-500px absolute flex justify-around w-full py-2">
          <div>
            <Image
              styles={"rounded-full border-2 border-white h-8 w-8 m-auto"}
              url={aImage ? aImage : UserProfileData.img}
            />
            <div className="bg-score-purple text-center px-4 mt-1 rounded-3xl">
              <Text
                tag="h6"
                scale={true}
                text={aName}
                textColor={"text-white font-bold"}
              />
            </div>

            <Text
              tag="h4"
              scale={true}
              text={`${aScore}`}
              fontweight="bold"
              textColor={"text-white"}
              textTransform={"uppercase"}
              alignment="center"
            />
          </div>
          <div className="ml-16">
            <Image
              styles={
                oppGameEnd
                  ? "rounded-full w-8 h-8 m-auto blink-border"
                  : "rounded-full border-2 border-white w-8 h-8 m-auto"
              }
              url={bImage ? bImage : UserProfileData.img}
            />
            <div
              className={
                oppGameEnd
                  ? "blink text-center px-4 mt-1 rounded-3xl"
                  : "bg-score-purple text-center px-4 mt-1 rounded-3xl"
              }
            >
              <Text
                tag="h6"
                scale={true}
                text={bName}
                styles={
                  oppGameEnd ? "blink-text font-bold" : "text-white font-bold"
                }
              />
            </div>
            <Text
              tag="h4"
              scale={true}
              text={`${bScore}`}
              fontweight="bold"
              textColor={"text-white"}
              textTransform={"uppercase"}
              alignment="center"
            />
          </div>
        </div>
      ) : (
        <div className="max-w-500px flex justify-center h-22 w-full absolute">
          <div>
            <Image
              parentFullSize
              fullHeight
              fullWidth
              styles={"rounded-full border-2 border-green-400 w-8 m-auto"}
              url={UserProfileData.img}
            />
            <Text
              tag="h4"
              scale={true}
              text={`${aScore}`}
              fontweight="bold"
              textColor={"text-white"}
              textTransform={"uppercase"}
              alignment="center"
            />
          </div>
        </div>
      )}
    </div>
  );
}

UserScore.propTypes = {
  category: PropTypes.string,
  aScore: PropTypes.number,
  bScore: PropTypes.number,
  aName: PropTypes.string,
  bName: PropTypes.string,
  aImage: PropTypes.string,
  bImage: PropTypes.string,
  oppGameEnd: PropTypes.bool,
};

export default UserScore;
