import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import _ from "lodash";
const Text = ({
  styles = "",
  tag = "",
  scale = true,
  text = "",
  fontweight = "",
  alignment = "",
  truncate = false,
  truncateLenth = 0,
  readMoreLess = false,
  fontStyle = "",
  fontSmoothing = "",
  letterSpacing = "normal",
  listStyleType = "none",
  listStylePosition = "",
  textColor = "",
  textOpacity = 1,
  textDecoration = "",
  textTransform = "",
  textOverflow = "",
  verticalAlign = "",
  whiteSpace = "",
  wordBreak = "",
}) => {
  // tag = (h1 .... h6, p, span, small,li)
  // scale = true / flase (resize)
  // text = string
  //thickness = true / flase (font-weight)
  const [readMore, setReadMore] = useState(readMoreLess);
  const [readMoreLessText, setReadMoreLessText] = useState("read more");
  const Tag = `${tag}`;
  const tagClass = cx(styles, textColor, {
    "overflow-ellipsis": truncate === true,
    "text-left": alignment === "left",
    "text-center": alignment === "center",
    "text-right": alignment === "right",
    "text-justify": alignment === "justify",
    "3xs:text-xl 2xs:text-2xl 1xs:text-3xl xs:text-4xl sm:text-5xl h1":
      tag === "h1" && scale === true,
    "3xs:text-lg 2xs:text-xl 1xs:text-2xl xs:text-3xl sm:text-4xl h2":
      tag === "h2" && scale === true,
    "3xs:text-base 2xs:text-lg 1xs:text-xl xs:text-2xl sm:text-3xl h3":
      tag === "h3" && scale === true,
    "3xs:text-sm 2xs:text-base 1xs:text-lg xs:text-xl sm:text-2xl h4":
      tag === "h4" && scale === true,
    "3xs:text-xs 2xs:text-sm 1xs:text-base xs:text-lg sm:text-xl h5":
      tag === "h5" && scale === true,
    "3xs:text-2xs 2xs:text-xs 1xs:text-sm xs:text-base sm:text-lg h6":
      tag === "h6" && scale === true,
    "3xs:text-3xs 2xs:text-2xs 1xs:text-xs xs:text-sm sm:text-base span":
      tag === "span" && scale === true,
    "3xs:text-3xs 2xs:text-2xs 1xs:text-xs xs:text-xs sm:text-sm p":
      tag === "p" && scale === true,
    "2xs:text-2xs 1xs:text-xs xs:text-xs sm:text-sm li":
      tag === "li" && scale === true,
    "text-4xl": tag === "h1" && scale === false,
    "text-3xl": tag === "h2" && scale === false,
    "text-2xl": tag === "h3" && scale === false,
    "text-xl": tag === "h4" && scale === false,
    "text-lg": tag === "h5" && scale === false,
    "text-base": tag === "h6" && scale === false,
    "text-sm inb": tag === "span" && scale === false,
    "text-xs": tag === "small" && scale === false,
    "text-sm": tag === "p" && scale === false,
    "text-sm list": tag === "li" && scale === false,
    "font-bold": fontweight === "bold",

    [`${fontSmoothing}`]: true,
    [`${fontStyle}`]: true,
    [`tracking-${letterSpacing}`]: letterSpacing.length > 0,
    [`list-${listStyleType}`]: listStyleType.length > 0,
    [`list-${listStylePosition}`]: listStylePosition.length > 0,
    // [`text-${textColor}`]: textColor.length > 0,
    [`text-opacity-${textOpacity}`]: textOpacity.length > 0,
    [`${textDecoration}`]: textDecoration.length > 0,
    [`${textTransform}`]: textTransform.length > 0,
    [`${textOverflow}`]: textOverflow.length > 0,
    [`align-${verticalAlign}`]: verticalAlign.length > 0,
    [`whitespace-${whiteSpace}`]: whiteSpace.length > 0,
    [`break-${wordBreak}`]: wordBreak.length > 0,
  });
  if (tag === "span") {
    // console.log(
    //   ">>> current value of this ",
    //   tag === "span" && scale === true,
    //   tagClass
    // );
  }

  const toggleReadMore = () => {
    setReadMore((prev) => !prev);
    setReadMoreLessText((prev) => {
      return prev === "read more" ? "read less" : "read more";
    });
  };
  // console.log("readMoreLessText ::", readMoreLessText);
  text =
    readMore === true
      ? _.truncate(text, {
          length: truncateLenth,
          omission: "",
        })
      : text;
  return (
    <Tag className={tagClass}>
      {text}{" "}
      {truncate && (
        <span className="text-red-500" onClick={toggleReadMore}>
          {readMoreLessText}
        </span>
      )}
    </Tag>
  );
};

Text.propTypes = {
  tag: PropTypes.string,
  scale: PropTypes.bool,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  thickness: PropTypes.bool,
  alignment: PropTypes.string,
  fontweight: PropTypes.string,
  styles: PropTypes.string,
  truncate: PropTypes.bool,
  truncateLenth: PropTypes.number,
  readMoreLess: PropTypes.bool,
  fontFamily: PropTypes.string,
  fontSmoothing: PropTypes.string,
  letterSpacing: PropTypes.string,
  lineHeight: PropTypes.string,
  listStyleType: PropTypes.string,
  listStylePosition: PropTypes.string,
  textColor: PropTypes.string,
  textOpacity: PropTypes.number,
  textDecoration: PropTypes.string,
  textTransform: PropTypes.string,
  textOverflow: PropTypes.string,
  verticalAlign: PropTypes.string,
  whiteSpace: PropTypes.string,
  wordBreak: PropTypes.string,
  fontStyle: PropTypes.string,
};

export default Text;
