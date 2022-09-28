import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import Button from "../commonComponents/Button";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import { Base64 } from "js-base64";

const WalletWinningsCard = ({
  walletType,
  winningBalance,
  activeWallet,
  setActiveWallet,
  text,
  lang,
}) => {
  const history = useHistory();
  const isActive = walletType === activeWallet ? true : false;
  const selectWinningCard = () => {
    setActiveWallet(walletType);
  };

  const tick =
    require("../assets/wallet-icon/select_withdraw_tick.svg").default;
  const tick_disbaled =
    require("../assets/wallet-icon/deselect_withdraw_tick.svg").default;
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const tempObj = reactLocalStorage.getObject("tempObj");

  return (
    <div
      className="w-full bg-walletCardPurple border border-walletCardPurpleBorder flex px-2 py-3 rounded-xl my-2"
      onClick={() => selectWinningCard()}
    >
      <div className="w-1/12 mr-2 flex items-center">
        <Image url={isActive ? tick : tick_disbaled} styles={"h-6 w-6"} />
      </div>
      <div className="w-7/12">
        <Text
          tag="span"
          text={
            walletType === "MOMO"
              ? text.mobileMoneyWin[lang]
              : text.prepaidMoneyWin[lang]
          }
          textColor="text-lightPurple"
          fontweight="normal"
        />
        <div className="flex items-center">
          <Image url={coinIcon} styles="h-5 w-5 rounded-full mr-1" />
          <Text
            tag="h3"
            text={winningBalance}
            textColor="text-white"
            fontweight="bold"
          />
        </div>
      </div>
      <div className="w-4/12">
        <Button
          type="button"
          label={text.withdraw[lang]}
          eventHandler={() => {
            ReactGA.event({
            category: "wallet_p",
            action: `withdraw button clicked - mobile - ${tempObj.number}, date - ${new Date()}`,
        });
            const withdrawWallet = walletType === "MOMO" ? "m" : "p";
            history.push(`/withdraw?w=${Base64.encode(withdrawWallet)}&bal=${Base64.encode(winningBalance)}`);
          }}
          size={"medium"}
          styles={"font-bold text-sm uppercase bg-withdrawButton text-black"}
        />
      </div>
    </div>
  );
};

export default WalletWinningsCard;

WalletWinningsCard.propTypes = {
  walletType: PropTypes.string,
  winningBalance: PropTypes.number,
  activeWallet: PropTypes.string,
  setActiveWallet: PropTypes.func,
  text: PropTypes.object,
  lang: PropTypes.string,
};
