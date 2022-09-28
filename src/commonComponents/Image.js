/**
 * Image component
 * By default : image takes full height and width of parent container
 * To set a fixed height/width, pass required Tailwind CSS classes in the 'styles' param
 * Image always fills entire parent container while maintaining its aspect ratio (object-fit : cover)
 * @property {String} styles Optional | Contains all the required Tailwind CSS classes (eg. "rounded-full h-32 w-32")
 * @property {string} url The url of the image
 */

import React, { useState, useEffect } from "react";
import "../App.scss";
import PropTypes from "prop-types";
import cx from "classnames";
function Image({
  url = "",
  styles = "",
  classImg = "",
  heightAspect = 1,
  widthAspect = 1,
  showPreloader = true,
  objectCover = true,
  objectContain = false,
  width = "",
  height = "",
  hFull = "full",
  wFull = "full",
  
  handleClick = () => {},
}) {
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState("");

  /**
   * Check if image is loaded or not (to control the display of the preloading animation)
   */
  const imageLoaded = () => {
    setLoading(false);
  };

  /**
   * Display placeholder image if image url is unavailable..
   */
  const thumbUrl = require("../assets/svg-icons/placeholder.svg").default;
  useEffect(() => {
    if (url && url.length > 0) {
      setImgUrl(url);
    } else {
      setImgUrl(thumbUrl);
    }
  }, [url]);

  let divClass = cx(styles, {
    "z-5": true,
    "overflow-hidden": true,
    [`aspect-w-${widthAspect}`]: widthAspect > 1,
    [`aspect-h-${heightAspect}`]: heightAspect > 1,
  });
  let imgClass = cx({
    "object-cover": objectCover,
    "object-contain": objectContain,
    "h-full": hFull,
    "w-full": wFull,
  });

  return (
    <div className={divClass}>
      {loading && showPreloader && (
        <div
          id="preloader"
          className={`${imgClass} animate-pulse-custom bg-white ${classImg}`}
        ></div>
      )}
      <img
        onLoad={imageLoaded}
        className={`${imgClass} optimize-contrast`}
        src={imgUrl}
        onClick={() => handleClick()}
        alt=""
        style={{ textIndent: "-500px", width : width,  height:height}}
  
      ></img>
    </div>
  );
}

Image.propTypes = {
  url: PropTypes.string,
  styles: PropTypes.string,
  classImg: PropTypes.string,
  heightAspect: PropTypes.number,
  widthAspect: PropTypes.number,
  handleClick: PropTypes.func,
  showPreloader: PropTypes.bool,
  objectCover: PropTypes.bool,
  objectContain: PropTypes.bool,
  width : PropTypes.string,
  height : PropTypes.string,
  hFull : PropTypes.string,
  wFull : PropTypes.string
};

export default Image;
