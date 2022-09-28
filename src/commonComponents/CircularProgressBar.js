import React from "react";
import PropTypes from "prop-types";
import Text from "./Text";

const CircularProgressBar = ({
  sqSize = 100, // Size of the enclosing square
  strokeWidth = 5,
  percentage = 25,
  totalTime,
  bottomText,
}) => {
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * percentage) / totalTime;

  return (
    <div className="pt-2 flex flex-col items-center justify-center">
      <svg
        className="pr-2 pl-2"
        width={sqSize}
        height={sqSize}
        viewBox={viewBox}
      >
        <circle
          className="circle-background bg-register-purple"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className="circle-progress"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
        <text
          className="circle-text"
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
        >
          {`${percentage}`}
        </text>
      </svg>
      <Text tag="p" text={bottomText} styles="font-bold text-white" />
    </div>
  );
};

CircularProgressBar.propTypes = {
  sqSize: PropTypes.string,
  percentage: PropTypes.number,
  totalTime: PropTypes.string,
  strokeWidth: PropTypes.string,
  bottomText: PropTypes.string,
};

export default CircularProgressBar;
