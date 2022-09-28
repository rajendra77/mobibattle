import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import Button from "../commonComponents/Button";
import Timer from "../myhooks/Timer";
import { updateData, CallBot } from "../myhooks/SocketManagerIO";
import UserProfileData from "../Database/UserProfileData";
// import User2 from "../assets/svg-icons/ezgif-7-063c6560d981.gif";
import User2 from "../assets/mtncongo/avatar.gif";
import { Base64 } from "js-base64";
import _ from "lodash";
import { Context } from "../context/Context";
import { reactLocalStorage } from "reactjs-localstorage";
import ReactGA from "react-ga";



function Matching({
  id,
  setShowModal,
  matched,
  setMatched,
  setTimeLeft,
  text,
  lang,
  userGif,
}) {
  const history = useHistory();
  const { timeLeft, stopTimer } = Timer();
  const tempObj = reactLocalStorage.getObject("tempObj");
  // const [setPerc] = useState(20);
  // const [setPercentage] = useState(100);
  const [userImage, setUserImage] = useState(User2);
  // console.log(userImage);
  // const [matched, setMatched] = useState(false);
  // const [setDisabled] = useState(true);
  // console.log(userImage);
  const [name, setName] = useState("");
  const user = reactLocalStorage.getObject("userProfile");
  const userDataS = {
    id: user.uniqueId,
    gameId: id,
  };
  
  const { battleData, updateBattle, catId, currentGameData, handleShowModal } =
    useContext(Context);
  // const userGif =
  //   require("../assets/svg-icons/ezgif-7-063c6560d981.gif").default;
  const coin_icon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const playerBusyIcon =
    require("../assets/modal-icons/oops_busy_player.svg").default;
  useEffect(() => {
    // console.log(">>> ######## reciving my findBattle in match::", updateData);
    if (updateData != undefined && _.isEmpty(updateData) === false) {
      updateBattle(updateData);
      setMatched(true);
      stopTimer();
      setUserImage(battleData.img ? battleData.img : User2);
      setName(updateData.name ? updateData.name : "");
      setTimeout(() => {
        history.push(`/singlegame/${Base64.encode(catId.type)}/${Base64.encode(catId.id)}`);
        setMatched(false);
      }, 2000);
    }
  }, [updateData]);

  const modalData = {
    title: text.playersBusyModal.title[lang],
    body: text.playersBusyModal.body[lang],
    icon: playerBusyIcon,
    buttons: [
      {
        label: text.playersBusyModal.button[lang],
        action: "close",
        buttonColor: "bg-tabsColor",
        textColor: "text-white",
      },
    ],
    handleClick: function (button) {
      if (button === "close") {
        handleShowModal(false);
      }
    },
  };


  useEffect(() => {
    // setPerc((prev) => prev - 1);
    // const percentageShow = 100 * (1 - (timeLeft - 1) / timeLeft);
    // setPercentage(percentageShow);
    timeLeft < 10 ? setTimeLeft("0" + timeLeft) : setTimeLeft(timeLeft);
    if (currentGameData.planType === "FREE" && timeLeft === 15) {
      CallBot(userDataS);
    } else if (currentGameData.planType === "LEADERBOARD" && timeLeft === 10) {
      CallBot(userDataS);
    } else if (currentGameData.planType === "MOMO" && timeLeft === 5) {
    //   ReactGA.event({
    //   category: "match_not_found",
    //   action: `match not found, all players seems busy - mobile - ${tempObj.number}, planType - ${currentGameData.planType}, date-${new Date()}`,
    // });
      CallBot(userDataS);
      // setShowModal(false);
      // handleShowModal(true, modalData);
      
    } else if (timeLeft === 0) {
      ReactGA.event({
      category: "dev_s_match_not_found",
      action: `match not found, all players seems busy - code - ${tempObj.code}, mobile - ${tempObj.number},planType - ${currentGameData.planType}, gameId - ${id} date-${new Date()}`,
    });
      setShowModal(false);
      handleShowModal(true, modalData);
    }
  }, [timeLeft]);

  const label =
    currentGameData.planType === "FREE" ? (
      text.free[lang]
    ) : (
      <div className="flex items-center">
        <Image url={coin_icon} styles="w-6 h-6 mr-1" />
        {currentGameData.price}
      </div>
    );
  const aPartyAvatar =
    _.has(user, "avatarUrl") && user.avatarUrl.length > 0
      ? user.avatarUrl
      : UserProfileData.img;
  const bPartyAvatar =
    matched === false
      ? userGif
      : _.isEmpty(battleData) === false &&
        _.has(battleData, "img") &&
        battleData.img !== null &&
        battleData.img.length > 0
      ? battleData.img
      : UserProfileData.img;

  // console.log(" BATTLEDATA IMAGE ---- b party avatar ", battleData);
  const userDisplay = (img, name, label) => {
    return (
      <div className="rounded-full flex flex-col items-center mx-2">
        {!matched && (
          <Image
            url={img}
            styles={"h-24 w-24 rounded-full border-4 border-lightPurple"}
          />
        )}
        {matched && (
          <Image
            url={img}
            styles={"h-24 w-24 rounded-full border-4 border-lightPurple"}
          />
        )}
        <Text
          tag="h6"
          scale={true}
          text={name}
          fontweight="bold"
          alignment="center"
          textColor="text-white"
        />
        {matched && currentGameData.planType !== "LEADERBOARD" && (
          <Button
            label={label}
            size="small"
            textStyles="font-bold"
            styles="bg-button-green text-white"
          />
        )}
      </div>
    );
  };

  return (
    <div className="px-1 pb-4 my-2">
      <div className="flex justify-between items-start">
        {userDisplay(aPartyAvatar, user.name, label)}
        <div className="flex justify-center items-center my-8 mx-4">
          <Text
            tag="h4"
            scale={true}
            text={text.vs[lang]}
            fontweight="bold"
            alignment="center"
            textColor="text-white"
            styles="mx-4"
          />
        </div>
        {userDisplay(bPartyAvatar, name, label)}
      </div>
      <br />
      <Text
        tag="h5"
        scale={true}
        text={matched ? text.matched[lang] : text.searching[lang]}
        fontweight="bold"
        textColor="text-orange"
        alignment="center"
      />
    </div>
  );
}
Matching.propTypes = {
  setShowModal: PropTypes.func,
  id: PropTypes.string,
  matched: PropTypes.bool,
  setMatched: PropTypes.func,
  setTimeLeft: PropTypes.func,
  text: PropTypes.object,
  lang: PropTypes.string,
  userGif: PropTypes.string,
};

export default Matching;
