import React from "react";
import PropTypes from "prop-types";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";

function Notification({ name, image, date, time, days }) {
  return (
    <div className="w-full flex flex-col mx-4 pr-4">
      <div className="flex justify-end py-1 px-4">
        <Text
          tag="span"
          scale={true}
          text={`${days} days left !`}
          styles="text-white"
        />
        {/* <p>{days} days left !</p> */}
      </div>
      <div className="flex pr-4 text-sm">
        <Image url={image} styles="w-10 h-10 rounded-full" />
        <div className="flex flex-col justify-center items-start ml-4">
          <p className="font-bold text-white">{name}</p>
          <div className="flex text-white">
            <Text
              tag="span"
              scale={true}
              text={`${date},`}
              styles="text-white"
            />
            <Text
              tag="span"
              scale={true}
              text={time}
              styles="text-white ml-1"
            />
            {/* <p>{date}, </p>
                    <p className="ml-1">{time}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

Notification.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  days: PropTypes.number,
};

export default Notification;
