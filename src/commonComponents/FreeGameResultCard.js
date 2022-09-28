import React from "react";
import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import PropTypes from "prop-types";
import { text } from "@fortawesome/fontawesome-svg-core";

function FreeGameResultCard({
  title,
  subtitle,
  win,
  icon,
  buttonText,
  handleClick,
  background,
  buttonBg,
  action,
  price,
  doublePrice,
  coin,
  subscribed,
  playersStats,
  balance
}) {
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  return (

    <div
      className={`w-full p-1 mx-2 mb-2 rounded-xl flex flex-col items-center justify-between relative ${background}`}
    >
      <Image
        url={icon}
        styles="h-16 w-16 rounded-xl absolute -top-8"
        showPreloader={false}
      />
      <div className="flex justify-center items-end">
        <Text
          tag="h2"
          text={title}
          textColor="text-black"
          fontweight="bold"
          styles="mt-10 text-center"
        />
        {coin && <Image url={coinIcon} styles="w-4 h-4 ml-1" />}

        <Text
          tag="h6"
          text={price}
          fontweight="bold"
          styles="mt-10 text-center text-black"
        />
      </div>
      <div className="flex justify-center items-center">
        <Text
          tag={subscribed ? "h2" : "h5"}
          text={win}
          textColor="text-black"
          // fontweight= "bold"
          styles={"mt-4 mb-4 text-center" + (subscribed ? " font-medium" : " font-bold")}

        />


        {coin && <Image url={coinIcon} styles="w-4 h-4 mx-1" />}

        <Text
          tag="h4"
          text={doublePrice}
          textColor="text-black"
          fontweight="bold"
          styles="my-4"
        />
      </div>

      {subscribed && <Text
          tag={"p"}
          text={playersStats}
          textColor="text-black"
          // fontweight= "bold"
          styles="mb-3"
        />}

      {/* <Text
        tag="h6"
        text={subtitle}
        textColor="text-black"
        styles="text-center mb-2"
      /> */}
      <Button
        type="button"
        label={
          coin ? (
            <div className="flex">
              <div className="flex items-center justify center">
                <Text
                  tag="h5"
                  text={buttonText}
                  textColor="text-white"
                  fontweight="normal"
                  styles=""
                />
                <Image url={coinIcon} styles="w-4 h-4 ml-1" />
                <Text
                  tag="h5"
                  text={price}
                  textColor="text-white"
                  fontweight="normal"
                  styles=""
                />
              </div>
            </div>
          ) : (
            <Text
                  tag="h2"
                  text={buttonText}
                  textColor="text-white"
                  fontweight="normal"
                  styles=""
                />
          )
        }
        eventHandler={handleClick}
        action={action}
        size={"medium"}
        styles={`font-bold text-4xl text-white ${buttonBg}`}
      />
      
    </div>
  );
}

FreeGameResultCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  win: PropTypes.string,
  icon: PropTypes.string,
  buttonText: PropTypes.string,
  handleClick: PropTypes.func,
  background: PropTypes.string,
  buttonBg: PropTypes.string,
  action: PropTypes.string,
  price: PropTypes.string,
  doublePrice: PropTypes.string,
  coin: PropTypes.bool,
};

export default FreeGameResultCard;
