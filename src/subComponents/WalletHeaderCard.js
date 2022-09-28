import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import moment from "moment";
import { Base64 } from "js-base64";

function WalletHeaderCard({
  activeWallet,
  activeWalletBalance,
  isSubscribed,
  text,
  lang,
  endDate,
  balance
}) {

  const history = useHistory();
  const defaultImage =
    require("../assets/svg-icons/animal-avatar4.png").default;
  const user = reactLocalStorage.getObject("userProfile");
  const profileImg = _.has(user, "avatarUrl") ? user.avatarUrl : defaultImage;
  const crown = require("../assets/svg-icons/crown_member.svg").default;
  const lock = require("../assets/svg-icons/premium_card_lock.svg").default;
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const tempObj = reactLocalStorage.getObject("tempObj");

  
  const redirectSubscription = (isSubscribed) => {
    console.log("subscription status::", isSubscribed);
    if (!isSubscribed) {
      balance > 0 ? history.push("/subscription") : history.push(`/subscription?subType=${Base64.encode("combo")}`)
      
    }else{
      history.push("/subscribed");
    }
  };
  return (
    <div className="w-full border-b-4 pt-4 border-tViolet">
      <Text
        tag="h5"
        text={text.mySubscriptionPlan[lang]}
        styles="font-bold tracking-wider pl-2 pb-2 text-black-900 text-white"
      />
      <div className="bg-tViolet p-3 ">
        <div
          className="flex items-center"
          // onClick={() => {
          //   ReactGA.event({
          //     category: "wallet_p",
          //     action: `my subscription button clicked - mobile - ${
          //       tempObj.number
          //     }, date - ${new Date()}`,
          //   });
          //   redirectSubscription(isSubscribed);
          // }}
        >
          <div className="h-12 w-12 rounded-full bg-walletSubCircle flex justify-center items-center border-4 border-walletSubBorder">
            <Image
              url={isSubscribed ? crown : lock}
              styles="p-2"
              objectCover={false}
              objectContain={true}
            />
          </div>
          <div className="ml-3 flex">
            <Text
              tag="span"
              text={text.subscriptionStatus[lang]}
              styles="font-medium tracking-wider text-white"
            /> 
            <Text
              tag="h6"
              text={isSubscribed ? text.active[lang] : text.inactive[lang]}
              styles="font-bold tracking-wide -mt-1 text-white"
            />

          </div>
          <div className="ml-auto mr-0 cursor-pointer" 
          onClick={() => {
            ReactGA.event({
              category: "wallet_p",
              action: `my subscription button clicked - mobile - ${
                tempObj.number
              }, date - ${new Date()}`,
            });
            redirectSubscription(isSubscribed);
          }}
          >
            <Text
              tag="h6"
              text={"Багц цуцлах бол "}
              styles="font-bold tracking-wide text-white "
            />
             <Text
              tag="h6"
              text={"Энд дарна уу"}
              styles="font-bold tracking-wide text-white underline text-center"
            />
          </div>
         
        </div>
       
        {isSubscribed && <div className="ml-3">
          <Text
            tag="span"
            text={text.validityDate[lang]}
            styles="font-bold text-white"
          />
          {endDate && <Text
            tag="span"
            text={moment( endDate ).format("YYYY/MM/DD")}
            styles="font-medium text-white"
          />}
        </div>}
       
      </div>
     
      <div className="w-full flex items-center px-3 py-5">
        <Image
          url={profileImg}
          styles={"rounded-full w-16 h-16"}
          classImg="rounded-full"
        />
        <div className="ml-2">
          <Text
            tag="h6"
            text={text.mobileBalance[lang]}
            styles="font-medium tracking-wider text-white"
          />
          <div className="flex items-center">
            <Image url={coinIcon} styles="h-5 w-5 rounded-full mr-1" />
            <Text tag="h3" text={activeWalletBalance} fontweight="bold" styles="text-white"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletHeaderCard;

WalletHeaderCard.propTypes = {
  activeWallet: PropTypes.string,
  activeWalletBalance: PropTypes.number,
  isSubscribed: PropTypes.bool,
  text: PropTypes.object,
  lang: PropTypes.string,
};
