import React, { useState, useEffect, useContext } from "react";
import Text from "../commonComponents/Text";
import WalletHeaderCard from "../subComponents/WalletHeaderCard";
import WalletCard from "../subComponents/WalletCard";
import WalletWinningsCard from "../subComponents/WalletWinningsCard";
import useSubscribe from "../network/useSubscribe";
import { WalletText as text } from "../Database/Text";
import { Context } from "../context/Context";
import useProceedToPay from "../network/useProceedToPay";
import _ from "lodash";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import useTournament from "../network/useTournament";
import ApiNotFound from "./ApiNotFound";

function Wallet() {
  const { checkSubscription } = useSubscribe();
  const [activeWalletBalance, setActiveWalletBalance] = useState();
  const [activeWallet, setActiveWallet] = useState("MOMO");
  const [winningBalance, setWinningBalance] = useState();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const tempObj = reactLocalStorage.getObject("tempObj");
  const [apiFailed, setApiFailed] = useState(false);
  const { getBalanceData } = useProceedToPay();
  const [balance, setBalance] = useState();


  useEffect(() => {
    setLang(getLanguage());
    setActiveWallet("MOMO");
    setIsSubscribed(false);
  }, []);



  useEffect(() => {
    checkSubscription()
      .then((res) => {
        const reason = res.reason ? res.reason : "null";
        ReactGA.event({
            category: "wallet_p",
            action: `check subscription request made - mobile - ${tempObj.number}, date - ${new Date()}, resStatus - ${res.status}, resReason - ${reason}`,
        });
        setIsSubscribed(res.subscription.status);
      })
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        ReactGA.event({
            category: "wallet_p",
            action: `check subscription request failed - mobile - ${tempObj.number}, date - ${new Date()}, err - ${errObj}`,
        });
        console.log(">>>>> CHECK SUBSCRIPTION API ERROR :: ", err);
      });
    getBalanceData()
      .then((res) => {
        const reason = res.reason ? res.reason : "null";
        ReactGA.event({
            category: "wallet_p",
            action: `get balance request made - code - ${tempObj.code}, mobile - ${tempObj.number}, date - ${new Date()}, resStatus - ${res.status}, resReason - ${reason}`,
        });
        setActiveWalletBalance(res.main_balance);
        setWinningBalance(_.has(res, "winningAmount") ? res.winningAmount : 5);
        setBalance(res.main_balance + res.winning_balance)
        console.log("----wallet--->", res);
      })
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        setApiFailed(true);
        ReactGA.event({
            category: "wallet_p",
            action: `get balance request failed -code - ${tempObj.code}, mobile - ${tempObj.number}, date - ${new Date()}, err - ${errObj}`,
        });
        console.error(">>>>> GET BALANCE API ERROR >>>>>", err)
      });
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }


  return (

    <div className="p-1">
      <div className="p-1">
        <WalletHeaderCard
          activeWalletBalance={activeWalletBalance}
          activeWallet={activeWallet}
          isSubscribed={isSubscribed}
          text={text}
          lang={lang}
          balance={balance}
        />
      </div>
      <br />
      <Text
        tag="h3"
        text={text.mobileWallet[lang]}
        textColor="text-lightPurple"
        fontweight="bold"
        styles="pl-1 mb-3"
      />
      <div className="w-full flex">
        <WalletCard
          walletType="MOMO"
          walletBalance={activeWalletBalance}
          activeWallet={activeWallet}
          setActiveWallet={setActiveWallet}
          text={text}
          lang={lang}
        />
        {/* <WalletCard
          walletType="PREPAID"
          walletBalance={activeWalletBalance}
          activeWallet={activeWallet}
          setActiveWallet={setActiveWallet}
          text={text}
          lang={lang}
        /> */}
      </div>
      <br />
      <Text
        tag="h3"
        text={text.mobileMoneyWin[lang]}
        textColor="text-lightPurple"
        fontweight="bold"
        styles="pl-1"
      />

      <div className="w-full p-1">
        <WalletWinningsCard
          walletType="MOMO"
          walletBalance={activeWalletBalance}
          activeWallet={activeWallet}
          setActiveWallet={setActiveWallet}
          text={text}
          lang={lang}
          winningBalance={winningBalance}
        />
        {/* <WalletWinningsCard
          walletType="PREPAID"
          walletBalance={activeWalletBalance}
          activeWallet={activeWallet}
          setActiveWallet={setActiveWallet}
          text={text}
          lang={lang}
        /> */}
      </div>
    </div>
  );
}

export default Wallet;

