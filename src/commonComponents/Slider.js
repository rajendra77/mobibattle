/**
 * Slider component props :
 * @property {object} sliderConfig Object containing Configuration for the react-multi-carousel slider
 * @property {Array} data Array of slider items data
 * @property {component} sliderItem Compoennt to render individual slider item
 */

import React from "react";
import PropTypes from "prop-types";
import "./Slider.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";

function Slider({
  sliderConfig: {
    responsiveBreakpoints = {},
    centerMode = false,
    partialVisible = false,
    showDots = false,
    autoPlay = false,
    arrows = false,
    autoPlaySpeed = "2000",
    infinite = false,
  },
  gameCategory = "",
  handleClick,
  category,
  ...props
}) {
  const { data, sliderItem, text, lang } = props;

  let slider = "";
  if (data && data.length > 0) {
    const SliderItem = sliderItem;

    slider = data.map((item, i) => (
      <SliderItem
        data={item}
        key={i}
        gameCategory={gameCategory}
        handleClick={handleClick}
        category={category}
        text={text}
        lang={lang}
      />
    ));
  }

  return (
    <Carousel
      responsive={responsiveBreakpoints}
      swipeable={true}
      partialVisible={partialVisible}
      showDots={showDots}
      autoPlay={autoPlay}
      arrows={arrows}
      autoPlaySpeed={autoPlaySpeed}
      centerMode={centerMode}
      infinite={infinite}
      draggable={false}
      keyBoardControl={true}
      minimumTouchDrag={0}
    >
      {slider}
    </Carousel>
  );
}

Slider.propTypes = {
  data: PropTypes.any,
  sliderConfig: PropTypes.shape({
    responsiveBreakpoints: PropTypes.object,
    centerMode: PropTypes.bool,
    partialVisible: PropTypes.bool,
    showDots: PropTypes.bool,
    autoPlay: PropTypes.bool,
    arrows: PropTypes.bool,
    autoPlaySpeed: PropTypes.number,
    infinite: PropTypes.bool,
    draggable: PropTypes.bool,
    swipeable: PropTypes.bool,
  }),
  gameCategory: PropTypes.string,
  handleClick: PropTypes.func,
  category: PropTypes.string,
  sliderItem: PropTypes.func,
  text: PropTypes.object,
  lang: PropTypes.string,
};

export default Slider;
