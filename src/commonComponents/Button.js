/**
 * Button component
 * @property {"pill" | "circle"} shape Shape of button
 * @property {"black" | "gray" | "orange"} background Background color of the button
 * @property {boolean} fullWidth If true, button occupies full width of the parent container
 * @property {String} label The text displayed inside the button
 * @property {string} icon The icon shown inside the button
 * @function eventHandler Handle click event on the button
 */

 import React from "react";
 import cx from "classnames";
 import PropTypes from "prop-types";
 import Text from "../commonComponents/Text";
 import Image from "../commonComponents/Image";
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faWallet, faPlus } from "@fortawesome/free-solid-svg-icons";
 import useProceedToPay from "../network/useProceedToPay";
 import { useContext, useEffect } from "react";
 import { Context } from "../context/Context";
 import { reactLocalStorage } from "reactjs-localstorage";
 import {logEvent} from '../Analytics/AnalyticsEvent';
 import {screen, events} from '../Analytics/EventName'; 
 
 function Button({
   type = "button",
   tag = "",
   shape = "pill",
   fullWidth = true,
   label = "",
   icon = "",
   styles = "",
   textStyles = "",
   size = "",
   isDisabled = false,
   eventHandler = null,
   action = "",
   faIcon = "",
   faIconLast = "",
   iconClass = "",
   textTag = "",
   iconStyle = "h-4 w-4",
   textTransform ="",
 }) {
   
   const { walletBalance, updateWalletBalance } = useContext(Context);
   const { getBalanceData } = useProceedToPay();
   const mbc_coin = require("../assets/svg-icons/mbc_coin_icon.svg").default;
   const tempObj = reactLocalStorage.getObject("tempObj")
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = (userName === "Guest") ? 1 : 0;
 
   useEffect(() => {
     tag === "wallet" &&
         getBalanceData().then((res) => {
           console.log(res);
           const balance  = res.main_balance >= 0 ? res.main_balance : "null";
           guest === 0 ? (updateWalletBalance(res.main_balance + res.winning_balance)) : updateWalletBalance(0);
           logEvent(
             {
               screen: screen.header,
               event: events.balanceApiSuccess
             }, 
             {
               title: "getBalance request successfull",
               date: new Date(),
               code: tempObj.code,
               mobile: tempObj.number,
               others: {
                 balance: balance,
                 resCode: res.statusCode,
                 resReason: res.reason
               }
             });
         }).catch((err) => {
           let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
           logEvent(
             {
               screen: screen.header,
               event: events.balanceApiFailure
             }, 
             {
               title: "getBalance request failed",
               date: new Date(),
               code: tempObj.code,
               mobile: tempObj.number,
               others: {
                 err: errObj
               } 
             }
           );
           console.log(">>>>> GET BALANCE API ERROR >>>>>", err)
         });   
   }, []);
  
   let bgClass = cx({
     "w-full": fullWidth === true,
     "rounded-lg": (shape === "pill") === true,
     "rounded-full": (shape === "circle") === true,
     "p-1": (size === "small") === true,
     "p-3": (size === "medium") === true,
     "p-5": (size === "large") === true,
     "opacity-50 cursor-not-allowed": isDisabled === true,
   });
 
   let textStyle = cx({
     [`${textStyles}`]: textStyles.length > 0,
     "text-black-400": isDisabled === false,
   });
   return (
     <>
       {tag === "wallet" ? (
         <button
           className="focus:outline-none bg-wallet rounded-lg text-white font-bold flex items-center"
           onClick={() => {
             // console.log("clicked ::", eventHandler);
             if (eventHandler && !isDisabled) eventHandler();
             else return;
           }}
         >
           <div className="flex items-center border-r border-white p-2 2xs:p-1 3xs:p-1">
             <FontAwesomeIcon icon={faWallet} />
             <div className="flex items-center ml-1">
               <Image url={mbc_coin} styles="h-4 w-4 mr-1" />
               {guest === 1 ? "0" : walletBalance}
             </div>
           </div>
           <div className="flex items-center p-2">
             <FontAwesomeIcon icon={faPlus} className={"text-xs"} />
           </div>
         </button>
       ) : (
         <button
           type={type}
           className={`focus:outline-none flex justify-center items-center ${bgClass} ${styles}`}
           disabled={isDisabled}
           onClick={() => {
             if (eventHandler && !isDisabled) eventHandler(action);
             else return;
           }}
         >
           {icon && <Image url={icon} styles={iconStyle} />}
           {faIcon && <FontAwesomeIcon icon={faIcon} className={iconClass} />}
           <Text
             tag={textTag || "h5"}
             scale={true}
             styles={textStyle}
             text={label}
             fontweight="normal"
             alignment="center"
             textTransform ={textTransform}
           />
           {faIconLast && <FontAwesomeIcon icon={faIconLast} className={iconClass} />}
         </button>
       )}
     </>
   );
 }
 
 Button.propTypes = {
   tag: PropTypes.string,
   textColor: PropTypes.string,
   textStyles: PropTypes.string,
   size: PropTypes.string,
   isDisabled: PropTypes.bool,
   action: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
   textTag: PropTypes.string,
   iconClass: PropTypes.string,
   faIcon: PropTypes.object,
   faIconLast: PropTypes.object,
   type: PropTypes.oneOf(["button", "submit", "reset"]),
   shape: PropTypes.oneOf(["pill", "circle"]),
   background: PropTypes.string,
   fullWidth: PropTypes.bool,
   label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
   icon: PropTypes.string,
   eventHandler: PropTypes.func,
   styles: PropTypes.string,
   iconStyle: PropTypes.string,
   textTransform : PropTypes.string
 };
 
 export default Button;