import React, { useEffect, useState } from "react";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import ProgressSlider from "../commonComponents/ProgressSlider";
import PrizePoolItem from "../commonComponents/PrizePoolItem";
import useTournament from "../network/useTournament";
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import { reactLocalStorage } from "reactjs-localstorage";

function TournamentPrizePool({
  setShowPrizeModal,
  prizeList,
  prizePool,
  prizeMoney,
  text,
  lang
}) {
  const { getPrize } = useTournament();
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const prizePoolImg =
    require("../assets/svg-icons/prize_pool_popup_icon.svg").default;
  const [prizePoolData, setPrizePoolData] = useState([]);
  const [prizeListData, setPrizeListData] = useState([]);
  const [players, setPlayers] = useState(prizePool.players);
  const [prizeDistributionMethod, setPrizeDistributionMethod] = useState("");
  const [perkillCoins, setPerkillCoins] = useState("");
  const [
    userRankBasedCoinsDistributionMethod,
    setUserRankBasedCoinsDistributionMethod,
  ] = useState(null);
  const tempObj = reactLocalStorage.getObject("tempObj");

  useEffect(() => {
    getPrize(prizePool.tournamentId)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
          logEvent(
              {
                screen: screen.prizePool_p,
                event: events.apiSuccess
              }, 
              {
                title: "prize pool request successfull",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  tournamentId: prizePool.tournamentId,
                  resStatus: res.status,
                  resReason: reason
                } 
              }
            );
          console.log("res", res);
          setPrizeListData(res.userRankBasedCoins);
          const arr = [];
          arr.push(res.perkillCoins);
          setPrizePoolData(arr);
          setPrizeDistributionMethod(res.prizeDistributionMethod);
          setPerkillCoins(res.perkillCoins);
          setUserRankBasedCoinsDistributionMethod(
            res.userRankBasedCoinsDistributionMethod
          );
        }else {
          logEvent(
              {
                screen: screen.prizePool_p,
                event: events.apiFailure
              }, 
              {
                title: "prize pool request failed",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  tournamentId: prizePool.tournamentId,
                  resStatus: res.status,
                  resReason: res.reason
                } 
              }
              );
        }
        
        // showLoader(false);
      })
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        console.log(">>>>> err >>>>>", err);
        logEvent(
            {
              screen: screen.prizePool_p,
              event: events.apiFailure
            }, 
            {
              title: "prize pool request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentId: prizePool.tournamentId,
                err: errObj
              } 
            }
          );
        // showLoader(false);
      });
  }, []);

  useEffect(() => {
    /** Disable background scroll when Prize list is opened */
    const background = document.getElementById("app-wrapper");
    if (background) {
      background.style.height = "100vh";
      background.style.overflow = "hidden";
    }

    return () => {
      console.log("Prize list closed...");
      if (background) {
        background.style.height = "auto";
        background.style.overflow = "scroll";
      }
    };
  }, []);

  const toHandleSlider = (players) => {
    setPlayers(players);
  };

  return (
    <>
      <div
        className={`w-full max-w-500px max-h-3/4 m-auto justify-center items-center fixed bottom-0 z-50 outline-none focus:outline-none`}
      >
        <div className="relative">
          <div className="rounded-t-3xl shadow-lg relative pt-2 flex flex-col w-full bg-primary outline-none focus:outline-none">
            <div className="px-6 flex-auto text-center">
              <div
                className="flex justify-center items-center absolute top-1 right-1 h-8 w-8 text-2xl text-white font-bold leading-6 z-10 text-center cursor-pointer"
                onClick={() => {
                  setShowPrizeModal(false);
                }}
              >
                &times;
              </div>
              <br />
              <div className="flex justify-center items-center">
                <Image url={prizePoolImg} styles="mb-2" />
              </div>
              <div className="mt-2 mb-4 w-12 border-b-2 border-t-2 rounded-full border-white border-opacity-50 m-auto"></div>

              <Text
                tag="h4"
                scale={true}
                styles=""
                text={prizeList ? text.prizeList[lang] : text.prizePool[lang]}
                fontweight="bold"
                textColor={"text-white"}
              />

              <div className="mt-2 pb-28 h-500px overflow-scroll no-scrollbar">
                {prizeList === false && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col justify-between items-center">
                        <Text
                          tag="label"
                          text={text.numberofPlayers[lang]}
                          styles="text-white text-opacity-60 text-xs"
                        />
                        <Text
                          tag="h5"
                          text={`${players}/${prizePool.capacity}`}
                          textColor="text-white"
                        />
                      </div>
                      <div className="flex flex-col justify-between items-center">
                        <Text
                          tag="label"
                          text={text.prizePool[lang]}
                          styles="text-white text-opacity-60 text-xs"
                        />
                        <div className="flex justify-center items-center">
                          <Image url={coinIcon} styles="w-4 h-4 mx-1" />
                          <Text
                            tag="h5"
                            text={players * prizePoolData[0]}
                            textColor="text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="my-4">
                      <ProgressSlider
                        defaultValue={players}
                        handleSlider={toHandleSlider}
                      />
                    </div>
                  </>
                )}

                <div className="mt-4 px-4 flex justify-between items-center">
                  <Text
                    tag="h5"
                    text={text.rank[lang]}
                    textColor="text-white font-medium"
                  />
                  <Text
                    tag="h5"
                    text={text.prize[lang]}
                    textColor="text-white font-medium"
                  />
                </div>

                <div className="mt-6 py-6 px-4 bg-tournamentCards rounded-t-lg overflow-y-auto">
                  {prizeDistributionMethod === "RANK" ? (
                    prizeListData &&
                    prizeListData.length > 0 &&
                    prizeListData.map((item, i) => (
                      <PrizePoolItem
                        prize={
                          userRankBasedCoinsDistributionMethod === "PERCENTAGE"
                            ? (item * prizeMoney) / 100
                            : item
                        }
                        rank={i}
                        key={i}
                        prizeList={prizeList}
                        prizeDistributionMethod={prizeDistributionMethod}
                        text={text}
                        lang = {lang}
                      />
                    ))
                  ) : (
                    <PrizePoolItem
                      prize={perkillCoins}
                      prizeDistributionMethod={prizeDistributionMethod}
                      text={text}
                      lang = {lang}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default TournamentPrizePool;
