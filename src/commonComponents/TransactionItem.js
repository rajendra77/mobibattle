import React from "react";
import PropTypes from "prop-types";
import Text from "./Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Image from "./Image";

const TransactionItem = ({
  id,
  transactionType,
  date,
  balance,
  selectedItem,
  handleClick,
  txnId,
  txnStatus,
  txnType,
  image,
  optional,
  text,
  lang,
}) => {
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const upArrow =
    require("../assets/wallet-icon/transaction_up_arrow_icon.svg").default;
  const downArrow =
    require("../assets/wallet-icon/transaction_down_arrow_icon.svg").default;

  const transactionDatailsCard = () => {
    return (
      <div className="bg-darkPurple">
        <div className="border-b border-lightBorder p-3 pl-5">
          <Text
            tag={"h6"}
            scale={true}
            styles="text-lightPurple"
            text={text.transactionId[lang]}
            fontweight="normal"
            alignment="left"
          />
          <Text
            tag={"h6"}
            scale={true}
            styles="text-white"
            text={txnId}
            fontweight="bold"
            alignment="left"
          />
        </div>
        <div className="p-3 pl-5">
          <Text
            text={
              <>
                {text.transactionStatus[lang] + " "}
                <strong
                  className={ 
                    ((txnStatus === "success" || txnStatus === "settlement" || txnStatus === "disputed") && "text-green-500") ||
                    (txnStatus === "pending" && "text-orange") ||
                    (txnStatus === "failed" && "text-red-500")
                  }
                >
                  {" " + txnStatus && text[txnStatus][lang] }
                </strong>

              </>
            }
            tag={"h6"}
            scale={true}
            styles="text-lightPurple"
            fontweight="normal"
            alignment="left"
          />
        </div>
      </div>
    );
  };

  const handleToggle = () => {
    if (selectedItem == id) {
      id = null; // for hiding the opened card
    }
    handleClick(id);
  };

  const getLocalTime = (date) => {
    const localDate = new Date(date + "Z").toLocaleString();
    return localDate.split(",")[1].split(":").splice(0, 2).join(":");
  };

  const coinDeposited =
    require("../assets/wallet-icon/transaction_deposited_icon.svg").default;
  const entryFees =
    require("../assets/wallet-icon/transaction_entry_fees_icon.svg").default;
  const winningGame =
    require("../assets/wallet-icon/transaction_winnings_game_icon.svg").default;

  let gameName;
  if (
    optional &&
    optional !== "wallet" &&
    optional !== "Stall through Scheduler"
  ) {
    let obj = JSON.parse(optional);
    if (obj && obj.gameName) {
      gameName = obj.gameName;
    }
  }

  let txnText = "";
  if (txnType === "WINNING") {
    image = winningGame;
    if (gameName) {
      txnText = text.coinsWon[lang] + " : " + gameName;
    } else {
      txnText = text.coinsWon[lang];
    }
  } else if (txnType === "DEDUCT") {
    image = entryFees;
    if (gameName) {
      txnText = text.entryFee[lang] + " : " + gameName;
    } else {
      txnText = text.entryFee[lang];
    }
  } else if (txnType === "TOPUP") {
    image = coinDeposited;
    if (gameName) {
      txnText = text.bonusCoinsAdded[lang] + " : " + gameName;
    } else {
      txnText = text.bonusCoinsAdded[lang];
    }
  } else if (txnType === "BOOTRETURN" || txnType === "STALLED") {
    image = coinDeposited;
    if (gameName) {
      txnText = text.entryFeeRefund[lang] + " : " + gameName;
    } else {
      txnText = text.entryFeeRefund[lang];
    }
  } else if (txnType === "REDEEM") {
    image = entryFees;
    txnText = text.redeem[lang];
  } else if (txnType === "REFUND") {
    image = entryFees;
    txnText = text.refund[lang];
  }

  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let offset = -new Date().getTimezoneOffset();
  let localHours = offset / 60;
  let localMin = offset % 60;

  let txnDate = new Date(date);
  txnDate.setHours(txnDate.getHours() + localHours);
  txnDate.setMinutes(txnDate.getMinutes() + localMin);

  let year = txnDate.getFullYear();
  let month = txnDate.getMonth();
  let monthName = monthNames[month];
  let dt = txnDate.getDate();
  let hours = txnDate.getHours();
  let minutes = txnDate.getMinutes();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  const ampm = hours >= 12 ? "PM" : "AM";
  date =
    monthName +
    " " +
    dt +
    ", " +
    year +
    ", " +
    hours +
    ":" +
    minutes +
    " " +
    ampm;
  console.log(year + "-" + monthName + "-" + dt);

  return (
    <>
      <div
        onClick={handleToggle}
        className={`flex justify-between border-b border-lightBorder py-4 ${
          id == selectedItem && "bg-darkPurple"
        }`}
      >
        <div className="flex">
          <div className="pt-2 px-4">
            <Image url={image} styles="h-8 w-8 mr-1" />
          </div>
          <div className="flex flex-col">
            <Text
              tag={"h5"}
              scale={true}
              styles="text-white"
              text={txnText}
              alignment="left"
            />
            <Text
              tag={"h6"}
              scale={true}
              styles="text-lightPurple"
              text={date}
              alignment="left"
            />
          </div>
        </div>
        <div className="px-4 flex flex-col items-end">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={
                txnType === "DEDUCT" || txnType === "REDEEM" ? faMinus : faPlus
              }
              color={
                ((txnType === "TOPUP" ||
                  txnType === "BOOTRETURN" ||
                  txnType === "STALLED") &&
                  "orange") ||
                ((txnType === "DEDUCT" || txnType === "REDEEM") && "white") ||
                (txnType === "WINNING" && "green")
              }
              className="mr-1 text-2xs"
            />
            <Image url={coinIcon} styles="h-3 w-3" />
            <div className="ml-1">
              <Text
                tag={"h6"}
                scale={true}
                textColor={
                  ((txnType === "TOPUP" ||
                    txnType === "BOOTRETURN" ||
                    txnType === "STALLED") &&
                    "text-orange") ||
                  ((txnType === "DEDUCT" || txnType === "REDEEM") &&
                    "text-white") ||
                  (txnType === "WINNING" && "text-green-500")
                }
                text={balance}
              />
              {/* <Image
                url={selectedItem == id ? upArrow : downArrow}
                styles="h-5 w-5"
              /> */}
            </div>
          </div>
          <Image
            url={selectedItem == id ? upArrow : downArrow}
            styles="h-5 w-5"
          />
        </div>
      </div>
      {id == selectedItem && transactionDatailsCard()}
    </>
  );
};

TransactionItem.propTypes = {
  id: PropTypes.number,
  transactionType: PropTypes.string,
  date: PropTypes.string,
  balance: PropTypes.number,
  selectedItem: PropTypes.number,
  handleClick: PropTypes.func,
  txnId: PropTypes.string,
  txnStatus: PropTypes.string,
  txnType: PropTypes.string,
  image: PropTypes.string,
};

export default TransactionItem;
