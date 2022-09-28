import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import WalletWinningsCardNew from "../subComponents/WalletWinningsCardNew";
import useSubscribe from "../network/useSubscribe";
import { WalletText as text, BuyCoinText } from "../Database/Text";
import { Context } from "../context/Context";
import useProceedToPay from "../network/useProceedToPay";
import _ from "lodash";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import WalletHeaderCard from "../subComponents/WalletHeaderCard";
import ApiNotFound from "./ApiNotFound";
import Text from "../commonComponents/Text";
import SelectAmount from "../commonComponents/SelectAmount";
import Button from "../commonComponents/Button";
import dateInMonthFormat from "../utils/dateInMonthFormat";
import cx from "classnames";
import Loader from "../commonComponents/Loader";
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';

function WalletNew() {
  const [activeWalletBalance, setActiveWalletBalance] = useState();
  const [activeWallet, setActiveWallet] = useState("MOMO");
  const [winningBalance, setWinningBalance] = useState();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lang, setLang] = useState("en");
  const [apiFailed, setApiFailed] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [topups, setTopups] = useState([]);
  const [loader, showLoader] = useState(true);
  const [endDate, setEndDate] = useState("");
  const { getLanguage } = useContext(Context);
  const [disabled, setDisabled] = useState(true);
  const { getBalanceData, getTopupsData } = useProceedToPay();
  const { checkSubscription } = useSubscribe();
  const history = useHistory();
  const tempObj = reactLocalStorage.getObject("tempObj");
  const [balance, setBalance] = useState();

  useEffect (() => {
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'wallet';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  },[])

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
    setActiveWallet("MOMO");
    setIsSubscribed(false);
  }, []);
  

  useEffect(() => {
    checkSubscription()
      .then((res) => {
        reactLocalStorage.set(
          "subStatus",
          res.currentStatus.toLowerCase()
        );
        if (res.status.toUpperCase() === "SUCCESS") {
        
          const dateObj = dateInMonthFormat(res.cdrEndDate);
          setEndDate(dateObj.dt + " " + dateObj.monthName + " " + dateObj.year);
          setIsSubscribed(true);
        } else if (res.status.toUpperCase() === "FAILURE") {
          setIsSubscribed(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsSubscribed(false);
      });
    getBalanceData()
      .then((res) => {
        const reason = res.reason ? res.reason : "null";
        ReactGA.event({
          category: "wallet_p",
          action: `get balance request made - code - ${
            tempObj.code
          },  mobile - ${tempObj.number}, date - ${new Date()}, resStatus - ${
            res.status
          }, resReason - ${reason}`,
        });
        setBalance(res.main_balance + res.winning_balance);
        setActiveWalletBalance(res.main_balance);
        setWinningBalance(
          _.has(res, "winning_balance") ? res.winning_balance : 0
        );
        showLoader(false);
        console.log("----wallet--->", res);
      })
      .catch((err) => {
        let errObj;
        const msg = err.message;
        if (msg === "Failed to fetch") {
          errObj = `${msg} due to internet disconnected, statusCode: 503`;
        } else {
          errObj = err;
        }
        setApiFailed(true);
        ReactGA.event({
          category: "wallet_p",
          action: `get balance request failed - code - ${
            tempObj.code
          }, mobile - ${tempObj.number}, date - ${new Date()}, err - ${errObj}`,
        });
        console.log(">>>>> GET BALANCE API ERROR >>>>>", err);
      });
  }, []);

  useEffect(() => {
    getTopupsData()
      .then((res) => {
        const packs = JSON.parse(res.packs);
        packs.sort((a, b) => {
          return a.amount - b.amount;
        });
        console.log("packs", packs);
        const newPacks = packs.filter((item) => item.linkedEventId == null);
        setTopups(newPacks);
      })
      .catch((err) => {
        console.log(">>>>> GET TOPUPS API ERROR >>>>>", err);
        setApiFailed(true);
      });
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  const handleClick = (id, amount) => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'wallet';
    guiDataEvent['event'] = 'coinpack_click';
    guiDataEvent['amount'] = amount;
    SendGuiDataEvents(guiDataEvent);
    ReactGA.event({
      category: "addAmount_p",
      action: `${amount} amount button selected - mobile - ${
        tempObj.number
      }, date - ${new Date()}`,
    });
    setActiveId(id);
    setDisabled(false);
  };

  const handleSubmit = () => {
    history.push(`addamount?packId=${Base64.encode(activeId)}`);
  };

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <React.Fragment>
      {loader && <Loader />}
      <div className={`min-h-screen ${loaderClass}`}>
        <WalletHeaderCard
          activeWalletBalance={activeWalletBalance + winningBalance}
          activeWallet={activeWallet}
          isSubscribed={isSubscribed}
          text={text}
          lang={lang}
          endDate={endDate}
          balance={balance}
        />
        <div className="w-full py-1">
          <WalletWinningsCardNew
            type="mainBalance"
            walletBalance={activeWalletBalance}
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
            text={text}
            lang={lang}
            coins={activeWalletBalance}
          />
          <WalletWinningsCardNew
            type="winningBalance"
            walletBalance={activeWalletBalance}
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
            text={text}
            lang={lang}
            coins={winningBalance}
          />
        </div>
        <div className="pt-4 px-3">
          <Text
            tag="h4"
            scale={true}
            text={text.selectRecharge[lang]}
            fontweight="bold"
            styles="pl-2 text-white"
          />

          <SelectAmount
            amountData={topups}
            handleClick={handleClick}
            activeId={activeId}
          />
          {topups && topups.length > 0 && (
            <Button
              type="button"
              label={BuyCoinText.proceedToPay[lang]}
              isDisabled={disabled}
              action={"addMoney"}
              size={"medium"}
              styles={"font-bold text-lg  text-white bg-wallet"}
              eventHandler={handleSubmit}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default WalletNew;
