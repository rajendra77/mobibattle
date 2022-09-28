import React from "react";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";


function SideMenuProfile({ profileImg, userName, setSideMenu, mobile ,countryCode}) {
  const tempObj = reactLocalStorage.getObject("tempObj");
  const name = reactLocalStorage.getObject("userProfile").name;
  const guest = (name === "Guest") ? 1 : 0
  return (
    <div className="w-full flex mb-4 p-3 pl-4 pb-6 border-b-2 border-sideMeduSeparator">
      <div className="mr-4">
        <Link
          to={guest === 0 ? "/myprofile" : "/subscription?subType=combo"}
          onClick={() => {
            ReactGA.event({
            category: "sideMenu_p",
            action: `profile image clicked - mobile - ${tempObj.number}, date - ${new Date()}`,
          });
            setSideMenu(false);
          }}
        >
          <Image
            url={profileImg}
            styles="w-24 h-24 rounded-full border-4 border-sideMenuProfileBorder"
            classImg="rounded-full"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-center items-start">
        <Text
          tag="h3"
          scale={true}
          styles="text-white capitalize"
          text={userName}
          fontweight="bold"
          alignment="left"
        />
        <Text
          tag="h6"
          scale={true}
          styles="text-lightPurple mt-1"
          text={guest === 0 ? `${countryCode}-${mobile}` : `${countryCode}-XXXXXXXX`}
          fontweight="bold"
          alignment="left"
        />
        {/* <p>{userName}</p>
                <p>{text}</p> */}
      </div>
    </div>
  );
}

SideMenuProfile.propTypes = {
  profileImg: PropTypes.string,
  userName: PropTypes.string,
  setSideMenu: PropTypes.func,
  mobile: PropTypes.string,
  countryCode : PropTypes.string
};

export default SideMenuProfile;
