import React, { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Context } from "../context/Context";
import Text from "../commonComponents/Text";
import PaymentOption from "../commonComponents/PaymentOption";
import Button from "../commonComponents/Button";
import Input from "../commonComponents/Input";
import queryString from "query-string";
import useProceedToPay from "../network/useProceedToPay";
import Image from "../commonComponents/Image";
import {
  WithdrawText as text,
  BalanceWithdrawModalText as balWithdrawText,
} from "../Database/Text";
import _ from "lodash";
import ApiNotFound from "./ApiNotFound";
import Loader from "../commonComponents/Loader";
import ProcessingPage from "../commonComponents/ProcessingPage";
import {SendGuiDataEvents} from '../commonScript';
import { reactLocalStorage } from "reactjs-localstorage";
import { Base64 } from "js-base64";


function Withdraw() {
  console.log("-----withdraw----->");
  const [selectedAmount, setSelectedAmount] = useState("0");
  const [disabled, setDisabled] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState(1);
  const [lang, setLang] = useState("en");
  const [loader, showLoader] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [mainBalance, setMainBalance] = useState();
  const [winningBalance, setWinningBalance] = useState();
  const [showProcessing, setShowProcessing] = useState(false);
  const [fetchBalance, setFetchBalance] = useState(false);
  const { getLanguage, handleShowModal } = useContext(Context);
  const { withdrawCoin, getBalanceData } = useProceedToPay();
  const { search } = useLocation();
  let { wType } = queryString.parse(search);
  wType = wType && Base64.decode(wType);

  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;

  useEffect(() => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'withdraw';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
  }, [getLanguage]);

  useEffect(() => {
    getBalanceData()
      .then((res) => {
        setMainBalance(res.main_balance);
        setWinningBalance(
          _.has(res, "winning_balance") ? res.winning_balance : 0
        );
        showLoader(false);
        console.log("----wallet--->", res);
      })
      .catch((err) => {
        setApiFailed(true);
        console.log(">>>>> GET BALANCE API ERROR >>>>>", err);
      });
  }, [fetchBalance]);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  const handleInputChange = (e) => {
    if (e.target.value > 0 && !e.target.value.includes(".")) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    setSelectedAmount(e.target.value);
  };

  const handleCloseChange = () => {
    setSelectedAmount("");
    setDisabled(true);
  };

  const handleSubmit = () => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'withdraw';
    guiDataEvent['event'] = 'withdraw_click';
    guiDataEvent['amount'] = selectedAmount;
    SendGuiDataEvents(guiDataEvent);
    setDisabled(true);
    if (selectedAmount > 5000) {
      const modalData = {
        title: "",
        body: text.limitExceededMsg[lang],
        icon : require("../assets/mtncongo/oops_busy_player.png").default,
        buttons: [
          {
            label: text.okay[lang],
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
    } else if (selectedAmount < 100) {
      const modalData = {
        title: "",
        body: text.limitFallshortMsg[lang],
        icon : require("../assets/mtncongo/oops_busy_player.png").default,
        buttons: [
          {
            label: text.okay[lang],
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
    } else {

      setShowProcessing(true);
      withdrawCoin(selectedAmount, wType.toUpperCase())
        .then(
          (res) => {
            if (res.status.toUpperCase() === "SUCCESS") {
              setFetchBalance(!fetchBalance);
              setSelectedAmount("0")
              setShowProcessing(false);
              const modalData = {
                title: balWithdrawText.title[lang],
                body: balWithdrawText.body[lang],
                icon: require("../assets/mtncongo/redemption_successful_icon.png")
                  .default,
                buttons: [
                  {
                    label: balWithdrawText.okayButton[lang],
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
              // history.replace("wallet");
              // updateWalletBalance(res.balance);
            }
          },
          (err) => {
            setShowProcessing(false);
            console.log(err);
          }
        )
        .catch((err) => {
          setShowProcessing(false);
          console.error(err);
        });
    }
  };

  const showPaymentCards = () => {
    const paymentCards = [
      // {
      //   id: 1,
      //   option: text.mpesa[lang],
      //   icon: require("../assets/wallet-icon/m-pesa_logo_withdraw.svg").default,
      // },
      {
        id: 1,
        option: text.prepaidRecharge[lang],
        icon: require("../assets/wallet-icon/prepaid_balance_icon.png").default,
      },
    ];

    return paymentCards.map((item) => {
      return (
        <div className="px-3 w-full py-1" key={item.id}>
          <PaymentOption
            id={item.id}
            type="button"
            label={item.option}
            action={"addMoney"}
            background={"buyCoin"}
            size={"large"}
            textStyles="font-medium text-white"
            styles={"text-lg"}
            eventHandler={(id) => setSelectedWallet(id)}
            icon={item.icon}
            iconStyle="h-8 w-16"
            selectedItem={selectedWallet}
          />
        </div>
      );
    });
  };

  const blockInvalidChar = (e) =>
    ["e", "E", ".", "-"].includes(e.key) && e.preventDefault();

  return (
    <section className="min-h-screen">
      {loader && <Loader />}
      {showProcessing ? (
        <ProcessingPage />
      ) : (
        <>
          <div className="py-4">
            <div className="flex items-center py-4 pl-5 ">
              <Text
                tag="h5"
                scale={true}
                text={text.withdrawReward[lang]}
                fontweight="bold"
                styles="text-white"
              />
              <Image url={coinIcon} styles={"h-5 w-5 mx-1"} />
              <Text
                tag="h5"
                scale={true}
                text={wType === "winningBalance" ? winningBalance : mainBalance}
                fontweight="bold"
                styles="text-white"
              />
            </div>

            <div className="p-2 relative">
              <div className="top-0 absolute left-5 pr-5 top-4">
                <Image url={coinIcon} styles={"h-8 w-8 mt-1 ml-2"} />
              </div>
              <div className="pl-3 pr-3">
                <Input
                  type={"number"}
                  value={selectedAmount}
                  eventHandler={handleInputChange}
                  blockKeys={blockInvalidChar}
                  styles="placeholder:w-20 text-white p-3 w-full font-bold outline-none border border-moneyBorder rounded-xl text-3xl bg-black bg-opacity-0 pl-12"
                  min={"0"}
                  step={"1"}
                  onFocus ={()=> setSelectedAmount("")}
                  // placeholderText = {text.inputMsg[lang]}
                />
              </div>
              <div className="right-0 absolute top-1/3 right-6 flex" onClick={handleInputChange}>
                {selectedAmount === '0' && <Text
                  tag="span"
                  scale={true}
                  styles="pr-2 pt-1 text-white"
                  text={`${
                    selectedAmount !== "" ? `${text.inputMsg[lang]}` : ""
                  }`}
                  fontweight="bold"
                />}
                <Image
                  url={
                    require("../assets/wallet-icon/delete_amount.svg").default
                  }
                  styles={"h-6 w-6"}
                  handleClick={handleCloseChange}
                />
              </div>
            </div>

            <div className="flex items-center pl-5 pb-5">
              {/* <Text
                text={`${text.withdrawallimit[lang]}`}
                tag="span"
                scale={true}
                fontweight="normal"
                styles="text-white"
              /> */}
              <Text
                text={`${text.minimum[lang]}`}
                tag="span"
                scale={true}
                fontweight="normal"
                styles="text-white"
              />
              <Image
                url={coinIcon}
                styles={"h-3 w-3 mx-1"}
                handleClick={handleCloseChange}
              />
              <Text
                text={` 100 | ${text.maximum[lang]}`}
                tag="span"
                scale={true}
                fontweight="normal"
                styles="text-white"
              />
              <Image
                url={coinIcon}
                styles={"h-3 w-3 mx-1"}
                handleClick={handleCloseChange}
              />
              <Text
               text={`5000`}
                tag="span"
                scale={true}
                fontweight="normal"
                styles="text-white"
              />
            </div>
          </div>
          {/* <Text
            tag="h4"
            scale={true}
            styles="pl-4 py-3 text-white"
            text={text.withdrawalMethods[lang]}
            fontweight="bold"
          /> */}
          {showPaymentCards()}
          <div className="w-full pb-5 pt-3 px-3 max-w-500px m-auto ">
            <Button
              type="button"
              label={text.proceedToWithdraw[lang]}
              action={"addMoney"}
              size={"medium"}
              styles={"font-bold text-lg text-white bg-wallet"}
              eventHandler={handleSubmit}
              isDisabled={disabled}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default Withdraw;
