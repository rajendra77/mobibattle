import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../context/Context";
import { reactLocalStorage } from "reactjs-localstorage";
import useTournament from "../network/useTournament";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import TournamentCard from "../commonComponents/TournamentCard";
import TournamentHeader from "../subComponents/TournamentHeader";
import TournamentCalender from "../commonComponents/TounamenetCalender";
import TournamentPrizePool from "../subComponents/TournamentPrizePool";
import Loader from "../commonComponents/Loader";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { tournamentText as text } from "../Database/Text";
import useSubscribe from "../network/useSubscribe";
import useProceedToPay from "../network/useProceedToPay";
import moment from "moment";
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';

const Tournaments = () => {

  const [activeDate, setActiveDate] = useState(new Date().getDate());
  const [disableJoinBtn, setDisableJoinBtn] = useState(false)
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [tournamentData, setTournamentData] = useState([]);
  const [joined, setJoined] = useState(0);
  const [tournamentType, setTournamentType] = useState(false);
  const [prizeList, setPrizeList] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [loader, showLoader] = useState(true);
  const [prizePool, setPrizePool] = useState({});
  const [prizeMoney, setPrizeMoney] = useState("");
  const [lang, setLang] = useState('en')
  const [subscribed, setSubscribed] = useState(false);
  const [mainBalance, setMainBalance] = useState();
  const [wallet, toggleWallet]= useState(false)
  const { handleShowModal, getLanguage } = useContext(Context);
  const {
    getTournamentDetails,
    joinTournament,
    debitCoinsTournament,
    updateWalletBalance,
    clearRegisteredUser
  } = useTournament();
  const { checkSubscription } = useSubscribe();
  const { getBalanceData } = useProceedToPay();
  const history = useHistory();

  const calenderICon =
    require("../assets/tImages/coming_soon_tournament_icon.svg").default;
  const confirmationIcon =
    require("../assets/tImages/confirmation_tick_icon.svg").default;
  const lowBalanceIcon =
    require("../assets/modal-icons/low_wallet_balance_icon.svg").default;
  const tournamentSummaryId = reactLocalStorage.get("tournamentSummaryId");
  const userGameId = reactLocalStorage.get("userGameId");
  const tempObj = reactLocalStorage.getObject("tempObj");

  useEffect (() => {
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'tournament';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  },[])

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
    return () => {
      if (history.action === "POP") {
        console.log("-------browser back fired------->");
        history.push("/home");
      }
    };
  }, []);

  
  useEffect(() => {
    checkSubscription()
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          setSubscribed(true);
        } else if (res.status.toUpperCase() === "FAILURE") {
          setSubscribed(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setSubscribed(false);
      });
  }, []);

  useEffect(()=>{
    getBalanceData()
    .then((res) => {
      setMainBalance(res.main_balance);
    })
    .catch((err) => {
      console.error(err);
    });
  },[wallet])

  useEffect(() => {
    setDisableJoinBtn(false)
    const tournamentSummaryId = reactLocalStorage.get("tournamentSummaryId");
    let date = new Date();
    let now_utc = "";
    let endTime = "";
    if (activeDate === date.getDate()) {
      now_utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
      endTime = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23 - 5,
        59 - 30,
        0
      );
    } else {
      date.setDate(activeDate);
      now_utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() - 1,
        24 - 6,
        60 - 30,
        0
      );
      endTime = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23 - 5,
        59 - 30,
        59
      );
    }
    const selectedDate = new Date(now_utc);
    const endDate = new Date(endTime);
    setTournamentData([]);
    showLoader(true);
    getTournamentDetails(tournamentSummaryId, selectedDate, endDate)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
          logEvent(
            {
              screen: screen.tournamentList_p,
              event: events.apiSuccess,
            },
            {
              title: "getTournament request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentSummaryId: tournamentSummaryId,
                resStatus: res.status,
                resReason: reason,
              },
            }
          );
          setTournamentData(res.tournamentDetailsResponse);
          reactLocalStorage.set("userGameId" , res.userGameId)
          showLoader(false);
        } else {
          reactLocalStorage.set("userGameId" , res.userGameId)
          showLoader(false);
          logEvent(
            {
              screen: screen.tournamentList_p,
              event: events.apiFailure,
            },
            {
              title: "getTournament request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentSummaryId: tournamentSummaryId,
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
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        console.log(">>>>> err >>>>>", err);
        logEvent(
          {
            screen: screen.tournamentList_p,
            event: events.apiFailure,
          },
          {
            title: "getHomeData request failed",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
            others: {
              tournamentSummaryId: tournamentSummaryId,
              err: errObj,
            },
          }
        );
        showLoader(false);
      });
  }, [activeDate, joined]);

  const handleJoinTournament = (tournamentId, entryFees, displayStatus) => {

    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'tournament';
    guiDataEvent['event'] = 'join_click';
    guiDataEvent['tour_id'] = tournamentId;
    guiDataEvent['entry_fee'] = entryFees;
    SendGuiDataEvents(guiDataEvent);

    if(!subscribed){
      history.push(`/subscription`)
      return 
    }
    const tournamentSummaryId = reactLocalStorage.get("tournamentSummaryId");
    const userGameId = reactLocalStorage.get("userGameId");
    if (userGameId && userGameId != "null") {
      joinTournament(tournamentId, tournamentSummaryId, userGameId)
        .then((res) => {
          if (res.status.toUpperCase() === "SUCCESS") {
            const reason = res.reason ? res.reason : "null";
            logEvent(
              {
                screen: screen.tournamentList_p,
                event: events.joinTournamentApiSuccess,
              },
              {
                title: "join tournament request successfull",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  tournamentId: tournamentId,
                  resStatus: res.status,
                  resReason: reason,
                },
              }
            );
            debitCoinsTournamentfunc(tournamentId, userGameId);
          } else if (
            res.status.toUpperCase() === "FAILURE" &&
            res.statusCode === 1038
          ) {
            const modalData = {
              title: text.lowBalance[lang],
              body: text.lowBalanceMSg[lang],
              icon: lowBalanceIcon,
              buttons: [
                {
                  label: text.addMoney[lang],
                  action: "addMoney",
                  buttonColor: "bg-tabsColor",
                  textColor: "text-white",
                },
              ],
              handleClick: function (button) {
                if (button === "addMoney") {
                  handleShowModal(false);
                  history.push(`/addamount?tid=${Base64.encode(tournamentId)}`);
                }
              },
            };
            handleShowModal(true, modalData);
            logEvent(
              {
                screen: screen.tournamentList_p,
                event: events.joinTournamentApiFailure,
              },
              {
                title: "join tournament request failed due to low balance",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  tournamentId: tournamentId,
                  resStatus: res.status,
                  resReason: res.reason,
                },
              }
            );
          } else {
            const modalData = {
              title: text.somethingWrongErr[lang],
              body: res.reason,
              icon: lowBalanceIcon,
              buttons: [
                {
                  label: text.okay[lang],
                  action: "okay",
                  buttonColor: "bg-tabsColor",
                  textColor: "text-white",
                },
              ],
              handleClick: function (button) {
                if (button === "okay") {
                  handleShowModal(false);
                }
              },
            };
            handleShowModal(true, modalData);
            logEvent(
              {
                screen: screen.tournamentList_p,
                event: events.joinTournamentApiFailure,
              },
              {
                title: "join tournament request failed",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  tournamentId: tournamentId,
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
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
          console.log(">>>>> err >>>>>", err);
          logEvent(
            {
              screen: screen.tournamentList_p,
              event: events.joinTournamentApiFailure,
            },
            {
              title: "join tournament request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentId: tournamentId,
                err: errObj,
              },
            }
          );
        });
    } else {
      history.push(
        `/tournamentUserName?tournamentSummaryId=${tournamentSummaryId}&entryFees=${entryFees}&id=${tournamentId}`
      );
    }
  };


  const debitCoinsTournamentfunc = (tournamentId, userGameId) => {
    debitCoinsTournament(tournamentId, userGameId)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
          setJoined(joined + 1);
          logEvent(
            {
              screen: screen.tournamentList_p,
              event: events.conformationApiSuccess,
            },
            {
              title: "debit coins request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentId: tournamentId,
                resStatus: res.status,
                resReason: reason,
              },
            }
          );
          console.log("debit reponse", res);
          showModalFun(tournamentId);
          toggleWallet(!wallet)
          updateWalletBalance(res.closing_balance)
        } else {
          handleClearRegisteredUser(tournamentId)
          logEvent(
            {
              screen: screen.tournamentList_p,
              event: events.conformationApiFailure,
            },
            {
              title: "debit coins request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentId: tournamentId,
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
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        console.log(">>>>> err >>>>>", err);
        logEvent(
          {
            screen: screen.tournamentList_p,
            event: events.conformationApiFailure,
          },
          {
            title: "debit coins request failed",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
            others: {
              tournamentId: tournamentId,
              err: errObj,
            },
          }
        );
      });
  };
  const showModalFun = (tournamentId) => {
    // Room ID and Password are visible in match description before 15 minutes.
    const modalData = {
      title: text.confirmation[lang],
      body: text.congratulations[lang],
      subDescription:text.confirmationText[lang],
      buttons: [
        {
          label: text.okay[lang],
          action: "close",
          buttonColor: "bg-tabsColor",
          textColor: "text-white",
        },
      ],
      icon: confirmationIcon,
      hideClose: true,
      handleClick: function (button) {
        if (button === "close") {
          setActiveDate(activeDate);
          logEvent(
            {
              screen: screen.tournamentList_p,
              event: events.okayClicked,
            },
            {
              title: "Confirmation Modal Closed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentId: tournamentId,
              },
            }
          );

          handleShowModal(false);
        }
      },
    };
    handleShowModal(true, modalData);
  };

  const handleClearRegisteredUser  = (tournamentId) =>{
    clearRegisteredUser(tournamentId).then(()=>{
      setJoined(joined +1 )
    }).catch((err)=>{
      console.log(err)
    })
  }

  const getBackgroundColor = (displayStatus, teamType, weeklyTournament) => {
    if (weeklyTournament) {
      return "bg-megaTournament";
    } else if (
      displayStatus.toLowerCase() === "full" ||
      displayStatus.toLowerCase() === "closed"
    ) {
      return "bg-gradient-to-r from-tGray to-tGrayDark";
    } else {
      if (teamType.toLowerCase() === "solo") {
        return "bg-gradient-to-r from-tRed to-tRedDark";
      } else if (teamType.toLowerCase() === "squad") {
        return "bg-gradient-to-r from-tLightBlue to-tDarkBlue";
      }
    }
  };
  const getDisplayStatusColor = (displayStatus) => {
    if (displayStatus.toLowerCase() === "join") {
      return "bg-tBlue";
    } else if (displayStatus.toLowerCase() === "full") {
      return "bg-tRed";
    } else if (displayStatus.toLowerCase() === "closed") {
      return "bg-tGray";
    } else {
      return "bg-tBlue";
    }
  };

  const handleCopyText = (data, password) => {
    if (!password) {
      logEvent(
        {
          screen: screen.tournamentList_p,
          event: events.roomIdCopy,
        },
        {
          title: "roomId copied",
          date: new Date(),
          code: tempObj.code,
          mobile: tempObj.number,
          others: {
            roomId: data,
            tournamentSummaryId: tournamentSummaryId,
          },
        }
      );
    } else {
      logEvent(
        {
          screen: screen.tournamentList_p,
          event: events.passwordCopy,
        },
        {
          title: "password copied",
          date: new Date(),
          code: tempObj.code,
          mobile: tempObj.number,
          others: {
            roomId: data,
            tournamentSummaryId: tournamentSummaryId,
          },
        }
      );
    }
    navigator.clipboard.writeText(data);
    setShowCopyAlert(true);
    setTimeout(() => {
      setShowCopyAlert(false);
    }, 3000);
  };

  const handleShowPrizeModal = (
    tournamentType,
    tournamentId,
    capacity,
    players,
    prizeMoney
  ) => {
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'tournament';
    guiDataEvent['event'] = 'pricelist_click';
    guiDataEvent['tour_id'] = tournamentId;
    SendGuiDataEvents(guiDataEvent);
    setTournamentType(tournamentType);
    setPrizeList(!tournamentType);
    setPrizePool({ tournamentId, capacity, players });
    setPrizeMoney(prizeMoney);
    setShowPrizeModal(true);
  };

  const getLocalTime = (date) => {
    date = date.split("+")[0];
    var stillUtc = moment.utc(date).toDate();
    var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    // const localDate = new Date(date + "Z").toLocaleString();
    return local.split(" ")[1].split(":").splice(0,2).join(":");
  };

  return (
    <div className="pb-4">
      {showPrizeModal && (
        <TournamentPrizePool
          tournamentType={tournamentType}
          setShowPrizeModal={setShowPrizeModal}
          prizeList={prizeList}
          id={tournamentSummaryId}
          prizePool={prizePool}
          prizeMoney={prizeMoney}
          text={text}
          lang={lang}
        />
      )}
      
      <TournamentHeader
        userGameId={userGameId}
        text={text}
        lang={lang}
      />

      <div className="mt-2">
        <TournamentCalender
          activeDate={activeDate}
          handleSelectDate={(date) => {
            logEvent(
              {
                screen: screen.tournamentList_p,
                event: events.calenderBtnClick,
              },
              {
                title: "Date Calender Button Clicked",
                date: new Date(),
                code: tempObj.code,
                mobile: tempObj.number,
                others: {
                  activeDate: date,
                  tournamentId: tournamentSummaryId,
                },
              }
            );
            setActiveDate(date);
          }}
        />
        {tournamentData && tournamentData.length > 0 ? (
          tournamentData.map((item) => (
            <TournamentCard
              id={item.index}
              key={item.index}
              image={item.image}
              time={item.startDatetime && getLocalTime(item.startDatetime)}
              tournamentStatus={
                item.tournamentStatus
                  ? item.tournamentStatus.toUpperCase()
                  : item.tournamentStatus
              }
              displayStatus={
                item.displayStatus ? item.displayStatus.toUpperCase() : ""
              }
              // joininginfoMessage={item.joininginfoMessage}
              joininginfoMessage = {`Room ID болон нууц үгийг тэмцээн эхлэхээс ${item.regisCloseDuration} минутын өмнө гарч ирэх болно`}
              players={item.usersRegistered}
              capacity={item.capacity}
              map={item.mapType}
              teamType={item.gameType}
              prizeMoney={item.prizeMoney}
              entryFees={item.entryFee}
              weeklyTournament={false}
              type={"current"}
              roomId={item.roomId}
              password={item.password}
              handleCopyText={handleCopyText}
              handleShowPrizeModal={handleShowPrizeModal}
              handleJoinTournament={handleJoinTournament}
              tournamentId={item.id}
              backgroundColor={getBackgroundColor(
                item.displayStatus,
                item.gameType,
                false
              )}
              statusBtnColor={
                item.displayStatus && getDisplayStatusColor(item.displayStatus)
              }
              disableJoinBtn = {disableJoinBtn}
              setDisableJoinBtn = {setDisableJoinBtn}
            />
          ))
        ) : loader ? (
          <Loader />
        ) : (
          <div className="pt-20 2xs:pt-12 flex flex-col justify-center items-center">
            <Image url={calenderICon} styles={"h-36 w-36 "} />
            <Text
              tag={"h4"}
              scale={true}
              text={text.comingSoon[lang]}
              styles={"text-white text-opacity-90 font-medium pt-6"}
            />
          </div>
        )}
      </div>
      {showCopyAlert && (
        <Text
          tag={"lable"}
          scale={true}
          text={"Text Copied"}
          fontweight="bold"
          styles="text-white text-sm z-90 text-center fixed bottom-10 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-black-70 px-4 py-1"
        />
      )}
    </div>
  );
};

export default Tournaments;
