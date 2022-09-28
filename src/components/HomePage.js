import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { HomePageText as text, SubscriptionText, tournamentText } from "../Database/Text";
import Text from "../commonComponents/Text";
import useHome from "../network/useHome";
import GameCard from "../commonComponents/GameCard";
import TrendingCard from "../commonComponents/TrendingCard";
import BannerCard from "../commonComponents/BannerCard";
import { reactLocalStorage } from "reactjs-localstorage";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import _ from "lodash";
import ApiNotFound from "./ApiNotFound";
import { Context } from "../context/Context";
import TournamentHomeCard from "../commonComponents/TournamentHomeCard";
import useTournament from "../network/useTournament";
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import ProcessingPage from "../commonComponents/ProcessingPage";
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';

function HomePage() {
  const [gamesData, setGamesData] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [banners, setBanners] = useState([]);
  // const [tournaments, setTournaments] = useState([]);
  const [loader, showLoader] = useState(true);
  const [showProcessing, setShowProcessing] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [tournamentData, setTournamentData] = useState([])
  const { getHomeData } = useHome();
  const { getTournamentSummary } = useTournament();
  const { saveTournamentTab, getLanguage, handleShowModal} = useContext(Context);
  const [lang, setLang] = useState("");
  const history = useHistory();
  const userData = reactLocalStorage.getObject("userProfile");
  const tempObj = reactLocalStorage.getObject("tempObj");
  let { search, pathname } = useLocation();
  let { mode } = queryString.parse(search);
  mode = mode && Base64.decode(mode);
  const subscribed = require("../assets/mtncongo/subscription_activated_icon1.png").default;
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = (userName === "Guest") ? true : false;
  const isProfileCreated = reactLocalStorage.getObject("guestProfileCreated");


  useEffect (() => {
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'homepage';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);

  },[])

  useEffect(() => {
    window.scrollTo(0, 0);
    const lang = getLanguage();
    setLang(lang);


    if (guest && !isProfileCreated) {
      setTimeout(() => {
      setShowProcessing(false);
      const modalData = {
              icon : require("../assets/mtncongo/coins_recharge_successfully_tick_icon.png").default,
              title: text.gstProfileCreated[lang],
              body: text.gstProfileCreatedDes[lang],
              buttons: [
                {
                  label: text.okay[lang],
                  action: "close",
                  buttonColor: "bg-tabsColor",
                  textColor: "text-white",
                },
              ],
              hideClose: true,
              handleClick: function (button) {
                if (button === "close") {
                  handleShowModal(false);
                }
              },
            };
            handleShowModal(true, modalData);
            reactLocalStorage.setObject("guestProfileCreated", true);
    }, 2000);
    }


    /** Once user naviagtes back to Home Page from Tournament Section, set Upcoming as default Tournament tab */
    saveTournamentTab("upcoming");

    if (_.isEmpty(userData) === true) {
      console.log("empty userData");
      history.push("/");
    } else {
      getHomeData(4)
        .then((res) => {
          console.log("----res----->", res);
          if (res.status.toUpperCase() === "SUCCESS") {
            const reason = res.reason ? res.reason : "null";
            console.log(reason);
            logEvent(
              {
                screen: screen.home_p,
                event: events.apiSuccess
              }, 
              {
                title: "getHomeData request successfull",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  resStatus: res.status,
                  resReason: reason
                } 
              }
            );
            const trendingGameId = res.trendingList[0].gameId;
            const filteredGameList = res.gameList.filter(game => game.gameId !== trendingGameId);
            showLoader(false);
            setBanners(res.bannerList);
            setGamesData(filteredGameList);
            setTrendingGames(res.trendingList);
            // setTournaments(res.tournamentList);
            if (mode === "subscribe") {
              const modalData = {
                icon: subscribed,
                title: "",
                body: SubscriptionText.alreadySubHome[lang],
                buttons: [
                  {
                    label: SubscriptionText.playNow[lang],
                    action: "okay",
                    buttonColor: "bg-tabsColor",
                    textColor: "text-white",
                 },
                        ],
                        hideClose: true,
                        handleClick: function (button) {
                            if(button === "okay") {
                            handleShowModal(false);
                            history.push("/home");
                          }
                        },
                      };
                      handleShowModal(true, modalData);
            }

            }
            else {
              console.log("request failed");
              logEvent(
              {
                screen: screen.home_p,
                event: events.events.apiFailure
              }, 
              {
                title: "getHomeData request failed",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  resStatus: res.status,
                  resReason: res.reason
                } 
              }
              );
          }
        }
        )
        .catch((err) => {
          // let errObj;
          // const msg = err.message;
          // if (msg === "Failed to fetch") {
          //   errObj = `${msg} due to internet disconnected, statusCode: 503`
          // }else {
          //   errObj = err;
          // }
          // console.log("------msg----->", msg);
          logEvent(
            {
              screen: screen.home_p,
              event: events.apiFailure
            }, 
            {
              title: "getHomeData request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                err: err 
              } 
            }
          );
          console.log(">>>>> home err >>>>>", err.message);
          setApiFailed(true);
        });
    }
  }, []);
  

  useEffect(() => {
    getTournamentSummary()
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
            console.log(reason);
            logEvent(
              {
                screen: screen.home_p,
                event: events.tournamentListApiSuccess
              }, 
              {
                title: "tournament summary request successfull",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  resStatus: res.status,
                  resReason: reason
                } 
              }
            );
          setTournamentData(res.tournamentSummaryClassResponse)
        }else {
            logEvent(
              {
                screen: screen.home_p,
                event: events.tournamentListApiFailure
              }, 
              {
                title: "tournament summary request failed",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  resStatus: res.status,
                  resReason: res.reason
                } 
              }
              );
        }
      })
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        logEvent(
            {
              screen: screen.home_p,
              event: events.tournamentListApiFailure
            }, 
            {
              title: "tournament summary request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                err: errObj
              } 
            }
          );
        console.log(">>>>> err >>>>>", err);
      });
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

  if (apiFailed) {
    return <ApiNotFound />;
  }

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <>
      { guest && !isProfileCreated && showProcessing && <ProcessingPage guest={true}/>}
      {!showProcessing && loader && <Loader />}
      <div className={`px-1 ${loaderClass}`}>
        {!_.isEmpty(trendingGames) && trendingGames.length > 0 && (
          <TrendingCard
            data={trendingGames[0]}
            text={text}
            lang={lang}
            handleClick={(id) => {
              console.log('------- trending card clicked ---->'+id);
              //send gui events
              let guiDataEvent = {}
              guiDataEvent['page'] = 'homepage';
              guiDataEvent['event'] = 'game_click';
              guiDataEvent['game_id'] = id
              guiDataEvent['game_name'] = gamesData.name
              SendGuiDataEvents(guiDataEvent);
              history.push(`/battleinfo?id=${Base64.encode(id)}`)
            }}
          />
        )}
        {!_.isEmpty(gamesData) && gamesData.length > 0 && (
          <div className="flex flex-wrap">
            {gamesData.map((item, i) => {
              return <GameCard data={item} key={i} text={text} lang={lang} />;
            })}
          </div>
        )}
        {!_.isEmpty(banners) && banners.length > 0 && (
          <BannerCard data={banners[0]} text={text} lang={lang} />
        )}
        <br />

        
        {tournamentData && tournamentData.length > 0 && <div className="pb-10">
        <div className="flex justify-between items-center pb-2">
          <Text
            tag={"h3"}
            scale={true}
            text={tournamentText.battleArena[lang]}
            styles="text-white font-bold float-right pl-2 tracking-wider"
          />
          <div className="flex pr-2.5" onClick={() => {
            logEvent(
            {
              screen: screen.home_p,
              event: events.viewAll
            }, 
            {
              title: "View All Button Clicked",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
            });
            history.push('/allTournament')
          }}>
            <Text
              tag={"lable"}
              scale={true}
              text={tournamentText.viewAll[lang] + " >"}
              styles="text-lightPurple font-medium text-sm float-right"
            />
          </div>
        </div>

           
        {tournamentData.map((item, index) =>
          index < 3 && <TournamentHomeCard
            image={item.backgroundImage}
            noOfDaysShown ={item.noOfDaysShown}
            won={item.totalCoinsWon}
            tournamentSummaryId={item.id}
            tournamentName={item.name}
            upcomingMatches={item.upcomingTournaments}
            totolMatchesPlayed={item.totalTournamentPlayed}
            background="bg-primary"
            // background={index % 2 === 0 ? "bg-gradient-to-b from-tRed to-tRedDark" : "bg-gradient-to-b from-tLightBlue to-tDarkBlue"}
            key={index}
            text = {tournamentText}
            lang={lang}
          />
        )}
        </div>}
      </div>
    </>
  );
}

export default HomePage;
