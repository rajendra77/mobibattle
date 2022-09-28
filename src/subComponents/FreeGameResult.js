import React, { useContext, useEffect, useState } from "react";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import FreeGameResultCard from "../commonComponents/FreeGameResultCard";
import { Context } from "../context/Context";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import useSubscribe from "../network/useSubscribe";
import { FreeResultText as text } from "../Database/Text";
import { reactLocalStorage } from "reactjs-localstorage";
import ReactGA from "react-ga";
import useProceedToPay from "../network/useProceedToPay";
import { cleanData } from "../myhooks/SocketManagerIO";
import SocketEvent from "../myhooks/SocketEvent";
import { Base64 } from "js-base64";


function FreeGameResult({
  id,
  title,
  subtitle,
  handleClick,
  subPacks,
  lang,
  gameOver,
}) {
  const dollar_icon = require("../assets/svg-icons/play$4_icon.svg").default;
  const crown_icon =
    require("../assets/svg-icons/premium_member_result_page.svg").default;
    const pot_icon =
    require("../assets/mtncongo/play4_icon_result_page.png").default;
  const like_icon = require("../assets/svg-icons/thumb_like_icon.svg").default;
  const home_icon_white = require("../assets/svg-icons/home-white.svg").default;
  const history = useHistory();
  const { updateRedirectHome, updateMyScore, updateBattle} = useContext(Context);
  const [percentage, setPercentage] = useState(0);
  const { checkSubscription } = useSubscribe();
  const [subscribed, setSubscribed] = useState(false);
  const tempObj = reactLocalStorage.getObject("tempObj");
  const { getBalanceData } = useProceedToPay();
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = (userName === "Guest") ? 1 : 0;
  const { socketDisconnect } = SocketEvent();
  const [balance, setBalance] = useState();


  const handlePremiumButton = () => {
    updateRedirectHome(true);
    if (subscribed) {
      ReactGA.event({
        category: "game_result",
        action: `play now button clicked - mobile - ${tempObj.number} , date-${new Date()}`,
    });
      history.push(`/battleinfo?id=${Base64.encode(id)}`);
    } else {
      ReactGA.event({
        category: "game_result",
        action: `subscribe now button clicked - mobile - ${tempObj.number} , date-${new Date()}`,
    });
      const packId = subPacks && subPacks.length > 0 ? subPacks[0].packId : "";
      // history.push(`/subscription?gId=${id}&result=${true}`);
      if (balance > 0) {
        history.push(`/subscription?result=${Base64.encode(true)}`);
      }else {
        history.push(`/subscription?subType=${Base64.encode("combo")}&result=${Base64.encode(true)}`);
      }
    }

  };
  


  useEffect(() => {
    // Returns a random integer from 1 to 10:
    setPercentage(Math.floor(Math.random() * 20) + 1);
  }, []);

  useEffect(() => {
    guest === 0 && checkSubscription()
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
        setSubscribed(true);
        }else if (res.status.toUpperCase() === "FAILURE" || res.status.toUpperCase() === "PENDING") {
          setSubscribed(false);
          getBalanceData().then((res) => {
           console.log(res);
           (guest === 0) ? setBalance(res.main_balance + res.winning_balance) : setBalance(0);
         }).catch((err) => {
           console.log(">>>>> GET BALANCE API ERROR >>>>>", err)
         }); 
        }
      })
      .catch((err) => {
        console.log("------err------>", err);
        setSubscribed(false);
      });
  }, []);

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center mt-4 mb-2">
        <Text
          tag="h2"
          scale={true}
          text={title}
          fontweight="bold"
          textColor={"text-white"}
        />
        <Text
          tag="h2"
          scale={true}
          text={subtitle}
          fontweight="bold"
          textColor={"text-orange text-center"}
          styles="pl-2"
        />
      </div>
      {gameOver === true && (
        <div className="flex w-full justify-center items-center mb-2">
          <Image url={like_icon} styles="pr-1 pb-1" />
          <Text
            tag="h5"
            scale={true}
            text={text.infoText.text1[lang]}
            textColor={"text-lightPurple"}
          />
          <Text
            tag="h4"
            scale={true}
            text={text.infoText.text2[lang]}
            textColor={"text-white"}
            styles="pl-1"
          />
          <Text
            tag="h2"
            scale={true}
            text={`${percentage}%`}
            fontweight="bold"
            textColor={"text-orange"}
            styles="pl-1"
          />
          <Text
            tag="h4"
            scale={true}
            text={text.infoText.text3[lang]}
            textColor={"text-white"}
            styles="pl-1"
          />
        </div>
      )}
      <div className="flex w-full justify-center mt-10">

        <FreeGameResultCard
          title={
            subscribed
              ? text.cardLeaderboard.titleSub[lang]
              : text.cardLeaderboard.titleNoSub[lang]
          }
          subtitle={text.cardLeaderboard.subtitle[lang]}
          win={subscribed ? text.cardLeaderboard.winSub[lang] : text.cardLeaderboard.win[lang]}
          buttonText={
            subscribed
              ? text.cardLeaderboard.buttonSub[lang]
              : text.cardLeaderboard.buttonNoSub[lang]
          }
          subscribed={subscribed}
          icon={subscribed ? pot_icon : crown_icon}
          handleClick={handlePremiumButton}
          background={subscribed ? "freeGameResultCard1" : "freeGameResultCard2"}
          buttonBg={subscribed ? "bg-darkGreen" : "bg-score-purple"}
          playersStats={text.cardMomo.subtitle[lang]}
          balance={balance}
        />
      </div>
      <div className="w-full px-1 py-2 text-center">
        <p className="text-center text-lightPurple">{text.freeGames[lang]}</p>
        <span className="px-1 rounded bg-orange text-black" onClick={() => {
          updateMyScore(0);
          cleanData();
          socketDisconnect(id);
          updateBattle({});
          history.push("/home")
        }}>{text.click[lang]}</span>
      </div>
    </>
  );
}

FreeGameResult.propTypes = {
  id: PropTypes.string,
  subPacks: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  handleClick: PropTypes.func,
  lang: PropTypes.string,
  gameOver: PropTypes.bool,
};

export default FreeGameResult;
