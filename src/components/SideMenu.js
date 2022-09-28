import React, { useContext, useEffect, useState } from "react";
import Profile from "../commonComponents/SideMenuProfile";
import Item from "../commonComponents/SideMenuItem";
import SideMenuData from "../Database/SideMenuData";
import CancelButton from "../assets/svg-icons/menu_close_icon.svg";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
import PropTypes from "prop-types";
import { Context } from "../context/Context";
import ReactGA from "react-ga";
import Image from "../commonComponents/Image";

function SideMenu({ sideMenu, setSideMenu }) {
  const [lang, setLang] = useState('en');
  console.log("lang::",lang);
  const {code,getLanguage} = useContext(Context)
  const data = SideMenuData.data;
  const userProfile = reactLocalStorage.getObject("userProfile");
  const profileImg = _.has(userProfile, "avatarUrl")
    ? userProfile.avatarUrl
    : SideMenuData.profileImg;
  const userName = _.has(userProfile, "name")
    ? userProfile.name
    : SideMenuData.userName;
  const mobile = userProfile.number;
  const tempObj = reactLocalStorage.getObject("tempObj");
  
  const mobibattle =
  require("../assets/gmobileMongolia/2-min.png").default;


 useEffect(() => {
  setLang(getLanguage());
}, []);

  
  return (
    <>
      {sideMenu && (
        <>
          <div className="fixed bg-black-50 z-20 top-0 left-0 bottom-0 right-0"></div>
          <div className="3xs:w-5/6 2xs:w-5/6 1xs:w-5/6 w-80 fixed top-0 z-50 bg-timerbgbottom min-h-screen flex flex-col items-center justify-start shadow-2xl rounded-r-3xl">
            <div className="w-full flex flex-col items-center h-90v overflow-auto">
              <div className="flex w-full pl-2 bg-gmobiSideMenu relative">
              <Image url={mobibattle} styles="w-1/6 mx-auto pt-1.5" />
                <img
                  onClick={() => {
                    ReactGA.event({
                        category: "sideMenu_p",
                        action: `close side menu button clicked - code - ${tempObj.code}, mobile - ${tempObj.number}, date - ${new Date()}`,
                      });
                    setSideMenu(false);
                  }}
                  src={CancelButton}
                  alt="close"
                  className="absolute right-2 top-2"
                />
              </div>

              <Profile
                profileImg={profileImg}
                userName={userName}
                mobile={mobile}
                text={SideMenuData.text}
                setSideMenu={setSideMenu}
                countryCode = {code}
              />
              {data.map((item, i) => (
                <div
                  className="w-full flex flex-col items-center max-h-screen"
                  key={i}
                >
                  <Item item={item} setSideMenu={setSideMenu} lang={lang}/>
                </div>
              ))}
            </div>

          </div>
        </>
      )}
    </>
  );
}

SideMenu.propTypes = {
  sideMenu: PropTypes.bool,
  setSideMenu: PropTypes.func,
};

export default SideMenu;
