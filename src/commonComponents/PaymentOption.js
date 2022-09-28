import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import Text from "../commonComponents/Text";
import Image from "./Image";

function PaymentOption({
  id = "",
  type = "button",
  shape = "pill",
  background,
  textColor,
  fullWidth = true,
  label = "",
  icon = "",
  styles,
  textStyles,
  size = "",
  isDisabled = false,
  eventHandler = null,
  // action = "",
  textTag = "",
  selectedItem = "",
  iconStyle = "",
}) {
  let bgClass = cx("flex-row", textColor, {
    "w-full": fullWidth === true,
    "rounded-lg": (shape === "pill") === true,
    "rounded-full": (shape === "circle") === true,
    "p-1": (size === "small") === true,
    "p-3": (size === "medium") === true,
    "p-5": (size === "large") === true,
    [`bg-${background}`]: true,
    "opacity-50 cursor-not-allowed text-white": isDisabled === true,
  });

  let textStyle = cx("w-4/5", {
    [`${textStyles}`]: true,
    "text-black-400": isDisabled === false,
    "pl-2 pt-1": true,
  });

  const tick =
    require("../assets/mtncongo/select_wallet_withdraw_green_tick.png").default;
  const tick_disbaled =
    require("../assets/wallet-icon/deselect_wallet_withdraw_tick.svg").default;

  return (
    <>
      <button
        // style={{ border: "1px solid #b970b9a8" }}
        type={type}
        className={`focus:outline-none flex rounded-md ${bgClass} ${styles}`}
        disabled={isDisabled}
        onClick={() => {
          if (eventHandler && !isDisabled) eventHandler(id);
        }}
      >
        <div className="w-1/8">
          <Image url={icon} styles={iconStyle} />
        </div>

        <Text
          tag={textTag || "h5"}
          scale={true}
          styles={textStyle}
          text={label}
          alignment="left"
        />

        <div className="w-1/7 text-right ">
          <Image
            url={selectedItem === id ? tick : tick_disbaled}
            styles={"h-8 w-8"}
          />
        </div>
      </button>
    </>
  );
}

PaymentOption.propTypes = {
  id: PropTypes.number,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  shape: PropTypes.oneOf(["pill", "circle"]),
  size: PropTypes.string,
  background: PropTypes.string,
  isDisabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  icon: PropTypes.any,
  eventHandler: PropTypes.func,
  styles: PropTypes.string,
  textColor: PropTypes.string,
  textStyles: PropTypes.string,
  textTag: PropTypes.string,
  iconClass: PropTypes.string,
  // action: PropTypes.string,
  selectedItem: PropTypes.number,
  iconStyle: PropTypes.string,
};

export default PaymentOption;
