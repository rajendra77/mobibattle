import React, { useEffect, useState, useContext } from "react";
import Text from "../commonComponents/Text";
import { WithdrawText as text } from "../Database/Text";
import { PromoBannerText as bannerText } from "../Database/Text";
import SelectAmount from "../commonComponents/SelectAmount";
import PaymentOption from "../commonComponents/PaymentOption";
import Button from "../commonComponents/Button";
import Input from "../commonComponents/Input";
import useProceedToPay from "../network/useProceedToPay";
import { Context } from "../context/Context";
import Loader from "../commonComponents/Loader";
import ApiNotFound from "./ApiNotFound";
import Image from "../commonComponents/Image";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import WalletBanner from "../subComponents/WalletBanner";
import WithdrawDetails from "../subComponents/WithdrawDetails";

function WithdrawNew() {
  const [walletBalance, setWalletBalance] = useState();
  const [activeId, setActiveId] = useState("");
  const [selectedAmount, setSelectedAmount] = useState();
  const [selectedCoins, setSelectedCoins] = useState();
  const [topups, setTopups] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loader, showLoader] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [showWithdrawDetails, setShowWithdrawDetails] = useState(false);
  const [lang, setLang] = useState("en");

  const { getLanguage } = useContext(Context);
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const { getTopupsData, getBalanceData } = useProceedToPay();
  const tempObj = reactLocalStorage.getObject("tempObj");

  const spinWheelBanner =
    require("../assets/wallet-new/spin-wheel-banner.png").default;

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());

    getBalanceData().then((res) => {
      // const reason = res.reason ? res.reason : "null";
      //   ReactGA.event({
      //     category: "wallet_p",
      //     action: `get balance request made - code - ${tempObj.code}, mobile - ${
      //       tempObj.number
      //     }, date - ${new Date()}, resStatus - ${
      //       res.status
      //     }, resReason - ${reason}`,
      //   });
      setWalletBalance(res.main_balance ? res.main_balance : "");
    });
    getTopupsData()
      .then(async (res) => {
        showLoader(false);
        const packs = await JSON.parse(res.packs);
        if (!packs || packs.length === 0) {
          setDisabled(true);
        } else {
          setActiveId(packs[0].id);
          setSelectedAmount(packs[0].amount);
          setSelectedCoins(packs[0].credits);
          setTopups(packs);
        }
      })
      .catch((err) => {
        console.log(">>>>> GET TOPUPS API ERROR >>>>>", err);
        showLoader(false);
        setApiFailed(true);
      });
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  const handleClick = (id, amount, coins) => {
    ReactGA.event({
      category: "addAmount_p",
      action: `${amount} amount button selected - mobile - ${
        tempObj.number
      }, date - ${new Date()}`,
    });
    setDisabled(false);
    setActiveId(id);
    setSelectedAmount(amount);
    setSelectedCoins(coins);
  };

  const handleSubmit = () => {
    // setDisabled(true);
    setShowWithdrawDetails(true);
  };

  return (
    <section className="bg-gray-100 min-h-screen">
      {showWithdrawDetails && (
        <WithdrawDetails
          setShowWithdrawDetails={setShowWithdrawDetails}
          selectedAmount={selectedAmount}
          selectedCoins={selectedCoins}
        />
      )}
      {loader ? (
        <Loader />
      ) : (
        <>
          <div
            id="w-wrapper"
            className="bg-walletNewGreen px-6 py-8 2xs:py-4 3xs:py-4"
          >
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
            <Text
              tag="h4"
              text={text.coinsBalance[lang]}
              textColor="text-white"
            />
          </div>
          <div className="px-3 py-4">
            <Text
              tag="h4"
              text={text.withdrawal[lang]}
              textColor="text-black"
              fontweight="bold"
              styles="my-4"
            />
            {topups && topups.length > 0 ? (
              topups.map((pack, i) => {
                return (
                  <TopupCard
                    key={i}
                    pack={pack}
                    activeId={activeId}
                    handleClick={handleClick}
                    text={text}
                    lang={lang}
                  />
                );
              })
            ) : (
              <Text
                tag="h4"
                text={text.noPacks[lang]}
                fontweight="bold"
                styles="mt-4"
              />
            )}
            <br />
            <Button
              type="button"
              label={text.withdrawCoins[lang]}
              size={"medium"}
              styles={"font-bold text-lg uppercase text-white bg-wallet"}
              eventHandler={handleSubmit}
              isDisabled={disabled}
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

const TopupCard = ({ pack, activeId, handleClick, text, lang }) => {
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const rupeeIcon =
    require("../assets/wallet-new/rupee-symbol_gray.svg").default;
  const tick =
    require("../assets/wallet-new/select_wallet_withdraw_tick_white.svg").default;
  const tick_disbaled =
    require("../assets/wallet-new/select_wallet_withdraw_tick_gray.svg").default;
  return (
    <div
      className={`w-full ${
        activeId === pack.id
          ? "bg-walletNewGreen text-white"
          : "bg-white text-black"
      } flex items-center justify-between p-4 my-2 rounded-xl`}
      onClick={() => handleClick(pack.id, pack.amount, pack.credits)}
    >
      <div className="flex-grow flex flex-col items-start">
        <div className="flex items-center">
          <Image url={coinIcon} styles="h-5 w-5 rounded-full mr-1" />
          <Text
            tag="h4"
            text={`${pack.credits} ${text.coins[lang]}`}
            textColor={activeId === pack.id ? "text-white" : "text-black"}
            fontweight="bold"
          />
        </div>
        <div className="flex items-center">
          <Image url={rupeeIcon} styles="h-5 w-5 rounded-full mr-1" />
          <Text
            tag="h5"
            text={`${pack.amount} ${text.coins[lang]}`}
            textColor={activeId === pack.id ? "text-white" : "text-black"}
          />
        </div>
      </div>
      <div>
        <Image
          url={activeId === pack.id ? tick : tick_disbaled}
          styles={"h-8 w-8"}
        />
      </div>
    </div>
  );
};

export default WithdrawNew;
