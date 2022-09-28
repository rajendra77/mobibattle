import React, { useRef, useEffect, useState, useContext } from "react";
import "./SingleGame.scss";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "../context/Context";
import { useCustomEventListener } from "react-custom-events";
import BattleResultHooks from "../network/BattleResultHooks";
import _ from "lodash";
import {logEvent} from '../Analytics/AnalyticsEvent';
import {screen, events} from '../Analytics/EventName';
import { Base64 } from "js-base64";


import UserScore from "../commonComponents/UserScore";
import {
  scoreUpdate,
  endBattle,
  updateScoreB,
  endData,
  cleanData,
  startBattle,
} from "../myhooks/SocketManagerIO";
import SocketEvent from "../myhooks/SocketEvent";
import GameTimer from "./GameTimer";
import { SingleGameText as text } from "../Database/Text";
import ReactGA from "react-ga";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import { SendGuiDataEvents } from "../commonScript";

function SingleGame() {
  // console.log("------singlegame.js------->", crownImage);
  const iframe = useRef(null);
  const { gameList, trendingList, bannerList } =
    reactLocalStorage.getObject("homedata");
  const userProfile = reactLocalStorage.getObject("userProfile");
  const aPartyName = userProfile.name;
  const aImage = userProfile.avatarUrl;
  const [bPartyName, setBpartyName] = useState("");
  const [bImage, setBimage] = useState("");
  const { GameInit, socketDisconnect } = SocketEvent();
  const gameIcon = reactLocalStorage.getObject("gameIcon");
  const tempObj = reactLocalStorage.getObject("tempObj");
  const [loader, showLoader] = useState(true);
  const { pathname } = useLocation();
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = userName === "Guest" ? 1 : 0;
  const {
    endGameResult,
    battleData,
    updateBattle,
    handleShowModal,
    currentGameData,
    getLanguage,
    updateMyScore,
    oppOutResult,
    oppOutStatus,
  } = useContext(Context);
  console.log("Battle data in single game --- ", battleData);
  console.log("currentGameData --- ", currentGameData);
  // const [gameURL, setGameURL] = useState("");
  const [oppGameEnd, setOppGameEnd] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [score, setScore] = useState(0);
  const [lang, setLang] = useState("");
  let { category, id } = useParams();
  category  = Base64.decode(category);
  id  = Base64.decode(id);
  console.log("category, id ::", category, id);
  //const catobj = categoryList.filter((item) => item.type === category)[0];
  const history = useHistory();
  console.log("height::", height);
  console.log("width::", width);

  const gamesArray = [...gameList, ...trendingList];
  // const gamesArray = [...gameList, ...trendingList, ...bannerList];
  const game = gamesArray.filter((game) => game.gameId == id)[0];
  console.log("my game object data ::", game);
  console.log("my gameLink ::", game.gameLink);
  const [bPartyScore, setBPartyScore] = useState(0);
  const { scoreReq } = BattleResultHooks();
  const exitMatchIcon =
    require("../assets/modal-icons/leave_exit_match.svg").default;
  // const [counter, setCounter] = React.useState(5);
  // React.useEffect(() => {
  //   const timer =
  //     counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   return () => clearInterval(timer);
  // }, [counter]);
  // console.log('-----counter------->', counter);

  useEffect(() => {
    setTimeout(() => showLoader(false), 1000);
  }, []);

  useEffect(() => {
    setLang(getLanguage());
    setHeight(window.innerHeight);
    setWidth(window.innerWidth > 500 ? 500 : window.innerWidth);
    const mygameURL = game.name.toLowerCase().split(" ").join("-");
    let guiDataEvent = {};
    guiDataEvent["page"] = "casual_game_" + id;
    guiDataEvent["event"] = "open";
    SendGuiDataEvents(guiDataEvent);
  }, []);

  useEffect(() => {
    setBpartyName(battleData.name);
    setBimage(battleData.img);
  }, [battleData]);

  useEffect(() => {
    if (category === "battle") {
      scoreUpdate((err, data) => {
        if (err) return;
        setBPartyScore((prev) => {
          return data && _.has(data, "score") && data.score != 0
            ? data.score
            : prev;
        });
      });
    }
  });

  useCustomEventListener("scoreUp", (currentScore) => {
    console.log("SINGLE GAME FILE :: SCORE UPDATE EVENT ::: ", currentScore);
    setBPartyScore((prev) => {
      return currentScore &&
        _.has(currentScore, "score") &&
        currentScore.score !== 0
        ? currentScore.score
        : prev;
    });
  });

  useCustomEventListener("oppOut", (data) => {
    console.log("::: SINGLE GAME __ OPP OUT EVENT --- ", data);
    setOppGameEnd(true);
    oppOutStatus(true);
    oppOutResult(data);
  });

  useCustomEventListener("endGameData", (endData) => {
    console.log(">>> end game event recieved2 :::", endData);
    const myBattle = {
      ...battleData,
      score: endData.score,
    };
    endBattle(myBattle);
    endGameResult({ gameId: game.gameId, score: endData.score });
    updateBattle(battleData);
    history.push(`/gameresult?category=${category}&id=${game.gameId}`);
  });

  useEffect(() => {
    const unblock = history.block((location, action) => {
      console.log("-----step 1----->", location, action);
      if (action === "POP") {
        logEvent(
          {
            screen: screen.game_p,
            event: events.backButton,
          },
          {
            title: "back button clicked",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
          }
        );
        console.log("-----step 2----->", action);
        const bodyText =
          currentGameData.planType === "MOMO"
            ? text.leaveGameModal.bodyMomo[lang]
            : text.leaveGameModal.bodyFree[lang];
        const modalData = {
          title: text.leaveGameModal.title[lang],
          body: bodyText,
          icon: exitMatchIcon,
          buttons: [
            {
              label: text.leaveGameModal.leaveButton[lang],
              action: "leave",
              buttonColor: "bg-lightPurple",
              textColor: "text-white",
            },
            {
              label: text.leaveGameModal.keepPlayingButton[lang],
              action: "close",
              buttonColor: "bg-tabsColor",
              textColor: "text-white",
            },
          ],
          handleClick: function (button) {
            if (button === "leave") {
              logEvent(
                {
                  screen: screen.game_p,
                  event: events.leaveGame,
                },
                {
                  title: "leave game button clicked",
                  date: new Date(),
                  code: tempObj.code,
                  mobile: tempObj.number,
                  others: {
                    game_name: game.gameName,
                    game_id: battleData.gameId,
                    battle_id: battleData.battleId,
                    a_party: battleData.aparty,
                    b_party: battleData.bparty,
                  },
                }
              );
              handleShowModal(false);
              const myBattle = {
                ...battleData,
                score: 0,
              };
              endBattle(myBattle);
              cleanData();
              socketDisconnect(id);
              history.push(`/battleinfo?id=${Base64.encode(id)}`);
            } else {
              logEvent(
                {
                  screen: screen.game_p,
                  event: events.keepPlaying,
                },
                {
                  title: "keep playing game button clicked",
                  date: new Date(),
                  code: tempObj.code,
                  mobile: tempObj.number,
                  others: {
                    game_name: game.gameName,
                    game_id: battleData.gameId,
                    battle_id: battleData.battleId,
                    a_party: battleData.aparty,
                    b_party: battleData.bparty,
                  },
                }
              );
              handleShowModal(false);
            }
          },
        };
        handleShowModal(true, modalData);
        return false;
      }
      return true;
    });

    return () => {
      unblock();
    };
  });

  function listenData(e) {
    console.log(
      " :: Listen data function called ----- ",
      category,
      e.data.type
    );
    if (e.data.type === "gameStart") {
      console.log("----------game start event------>", e.data.type);
      logEvent(
        {
          screen: screen.game_p,
          event: events.gameStart,
        },
        {
          title: "game starts",
          date: new Date(),
          code: tempObj.code,
          mobile: tempObj.number,
          others: {
            game_name: game.name,
            game_id: battleData.gameId,
            battle_id: battleData.battleId,
            a_party: battleData.aparty,
            b_party: battleData.bparty,
          },
        }
      );
      let guiDataEvent = {};
      guiDataEvent["page"] = "casual_game";
      guiDataEvent["event"] = "game_start";
      guiDataEvent["game_id"] = battleData.gameId;
      guiDataEvent["game_name"] = game.name;
      SendGuiDataEvents(guiDataEvent);
      startBattle(battleData);
    } else if (e.data.type === "score") {
      if (guest === 1) {
        updateMyScore(e.data.body.score);
      }
      console.log("CATEGORY ___ LINE 89 ", category);
      if (category === "battle") {
        console.log("------body------>", e.data.body);
        setScore(e.data.body.score);
        const userData = {
          ...battleData,
          score: e.data.body.score,
        };
        updateScoreB(userData);
        scoreUpdate((err, scoreUpdateData) => {
          if (err) return;
          setBPartyScore((prev) => {
            return scoreUpdateData &&
              _.has(scoreUpdateData, "score") &&
              scoreUpdateData.score != 0
              ? scoreUpdateData.score
              : prev;
          });
        });
      } else {
        setScore(e.data.body.score);
      }
    } else if (e.data.type === "gameOver") {
      logEvent(
        {
          screen: screen.game_p,
          event: events.gameEnd,
        },
        {
          title: "game over",
          date: new Date(),
          code: tempObj.code,
          mobile: tempObj.number,
          others: {
            game_name: game.name,
            game_id: battleData.gameId,
            battle_id: battleData.battleId,
            a_party: battleData.aparty,
            b_party: battleData.bparty,
          },
        }
      );

      if (category === "battle") {
        const myBattle = {
          ...battleData,
          score: e.data.body.score,
        };
        endData((err, endGameData) => {
          console.log("----endGameData----->", endGameData, battleData);
          if (err) return;
          const { isEnd } = endGameData;
          battleData.isEnd = isEnd;
          if (endGameData.isEnd === 1) {
            console.log("Socket disconnet called 1");
            // cleanData();
            socketDisconnect(id);
          }
        });

        endBattle(myBattle);
        endGameResult({ gameId: game.gameId, score: e.data.body.score });
        updateBattle(battleData);
        updateMyScore(e.data.body.score);
        history.push(`/gameresult?category=${Base64.encode(category)}&id=${Base64.encode(game.gameId)}`);
      } else {
        // for solo game
        endGameResult({ gameId: game.gameId, score: score });
        updateMyScore(e.data.body.score);
        console.log("score------>", score);
        scoreReq(game.gameId, score, category)
          .then(() => {
            history.push(`/gameresult?category=${Base64.encode(category)}&id=${Base64.encode(game.gameId)}`);
          })
          .catch((err) => console.log("SCORE REQ API ERROR ", err));
      }
    } else if (e.data.type === "gameRestart") {
      setScore(0);
    }
  }

  useEffect(() => {
    if (category === "battle" && _.isEmpty(battleData) === true) {
      console.log("Socket disconnet called 2");
      cleanData();
      socketDisconnect(id);
      history.push(`/home`);
    } else {
      window.addEventListener("message", listenData);
    }
    return () => window.removeEventListener("message", listenData);
  }, [score, bPartyScore]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      battleData.score = 0;
      if (category === "battle" && history.action === "POP") {
        endBattle(battleData);
        console.log("Socket disconnet called 3");
        cleanData();
        socketDisconnect(id);
      }
    };
  }, []);

  // opponentOut((err, data) => {
  //   console.log("Opponent out data ::: ", err, data);
  // });

  const gameStyle = {
    height: height,
    width: width,
  };

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <>
      {loader && <Loader />}
      <div className={loaderClass}>
        <div className="absolute z-20">
          {gameIcon && (
            <GameTimer gameIcon={gameIcon} text={text.gameTimer} lang={lang} />
          )}
        </div>

        <section className="hero is-fullheight pl-0 pr-0 pt-0">
          <UserScore
            category={category}
            aScore={score}
            bScore={bPartyScore}
            aName={aPartyName}
            bName={bPartyName}
            aImage={aImage}
            bImage={bImage}
            oppGameEnd={oppGameEnd}
          />

          <div className="iframe-holder min-w-screen">
            {game ? (
              <iframe
                ref={iframe}
                src={game.gameLink}
                title="game page"
                onLoad={() => GameInit(iframe, game.name)}
                // onLoad={() => GameInit(iframe, game.gameName)}
                scrolling="no"
                frameBorder="0"
                style={gameStyle}
              ></iframe>
            ) : (
              <p className="has-text-white mt-100 has-text-centered">
                {text.gameDoesNotExist[lang]}
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
export default React.memo(SingleGame);
