/**
 * Header component
 * @property {boolean} back Show back icon if true
 * @property {boolean} hamburger Show menu icon if true
 * @property {boolean} wallet Show wallet icon if true
 * @property {boolean} home Show home icon if true
 * @property {String} profileImg Url for profile image
 * @property {string} title Text for header title
 */

import React from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
//imports from Common components..
import Image from "../commonComponents/Image";
import Button from "../commonComponents/Button";
//imports from Databases...
import Text from "../commonComponents/Text";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
import RedirectHook from "../myhooks/RedirectHook";
import { useContext } from "react";
import { Context } from "../context/Context";
import ReactGA from "react-ga";
import { Base64 } from "js-base64";
import {  SendGuiDataEvents } from "../commonScript";
// import { ReactComponent as YourSvg } from "../assets/svg-icons/animal-avatar4.png";

function Header(props) {
  const back_icon = require("../assets/svg-icons/back_arrow_white.svg").default;
  const home_icon = require("../assets/svg-icons/home-white.svg").default;
  const tempObj = reactLocalStorage.getObject("tempObj");
  let history = useHistory();
  const { walletPage } = RedirectHook();
  const { back, hamburger, wallet, home, profileImg, title, setSideMenu } =
    props;
  const { pathname } = useLocation();
  const {
    redirectHome,
    updateRedirectHome,
    showRegisterModal,
    handleRegisterModal,
  } = useContext(Context);
  const userProfile = reactLocalStorage.getObject("userProfile");
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = userName === "Guest" ? 1 : 0;
  const profileIm = _.has(userProfile, "avatarUrl")
    ? userProfile.avatarUrl
    : profileImg;
  const handleClick = () => {
    if (guest === 1) {
      history.push(`/subscription?subType=${Base64.encode("combo")}`);
    } else {
      ReactGA.event({
        category: "header_p",
        action: `wallet button clicked - code - ${tempObj.code} mobile - ${
          tempObj.number
        }, date - ${new Date()}`,
      });
      walletPage();
    }
  };
  const handleImg = () => {
    ReactGA.event({
      category: "header_p",
      action: `profile image clicked - code - ${tempObj.code}, mobile - ${
        tempObj.number
      }, date - ${new Date()}`,
    });
  };

  const handleHome = () => {
    ReactGA.event({
      category: "header_p",
      action: `home button clicked - code - ${tempObj.code}, mobile - ${
        tempObj.number
      }, date - ${new Date()}`,
    });
  };

  const goBack = () => {
    console.log("goBack function called...", redirectHome, pathname);
    if (
      redirectHome &&
      (pathname.includes("/subscription") ||
        pathname.includes("/leaderBoard") ||
        pathname.includes("/wallet") ||
        pathname.includes("/myprofile") ||
        window.history.length === 2)
    ) {
      console.log("Push to home...");
      history.push("/home");
      updateRedirectHome(false);
    } else if (showRegisterModal && pathname.includes("/tournaments")) {
      handleRegisterModal(false);
    } else {
      history.goBack();
    }
  };
  return (
    <div
      className={`h-20 w-full max-w-500px bg-primary flex justify-between items-center fixed top-0 z-50 px-4`}
    >
      {back && (
        <div
          className="px-2"
          onClick={() => {
            ReactGA.event({
              category: "header_p",
              action: `back button clicked from ${pathname} page - code - ${
                tempObj.code
              }, mobile - ${tempObj.number}, date - ${new Date()}`,
            });
            goBack();
          }}
        >
          <img src={back_icon}></img>
        </div>
      )}

      <div className="flex items-center flex-grow">
        {hamburger && (
          <div
            className="pr-2"
            onClick={() => {
              //send gui events
             let guiDataEvent = {}
              guiDataEvent["page"] = "homepage";
              guiDataEvent["event"] = "sidemenu_click";
              SendGuiDataEvents(guiDataEvent);
              ReactGA.event({
                category: "header_p",
                action: `side menu button clicked - code - ${
                  tempObj.code
                }, mobile - ${tempObj.number}, date - ${new Date()}`,
              });
              setSideMenu(true);
            }}
          >
            <FontAwesomeIcon
              icon={faBars}
              className="text-white text-2xl 2xs:text-xl 3xs:text-lg"
            />
          </div>
        )}
        {profileImg && (
          <Link
            to={guest === 0 ? "/myprofile" : "/subscription?subType=combo"}
            onClick={handleImg}
          >
            <Image
              styles={
                "rounded-full h-12 w-12 2xs:h-10 2xs:w-10 3xs:h-8 3xs:w-8 mx-2"
              }
              url={profileIm}
              classImg="rounded-full"
            />
          </Link>
        )}

        <Text
          tag="h4"
          scale={true}
          styles="whitespace-nowrap overflow-ellipsis tracking-wider"
          text={title}
          fontweight="bold"
          alignment="center"
          textColor={"text-white"}
        />
      </div>
      {home && (
        <Link to="/home" onClick={handleHome}>
          <div className="mr-4">
            <img src={home_icon}></img>
          </div>
        </Link>
      )}
      {wallet && (
        <Button styles="bg-white" tag={"wallet"} eventHandler={handleClick} />
        // <div className="px-2">
        //   <img src={wallet_icon}></img>
        // </div>
      )}
    </div>
  );
}

Header.propTypes = {
  back: PropTypes.bool,
  hamburger: PropTypes.bool,
  wallet: PropTypes.bool,
  home: PropTypes.bool,
  title: PropTypes.string,
  profileImg: PropTypes.string,
  setSideMenu: PropTypes.func,
};

export default Header;
