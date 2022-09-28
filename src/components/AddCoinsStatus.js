import React, { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import Text from "../commonComponents/Text";
import { AddCoinsStatusText as text } from "../Database/Text";
import { Context } from "../context/Context";

export default function AddCoinsStatus() {
  const { search } = useLocation();
  let { status } = queryString.parse(search);
  status = status ? status.toUpperCase() : "";
  const { getLanguage } = useContext(Context);
  const [lang, setLang] = useState("en");
  const [date, setDate] = useState("13 June 2020, 10:25 PM");
  const [txnId, setTxnId] = useState("NX2121212121212121212");
  const [paidToName, setPaidToName] = useState("Surendra Yadav");
  const [paidToAcc, setPaidToAcc] = useState("999999996475@byl");
  const [debitedFromAcc, setDebitedFromAcc] = useState("Axis Bank - 6043");
  const [amount, setAmount] = useState("Rs. 500");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div
        className={`py-16 flex flex-col justify-center items-center ${
          status === "SUCCESS"
            ? "bg-addCoinsSuccess"
            : status === "FAILURE"
            ? "bg-addCoinsFailure"
            : "bg-addCoinsProcessing"
        }`}
      >
        <Text
          tag="h3"
          text={
            status === "SUCCESS"
              ? text.headingSuccess[lang]
              : status === "FAILURE"
              ? text.headingFailure[lang]
              : text.headingProcessing[lang]
          }
          textColor="text-white"
          fontweight="bold"
        />
        <Text tag="h6" text={date} textColor="text-white" />
      </div>
      <div className="border-b-4 border-gray-300 p-4">
        <Text tag="h6" text={text.txnId[lang]} styles="text-black" />
        <Text tag="h6" text={txnId} styles="text-black" />
      </div>
      {(status === "SUCCESS" || status === "PROCESSING") && (
        <div className="border-b-4 border-gray-300 p-4">
          <Text tag="h6" text={text.paidTo[lang]} styles="text-black" />
          <div className="w-full flex font-bold">
            <div className="w-1/2">
              <Text tag="h6" text={paidToName} styles="text-black" />
              <Text tag="h6" text={paidToAcc} styles="text-black" />
            </div>
            <div className="w-1/2 text-right">
              <Text tag="h6" text={amount} styles="text-black" />
            </div>
          </div>
          {status === "SUCCESS" && (
            <div className="flex justify-end text-indigo-500 font-bold">
              <Text tag="span" text={text.shareReciept[lang]} styles="pr-2" />
              <Text tag="span" text={text.sendAgain[lang]} styles="pl-2" />
            </div>
          )}
        </div>
      )}

      {(status === "SUCCESS" || status === "PROCESSING") && (
        <div className="border-b-4 border-gray-300 p-4">
          <Text tag="h6" text={text.debitedFrom[lang]} styles="text-black" />
          <div className="w-full flex font-bold">
            <div className="w-1/2">
              <Text tag="h6" text={debitedFromAcc} styles="text-black" />
            </div>
            <div className="w-1/2 text-right">
              <Text tag="h6" text={amount} styles="text-black" />
            </div>
          </div>
          <div className="flex justify-end text-indigo-500 font-bold">
            <Text tag="span" text={text.checkBalance[lang]} />
          </div>
        </div>
      )}

      {status === "PROCESSING" && (
        <div className="border-b-4 border-gray-300 p-4 flex justify-between">
          <Text
            tag="h6"
            text={text.issue[lang]}
            styles="text-black font-bold"
          />
        </div>
      )}

      {status === "FAILURE" && (
        <>
          <div className="border-b-4 border-gray-300 p-4 flex justify-between">
            <Text tag="h6" text={text.orderAmount[lang]} styles="text-black" />
            <Text tag="h6" text={amount} styles="text-black font-bold" />
          </div>
          <div className="border-b-4 border-gray-300 p-4 flex justify-between">
            <Text tag="h6" text={text.paymentMode[lang]} styles="text-black" />
            <Text
              tag="h6"
              text={text.payTM[lang]}
              styles="text-black font-bold"
            />
          </div>
          <div className="border-b-4 border-gray-300 p-4 flex justify-between">
            <Text tag="h6" text={text.status[lang]} styles="text-black" />
            <Text
              tag="h6"
              text={text.failed[lang]}
              styles="text-black font-bold"
            />
          </div>
        </>
      )}

      <Text
        tag="h6"
        text={
          status === "SUCCESS" || status === "PROCESSING"
            ? text.done[lang]
            : status === "FAILURE"
            ? text.goToApp[lang]
            : ""
        }
        styles="p-4 text-indigo-500 font-bold underline"
      />
    </div>
  );
}
