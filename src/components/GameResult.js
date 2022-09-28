import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import Image from "../commonComponents/Image";
import UserProfileData from "../Database/UserProfileData";
import Text from "../commonComponents/Text";
import { Context } from "../context/Context";
import BattleResultHooks from "../network/BattleResultHooks";
import { useCustomEventListener } from "react-custom-events";
import _ from "lodash";
import useGameDetails from "../network/useGameDetails";
import { reactLocalStorage } from "reactjs-localstorage";
import ScoreCard from "../subComponents/ScoreCard";
import SocketEvent from "../myhooks/SocketEvent";
import RedirectHook from "../myhooks/RedirectHook";
import { cleanData } from "../myhooks/SocketManagerIO";
import FreeGameResult from "../subComponents/FreeGameResult";
import LeaderboardGameResult from "../subComponents/LeaderboardGameResult";
import MomoGameResult from "../subComponents/MomoGameResult";
import { GameResultText as text } from "../Database/Text";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import "../App.scss";
// import ReactGA from "react-ga";
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';

function GameResult() {
  const [gameDetails, setGameDetails] = useState({ img: {} });
  const [subPacks, setSubPacks] = useState([]);
  const [resultData, setResultData] = useState({});
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitle2, setSubtitle2] = useState("");
  const [bPartyName, setBPartyName] = useState("");
  const [bPartyScore, setBPartyScore] = useState(0);
  const [bPartyImage, setBPartyImage] = useState(UserProfileData.img);
  const [isEndGame, setIsEndGame] = useState(false);
  const [isEndZero, setIsEndZero] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loader, showLoader] = useState(true);
  const [lang, setLang] = useState("mg");
  const [myRank, setMyRank] = useState("");
  const [opRank, setOpRank] = useState("");
  const [img, setImg] = useState();
  console.log("myrank::", myRank, "oprank::", opRank,"gameOver::", gameOver);
  const history = useHistory();
  const { search, pathname } = useLocation();
  let { id } = queryString.parse(search);
  id= id && Base64.decode(id);
  const { homeBack } = RedirectHook();
  const { socketDisconnect } = SocketEvent();
  const { getBattleResult } = BattleResultHooks();
  const { battleData, currentGameData, updateBattle, getLanguage, gameResult, score, isOppOut, oppOutRes, oppOutStatus, oppOutResult} =
    useContext(Context);
  const { getGameDetails } = useGameDetails();
  const userProfile = reactLocalStorage.getObject("userProfile");
  const userName = reactLocalStorage.getObject("userProfile").name;
  const tempObj = reactLocalStorage.getObject("tempObj");
  const guest = (userName === "Guest") ? 1 : 0

  /** Icons */
  const winner = require("../assets/mtncongo/winner_circle.png").default;
  // const winner = require("../assets/svg-icons/winner_circle.svg").default;
  const tie = require("../assets/mtncongo/match_tie_circle.png").default;
  console.log("gameResult::", gameResult);

  /** Set name and image of user */
  const apartyAvatar =
    _.has(userProfile, "avatarUrl") && userProfile.avatarUrl.length > 0
      ? userProfile.avatarUrl
      : UserProfileData.img;
  const apartyName = userProfile.name;

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'game_result';
    guiDataEvent['event'] = 'open';
    guiDataEvent['game_id'] = id;
    SendGuiDataEvents(guiDataEvent);
  }, []);

  useEffect(() => {
    const unblock = history.block((location, action) => {
      console.log("-----step 1----->", location, action);
      if (action === "POP") {
        console.log("-----step 2----->", action);
        // handleShowModal(true);
        // send this based on actions
        // const myBattle = {
        //     ...battleData,
        //     score: e.data.body.score,
        //   };
        //   setBattle(myBattle);
        //   endBattle(myBattle);
        return false;
      }
      return true;
    });

    return () => {
      unblock();
    };
  });

  // useEffect(() => {
  //   return () => {
  //     if (history.action === "POP") {
  //       history.push("/home");
  //     }
  //   }
  // })

  useEffect(() => {
    if (guest === 0) {
      setTimeout(() => {
      showLoader(false);
    }, 1000);
    }else if (guest === 1) {
      console.log("1::");
      console.log("opp status::", isOppOut, score, oppOutRes.score)
          if (isOppOut) {
            console.log("2::")
            setBPartyScore(oppOutRes.score);
            if (score > oppOutRes.score) {  
              console.log("3::") 
          setTitle(text.freeResult.winTitle[lang]);
          setSubtitle(text.freeResult.winSubtitle[lang]);
          setMyRank(1);
          setOpRank(2);
          setImg(true)
        }else if (score < oppOutRes.score){
          console.log("4::")
          setTitle(text.freeResult.loseTitle[lang]);
          setSubtitle(text.freeResult.loseSubtitle[lang]);
          setOpRank(1);
          setMyRank(2);
          setImg(true)
        }else {
          console.log("5::")
          setTitle(text.freeResult.tieTitle[lang]);
          setSubtitle(text.freeResult.tieSubtitle[lang]);
          setMyRank(3);
          setOpRank(3);
          setImg(true)
        }
        console.log("6::")
          showLoader(false);
          setGameOver(true);
          oppOutStatus(false);
          oppOutResult({});
        cleanData();
        socketDisconnect(id);
      updateBattle({});
          }else {
            console.log("7::")
            setBPartyScore(gameResult.score);
          setTitle(text.stillPlaying[lang]);
        setSubtitle("");
      showLoader(false);
          }
          
          
    }
    else {
      console.log("8::")
      setTimeout(() => {
      showLoader(false);
    }, 1000);
    }
  }, []);


  useEffect(() => {
    getGameDetails(id).then((res) => {
      if (res.status.toUpperCase() === "SUCCESS") {
        const reason = res.reason ? res.reason : "null";
      logEvent(
              {
                screen: screen.gameResult_p,
                event: events.gameDetailsApiSuccess
              }, 
              {
                title: "gameDetails request successfull",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  resStatus : res.status,
                  resReason : reason,
                  gameId: id
                }
              }
            );
      setGameDetails(res.gameDetails);

      }else {
        logEvent(
              {
                screen: screen.gameResult_p,
                event: events.gameDetailsApiFail
              }, 
              {
                title: "gameDetails request failed",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  resStatus : res.status,
                  resReason : res.reason,
                  gameId: id
                }
              }
            );
      }
    }).catch((err) => {
      let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        logEvent(
              {
                screen: screen.gameResult_p,
                event: events.gameDetailsApiFail
              }, 
              {
                title: "gameDetails request failed",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  err : errObj,
                  gameId: id
                }
              }
            );
      });
    if (_.has(battleData, "img") && battleData.img.length > 0) {
      setBPartyImage(battleData.img);
    }
    if (_.has(battleData, "name") && battleData.name.length > 0) {
      setBPartyName(battleData.name);
    }
  }, []);
  

  useEffect(() => {
    /** Call battle result API when result page first loads, and again when game ends for opponent */
    if (guest === 0) {
      console.log("------- end game use effect called ---------->", isEndGame);
    getBattleResult(id, isEndGame).then((res) => {
      console.log("-------2res---------->", res);
      let gameOver = isEndGame;
      if (res.status.toUpperCase() === "SUCCESS") {
        console.log("-------3status---------->", res.status);
        setResultData(res);
        /** Set name, image and score of opponent */
        if (_.has(res, "opRank")) {
          if (_.has(res.opRank, "score")) {
            setBPartyScore(res.opRank.score);
          }
          if (res.opRank.img && res.opRank.img.length > 0) {
            setBPartyImage(res.opRank.img);
          }
          if (res.opRank.name && res.opRank.name.length > 0) {
            setBPartyName(res.opRank.name);
          }
        }

        if (_.has(res, "subPacks") && res.subPacks != null)
          setSubPacks(res.subPacks);

        /** Render conditional text */

        if (_.has(res, "isEnd") && res.isEnd === 0) {
          // const stillPlaying = text;
          // console.log(
          //   "sssss >> ",
          //   stillPlaying,
          //   "...",
          //   stillPlaying.stillPlaying
          // );
          console.log("-------4resisEnd---------->", res.isEnd);
          setTitle(text.stillPlaying[lang]);
          setSubtitle("");
        } else {
          gameOver = true;
          // setGameOver(true);
          console.log("-------5 Inside Else---------->", currentGameData, res);
          if (
            _.has(currentGameData, "planType") &&
            currentGameData.planType === "FREE" &&
            _.has(res, "myRank")
          ) {
            if (res.myRank.rank == 1) {
              // setTitle("Whooaa!!");
              // setSubtitle("You Won!");
              setTitle(text.freeResult.winTitle[lang]);
              setSubtitle(text.freeResult.winSubtitle[lang]);
            } else if (res.myRank.rank == 2) {
              // setTitle("Sorry!!");
              // setSubtitle("You lose!");
              setTitle(text.freeResult.loseTitle[lang]);
              setSubtitle(text.freeResult.loseSubtitle[lang]);
            } else {
              // setTitle("Yeah!!");
              // setSubtitle("It's a Draw");
              setTitle(text.freeResult.tieTitle[lang]);
              setSubtitle(text.freeResult.tieSubtitle[lang]);
            }
          } else if (_.has(res, "myRank")) {
            if (res.myRank.rank == 1) {
              // setTitle("You Won!!!");
              // setSubtitle("Congratulations");
              setTitle(text.battleResult.winTitle[lang]);
              setSubtitle(text.battleResult.winSubtitle[lang]);
            } else if (res.myRank.rank == 2) {
              // setTitle("You Lose!");
              // setSubtitle("Well played!");
              // setSubtitle2("Better luck next time");
              setTitle(text.battleResult.loseTitle[lang]);
              // setSubtitle(text.battleResult.loseSubtitle[lang]);
              setSubtitle(text.battleResult.loseSubtitle2[lang]);
              
            } else {
              // setTitle("That's a tie!");
              // setSubtitle("Nobody wins any points");
              setTitle(text.battleResult.tieTitle[lang]);
              setSubtitle(text.battleResult.tieSubtitle[lang]);
            }
          } else {
            console.log("-----response----->", res, currentGameData);
          }
        }
      } else {
        console.log("Battle result API error");
      }
      if (gameOver === true) {
        /** Clean battle data and disconnent socket */
        console.log("--- BATTLE ENDS ---");
        setGameOver(true);
        cleanData();
        socketDisconnect(id);
      }
    });
    }   
  }, [isEndGame]);

    useEffect(() => {
    if (isEndZero === true && guest === 0) {
         /** Call battle result API when result page first loads, and again when game ends for opponent */
    console.log("------- end game use effect called ---------->", isEndZero);
    getBattleResult(id, isEndZero).then((res) => {
      console.log("-------2res---------->", res);
      // res.isEnd === 2 ? setIsEndTwo(true) : setIsEndTwo(false);
      if (res.status.toUpperCase() === "SUCCESS") {
        console.log("-------3status---------->", res.status);
        setResultData(res);
        /** Set name, image and score of opponent */
        

        /** Render conditional text */

        if (_.has(res, "isEnd") && (res.isEnd === 0 || res.isEnd === 2)) {
          console.log("-------4resisEnd---------->", res.isEnd);
          setTitle(text.stillPlaying[lang]);
          setSubtitle("");
        }
      } else {
        console.log("Battle result API error");
      }
    });
    }
  }, [isEndZero]);

  useEffect(() => {
    if (_.isEmpty(currentGameData)) {
      homeBack();
    }
  }, []);

  useCustomEventListener("scoreUp", (currentScore) => {
    console.log("Score update ::: game result screen ::: ", currentScore);
    setBPartyScore((prev) => {
      return currentScore &&
        _.has(currentScore, "score") &&
        currentScore.score != 0
        ? currentScore.score
        : prev;
    });
  });

  
  // /**...Listen to end game event.... */
  // useCustomEventListener("endGameData", (endData) => {
  //   console.log(">>> end game event recieved :::", endData);
  //   if (endData.isEnd === 1) {
  //     console.log(
  //       ">>> end game event recieved ::: endData.isEnd === 1 ::: ",
  //       endData
  //     );
  //     setIsEndGame(true);
  //     updateBattle({});
  //   }
  // });

    /**...Listen to end game event.... */
  useCustomEventListener("endGameData", (endData) => {
    console.log(">>> end game event recieved :::", endData);
    setBPartyScore(endData.score);
    if (endData.isEnd === 0) {
      console.log(
        ">>> end game event recieved ::: endData.isEnd === 1 ::: ",
        endData
      );
      setIsEndZero(true);
      if (guest === 1) {
        setBPartyScore(endData.score);
        setTitle(text.stillPlaying[lang]);
        setSubtitle("");
      }
      updateBattle({});
    }
    else if (endData.isEnd === 1) {
      console.log(
        ">>> end game event recieved ::: endData.isEnd === 1 ::: ",
        endData
      );
      
      setIsEndGame(true);
      if (guest === 1) {
        console.log("scores::",score, gameResult.score, endData.score)
        if (score > endData.score) {        
          setTitle(text.freeResult.winTitle[lang]);
          setSubtitle(text.freeResult.winSubtitle[lang]);
          setMyRank(1);
          setOpRank(2);
          setImg(true)
        }else if (score < endData.score){
          setTitle(text.freeResult.loseTitle[lang]);
          setSubtitle(text.freeResult.loseSubtitle[lang]);
          setOpRank(1);
          setMyRank(2);
          setImg(true)
        }else {
          setTitle(text.freeResult.tieTitle[lang]);
          setSubtitle(text.freeResult.tieSubtitle[lang]);
          setMyRank(3);
          setOpRank(3);
          setImg(true)
        }
      }
      setGameOver(true);
        cleanData();
        socketDisconnect(id);
      updateBattle({});
    }
  });

  const handleClick = (button) => {
    socketDisconnect(id);
    cleanData();
    updateBattle({});
    if (button === "playAgain") {
      logEvent(
              {
                screen: screen.gameResult_p,
                event: events.playAgainClick
              }, 
              {
                title: "play again button clicked",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  gameId: id
                }
              }
            );

      history.push(`/battleinfo?id=${Base64.encode(id)}`);
    } else if (button === "home") {
      logEvent(
              {
                screen: screen.gameResult_p,
                event: events.homeClick
              }, 
              {
                title: "home button clicked",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  gameId: id
                }
              }
            );
      history.push("/home");
    } else if (button === "leaderboard") {
      logEvent(
              {
                screen: screen.gameResult_p,
                event: events.leaderboardClick
              }, 
              {
                title: "home button clicked",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  gameId: id
                }
              }
            );
      history.push("/leaderBoard");
    }
  };

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

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <>
      {loader && <Loader />}
      <div className={`module ${loaderClass}`}>
        {_.isEmpty(currentGameData) === false &&
          _.has(currentGameData, "planType") && (
            <div className="bg-primary px-1 pb-2 min-h-screen flex flex-col justify-between items-start">
              {/* <div className="bg-primary bg-result-screen-new bg-no-repeat bg-center bg-cover px-1 pb-2 min-h-screen flex flex-col justify-between items-start"> */}
              <div className="w-full mb-6 text-center">
                <Image
                  url={
                    gameDetails && _.has(gameDetails, "gameIcon")
                      ? gameDetails.gameIcon
                      : ""
                  }
                  styles={"h-32 w-32 m-auto"}
                  showPreloader={false}
                />
              </div>

              <div className="flex justify-around items-start w-full">
                <div className="flex flex-col justify-center items-center">
                  <div className="w-24">
                    <ScoreCard
                      scoreText={text.score[lang]}
                      name={apartyName}
                      image={apartyAvatar}
                      score={
                        guest === 0 ? 
                        (_.isEmpty(resultData) === false &&
                        _.has(resultData, "myRank")
                          ? resultData.myRank.score
                          : "0") : score
                      }
                      rank={
                        _.isEmpty(resultData) === false &&
                        _.has(resultData, "myRank")
                          ? resultData.myRank.rank
                          : 0
                      }
                      setBanner={
                        guest === 0 ?
                        (gameOver &&
                        _.isEmpty(resultData) === false &&
                        _.has(resultData, "myRank") &&
                        resultData.myRank.rank !== 2
                          ? true
                          : false) : 
                          (gameOver && myRank !== 2 ? true : false )
                          
                      }
                      banner={
                        guest === 0 ? 
                        (gameOver &&
                        _.isEmpty(resultData) === false &&
                        _.has(resultData, "myRank") &&
                        resultData.myRank.rank === 1
                          ? winner
                          : tie) :
                            (gameOver && myRank === 1 ? winner : tie )                     
                      }
                    />
                  </div>
                </div>
                <Text
                  tag="h2"
                  scale={true}
                  text={text.vs[lang]}
                  fontweight="bold"
                  styles="transform translate-y-7"
                  textColor="text-resendYellow"
                />

                <ScoreCard
                  scoreText={text.score[lang]}
                  name={bPartyName}
                  image={bPartyImage}
                  score={bPartyScore}
                  rank={
                    _.isEmpty(resultData) === false && resultData.opRank
                      ? resultData.opRank.rank
                      : 0
                  }
                  setBanner={
                    guest === 0 ?
                    (gameOver &&
                    _.isEmpty(resultData) === false &&
                    _.has(resultData, "opRank") &&
                    resultData.opRank.rank !== 2
                      ? true
                      : false) : 
                      (gameOver && opRank !== 2 ? true : false )

                  }
                  banner={
                     guest === 0 ? 
                    (gameOver &&
                    _.isEmpty(resultData) === false &&
                    _.has(resultData, "opRank") &&
                    resultData.opRank.rank === 1
                      ? winner
                      : tie) :
                      (gameOver && opRank === 1 ? winner : tie )

                  }
                />
              </div>

              {currentGameData.planType === "FREE" ? (
                <FreeGameResult
                  title={title}
                  subtitle={subtitle}
                  subPacks={subPacks}
                  handleClick={handleClick}
                  isEndGame={isEndGame}
                  id={id}
                  lang={lang}
                  gameOver={gameOver}
                />
              ) : currentGameData.planType === "LEADERBOARD" ? (
                <LeaderboardGameResult
                  title={title}
                  handleClick={handleClick}
                  resultData={resultData}
                  factor={gameDetails.factor ? gameDetails.factor : 1}
                  lang={lang}
                  isEndGame={isEndGame}
                />
              ) : currentGameData.planType === "MOMO" ? (
                <MomoGameResult
                  title={title}
                  subtitle={subtitle}
                  subtitle2={subtitle2}
                  handleClick={handleClick}
                  isEndGame={isEndGame}
                  resultData={resultData}
                  lang={lang}
                />
              ) : (
                ""
              )}

              {/* <div className="w-full px-1 py-2">
              <Button
                type="button"
                icon={home_icon_white}
                label={text.home[lang]}
                action={"home"}
                eventHandler={handleClick}
                background={"button-purple"}
                size={"medium"}
                textColor={"text-white"}
                textStyles="ml-2"
                styles={
                  "font-bold text-md uppercase border-2 border-border-orange"
                }
              />
            </div> */}
            </div>
          )}
      </div>
    </>
  );
}

export default GameResult;
