import React, { useContext, useEffect, useState } from "react";
import Loader from "../commonComponents/Loader";
import TransactionItem from "../commonComponents/TransactionItem";
import useAllTransaction from "../network/useAllTransaction";
import ApiNotFound from "./ApiNotFound";
import cx from "classnames";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { reactLocalStorage } from "reactjs-localstorage";
import {TransactionHistoryText as text} from '../Database/Text'
import { Context } from "../context/Context";
import { useLocation } from "react-router-dom";
import {SendGuiDataEvents} from '../commonScript';


const AllTransaction = () => {
  const [selectedItem, setSelectedtem] = useState(null);
  const [allTransactionData, setAllTransactionData] = useState([]);
  const { getAllTransaction } = useAllTransaction();
  const [apiFailed, setApiFailed] = useState(false);
  const [loader, showLoader] = useState(true);
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const tempObj = reactLocalStorage.getObject("tempObj");
  const { pathname } = useLocation();

  
  useEffect(() => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'transactions';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);

    setLang(getLanguage());
    getAllTransaction()
      .then(
        async (res) => {
          logEvent(
            {
              screen: screen.transaction_p,
              event: events.apiSuccess,
            },
            {
              title: "transaction request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
            }
          );
          const transactionData = await JSON.parse(res.transactionHistory);
          console.log("transactionData::", transactionData);
          setAllTransactionData(transactionData);
          setTimeout(function () {
            showLoader(false);
          }, 1000);
        },
        (err) => {
          logEvent(
            {
              screen: screen.transaction_p,
              event: events.apiFailure,
            },
            {
              title: "transaction request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                err: err,
              },
            }
          );
          console.log("Promise rejected...", err);
          setApiFailed(true);
          showLoader(false);
        }
      )
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        logEvent(
          {
            screen: screen.transaction_p,
            event: events.apiFailure,
          },
          {
            title: "transaction request failed",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
            others: {
              err: errObj,
            },
          }
        );
        console.log("----err---->", err);
        setApiFailed(true);
        showLoader(false);
      });
 
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  const handleClick = (id) => {
    setSelectedtem(id);
  };

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <>
      {loader && <Loader />}
      {!allTransactionData && (
        <div
          className={`w-screen flex items-center justify-center pt-64 ${loaderClass}`}
        >
          <h1 className="text-white text-lg font-bold">{text.noTransaction[lang]}</h1>
        </div>
      )}
      {allTransactionData && allTransactionData.length > 0 && (
        <div className={loaderClass}>
          {allTransactionData.map((item, index) => (
            <TransactionItem
              text ={text}
              lang ={lang}
              key={index}
              id={index}
              image={item.image}
              transactionType={item.transactionType}
              date={item.transactionDate}
              balance={
                item.coinsCredited > 0 ? item.coinsCredited : item.coinsDeducted
              }
              selectedItem={selectedItem}
              handleClick={handleClick}
              txnId={item.transactionId}
              txnStatus={item.transactionStatus ? item.transactionStatus.toLowerCase() : "success"}
              txnType={item.transactionType}
              optional={item.optional}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AllTransaction;
