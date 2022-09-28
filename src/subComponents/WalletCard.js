import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import Button from "../commonComponents/Button";
import PropTypes from "prop-types";
// import Switch from "../commonComponents/Switch";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";

function WalletCard({
  walletBalance,
  walletType,
  // activeWallet,
  // setActiveWallet,
  text,
  lang,
}) {
  const history = useHistory();
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const momoIcon =
    require("../assets/svg-icons/mobile_money_wallet_withdraw_icon.svg").default;
  const prepaidIcon =
    require("../assets/svg-icons/prepaid_mobile_wallet_withdraw_icon.svg").default;
    const tempObj = reactLocalStorage.getObject("tempObj");

  // const toggleSwitch = () => {
  //   if (walletType === activeWallet) {
  //     if (walletType === "MOMO") {
  //       setActiveWallet("PREPAID");
  //     } else {
  //       setActiveWallet("MOMO");
  //     }
  //   } else {
  //     setActiveWallet(walletType);
  //   }
  // };

  return (
    <div
      className={`w-1/2 p-2 mx-1 mb-2 rounded-xl flex flex-col justify-between relative ${
        walletType === "MOMO" ? "freeGameResultCard1" : "freeGameResultCard2"
      }`}
    >
      <div className="flex justify-between items-center">
        <Image
          url={walletType === "MOMO" ? momoIcon : prepaidIcon}
          styles="h-12 w-12"
        />
        {/* <Switch
          walletType={walletType}
          toggleSwitch={toggleSwitch}
          activeWallet={activeWallet}
        /> */}
      </div>
      <br />
      <br />
      <Text
        tag="h4"
        text={
          walletType === "MOMO"
            ? text.mobileMoneyWallet[lang]
            : text.prepaidMoneyWallet[lang]
        }
        textColor="text-black"
      />
      <div className="flex items-center w-full mb-2">
        <Image url={coinIcon} styles="h-6 w-6 rounded-full mr-1 mt-1 mb-2" />
        <Text
          tag="h3"
          text={walletBalance}
          textColor="text-black"
          fontweight="bold"
        />
      </div>
      <Button
        type="button"
        label={text.buyCoin[lang]}
        eventHandler={() => {
          ReactGA.event({
            category: "wallet_p",
            action: `buy coin button clicked - mobile - ${tempObj.number}, date - ${new Date()}`,
        });
          history.push("/addamount");
        }}
        size="medium"
        styles={"font-bold text-sm uppercase bg-button-green text-white"}
      />
    </div>
  );
}

export default WalletCard;

WalletCard.propTypes = {
  walletBalance: PropTypes.number,
  setActiveWallet: PropTypes.func,
  walletType: PropTypes.string,
  activeWallet: PropTypes.string,
  text: PropTypes.object,
  lang: PropTypes.string,
};
