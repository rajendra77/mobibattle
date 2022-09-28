import React from "react";
import PropTypes from "prop-types";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";

function NoTournament({ title, subtitle }) {
  const icon = require("../assets/error_icons/server-error.svg").default;

  return (
    <div className="bg-primary flex flex-col justify-center items-center p-8">
      <Image url={icon} styles="w-48 h-48 mb-6" />
      <Text
        tag="h2"
        text={title}
        textTransform="capitalize"
        textColor="text-orange"
        fontweight="bold"
      />
      <Text
        tag="h5"
        text={subtitle}
        textTransform="capitalize"
        textColor="text-white"
        styles="my-4 text-center"
        fontweight="bold"
      />
    </div>
  );
}

NoTournament.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default NoTournament;
