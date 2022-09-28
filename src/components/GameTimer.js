import React, { useEffect } from "react";
import Text from "../commonComponents/Text";
import PropTypes from "prop-types";
// import { useHistory } from "react-router-dom";
// import Image from "../commonComponents/Image";

function GameTimer({ gameIcon, text, lang }) {
  const [showModal, setShowModal] = React.useState(false);
  const [timer, setTimer] = React.useState(6);
  const id = React.useRef(null);
  const clear = () => {
    window.clearInterval(id.current);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setShowModal(true);
    }, 1000);
  }, []);

  React.useEffect(() => {
    console.log("------timer------>", timer);
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  }, []);

  React.useEffect(() => {
    if (timer === 0) {
      // console.log("------inside cleanup block------>")
      clear();
      setShowModal(false);
    }
  }, [timer]);

  // React.useEffect(() => {
  //   return () => {
  //     if (history.action === "POP") {
  //       console.log('-------browser back fired------->');
  //       setShowModal(false);
  //     }
  //   };
  // });

  // const [counter, setCounter] = React.useState(5);
  // React.useEffect(() => {
  //   console.log('------counter------>', counter);
  //   const timer =
  //     counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   return () => {
  //     console.log('------inside cleanup block------>');
  //     clearTimeout(timer);
  //     setShowModal(false);
  //   };
  //   // if (counter <= 0) {
  //   //   clearInterval(timer)
  //   //   // console.log(setShowModal);
  //   //   setShowModal(false);
  //   // }

  // }, [counter]);

  return (
    <>
      {showModal && (
        <>
          <div className="max-w-500px h-full m-auto justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            {/* <div className="overlay bg-black-100 left-0 right-0 opacity-25 fixed z-40 bg-black"></div> */}
            <div className="relative w-11/12 max-w-3xl max-h-80vh">
              {/*content*/}
              <div className="rounded-3xl shadow-lg w-full bg-matching-light outline-none focus:outline-none">
                {/*body*/}
                {/* <div> */}
                <div className="p-4 flex flex-col items-center w-full">
                  {/* <Image url={game_icon} styles="h-24 w-24 absolute -top-14" /> */}
                  <img src={gameIcon} className="h-24 w-24 absolute -top-14" />
                  {/* <Image url={gameIcon} styles="h-24 w-24 absolute -top-14" /> */}
                  <Text
                    tag="h2"
                    scale={true}
                    text={text.title[lang]}
                    fontweight="bold"
                    textColor={"text-white"}
                    alignment="center"
                    styles="mt-12 uppercase"
                  />
                  <br />
                  <br />
                  <div className="flex flex-col items-center justify-center relative">
                    <div className="relative flex items-center justify-center 2xs:h-32 2xs:w-32 h-44 w-44 bg-leaderboardfooterbg  border-8 border-timerBorder rounded-full 2xs:mt-1 2xs:mb-4 mt-8 mb-24">
                      <h1 className="text-white font-bold 2xs:text-6xl text-8xl text-center">
                        {timer}
                      </h1>
                      <div className="flex items-center justify-center absolute w-44 p-2 border border-secondsborder rounded-2xl bg-secondsbg text-white font-bold text-xl -bottom-5 uppercase">
                        <h1>{text.seconds[lang]}</h1>
                      </div>
                    </div>
                  </div>
                  <br />

                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}

GameTimer.propTypes = {
  gameIcon: PropTypes.string,
  text: PropTypes.object,
  lang: PropTypes.string,
};
export default GameTimer;
