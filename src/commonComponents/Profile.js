import React, { useContext, useEffect, useState } from "react";
// import profileEdit from "../assets/svg-icons/profile_edit_icon.svg";
import Image from "../commonComponents/Image";
import { Link, useHistory} from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
import UserProfileData from "../Database/UserProfileData";
import crownImage from "../assets/svg-icons/premium_card_crown.svg";
import remote from "../assets/svg-icons/game_play_icon.svg";
import trophy from "../assets/svg-icons/color_trophy_icon.svg";
import camera from "../assets/svg-icons/camera_profile_pict.svg";
import PropTypes from "prop-types";
import { Context } from "../context/Context";
import ReactGA from "react-ga";
import {MyProfileText as text} from '../Database/Text'


function Profile({ subscribed, gamesPlayed, winnings, balance }) {
  console.log("----subscribed----->", subscribed);
  const [lang, setLang] = useState("en");
  const {code,getLanguage} = useContext(Context);
  const history = useHistory();
  const user = reactLocalStorage.getObject("userProfile");
  const coin_icon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const lock_icon =
    require("../assets/svg-icons/premium_card_lock.svg").default;
  const [userData, setUserData] = useState({
    gameStats: [],
    gameDetails: [],
    tournamentStats: { upcoming: {}, datetime: {} },
    menu: [1, 2, 3],
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
    setUserData(UserProfileData);
  }, []);

  const profileImg = _.has(user, "avatarUrl") ? user.avatarUrl : userData.img;
  const tempObj = reactLocalStorage.getObject("tempObj");
  console.log("balance::", balance);
  const redirect = balance > 0 ? "/subscription" : "/subscription?subType=combo" ;

  return (
    <div className="rounded-md bg-gradient-to-t from-profile to-profileLight py-3 px-3 border-2 border-profileBorder">
      <div className="flex items-center justify-between">
        <div className="ml-2">
          <h2 className="text-white text-xl font-bold">{user.name}</h2>
          <h2 className="text-lg text-logOutText">{`${code}-${user.number}`}</h2>
        </div>
        <div className="pr-4 relative">
          <Link to="/mojiavatar?sk=h" onClick={() => {
            ReactGA.event({
            category: "myProfile_p",
            action: `profile image clicked - mobile - ${tempObj.number}, date - ${new Date()}`,
          });
          }}>
            <Image
              styles={"rounded-full w-24 h-24"}
              url={profileImg}
              classImg="rounded-full"
            />
            <img src={camera} className="absolute right-1 bottom-1" alt="img"/>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center">
            <img src={remote} className="w-6 h-6" alt="img"/>
            <p className="text-white ml-2">{gamesPlayed}</p>
          </div>
          <p className="text-xs text-profileWinningText font-bold">
            {text.gamesPlayed[lang]}
          </p>
        </div>
        <div>
          <div className="flex items-center">
            <img src={trophy} className="w-4 h-4 mr-2" alt="img"/>
            <img src={coin_icon} className="w-4 h-4 mr-1" alt="img"/>
            <p className="text-white">{winnings}</p>
          </div>
          <p className="text-xs text-profileWinningText font-bold">
          {text.winnings[lang]}
          </p>
        </div>
        {subscribed && (
          <Link to="/subscribed">
          <div className="rounded flex items-center justify-center border border-premiumText py-1 px-1 bg-premiumTextBg mt-1">
            <img src={crownImage} className="w-4 h-4" alt="img"/>
            <p className="text-premiumText text-xs pl-1 font-bold">
            {text.premiumMember[lang]}
            </p>
          </div>
          </Link>
        )}
        {!subscribed && (
          <Link to={redirect} onClick={() => {
            ReactGA.event({
            category: "myProfile_p",
            action: `subscribe button clicked - mobile - ${tempObj.number}, date - ${new Date()}`,
          });
          }}>
            <div className="rounded flex items-center justify-center border border-premiumText py-1 px-4 bg-premiumTextBg mt-1">
              <img src={lock_icon} className="w-4 h-4" alt="img"/>
              <p className="text-premiumText text-sm pl-1 font-bold">
              {text.subscribe[lang]}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

Profile.propTypes = {
  subscribed: PropTypes.bool,
  gamesPlayed: PropTypes.number,
  winnings: PropTypes.number,
};

export default Profile;
