import React from "react";
import PropTypes from "prop-types";
import Text from "../commonComponents/Text";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Title({
  title,
  titleTag,
  subtitle,
  subTitleColor,
  textOpacity,
  showLock,
}) {
  return (
    <div className="px-3">
      <Text
        tag={titleTag}
        scale={true}
        styles="pt-8 text-white"
        text={title}
        fontweight="bold"
        alignment="center"
      />

      <div className="flex justify-center items-center pt-2">
        {showLock && (
          <FontAwesomeIcon icon={faLock} className="text-lightPurple" />
        )}
        <Text
          tag="h6"
          scale={true}
          styles={`mb-3 ml-2 text-${subTitleColor}`}
          text={subtitle}
          fontweight="normal"
          alignment="center"
          textOpacity={textOpacity}
        />
      </div>
    </div>
  );
}

Title.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  titleTag: PropTypes.string,
  subtitle: PropTypes.string,
  subTitleColor: PropTypes.string,
  textOpacity: PropTypes.string,
  showLock: PropTypes.bool,
};

export default Title;
