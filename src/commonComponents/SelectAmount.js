import React from "react";
import PropTypes from "prop-types";
import Text from "./Text";
import Image from "./Image";

function SelectAmount({ amountData, handleClick, activeId }) {
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  return (
    <div className="flex flex-wrap pt-1">
      {amountData &&
        amountData.map((item, index) => {
          return (
            <div key={index} className={`py-3 px-2 w-1/2`}>
              <div
                className={`py-3 grid grid-cols-2 divide-x divide-lightPurple text-center ${
                  activeId === index ? "bg-wallet" : "bg-buyCoin"
                } rounded-full`}
                onClick={() => handleClick(index, item.amount, item.packId)}
              >
                <div className="flex items-center justify-center">
                  <Text
                    tag="h4"
                    text={`${item.amount} ${"₮"}`}
                    textColor = {activeId === index ? "text-white font-bold" : "text-white text-opacity"}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Image url={coinIcon} styles="h-6 w-6 mr-2" />
                  <Text
                    tag="h4"
                    text={`${item.amount}`}
                    textColor = {activeId === index ? "text-white font-bold" : "text-white text-opacity"}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

SelectAmount.propTypes = {
  amountData: PropTypes.array,
  handleClick: PropTypes.func,
  activeId: PropTypes.any,
};

export default SelectAmount;
