import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Text from "../commonComponents/Text";
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
import { BuyCoinText } from "../Database/Text";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import WalletBanner from "../subComponents/WalletBanner";

function AddCoinsNew() {
  const history = useHistory();
  const [activeId, setActiveId] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [topups, setTopups] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loader, showLoader] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(1);
  const [mcdToUsd] = useState(1 / 20);
  const [lang, setLang] = useState("en");
  const { updateWalletBalance, getLanguage } = useContext(Context);
  const { getTopupsData, sendProceedToPayData } = useProceedToPay();
  const tempObj = reactLocalStorage.getObject("tempObj");
  console.log("amount::", selectedAmount, " quantity::", quantity);

  const spinWheelBanner =
    require("../assets/wallet-new/spin-wheel-banner.png").default;

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
    getTopupsData()
      .then(async (res) => {
        showLoader(false);
        const packs = await JSON.parse(res.packs);
        console.log("PACKSSSS : ", res.packs);
        if (!packs || packs.length === 0) {
          setDisabled(true);
        } else {
          setActiveId(packs[0].id);
          setSelectedAmount(packs[0].credits);
          setQuantity(packs[0].amount);
          setTopups(packs);
          // res.suggested_currency === "" && setDisabled(true);
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

  const handleClick = (id, amount, quantity) => {
    ReactGA.event({
      category: "addAmount_p",
      action: `${amount} amount button selected - mobile - ${
        tempObj.number
      }, date - ${new Date()}`,
    });
    setDisabled(false);
    setActiveId(id);
    setSelectedAmount(amount);
    setQuantity(quantity);
  };

  const handleSubmit = () => {
    setDisabled(true);
    sendProceedToPayData(selectedAmount, quantity)
      .then(async (res) => {
        console.log("res::", res);
        if (res.status.toUpperCase() === "SUCCESS") {
          const data = await JSON.parse(res.walletResponse);
          const arr = data.actions;
          const paytmUrl = arr[0].url;
          console.log(paytmUrl);
          window.location.href = paytmUrl;
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(">>>>> ADD COINS API ERROR >>>>>", err);
        setApiFailed(true);
      });
    // history.push("/paymentConf");
  };

  return (
    <section className="px-3 py-2 bg-gray-100 min-h-screen">
      {loader ? (
        <Loader />
      ) : (
        <>
          {topups && topups.length > 0 ? (
            topups.map((pack, i) => {
              return (
                <TopupCard
                  key={i}
                  pack={pack}
                  activeId={activeId}
                  handleClick={handleClick}
                  text={BuyCoinText}
                  lang={lang}
                />
              );
            })
          ) : (
            <Text
              tag="h4"
              text={BuyCoinText.noPacks[lang]}
              fontweight="bold"
              styles="text-center mt-4"
            />
          )}
          <Button
            type="button"
            label={BuyCoinText.addOrProceed[lang]}
            action={"addMoney"}
            size={"medium"}
            styles={"font-bold text-lg uppercase text-white bg-wallet mt-6"}
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
            text={`${pack.amount} ${text.rupees[lang]}`}
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

export default AddCoinsNew;
