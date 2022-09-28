import React from "react";
import PropTypes from "prop-types";
import Image from "./Image";
import Text from "./Text";


function StatsItem(props) {
  console.log("------props----->", props);
  const date = new Date(props.data.date);
  const year = date.getFullYear();
  let month = date.getMonth()+1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return (
   
        <div className="flex justify-between items-center bg-historybg w-full py-2 mb-2 border-2 border-historyborder rounded-lg ">
      {/* <div className="w-8 mr-1"></div> */}
      <div className="w-10 flex justify-center">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={props.index + 1}
          fontweight="normal"
          alignment="center"
        />
      </div>
      <div className="w-28 2xs:w-36 xs:w-36 sm:w-36 flex justify-center items-center">
        <Image url={props.data.gameImage} styles="w-10 2xs:w-11 xs:w-11 sm:w-11 h-10 2xs:h-11 xs:h-11 sm:h-11 rounded" />
        <Image url={props.image} styles="w-8 2xs:w-10 xs:w-10 sm:w-10 h-8 2xs:h-10 xs:h-10 sm:h-10 rounded-full  border-2 border-statsuserBorder transform translate-x-2" />
        <Image url={props.data.opponentImage} styles="w-8 2xs:w-10 xs:w-10 sm:w-10 h-8 2xs:h-10 xs:h-10 sm:h-10 rounded-full border-2 border-statsuserBorder " />
      </div>

      <div className="w-14 flex justify-center">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={props.data.winner === 0 ? props.text.loss[props.lang] : props.data.winner === 1 ? props.text.win[props.lang] : props.text.draw[props.lang]}
          fontweight="normal"
          alignment="center"
        />
      </div>

      <div className="w-12 flex justify-center">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={props.data.score}
          fontweight="normal"
          alignment="center"
        />
      </div>
      <div className="w-20 flex justify-center">
        <Text
          tag={"h5"}
          scale={true}
          styles="text-white"
          text={dt+'/' + month + '/'+year.toString().substring(2)}
          fontweight="normal"
          alignment="center"
        />
      </div>
    </div>
  );
}

StatsItem.propTypes = {
  data: PropTypes.object,
  props: PropTypes.object,
  key: PropTypes.number,
  image: PropTypes.string,
  index: PropTypes.number
};

export default StatsItem;
