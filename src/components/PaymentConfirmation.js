import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import { Context } from "../context/Context";
import { AddCoinsConfirmationText as text } from "../Database/Text";

export default function PaymentConfirmation() {
  const history = useHistory();
  const { updateRedirectHome, getLanguage } = useContext(Context);
  const [lang, setLang] = useState("en");
  const check = require("../assets/wallet-new/check.svg").default;
  const rupee = require("../assets/wallet-new/rupee-symbol_white1.svg").default;
  const [amount, setAmount] = useState(100);
  useEffect(() => {
    window.scrollTo(0, 0);
    setLang(getLanguage());
    return () => {
      if (history.action === "POP") {
        /** Wallet page back button will redirect to home page */
        updateRedirectHome(true);
        history.push("/wallet");
      }
    };
  }, []);

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center pt-16">
      <Image url={check} styles="h-24 w-24" />
      <Text
        tag="h3"
        text={text.title[lang]}
        styles="text-walletNewGreen mt-4 mb-8 font-bold"
      />
      <Text tag="h6" text={text.subtitle[lang]} styles="text-black mb-4" />
      <div className="flex items-center">
        <Image url={rupee} styles="h-7 w-7" />
        <Text
          tag="h4"
          text={`${amount} ${text.rupees[lang]}`}
          styles="text-black font-bold"
        />
      </div>
    </section>
  );
}
