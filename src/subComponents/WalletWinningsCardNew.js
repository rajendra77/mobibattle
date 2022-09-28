import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import Button from "../commonComponents/Button";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import { Base64 } from "js-base64";

const WalletWinningsCardNew = ({
  type,
  coins,
  activeWallet,
  setActiveWallet,
  text,
  lang,
}) => {
  const history = useHistory();
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const tempObj = reactLocalStorage.getObject("tempObj");

  return (
    <div className="w-full flex p-4 border-b-2 border-tViolet">
      <div className="w-7/12">
        <Text
          tag="h6"
          text={
            type === "mainBalance"
              ? text.addCoinCardText[lang]
              : text.withdrawCardText[lang]
          }
          styles="tracking-wide font-normal text-white"
        />
        <div className="flex items-center">
          <Image url={coinIcon} styles="h-5 w-5 rounded-full mr-1" />
          <Text
            tag="h3"
            text={coins}
            textColor="text-white"
            fontweight="bold"
          />
        </div>
      </div>
      <div className="w-full">
        <Button
          type="button"
          label={type ==="mainBalance" ? text.addCoinCardButton[lang] :  text.withdrawCardButton[lang]}
          // isDisabled ={type==="mainBalance" ? true : false}
          eventHandler={() => {
            
            ReactGA.event({
              category: "wallet_p",
              action: `${type} button clicked - mobile - ${
                tempObj.number
              }, date - ${new Date()}`,
            });
            type ==="mainBalance" ? history.push("/addamount") :history.push(`/withdraw?wType=${Base64.encode(type)}`);
          }}
          size={"medium"}
          styles={`font-bold text-xs ${
            type === "mainBalance"
              ? "bg-darkGreen text-white"
              : "bg-withdrawButton text-black"
          }`}
        />
      </div>
    </div>
  );
};

export default WalletWinningsCardNew;

WalletWinningsCardNew.propTypes = {
  walletType: PropTypes.string,
  coins: PropTypes.number,
  activeWallet: PropTypes.string,
  setActiveWallet: PropTypes.func,
  text: PropTypes.object,
  lang: PropTypes.string,
};
