import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Text from "../commonComponents/Text";
import useProceedToPay from "../network/useProceedToPay";
import { Context } from "../context/Context";
import Loader from "../commonComponents/Loader";
import ApiNotFound from "./ApiNotFound";
import Image from "../commonComponents/Image";
import Button from "../commonComponents/Button";
import ReactGA from "react-ga";
import WalletBanner from "../subComponents/WalletBanner";
import { WithdrawSuccessText as text } from "../Database/Text";
import { PromoBannerText as bannerText } from "../Database/Text";

function WithdrawSuccess() {
  const history = useHistory();
  const [walletBalance, setWalletBalance] = useState();
  const [loader, showLoader] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [referenceNum, setReferenceNum] = useState("MB9874723102");
  const [lang, setLang] = useState("en");

  const { getLanguage, updateRedirectHome } = useContext(Context);
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const { getBalanceData } = useProceedToPay();

  const verifyIcon =
    require("../assets/wallet-new/withdrawal_successful_verify_tick_white.svg").default;
  const spinWheelBanner =
    require("../assets/wallet-new/spin-wheel-banner.png").default;
  const youtubeBanner =
    require("../assets/wallet-new/youtube-rewards-banner.png").default;

  useEffect(() => {
    return () => {
      if (history.action === "POP") {
        /** Wallet page back button will redirect to home page */
        updateRedirectHome(true);
        history.push("/wallet");
      }
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());

    getBalanceData().then((res) => {
      setWalletBalance(res.main_balance ? res.main_balance : "");
    });
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  return (
    <section className="bg-gray-100 min-h-screen">
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="bg-walletNewGreen px-6 pb-20 flex justify-between items-center">
            <div>
              <Text
                tag="h4"
                text={text.withdrawalSuccess[lang]}
                textColor="text-white"
              />
              <div className="flex items-center">
                <Image url={coinIcon} styles="h-10 w-10 rounded-full mr-1" />
                <Text
                  tag="h1"
                  text={walletBalance}
                  textColor="text-white"
                  fontweight="bold"
                  styles="py-2"
                />
              </div>
            </div>
            <Image url={verifyIcon} styles="h-10 w-10 rounded-full mr-1" />
          </div>
          <div className="p-2 relative -top-14">
            <div className="bg-white rounded-xl w-full px-6 py-4">
              <Text tag="h6" text={text.cardTitle[lang]} />
              <Text tag="h5" text="9874723102" styles="font-bold pb-4" />
              <Text
                tag="span"
                text={`${text.cardBody[lang]} ${referenceNum}`}
                styles="text-withdrawSucCardGray"
              />
              <div className="flex pt-4">
                <Button
                  type="button"
                  textTag="span"
                  label={text.viewDetails[lang]}
                  size="medium"
                  styles={
                    "capitalize text-tabsColor bg-white border border-gray-200 mr-2"
                  }
                  fullWidth={false}
                  eventHandler={() => history.push("/alltransaction")}
                />
                <Button
                  type="button"
                  textTag="span"
                  label={text.withdrawAnother[lang]}
                  size="medium"
                  styles={
                    "capitalize text-tabsColor bg-white border border-gray-200 ml-2"
                  }
                  fullWidth={false}
                  eventHandler={() => history.push("/withdraw")}
                />
              </div>
            </div>
          </div>

          <div className="px-2 pb-4 bg-gray-100 -mt-16">
            <WalletBanner
              title={bannerText.youtubeUpload[lang]}
              image={youtubeBanner}
              handleClick={() => {
                console.log("YouTube banner clicked!");
              }}
            />
            <WalletBanner
              title={bannerText.spinTheWheel[lang]}
              image={spinWheelBanner}
              handleClick={() => {
                console.log("Spin the wheel banner clicked!");
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default WithdrawSuccess;
