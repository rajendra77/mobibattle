import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import Button from "../commonComponents/Button";
import Input from "../commonComponents/Input";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import useTournament from "../network/useTournament";
import { reactLocalStorage } from "reactjs-localstorage";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { tournamentText as text, errorCodes } from "../Database/Text";
import useSubscribe from "../network/useSubscribe";
import useProceedToPay from "../network/useProceedToPay";
import { Base64 } from "js-base64";
import { SendGuiDataEvents } from "../commonScript";

const TournamentUserName = () => {
  const {
    getGameId,
    joinTournament,
    debitCoinsTournament,
    handleClearRegisteredUser,
  } = useTournament();
  const history = useHistory();
  let { search } = useLocation();
  const { tournamentSummaryId, id, entryFees } = queryString.parse(search);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [name, setName] = useState("");
  const { handleShowModal, getLanguage } = useContext(Context);
  const [disabled, setDisabled] = useState(true);
  const [lang, setLang] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mainBalance, setMainBalance] = useState();
  const [wallet, toggleWallet] = useState(false);
  const { checkSubscription } = useSubscribe();
  const { getBalanceData } = useProceedToPay();

  const back_icon = require("../assets/svg-icons/back_arrow_white.svg").default;
  const curveLine = require("../assets/tImages/curve_line.svg").default;
  const confirmationIcon =
    require("../assets/tImages/confirmation_tick_icon.svg").default;
  const lowBalanceIcon =
    require("../assets/modal-icons/low_wallet_balance_icon.svg").default;
  const step1 = require("../assets/tImages/step1.jpg").default;
  const step2 = require("../assets/tImages/step2.jpg").default;
  const step3 = require("../assets/tImages/step3.jpg").default;
  const step4 = require("../assets/tImages/step4.jpg").default;
  const step5 = require("../assets/tImages/step5.jpg").default;
  const freeFire1 = require("../assets/tImages/freeFire_screen1.png").default;
  const freeFire2 = require("../assets/tImages/freeFire_screen2.png").default;

  const tempObj = reactLocalStorage.getObject("tempObj");

  useEffect(() => {
    setLang(getLanguage());
    setDisabled(() => (name.length >= 1 ? false : true));
  }, [name]);

  useEffect(() => {
    //send gui events
    let guiDataEvent = {};
    guiDataEvent["page"] = "tournament_username";
    guiDataEvent["event"] = "open";
    SendGuiDataEvents(guiDataEvent);
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

  useEffect(() => {
    getBalanceData()
      .then((res) => {
        setMainBalance(res.main_balance);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [wallet]);

  useEffect(() => {
    const userGameId = reactLocalStorage.get("userGameId");
    setName(
      userGameId != "" && userGameId != "null" && userGameId != undefined
        ? Base64.decode(userGameId)
        : ""
    );
    setTournamentName(reactLocalStorage.get("tournamentName"));
    setTournamentId(reactLocalStorage.get("tournamentSummaryId"));
  }, []);

  const updateGameId = (name) => {
    //send gui events
    let guiDataEvent = {};
    guiDataEvent["page"] = "tournament_username";
    guiDataEvent["event"] = "save_username_click";
    SendGuiDataEvents(guiDataEvent);
    // if (tournamentSummaryId) {
    //   handleJoinTournament();
    // } else {
    setDisabled();
    getGameId(Base64.encode(name))
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
          logEvent(
            {
              screen: screen.tournamentUserName_p,
              event: events.addGameIdApiSuccess,
            },
            {
              title: "add gameId request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentName: tournamentName,
                tournamentId: tournamentId,
                resStatus: res.status,
                resReason: reason,
              },
            }
          );
          console.log("gameId updated successfull");
          reactLocalStorage.set("userGameId", res.userGameId);
          if (tournamentSummaryId) {
            handleJoinTournament();
          } else {
            history.goBack();
          }
        } else {
          logEvent(
            {
              screen: screen.tournamentUserName_p,
              event: events.addGameIdApiFailure,
            },
            {
              title: "add gameId request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                tournamentName: tournamentName,
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
          errObj = `${msg} due to internet disconnected, statusCode: 503`;
        } else {
          errObj = err;
        }
        console.log(">>>>> err >>>>>", err);
        logEvent(
          {
            screen: screen.tournamentUserName_p,
            event: events.addGameIdApiFailure,
          },
          {
            title: "add gameId request failed",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
            others: {
              tournamentName: tournamentName,
              tournamentId: tournamentId,
              err: errObj,
            },
          }
        );
        history.goBack();
      });
  };

  const handleJoinTournament = () => {
    //send gui events
    let guiDataEvent = {};
    guiDataEvent["page"] = "tournamentusername";
    guiDataEvent["event"] = "join_click";
    guiDataEvent["tourid"] = id;
    SendGuiDataEvents(guiDataEvent);
    if (!subscribed && mainBalance < entryFees) {
      history.push(`/subscription?subType=combo`);
      return;
    } else if (!subscribed) {
      history.push(`/subscription`);
      return;
    }
    joinTournament(id, tournamentSummaryId, Base64.encode(name))
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
          debitCoinsTournamentfunc(id, Base64.encode(name));
        } else if (
          res.status.toUpperCase() === "FAILURE" &&
          res.statusCode === 1038
        ) {
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
        } else {
          const modalData = {
            title: text.somethingWrongErr[lang],
            body: errorCodes[res.statusCode]["mg"],
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
          errObj = `${msg} due to internet disconnected, statusCode: 503`;
        } else {
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
  };

  const debitCoinsTournamentfunc = (tournamentId, userGameId) => {
    debitCoinsTournament(tournamentId, userGameId)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
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
          setDisabled(false);
          toggleWallet(!wallet);
          getGameId(Base64.encode(name))
            .then((res) => {
              if (res.status.toUpperCase() === "SUCCESS") {
                const reason = res.reason ? res.reason : "null";
                logEvent(
                  {
                    screen: screen.tournamentUserName_p,
                    event: events.addGameIdApiSuccess,
                  },
                  {
                    title: "add gameId request successfull",
                    date: new Date(),
                    code: tempObj.code,
                    mobile: tempObj.number,
                    others: {
                      tournamentName: tournamentName,
                      tournamentId: tournamentId,
                      resStatus: res.status,
                      resReason: reason,
                    },
                  }
                );

                reactLocalStorage.set("userGameId", res.userGameId);
                showModalFun();
              } else {
                const modalData = {
                  title: "",
                  body: errorCodes[res.statusCode]["mg"],
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
                    screen: screen.tournamentUserName_p,
                    event: events.addGameIdApiFailure,
                  },
                  {
                    title: "add gameId request failed",
                    date: new Date(),
                    code: tempObj.code,
                    mobile: tempObj.number,
                    others: {
                      tournamentName: tournamentName,
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
                errObj = `${msg} due to internet disconnected, statusCode: 503`;
              } else {
                errObj = err;
              }
              console.log(">>>>> err >>>>>", err);
              logEvent(
                {
                  screen: screen.tournamentUserName_p,
                  event: events.addGameIdApiFailure,
                },
                {
                  title: "add gameId request failed",
                  date: new Date(),
                  code: tempObj.code,
                  mobile: tempObj.number,
                  others: {
                    tournamentName: tournamentName,
                    tournamentId: tournamentId,
                    err: errObj,
                  },
                }
              );
            });
        } else {
          handleClearRegisteredUser(tournamentId);
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
          errObj = `${msg} due to internet disconnected, statusCode: 503`;
        } else {
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

  const showModalFun = () => {
    const modalData = {
      title: text.confirmation[lang],
      body: text.congratulations[lang],
      subDescription: text.confirmationText[lang],
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
          handleShowModal(false);
          history.goBack();
        }
      },
    };
    handleShowModal(true, modalData);
  };

  const handleInputChange = (e) => {
    if (e.target.value === " ") {
      return;
    }
    setName(e.target.value);
  };

  const handleSubmit = () => {
    logEvent(
      {
        screen: screen.tournamentUserName_p,
        event: events.saveButtonClick,
      },
      {
        title: "Save Button Clicked",
        date: new Date(),
        code: tempObj.code,
        mobile: tempObj.number,
        others: {
          tournamentName: tournamentName,
          tournamentId: tournamentSummaryId,
        },
      }
    );
    setDisabled(true);
    updateGameId(name);
  };

  return (
    <div className="flex">
      <div className="w-full max-w-500px bg-tHeader flex flex-col fixed top-0 z-50 pt-8">
        <div className="flex items-center px-2 pb-4">
          <Image
            url={back_icon}
            styles="h-8 w-8"
            handleClick={() => {
              history.goBack();
            }}
          />
          <Text
            tag={"h4"}
            scale={true}
            text={`${text.add[lang]} ${tournamentName} ${text.name[lang]}`}
            styles="text-white font-bold float-right pr-2"
          />
        </div>
        <Image url={curveLine} styles="w-full" />
      </div>
      <div className="px-3 mt-12 3xs:mt-16">
        <div className="w-full bg-wallet-card rounded-xl p-4 text-center">
          <Text
            tag={"h3"}
            scale={true}
            text={`${text.addChange[lang]} ${tournamentName} ${text.username[lang]}`}
            fontweight="bold"
            styles="text-white py-4"
          />
          <Text
            tag={"h5"}
            scale={true}
            text={`${text.enterYour[lang]} ${tournamentName} ${text.username[lang]}`}
            fontweight="bold"
            styles="text-white py-2"
          />
          <Text
            tag={"h5"}
            scale={true}
            text={`${text.followSteps[lang]} ${tournamentName} ${text.username[lang]}`}
            styles="text-white"
          />
          <div className="pt-6">
            <Input
              type={"text"}
              value={name}
              eventHandler={handleInputChange}
              placeholderText={`${text.enter[lang]} ${tournamentName} ${text.username[lang]}`}
              styles="w-full h-16 outline-none border-b-2 border-white text-white text-xl bg-black bg-opacity-0 text-center"
            />
          </div>
          <Button
            type="submit"
            size="medium"
            label={text.save[lang]}
            eventHandler={handleSubmit}
            isDisabled={disabled}
            styles={`font-bold text-white ${
              disabled ? "bg-lightgray" : "bg-tabsColor"
            }  my-4`}
          />
        </div>

        <div className="flex-col mt-10 justtify-between mb-2">
          <div className="mr-2 mb-4">
            <Text
              tag={"lable"}
              scale={true}
              text={text.bottomLine1[lang]}
              styles="text-white font-medium pb-2 text-sm"
            />
            <Image url={step1} styles="rounded-md" />
          </div>
          <div className="mr-2 mb-4">
            <Text
              tag={"lable"}
              scale={true}
              text={text.bottomLine2[lang]}
              styles="text-white font-medium pb-2 text-sm"
            />
            <Image url={step2} styles="rounded-md" />
          </div>
          <div className="mr-2 mb-4">
            <Text
              tag={"lable"}
              scale={true}
              text={text.bottomLine3[lang]}
              styles="text-white font-medium pb-2 text-sm"
            />
            <Image url={step3} styles="rounded-md" />
          </div>
          <div className="mr-2 mb-4">
            <Text
              tag={"lable"}
              scale={true}
              text={text.bottomLine4[lang]}
              styles="text-white font-medium pb-2 text-sm"
            />
            <Image url={step4} styles="rounded-md" />
          </div>
          <div className="mr-2 mb-4">
            <Text
              tag={"lable"}
              scale={true}
              text={text.bottomLine5[lang]}
              styles="text-white font-medium pb-2 text-sm"
            />
            <Image url={step5} styles="rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentUserName;
