import { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import config from "../config/Config";
import { Context } from "../context/Context";
import { reactLocalStorage } from "reactjs-localstorage";
import queryString from "query-string";
import {
  LowBalanceModalText as lowBalText,
  BalanceAddedModalText as balAddedText,
  BalanceWithdrawModalText as balWithdrawTexyt,
  GeneralText,
  WithdrawText,
  errorCodes
} from "../Database/Text";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { Base64 } from "js-base64";


const useProceedToPay = () => {
  const { handleShowModal, getLanguage, updateWalletBalance } =
    useContext(Context);
  const { uniqueId } = reactLocalStorage.getObject("userProfile");
  const lowBalanceIcon =
    require("../assets/modal-icons/low_wallet_balance_icon.svg").default;
  let history = useHistory();
  let { search } = useLocation();
  const { id, tid } = queryString.parse(search);
  const lang = getLanguage();
  const tempObj = reactLocalStorage.getObject("tempObj");

  const getTopupsData = () => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("getTopups") ;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: header,
      })
        .then(async (response) => {
          const data = await response.json();
          const reason = data.reason ? data.reason : ""
          logEvent(
            {
              screen: screen.buyCoin_p,
              event: events.apiSuccess,
            },
            {
              title: "Topups request successfull",
              mobile : tempObj.number,
              others : {
                resStatus : data.status,
                resReason : reason
              }
            }
          );
          if (response.status === 200) {
            resolve(data);
          } else {
            console.log("Get packs failure 1");
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
          logEvent(
            {
              screen: screen.buyCoin_p,
              event: events.apiFailure,
            },
            {
              title: "Topups request failure",
              mobile : tempObj.number,
              others : {
                 err
              }
            }
          );
        });
    });
  };

  const getBalanceData = () => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("getBalance") + `/${uniqueId}`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: header,
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 200) {
            if(data.status.toUpperCase()==="SUCCESS"){
              updateWalletBalance(data.main_balance + data.winning_balance);
              resolve(data);
            }else{
              updateWalletBalance("-");
              reject(data);
            }
          } else {
            updateWalletBalance("-");
            reject(data);
          }
        })
        .catch((err) => {
          updateWalletBalance("-");
          reject(err);
        });
    });
  };

  const sendProceedToPayData = (amount, quantity, packId) => {
    const header = config.get("headers");
    const body = {
      gross_amount: amount,
      payment_category: config.get("paymentCategory"),
      payment_mode: config.get("paymentMode"),
      product_details: [
        {
          id: packId,
          name: packId,
          price: amount,
          quantity: quantity,
        },
      ],
      userId: uniqueId,
    };
    

    const url = config.get("base") + config.get("addCoins");
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          const data = await response.json();
          const reason = data.reason ? data.reason : ""
          logEvent(
            {
              screen: screen.buyCoin_p,
              event: events.apiSuccess,
            },
            {
              title: "Buy coins request successfull",
              mobile : tempObj.number,
              others : {
                resStatus : data.status,
                resReason : reason
              }
            }
          );
          if (data.status.toUpperCase() === "SUCCESS") {
            resolve(data);
         
            const modalData = {
              title: "",
              body:  balAddedText.body1[lang] + amount + balAddedText.body2[lang],
              icon : require("../assets/mtncongo/coins_recharge_successfully_tick_icon.png").default,
              buttons: [
                {
                  label: balAddedText.okayButton[lang],
                  action: "close",
                  buttonColor: "bg-tabsColor",
                  textColor: "text-white",
                },
              ],
              hideClose: true,
              handleClick: function (button) {
                if (button === "close") {
                  handleShowModal(false);
                  if (id) {
                    history.push(`/battleinfo?id=${Base64.encode(id)}`);
                  }else if(tid){
                    history.push(`/tournaments`);
                  }
                }
              },
            };
            handleShowModal(true, modalData);
          } else {
            reject(data);
            let reason = errorCodes[data.statusCode]["mg"];
            if (reason === "TP Parameters invalid") {
              reason = "You don't have sufficient balance in your account."
            }
            const modalData = {
              title: "",
              body: balAddedText.somethingWrongErr[lang],
              icon : require("../assets/mtncongo/oops_busy_player.png").default,
              buttons: [
                {
                  label: balAddedText.okayButton[lang],
                  action: "close",
                  buttonColor: "bg-tabsColor",
                  textColor: "text-white",
                },
              ],
              hideClose: true,
              handleClick: function (button) {
                if (button === "close") {
                  handleShowModal(false);
                  if (id) {
                    history.push(`/battleinfo?id=${Base64.encode(id)}`);
                  } 
                }
              },
            };
            handleShowModal(true, modalData);
          }
        })
        .catch((err) => {
            reject(err);
            logEvent(
              {
                screen: screen.buyCoin_p,
                event: events.apiFailure,
              },
              {
                title: "Buy coins request failed",
                mobile : tempObj.number,
                others : {
                  err
                }
              }
            );
        });
    });
  };

  const withdrawCoin = (coins, walletType) => {
    const header = config.get("headers");
    const body = {
      coins: coins,
      pack_id : "1",
      payToMsisdn: "",
      payToName: "",
      paymentMode: config.get("paymentMode"),
      paymentCategory : config.get("paymentCategory"),
      userId: uniqueId,
      walletType : walletType
    };

    const url = config.get("base") + config.get("withdraw");
    return new Promise((resolve,reject) => {
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          const data = await response.json();
          const reason = data.reason ? data.reason : ""
          logEvent(
            {
              screen: screen.withdraw_p,
              event: events.apiSuccess,
            },
            {
              title: "Withdraw money request successfull",
              mobile : tempObj.number,
              others : {
                resStatus : data.status,
                resReason : reason
              }
            }
          );
          if (data.status.toUpperCase() === "SUCCESS") {
            resolve(data)
          } else {
            let reason
            // const walletRes = JSON.parse(data.walletResponse);
            // if(walletRes.response_code === '4020'){
            //   reason = WithdrawText.oldTxnInProgress[lang]
            // }else{
            //   reason = WithdrawText.somethingWrongErr[lang]
            // }
            reason = WithdrawText.somethingWrongErr[lang]
            reject(data)
            const modalData = {
              title: "",
              body: reason,
              icon : require("../assets/mtncongo/oops_busy_player.png").default,
              buttons: [
                {
                  label: balWithdrawTexyt.okayButton[lang],
                  action: "close",
                  buttonColor: "bg-tabsColor",
                  textColor: "text-white",
                },
              ],
              handleClick: function (button) {
                if (button === "close") {
                  handleShowModal(false);
                }
              },
            };
            handleShowModal(true, modalData);
          }
        })
        .catch((err) => {
          reject(err)
          console.error(err);
          logEvent(
            {
              screen: screen.withdraw_p,
              event: events.apiFailure,
            },
            {
              title: "Withdraw money request failed",
              mobile : tempObj.number,
              others : {
                err : err
              }
            }
          );
        });
    });
  };

  const blockBalance = (gameId, coins) => {
    const header = config.get("headers");
    const reqBody = {
      userId: uniqueId,
      gameId: gameId,
      coins: coins,
    };

    const url = config.get("base") + config.get("playgame");
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(reqBody),
      })
        .then(async (response) => {
          const data = await response.json();
          console.log("data", data);
          if (data.status.toUpperCase() === "SUCCESS") {
            resolve(data);
          } else {
            if (data.statusCode === 1000 || data.reason === "You don't have enough credits for WalletID") {
                  logEvent(
                  {
                    screen: screen.gameDetails_p,
                    event: events.playGameApiSuccess,
                  },
                  {
                    title: "low balance & add amount modal opens",
                    date: new Date(),
                    code: tempObj.code,
                    mobile: tempObj.number,
                    others: {
                      amount: coins,
                      game_id: gameId,
                      resStatus: data.status,
                      resReason: data.response_message,
                    },
                  }
                );
                const modalData = {
                  title: lowBalText.title[lang],
                  body: lowBalText.body[lang],
                  icon: lowBalanceIcon,
                  buttons: [
                    {
                      label: lowBalText.addMoney[lang],
                      action: "addMoney",
                      buttonColor: "bg-tabsColor",
                      textColor: "text-white",
                    },
                  ],
                  handleClick: function (button) {
                    if (button === "addMoney") {
                      logEvent(
                        {
                          screen: screen.gameDetails_p,
                          event: events.addMoneyClick,
                        },
                        {
                          title: "add amount button clicked",
                          date: new Date(),
                          code: tempObj.code,
                          mobile: tempObj.number,
                          others: {
                            amount: coins,
                            game_id: gameId,
                            resStatus: data.status,
                            resReason: data.response_message,
                          },
                        }
                      );
                      handleShowModal(false);
                      history.push(`/addamount?id=${Base64.encode(gameId)}`);
                    }
                  },
                };

                handleShowModal(true, modalData);
            }else {
              const modalData = {
                  title: GeneralText.somethingWrongErr[lang],
                  body: errorCodes[data.statusCode]["mg"],
                  icon : require("../assets/mtncongo/oops_busy_player.png").default,
                  buttons: [
                    {
                      label: GeneralText.okay[lang],
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
            }
          }
        })
        .catch((err) => {
          console.log("INTIATE GAME ERROR -- ", err);
          reject(err);
        });
    });
  };

  return {
    getTopupsData,
    getBalanceData,
    sendProceedToPayData,
    blockBalance,
    withdrawCoin,
  };
};

export default useProceedToPay;
