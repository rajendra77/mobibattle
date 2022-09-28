import React from "react";
import PropTypes from "prop-types";
import Image from "./Image";
import Text from "./Text";


function PrizePoolItem(props) {
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  return (
    <div className="flex justify-between items-center py-4 border-b-2 border-prizeListBorder">
      <Text
        tag="h6"
        text={props.prizeDistributionMethod==="RANK" ? props.rank + 1 : props.text.perKill[props.lang]}
        textColor="text-white"
        styles="font-medium pl-1"
      />
      <div className="flex justify-center items-center">
        <Image url={coinIcon} styles="w-4 h-4 mx-1" />
        <Text tag="h6" text={props.prize} textColor="text-white" styles="font-medium pr-1"/>
      </div>
    </div>
  );
}


PrizePoolItem.propTypes = {
  prize: PropTypes.number,
  rank: PropTypes.number,
  prizeList: PropTypes.bool,
  prizeDistributionMethod : PropTypes.string
};

export default PrizePoolItem;
