import React from "react";
import PropTypes from "prop-types";
import Image from "../commonComponents/Image";

function TournamentCardHeader({ category, data }) {
  let filledWidth = data.filled + "%";
  let unFilledWidth = data.unfilled + "%";
  return (
    <>
      {category === "upcoming" ? (
        <>
          <Image
            url={data["x270x360"]}
            styles="w-full h-40 rounded-t-2xl"
            classImg="rounded-t-2xl"
          />
          <div className="m-4 w-full justify-between">
            <div className="text-lg font-extrabold text-white">
              {data.title}
            </div>
            <div className="flex mt-2 items-start justify-center">
              <div className="flex flex-col w-1/2">
                <div className="flex items-center bg-black-40 rounded-full h-3">
                  <div
                    className="bg-tabsColor rounded-full h-full text-white flex justify-center items-center"
                    style={{ width: filledWidth }}
                  ></div>
                  <div
                    className="flex justify-center items-center"
                    style={{ width: unFilledWidth }}
                  ></div>
                </div>
                <div className="flex items-center w-full justify-between mt-1 px-1">
                  <p className="text-3xs text-white">
                    {data.filled}/100 Filled
                  </p>
                  <p className="text-white text-3xs">{data.unfilled} left</p>
                </div>
              </div>
              <div className="flex w-1/2 2xs:ml-3 ml-6 items-end">
                <img
                  src={require("../assets/svg-icons/pubg-calendar.svg").default}
                />
                <span className="ml-1 text-white 2xs:text-2xs text-xs font-bold">
                  {data.date},
                </span>
                <span className="ml-1 text-white 2xs:text-2xs text-xs font-bold">
                  {data.time}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <hr className="w-11/12 border border-tournamentCardsLight opacity-20" />
          </div>
        </>
      ) : (
        <>
          <div className="flex mb-2 px-4 pt-4 pb-2">
            <div className="mr-4">
              <Image
                url={data["x96x96"]}
                styles={"h-12 w-12 rounded-full"}
                classImg="rounded-full"
              />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">
                {data.title}
              </div>
              <div className="flex mt-1 items-center">
                <img
                  src={require("../assets/svg-icons/pubg-calendar.svg").default}
                />
                <span className="ml-1 text-white font-bold text-xs">
                  {data.date},
                </span>
                <span className="ml-1 text-white font-bold text-xs">
                  {data.time}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <hr className="w-11/12 border border-tournamentCardsLight opacity-20" />
          </div>
        </>
      )}
    </>
  );
}

TournamentCardHeader.propTypes = {
  category: PropTypes.string,
  data: PropTypes.shape({
    filled: PropTypes.string,
    unfilled: PropTypes.string,
    x96x96: PropTypes.string,
    x270x360: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
  }),
};

export default TournamentCardHeader;
