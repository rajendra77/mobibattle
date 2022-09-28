import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import Matching from "../subComponents/Matching";
import { Context } from "../context/Context";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";


function MatchingModal({
  showModal,
  setShowModal,
  clearInterval,
  gameId,
  gameIcon,
  text,
  lang,
  userGif,
}) {
  const battle_icon = require("../assets/svg-icons/battle_icon.svg").default;
  const [matched, setMatched] = useState(false);
  const { currentGameData } = useContext(Context);
  const [timeLeft, setTimeLeft] = useState(0);
  const coin_icon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const tempObj = reactLocalStorage.getObject("tempObj");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {showModal && (
        <>
          <div className="max-w-500px m-auto justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            {/* <div className="overlay bg-black-100 left-0 right-0 opacity-25 fixed z-40 bg-black"></div> */}
            <div className="relative w-auto m-6 max-w-3xl">
              {/*content*/}
              {/* <div className="h-1/2 w-full absolute bottom-0 bg-black-50 rounded-t-full"></div> */}
              <div className="rounded-3xl shadow-lg w-full bg-matching-light outline-none focus:outline-none">
                {/*body*/}
                <div className="relative flex-auto text-center">
                  {!matched && (
                    <div
                      className="flex justify-center items-center absolute top-0 right-2 h-8 w-8 text-2xl text-white font-bold rounded-full leading-6 z-10 text-center cursor-pointer"
                      onClick={() => {
                        ReactGA.event({
                          category: "battleInfo_p",
                          action: `close matching modal button clicked - mobile - ${tempObj.number}, date - ${new Date()}`,
                        });
                        setShowModal(false)
                      }}
                    >
                      &times;
                    </div>
                  )}
                </div>
                {/* <div> */}
                <div className="2xs:py-4 2xs:px-0 p-4 flex flex-col items-center w-full">
                  {/* <Image url={game_icon} styles="h-24 w-24 absolute -top-14" /> */}
                  <img src={gameIcon} className="h-24 w-24 absolute -top-14" />
                  {/* <Image
                    url={gameIcon}
                    styles="h-24 w-24 absolute -top-14"
                    showPreloader={false}
                  /> */}
                  <div className="flex justify-center items-center p-1 bg-button-purple border-2 border-border-orange rounded-xl mb-4 mt-12">
                    <Image url={battle_icon} styles="h-12 w-12 mx-8" />

                    <div className="flex flex-col mr-8">
                      <Text
                        tag={
                          currentGameData.planType === "MOMO"
                            ? "h4"
                            : currentGameData.planType === "FREE"
                            ? "h2"
                            : "h1"
                        }
                        scale={true}
                        text={
                          currentGameData.planType === "MOMO"? text.battle[lang]:""
                          // currentGameData.planType === "FREE"? text.free[lang]: currentGameData.planType === "MOMO"? text.battle[lang]: timeLeft
                        }
                        fontweight="bold"
                        textColor={"text-white"}
                      />
                      <Text
                        tag={
                          currentGameData.planType === "MOMO"
                            ? "h1"
                            : currentGameData.planType === "FREE"
                            ? "h4"
                            : "h6"
                        }
                        scale={true}
                        text={
                          currentGameData.planType === "FREE" ? (
                            text.battle[lang]
                          ) : currentGameData.planType === "MOMO" ? (
                            <div className="flex items-center">
                              <Image url={coin_icon} styles="w-6 h-6 mr-1" />
                              {currentGameData.price}
                            </div>
                          ) : (
                            text.sec[lang]
                          )
                        }
                        fontweight="bold"
                        textColor={
                          currentGameData.planType === "LEADERBOARD"
                            ? "text-lightPurple"
                            : "text-white"
                        }
                      />
                    </div>
                  </div>
                  <Matching
                    id={gameId}
                    clearIntervalId={clearInterval}
                    setShowModal={setShowModal}
                    matched={matched}
                    setMatched={setMatched}
                    setTimeLeft={setTimeLeft}
                    text={text}
                    lang={lang}
                    userGif={userGif}
                  />
                  <Text
                    tag="h6"
                    scale={true}
                    text={text.tip[lang]}
                    fontweight="bold"
                    textColor={"text-white"}
                    alignment="center"
                  />
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

MatchingModal.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  clearInterval: PropTypes.func,
  gameId: PropTypes.string,
  gameIcon: PropTypes.string,
  text: PropTypes.object,
  lang: PropTypes.string,
  userGif: PropTypes.string,
};

export default MatchingModal;
