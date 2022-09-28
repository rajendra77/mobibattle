import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import Input from "../commonComponents/Input";
import Button from "../commonComponents/Button";
import useProceedToPay from "../network/useProceedToPay";
import { WithdrawalDetailsText as text } from "../Database/Text";
import { Context } from "../context/Context";

export default function WithdrawDetails({
  selectedAmount,
  selectedCoins,
  setShowWithdrawDetails,
}) {
  const history = useHistory();
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [showNameValidation, setShowNameValidation] = useState(false);
  const [showNumberReqValidation, setShowNumberReqValidation] = useState(false);
  const [showNumberLengthValidation, setShowNumberLengthValidation] =
    useState(false);
  const { withdrawCoin } = useProceedToPay();
  const { getLanguage } = useContext(Context);
  const icon =
    require("../assets/wallet-new/withdrawal_popup_icon.svg").default;

  const handleNameChange = (e) => {
    // console.log("name entered...", e.target.value);
    if (!e.target.value) {
      setShowNameValidation(true);
    } else {
      setShowNameValidation(false);
    }
    setName(e.target.value);
  };

  const handleNumberChange = (e) => {
    // console.log("number entered...", e.target.value);
    if (!e.target.value) {
      setShowNumberReqValidation(true);
    } else {
      setShowNumberReqValidation(false);
      if (e.target.value.toString().length > 10) {
        setShowNumberLengthValidation(true);
      } else {
        setShowNumberLengthValidation(false);
      }
    }
    setNumber(e.target.value);
  };

  const handleWithdrawRequest = () => {
    console.log("USER DETAILS :: Name :: ", name, " Number :: ", number);
    /**
     * Validations
     */
    if (!name) {
      setShowNameValidation(true);
    }
    if (!number) {
      setShowNumberReqValidation(true);
    }
    if (number && number.toString().length !== 10) {
      setShowNumberLengthValidation(true);
    }
    if (name && number && number.toString().length === 10) {
      withdrawCoin(selectedCoins, number, name)
        .then((res) => {
          console.log("withdraw coin res :: ", res);
          // history.push("/withdrawSuc");
          setShowWithdrawDetails(false);
        })
        .catch((err) => {
          console.log("withdraw coin error :: ", err);
        });
    }
  };

  const blockInvalidChar = (e) =>
    ["e", "E", ".", "-", "+"].includes(e.key) && e.preventDefault();

  useEffect(() => {
    setLang(getLanguage());
    /** Disable background scroll when Withdraw details modal is open */
    const background = document.querySelector(".App");
    if (background) {
      background.style.height = "100vh";
      background.style.overflow = "hidden";
    }

    return function () {
      background.style.height = "auto";
      background.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div
        className={`w-full max-w-500px max-h-3/4 m-auto justify-center items-center fixed bottom-0 z-50 outline-none focus:outline-none overflow-auto`}
      >
        <div className="relative">
          <div className="rounded-t-3xl shadow-lg relative pt-2 flex flex-col w-full bg-gray-100 outline-none focus:outline-none">
            <div className="px-6 flex-auto text-center">
              <div
                className="flex justify-center items-center absolute top-1 right-1 h-8 w-8 text-2xl text-black font-bold leading-6 z-10 text-center cursor-pointer"
                onClick={() => {
                  setShowWithdrawDetails(false);
                }}
              >
                &times;
              </div>
              <div className="mt-4 w-12 border-b-2 border-t-2 rounded-full border-gray-800 m-auto"></div>
              <br />
              <div className="flex justify-center items-center">
                <Image url={icon} styles="mb-4" />
              </div>

              <Text
                tag="h4"
                scale={true}
                styles=""
                text={text.heading[lang]}
                textColor={"text-black"}
              />
              <Text
                tag="h6"
                text={text.nameFieldLabel[lang]}
                styles="text-left font-bold py-4"
              />
              <Input
                type={"text"}
                value={name}
                eventHandler={handleNameChange}
                placeholderText={text.nameFieldPlaceholder[lang]}
                styles="w-full outline-none text-black text-lg bg-white p-4 rounded-lg"
              />
              {showNameValidation && (
                <p className="text-red-500 text-sm text-left">
                  {text.requiredValidation[lang]}
                </p>
              )}
              <Text
                tag="h6"
                text={text.numberFieldLabel[lang]}
                styles="text-left font-bold py-4"
              />
              <Input
                type={"number"}
                value={number}
                max={99999}
                eventHandler={handleNumberChange}
                placeholderText={text.numberFieldPlaceholder[lang]}
                blockKeys={blockInvalidChar}
                styles="w-full outline-none text-black text-lg bg-white p-4 rounded-lg"
              />
              {showNumberReqValidation && (
                <p className="text-red-500 text-sm text-left">
                  {text.requiredValidation[lang]}
                </p>
              )}
              {showNumberLengthValidation && (
                <p className="text-red-500 text-sm text-left">
                  {text.numberValidation[lang]}
                </p>
              )}
              <div className="flex items-center justify-evenly py-8">
                <Button
                  label={text.cancelButton[lang]}
                  eventHandler={() => {
                    setShowWithdrawDetails(false);
                  }}
                  styles="mr-2 uppercase font-bold w-1/2 text-white bg-lightPurple"
                  size={"medium"}
                  fullWidth={false}
                  textTag="h4"
                />
                <Button
                  label={text.okayButton[lang]}
                  eventHandler={() => handleWithdrawRequest()}
                  styles="ml-2 uppercase font-bold w-1/2 text-white bg-shinyPurple"
                  size={"medium"}
                  fullWidth={false}
                  textTag="h4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
