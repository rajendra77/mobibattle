import React, { useEffect, useState, useContext } from "react";
import TournamentCard from "../commonComponents/TournamentCard";
import TournamentResultCard from "../commonComponents/TournamentResultCard";
import useTournament from "../network/useTournament";
import { reactLocalStorage } from "reactjs-localstorage";
import ApiNotFound from "./ApiNotFound";
import Loader from "../commonComponents/Loader";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { tournamentText as text } from "../Database/Text";
import { Context } from "../context/Context";
import { SendGuiDataEvents } from "../commonScript";
import { Base64 } from "js-base64";

const TournamentHistory = () => {
  const { reportUser, getTournamentHistory, getWinnersList } = useTournament();
  const [tournamentData, setTournamentData] = useState([]);
  const [mapType, setMapType] = useState("");
  const [winnersList, setWinnersList] = useState([]);
  const [activeResult, setActiveResult] = useState(null);
  const [loader, showLoader] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [lang, setLang] = useState("en");
  const { getLanguage, handleShowModal } = useContext(Context);
  const tempObj = reactLocalStorage.getObject("tempObj");
  const pubgImg = require("../assets/pubg1.png").default;
  const reportIcon =
    require("../assets/tImages/report_user_popup_icon.svg").default;

  useEffect(() => {
    //send gui events
    let guiDataEvent = {};
    guiDataEvent["page"] = "tournament_history";
    guiDataEvent["event"] = "open";
    SendGuiDataEvents(guiDataEvent);

    window.scrollTo(0, 0);
    setLang(getLanguage());
    const tournamentSummaryId = reactLocalStorage.get("tournamentSummaryId");
    getTournamentHistory(tournamentSummaryId)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
          logEvent(
            {
              screen: screen.tournamentHistory_p,
              event: events.apiSuccess,
            },
            {
              title: "tournament history request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentId: tournamentSummaryId,
                resStatus: res.status,
                resReason: reason,
              },
            }
          );
          setTournamentData(res.tournamentHistory);
          res.tournamentHistory.length > 0 &&
            setMapType(res.tournamentHistory[0].mapType);
          showLoader(false);
        } else {
          logEvent(
            {
              screen: screen.tournamentHistory_p,
              event: events.apiFailure,
            },
            {
              title: "tournament history request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentId: tournamentSummaryId,
                resStatus: res.status,
                resReason: res.reason,
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
        console.log(">>>>> err >>>>>", err);
        logEvent(
          {
            screen: screen.tournamentHistory_p,
            event: events.apiFailure,
          },
          {
            title: "tournament history request failed",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
            others: {
              tournamentId: tournamentSummaryId,
              err: errObj,
            },
          }
        );
        showLoader(false);
        setApiFailed(true);
      });
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  const handleReportUser = () => {
    const modalData = {
      title: text.reportUser[lang],
      body: text.reportUserBody[lang],
      buttons: [
        {
          label: text.close[lang],
          action: "close",
          buttonColor: "bg-tabsColor",
          textColor: "text-white",
        },
      ],
      icon: reportIcon,
      hideClose: true,
      handleClick: function (button) {
        if (button === "close") {
          handleShowModal(false);
        }
      },
    };
    handleShowModal(true, modalData);
    // reportUser()
    //     .then((res) => {
    //         console.log("res.data", res)
    //     })
    //     .catch((err) => {
    //         console.log(">>>>> err >>>>>", err);
    //     });
  };

  const getBackgroundColor = (index) => {
    if (index % 2 === 0) {
      return "bg-gradient-to-r from-tRed to-tRedDark";
    } else {
      return "bg-gradient-to-r from-tLightBlue to-tDarkBlue";
    }
  };

  const showResults = (id, totalWinners, tournamentStatus) => {
    //send gui events
    let guiDataEvent = {};
    guiDataEvent["page"] = "tournament_history";
    guiDataEvent["event"] = "tour_history_result_click";
    SendGuiDataEvents(guiDataEvent);
    setWinnersList([]);
    getWinnersList(id)
      .then((res) => {
        setActiveResult(id);
        if (res.status.toUpperCase() === "SUCCESS") {
          let slicedArray = [];
          if (
            tournamentStatus !== "RESULT_AWT" &&
            res.userDetailsClassResponse.length > 0
          ) {
            slicedArray = res.userDetailsClassResponse.slice(0, totalWinners);
          }
          setWinnersList(slicedArray);
        } else if (res.status.toUpperCase() === "FAILURE") {
          setWinnersList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={`pb-4 `}>
      {loader && <Loader />}
      {!loader && tournamentData.length == 0 && (
        <div className="flex flex-col items-center justify-center pt-64">
          <h1 className="text-white font-bold">{text.notFound[lang]}</h1>
        </div>
      )}
      <div className="">
        {tournamentData.map((item, index) => (
          <TournamentCard
            id={item.tournamentId}
            key={item.tournamentId}
            image={pubgImg}
            displayStatus={"RESULT"}
            players={item.players}
            map={item.mapType}
            teamType={item.gameType}
            prizeMoney={item.prizeMoney}
            entryFees={item.entryFee}
            weeklyTournament={false}
            type={"past"}
            cashWon={item.coinsWon}
            rank={item.userRank}
            totalWinners={item.totalWinners}
            date={item.startDatetime && item.startDatetime.split("T")[0]}
            kill={item.kills}
            showResult={(id, totalWinners, tournamentStatus) => {
              showResults(id, totalWinners, tournamentStatus);
            }}
            tournamentId={item.tournamentId}
            tournamentStatus={item.tournamentStatus}
            activeResult={activeResult}
            backgroundColor={getBackgroundColor(index)}
          >
            {item.tournamentId == activeResult &&
            winnersList &&
            winnersList.length > 0
              ? winnersList.map((item, index) => (
                  <TournamentResultCard
                    id={item.userId}
                    key={item.userId}
                    image={
                      item.avatarUrl
                        ? item.avatarUrl
                        : require("../assets/svg-icons/animal-avatar4.png")
                            .default
                    }
                    rank={item.userRank === -1 ? index + 1 : item.userRank}
                    kills={item.kills}
                    prize={item.coinsWon}
                    battleName={mapType}
                    displayName={item.displayName}
                    userGameId={Base64.decode(item.userGameId)}
                    handleReportUser={handleReportUser}
                    text={text}
                    lang={lang}
                  />
                ))
              : item.tournamentId == activeResult && (
                  <div className="text-white text-center bg-black bg-opacity-30 py-1 font-bold mt-2">
                    {text.resultsDeclared[lang]}
                  </div>
                )}
          </TournamentCard>
        ))}
      </div>
    </div>
  );
};

export default TournamentHistory;
