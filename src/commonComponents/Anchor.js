import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import cx from "classnames";
import Image from "./Image";
import _ from "lodash";
import Text from "../commonComponents/Text";

const Anchor = ({
  isFull = false,
  isActive = false,
  redirectPath = "",
  classes = "",
  tag = "span",
  item = {},
  clickEvent = null,
  iconClass = "",
  textTransform ="",
  textStyle = ""
}) => {
  let linkClass = cx(classes, {
    "w-full": isFull === true,
    "bg-blueAnchor": isActive === true,
    "flex items-center justify-center p-1": _.has(item, "icon") === true,
  });
  const icon = _.has(item, "icon") && item.icon.length > 0 && (
    <span className="inline-flex justify-center items-center mx-2">
      <Image
        url={require(`../assets/svg-icons/${item.icon}`).default}
        alt={item.title}
        styles={iconClass}
      />
    </span>
  );
  const title = _.has(item, "title") && (
    <Text
      tag={tag}
      scale={true}
      text={item.title}
      fontweight="normal"
      alignment="center"
      textTransform ={textTransform}
      styles={textStyle}
    />
  );
  const badge = _.has(item, "badge") && (
    <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
      {item.badge}
    </span>
  );
  const handleClick = (e) => {
    if (clickEvent !== null) {
      e.preventDefault();
      clickEvent();
    }
  };
  // console.log("... item ....", item);
  return (
    <Link className={linkClass} to={redirectPath} onClick={handleClick}>
      {icon}
      {title}
      {badge}
    </Link>
  );
};

Anchor.propTypes = {
  tag: PropTypes.string,
  isFull: PropTypes.bool,
  isActive: PropTypes.bool,
  redirectPath: PropTypes.string,
  classes: PropTypes.string,
  item: PropTypes.object,
  clickEvent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  iconClass: PropTypes.string,
  textTransform : PropTypes.string,
  textStyle : PropTypes.string
};

export default Anchor;
