import React from "react";
import PropTypes from "prop-types";

function AttributeCard({ property, value }) {
  console.log("AttributeCard data", property, value);
  return (
    <div className="mr-2 mb-2 px-3 py-2 bg-AttributeCard inline-block rounded">
      <span className="text-tournamentCardsButton font-bold text-sm">
        {property}:&nbsp;
      </span>
      <span className="text-white font-bold text-sm">{value}</span>
    </div>
  );
}

AttributeCard.propTypes = {
  property: PropTypes.string,
  value: PropTypes.string,
};

export default AttributeCard;
