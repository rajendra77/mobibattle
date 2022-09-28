import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";

function WalletHeaderCardNew({
  activeWallet,
  activeWalletBalance,
  isSubscribed,
  text,
  lang,
}) {
  const history = useHistory();
  const defaultImage =
    require("../assets/svg-icons/animal-avatar4.png").default;
  const user = reactLocalStorage.getObject("userProfile");
  const profileImg = _.has(user, "avatarUrl") ? user.avatarUrl : defaultImage;
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const clocklIcon =
    require("../assets/wallet-new/transaction_history-clock_white.svg").default;
  const transactionHistoryNextIcon =
    require("../assets/wallet-new/transaction_history_next_icon_white.svg").default;
  const tempObj = reactLocalStorage.getObject("tempObj");
  const userProfile = reactLocalStorage.getObject("userProfile");

  return (
    <div className="w-full bg-walletNewGreen p-4 flex">
      <div className="flex-grow flex flex-col items-start">
        <Image
          url={profileImg}
          styles={"rounded-full w-16 h-16"}
          classImg="rounded-full"
        />
        <Text
          tag="h3"
          text={userProfile.name}
          textColor="text-white"
          fontweight="bold"
          styles="py-1"
        />
      </div>
      <div className="flex flex-col items-start justify-around pl-6 2xs:pl-4 3xs:pl-2">
        <div>
          <div className="flex items-center">
            <Image url={coinIcon} styles="h-6 w-6 rounded-full mr-2" />
            <Text
              tag="h2"
              text={activeWalletBalance}
              textColor="text-white"
              fontweight="bold"
            />
          </div>
          <Text
            tag="h5"
            text={text.coinsBalance[lang]}
            textColor="text-white"
          />
        </div>
        <div
          className="flex items-center mt-8"
          onClick={() => {
            ReactGA.event({
              category: "wallet_p",
              action: `transaction history button clicked - mobile - ${
                tempObj.number
              }, date - ${new Date()}`,
            });
            history.push("/alltransaction");
          }}
        >
          <Image url={clocklIcon} styles="w-8 rounded-full min-w-max" />
          <div className="flex flex-col px-2">
            <Text
              tag="span"
              text={text.transaction[lang]}
              textColor="text-white"
            />
            <Text tag="span" text={text.history[lang]} textColor="text-white" />
          </div>

          <Image url={transactionHistoryNextIcon} styles="h-4 w-4 pr-1" />
        </div>
      </div>
    </div>
  );
}

export default WalletHeaderCardNew;

WalletHeaderCardNew.propTypes = {
  activeWallet: PropTypes.string,
  activeWalletBalance: PropTypes.number,
  isSubscribed: PropTypes.bool,
  text: PropTypes.object,
  lang: PropTypes.string,
};
