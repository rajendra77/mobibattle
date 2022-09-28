import React, { useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.scss";
import LandingScreenCard from "../subComponents/LandingScreenCard";
import PropTypes from "prop-types";

function SliderLandingPage({ data }) {
  const slider = useRef(null)
  const settings = {
    arrows: false,
    dots: true,
    fade: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    swipe: true,
    autoplay: true,
    speed: 200,
    autoplaySpeed: 1500,
    cssEase: "linear",
    // eslint-disable-next-line react/display-name
    customPaging: () => <div className="dot-outer"><div className="dot"></div></div>,
    onSwipe: () => slider.current.slickPause()
  };
  return (
    <Slider ref={slider} {...settings}>
      {data && data.length > 0 && <LandingScreenCard data={data[0]} />}
      {data && data.length > 0 && <LandingScreenCard data={data[1]} />}
      {data && data.length > 0 && <LandingScreenCard data={data[2]} />}
    </Slider>
  );
}

SliderLandingPage.propTypes = {
  data: PropTypes.array,
};

export default SliderLandingPage;
