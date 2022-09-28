import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import Text from "../commonComponents/Text";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "../context/Context";
import {GeneralText} from '../Database/Text'



function SideMenuItem({ item, setSideMenu, lang }) {
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = (userName === "Guest") ? 1 : 0
  const redirect = (guest === 1 && (item.link === "/wallet" || item.link === "/myprofile")) ? "/subscription?subType=combo" : item.link
  console.log("item", item.link);

  const history = useHistory();
  const {  handleShowModal } = useContext(Context);

  const logoutFunc = () =>{
    const modalData = {
      title: GeneralText.logout[lang],
      body: GeneralText.logoutBody[lang],
      buttons: [
        {
          label: GeneralText.cancel[lang],
          action: "close",
          buttonColor: "bg-tLightViolet",
          textColor: "text-white",
        },
        {
          label: GeneralText.okay[lang],
          action: "okay",
          buttonColor: "bg-tabsColor",
          textColor: "text-white",
        },
      ],
      handleClick: function (button) {
        if(button === "close") {
          handleShowModal(false);
        }else if(button === "okay") {
          handleShowModal(false);
          reactLocalStorage.clear()
          history.push('/')
        }
      },
    };
    handleShowModal(true, modalData);
  }

  item.link =
    item.link === "/allgames" ? item.link + "?st=leaderboard" : item.link;
    const tempObj = reactLocalStorage.getObject("tempObj");
  return (
    <Link
      className="text-left w-full"
      to={item.link ==='/' ? null : redirect}
      onClick={() => {
        ReactGA.event({
            category: "sideMenu_p",
            action: `${item.link} button clicked - mobile - ${tempObj.number}, date - ${new Date()}`,
        });
        setSideMenu(false);
        item.link ==='/' && logoutFunc()
      }}
    >
      <div className="w-full flex items-center px-3 py-4 pb-5 2xs:p-2 3xs:p-2">
        <div className="h-6 w-12">
           <img className="mr-3 px-3" src={item.icon} alt="img"/>
        </div>
        <Text
          tag="h5"
          scale={true}
          text={item.name[lang]}
          styles="text-white font-medium"
        />
        {/* <p>{item.name}</p> */}
      </div>
    </Link>
  );
}

SideMenuItem.propTypes = {
  item: PropTypes.object,
  setSideMenu: PropTypes.func,
  lang : PropTypes.string
};

export default SideMenuItem;
