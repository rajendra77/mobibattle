import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
import queryString from "query-string";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import MatchingModal from "../subComponents/MatchingModal";
import PrizesSliderItem from "../subComponents/PrizesSliderItem";
import home from "../Database/home";
import useGameDetails from "../network/useGameDetails";
import useProceedToPay from "../network/useProceedToPay";
import { findBattle } from "../myhooks/SocketManagerIO";
import { Context } from "../context/Context";
import RedirectHook from "../myhooks/RedirectHook";
import SocketEvent from "../myhooks/SocketEvent";
import useSubscribe from "../network/useSubscribe";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import ApiNotFound from "./ApiNotFound";
import { BattleInfoPageText as text } from "../Database/Text";
import "../App.scss";
import CacheImage from "../commonComponents/CacheImage";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { cleanData } from "../myhooks/SocketManagerIO";
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';


function BattleInfo() {
  console.log("-----battleInfo----->");
  const user = reactLocalStorage.getObject("userProfile");
  const avatarUrl = user.avatarUrl;
  const { homeBack } = RedirectHook();
  const history = useHistory();
  let { search, pathname } = useLocation();
  let { id } = queryString.parse(search);
  id = Base64.decode(id);
  const [showModal, setShowModal] = useState(false);
  const { socketDisconnect } = SocketEvent();
  const { checkSubscription } = useSubscribe();
  const [modalData, setModalData] = useState({});
  const [gameDetails, setGameDetails] = useState({});
  const [balance, setBalance] = useState();
  const [options, setOptions] = useState({ packs: [], subPacks: [] });
  const [apiFailed, setApiFailed] = useState(false);
  const { getGameDetails } = useGameDetails();
  const { blockBalance, getBalanceData } = useProceedToPay();
  const [loader, showLoader] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [lang, setLang] = useState("en");
  const [tempObj, setTempObj] = useState("");
  const [disabled, setDisabled] = useState(false);
  const videoRef = useRef(null);
  const mobNum = reactLocalStorage.getObject("tempObj").number;
  const { battleCatId, saveCurrentGame, handleShowModal, getLanguage, oppOutStatus, oppOutResult, updateBattle } =
    useContext(Context);
  const userData = {
    id: user.uniqueId,
    gameId: Number(id),
    name: user.name,
  };
  const back_icon = require("../assets/svg-icons/back_button.svg").default;
  const rules_icon = require("../assets/svg-icons/rules_button.svg").default;
  const userGif = require("../assets/mtncongo/avatar.gif").default;
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = userName === "Guest" ? 1 : 0;

  useEffect(() => {
     //send gui events
     let guiDataEvent = {}
     guiDataEvent['page'] = 'casual_game';
     guiDataEvent['event'] = 'open';
     SendGuiDataEvents(guiDataEvent);

    window.scrollTo(0, 0);
    const lang = getLanguage();
    setLang(lang);
    setTempObj(reactLocalStorage.getObject("tempObj"));
   
  }, []);

  useEffect(() => {
    oppOutStatus(false);
      oppOutResult({});
      cleanData();
      updateBattle({});
    window.onbeforeunload = function () {
      console.log("page reload::");
      socketDisconnect(id);
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (history.action === "POP") {
        console.log("-------browser back fired------->");
        logEvent(
          {
            screen: screen.gameDetails_p,
            event: events.backButton,
          },
          {
            title: "back button clicked",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
          }
        );
        history.push("/home");
      }
    };
  });

  useEffect(() => {
    guest === 0 && checkSubscription()
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          setSubscribed(true);
        } else if (res.status.toUpperCase() === "FAILURE" || res.status.toUpperCase() === "PENDING") {
          setSubscribed(false);
          getBalanceData()
            .then((res) => {
              console.log(res);
              guest === 0
                ? setBalance(res.main_balance)
                : setBalance(0);
            })
            .catch((err) => {
              console.log(">>>>> GET BALANCE API ERROR >>>>>", err);
            });
        }
      })
      .catch((err) => {
        console.log("------err------>", err);
        setSubscribed(false);
      });
  }, []);

  useEffect(() => {
    getGameDetails(id)
      .then((data) => {
        if (data.status.toUpperCase() === "SUCCESS") {
          console.log("-----data----->", data);
          const reason = data.reason ? data.reason : "null";
          logEvent(
            {
              screen: screen.gameDetails_p,
              event: events.apiSuccess,
            },
            {
              title: "game details request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: mobNum,
              others: {
                game_id: id,
                resStatus: data.status,
                resReason: reason,
              },
            }
          );

          showLoader(false);
          setGameDetails(data.gameDetails);
          data.gameDetails &&
            reactLocalStorage.setObject("gameIcon", data.gameDetails.gameIcon);
          const { packs, subPacks } = data;
          setOptions(() => ({
            packs: packs != null ? packs : [],
            subPacks: subPacks != null ? subPacks : [],
          }));
          setModalData(home.matchingModal.searching);
        } else {
          logEvent(
            {
              screen: screen.gameDetails_p,
              event: events.apiFailure,
            },
            {
              title: "getHomeData request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                game_id: id,
                resStatus: data.status,
                resReason: data.reason,
              },
            }
          );
        }
      })
      .catch((err) => {
        let errObj;
        const msg = err.message;
        if (msg === "Failed to fetch") {
          errObj = `${msg} due to internet disconnected, statusCode: 503`;
        } else {
          errObj = err;
        }
        logEvent(
          {
            screen: screen.gameDetails_p,
            event: events.apiFailure,
          },
          {
            title: "game details request failed",
            date: new Date(),
            code: tempObj.code,
            mobile: mobNum,
            others: {
              game_id: id,
              err: errObj,
            },
          }
        );
        console.log("game details request failed ::: ", err);
        showLoader(false);
        setApiFailed(true);
      });
  }, []);

  useEffect(() => {
    if (showModal === false) {
      // console.log(">>> Step 1 : Socket is disconnected ::", showModal);
      // cleanData();
      socketDisconnect(id);
    }
  }, [showModal]);

  useEffect(() => {
    const videoInstance = videoRef.current;
    // console.log("VIDEO :: ", videoInstance);
    return () => {
      console.log("WINDOW BEFORE UNLOAD");
      // console.log("VIDEO 2 :: ", videoInstance);
      if (videoInstance) {
        console.log("if condition :: ", videoInstance.pause);
        videoInstance.pause();
        videoInstance.onpause = function () {
          console.log("The video has been paused");
        };
      }
    };
  }, []);

  function handleClick(button) {
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'casual_game';
    guiDataEvent['event'] = 'play_click';
    guiDataEvent['game_id'] = id;
    guiDataEvent['game_name'] =gameDetails.gameName
    SendGuiDataEvents(guiDataEvent);

    setDisabled(true)
    const startMatching = () => {
      battleCatId({ type: "battle", id });
      if (_.isEmpty(userData) === false) {
        findBattle(
          userData,
          _.lowerCase(button.planType),
          button.pack.price,
          "none",
          avatarUrl
        );
      }
      saveCurrentGame(button.pack);
      setShowModal(true);
    };

    if (button.planType === "FREE") {
      if (guest === 0) {
        blockBalance(gameDetails.gameId, 0)
          .then((res) => {
            console.log(res);
            setDisabled(false)
            if (res.statusCode === 1001) {
              const reason = res.reason ? res.reason : "null";
              logEvent(
                {
                  screen: screen.gameDetails_p,
                  event: events.playGameApiSuccess,
                },
                {
                  title: "play game request successfull",
                  date: new Date(),
                  code: tempObj.code,
                  mobile: tempObj.number,
                  others: {
                    game_name: gameDetails.gameName,
                    game_id: id,
                    amount: button.pack.price,
                    resStatus: res.status,
                    resReason: reason,
                  },
                }
              );

              startMatching();
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        startMatching();
      }

    } else if (button.planType === "MOMO") {
      console.log("----- MOMO CARD CLICKED ----- ");

      blockBalance(gameDetails.gameId, button.pack.price)
        .then((res) => {
          console.log(res);
          setDisabled(false)
          if (res.statusCode === 1001) {
            console.log("----- BLOCK BALANCE RESPONSE ----- ", res);
            const reason = res.reason ? res.reason : "null";
            logEvent(
              {
                screen: screen.gameDetails_p,
                event: events.playGameApiSuccess,
              },
              {
                title: "play game request successfull",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  game_name: gameDetails.gameName,
                  game_id: id,
                  amount: button.pack.price,
                  resStatus: res.status,
                  resReason: reason,
                },
              }
            );
            startMatching();
          } else {
            setDisabled(false)
            console.log("play game api failed");
            logEvent(
              {
                screen: screen.gameDetails_p,
                event: events.playGameApiFailure,
              },
              {
                title: "play game request failure",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  game_name: gameDetails.gameName,
                  game_id: id,
                  amount: button.pack.price,
                  resStatus: res.status,
                  resReason: res.response_message,
                },
              }
            );
          }
        })
        .catch((err) => {
          setDisabled(false)
          let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`;
          } else {
            errObj = err;
          }
          console.log("----err---->", err);
          logEvent(
            {
              screen: screen.gameDetails_p,
              event: events.playGameApiFailure,
            },
            {
              title: "play game request failure",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                game_name: gameDetails.gameName,
                game_id: id,
                amount: button.pack.price,
                err: errObj,
              },
            }
          );
          setApiFailed(true);
        });
    } 
    else {
      console.log("----- SUBSCRIPTION CARD CLICKED 123----- ");
      logEvent(
        {
          screen: screen.gameDetails_p,
          event: events.premiumClicked,
        },
        {
          title: "premium card clicked",
          date: new Date(),
          code: tempObj.code,
          mobile: tempObj.number,
          others: {
            game_name: gameDetails.gameName,
            game_id: id,
          },
        }
      );
      startMatching();
    }
  }

  function handleModalClick(button) {
    if (button === "close") {
      // console.log("Stop searching...");
      setShowModal(false);
    }
  }

  const getGameRules = () => {
    if (id == 7) {
      return text.gameRules.game1[lang];
    } else if (id == 10) {
      return text.gameRules.game2[lang];
    } else if (id == 2) {
      return text.gameRules.game3[lang];
    } else {
      return text.gameRules.defaultRule[lang];
    }
  };

  const imageClick = () => {
    const rulesModalData = {
      title: text.rules[lang],
      body: getGameRules(),
      description: text.gameRules.bottomText[lang],
      buttons: [
        {
          label: text.okay[lang],
          action: "okay",
          buttonColor: "bg-tabsColor",
          textColor: "text-white",
        },
      ],
    };
    handleShowModal(true, rulesModalData);
  };

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  if (apiFailed) {
    return <ApiNotFound />;
  }

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  // We listen to the resize event
  window.addEventListener("resize", () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  return (
    <div className="module">
      {loader && <Loader />}
      <div className={loaderClass}>
        <CacheImage
          img={require("../assets/svg-icons/ezgif-7-063c6560d981.gif").default}
        />
        <MatchingModal
          showModal={showModal}
          setShowModal={setShowModal}
          data={modalData}
          action={"close"}
          handleClick={handleModalClick}
          clearInterval={clearInterval}
          gameId={id}
          gameIcon={gameDetails && gameDetails.gameIcon}
          text={{
            ...text.matchingModal,
            playersBusyModal: text.playersBusyModal,
          }}
          lang={lang}
          userGif={userGif}
        />

        <div className="flex justify-between items-center px-4 my-2">
          <div className="flex flex-col items-center">
            <Image
              url={back_icon}
              styles={"h-12 w-12 mb-1 rounded-full"}
              handleClick={() => {
                logEvent(
                  {
                    screen: screen.gameDetails_p,
                    event: events.backButton,
                  },
                  {
                    title: "back button clicked",
                    date: new Date(),
                    code: tempObj.code,
                    mobile: tempObj.number,
                    others: {
                      game_name: gameDetails.gameName,
                      game_id: id,
                    },
                  }
                );

                console.log("UI back button...");
                homeBack();
                // historyBack();
              }}
            />
            <Text
              tag="span"
              text={text.back[lang]}
              textColor="text-lightPurple"
              styles="font-bold"
            />
          </div>
          {/* <Image url={game_icon} /> */}
          <Image url={gameDetails && gameDetails.gameIcon} styles="h-20 w-20" />
          <div className="flex flex-col items-center">
            <Image
              url={rules_icon}
              styles={"h-12 w-12 mb-1 rounded-full"}
              handleClick={() => {
                logEvent(
                  {
                    screen: screen.gameDetails_p,
                    event: events.gameRules,
                  },
                  {
                    title: "game rules clicked",
                    date: new Date(),
                    code: tempObj.code,
                    mobile: tempObj.number,
                    others: {
                      game_name: gameDetails.gameName,
                      game_id: id,
                    },
                  }
                );
                imageClick();
              }}
            />
            <Text
              tag="span"
              text={text.rules[lang]}
              textColor="text-lightPurple"
              styles="font-bold"
            />
          </div>
        </div>
        {_.has(gameDetails, "video") && (
          // <LazyLoad>
          <video
            id="video"
            ref={videoRef}
            className="w-full h-60 xs:h-60 1xs:h-52 2xs:h-48 mb-1 mt-1"
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            src={gameDetails.video}
            type="video/mp4"
            height="240"
          >
            This video is not available.
          </video>
          // </LazyLoad>
        )}

        <div className="px-2">
          {_.has(options, "packs") && options.packs.length > 0 && (
            <PrizesSliderItem
              data={options.packs}
              handleClick={handleClick}
              activeCategory={activeCategory}
              setActiveCategory={(data) => setActiveCategory(data)}
              subscribed={subscribed}
              subPack={() => {
                for (let i = 0; i < options.packs.length; i++) {
                  if (options.packs[i].planType === "LEADERBOARD") {
                    return options.packs[i];
                  }
                }
              }}
              text={text}
              lang={lang}
              balance={balance}
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BattleInfo;
