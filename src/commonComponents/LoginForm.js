import React, { useState, useEffect, useContext } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import PropTypes from "prop-types";
import { Context } from "../context/Context";
import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import Anchor from "../commonComponents/Anchor";
import useOtpRequest from "../network/useOtpRequest";
import Dropdown from "./Dropdown";
import { useHistory } from "react-router-dom";
import OtpInput from "react-otp-input";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { Base64 } from "js-base64";
import useRegister from "../network/useRegister";



function LoginForm({
  config: { numberInput: { placeholder } = {} } = {},
  handleEvent,
  number,
  setNumber,
  isLogin,
  isOtp,
  sub,
  terms,
  footer,
  resendText,
  timeLeft,
  resetTimer,
  otpNum,
  updateOtpNum,
  text,
  lang,
  isKeyboardVisible,
  ...props
}) {
  const [checked, setChecked] = useState(true);
  const { Otp } = useOtpRequest();
  const [disabled, setDisabled] = useState(true);
  const [loginDisable, setLoginDisable] = useState(true);
  const [num, setNum] = useState("97120498");
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+976");
  const [invalidChar, setInvalidChar] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(
    "https://res.mobibattle.co/Demo/flag/mn.png"
  );
  const [code, setCountryCode] = useState("");
  const history = useHistory();
  const { updateCode, handleShowModal, resendOtpCount, updateResendCount } =
    useContext(Context);
    const { guestRegister } = useRegister();

  useEffect(() => {
    setDisabled(() => (otpNum && otpNum.length === 4 ? false : true));
    setCountryCode(reactLocalStorage.get("code"));
  }, [otpNum]);

  useEffect(() => {
    setLoginDisable(() =>
      num.length === 8 && checked && !invalidChar ? false : true
    );
  }, [num, checked, invalidChar]);

  const blockInvalidChar = (e) =>
    ["e", "E", ".", "-"].includes(e.key) && e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEvent(number);
    setDisabled(true);
    setLoginDisable(true);
  };

  const handleGuest = () => {
    let number = parseInt(Math.random() * 1000000000).toString();
      guestRegister(number)
        .then(
          (res) => {
            reactLocalStorage.setObject("tempObj", {
              number: number,
              code: code,
            });
            reactLocalStorage.setObject("guestProfileCreated", false);
            history.push("/home");
          },
          (err) => {
            console.log("Promise rejected...", err);
          }
        )
        .catch((err) => {
          console.log("error is", err);
        });

  }

  props.countryCode.map((item) => (
    <option value={item.dial_code} key={item.name}>
      {item.dial_code}
    </option>
  ));

  const handleCheckbox = () => {
    setChecked(!checked);
    setDisabled(!disabled);
  };

  const resendOTP = () => {
    updateOtpNum("");
    if (resendOtpCount === 2) {
      updateResendCount(0);
      const modalData = {
        title: "Too many attempts!!!",
        body: "Please re-enter your mobile number.",
        buttons: [
          {
            label: "Okay",
            action: "close",
            buttonColor: "bg-tabsColor",
            textColor: "text-white",
          },
        ],
        hideClose: true,
        handleClick: function (button) {
          if (button === "close") {
            handleShowModal(false);
            history.goBack();
          }
        },
      };
      handleShowModal(true, modalData);
      return;
    } else {
      updateResendCount(resendOtpCount + 1);
    }
    resetTimer();
    Otp(number, code)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";

          logEvent(
            {
              screen: screen.login_p,
              event: events.sendOtpApiSuccess,
            },
            {
              title: "sendOtp request successfull",
              date: new Date(),
              code: code,
              mobile: number,
              others: {
                resStatus: res.status,
                resReason: reason,
              },
            }
          );
          reactLocalStorage.setObject("tempObj", {
            number: number,
            code: code,
          });
          history.push("/otp");
        } else {
          const reason = res.reason ? res.reason : "null";
          logEvent(
            {
              screen: screen.login_p,
              event: events.sendOtpApiFailure,
            },
            {
              title: "sendOtp request failed",
              date: new Date(),
              code: code,
              mobile: number,
              others: {
                resStatus: res.status,
                resReason: reason,
              },
            }
          );
        }
      })
      .catch(async (e) => {
        let errObj;
          const msg = e.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = e;
          }
        logEvent(
          {
            screen: screen.login_p,
            event: events.sendOtpApiFailure,
          },
          {
            title: "sendOtp request failed",
            date: new Date(),
            code: code,
            mobile: number,
            others: {
              err: errObj
            },
          }
        );
        const modalData = {
          title: "Error!!!",
          body: `There was some error. Please retry after sometime. ${
            e.type ? e.type : ""
          } : ${e.status ? e.status : ""} : ${
            e.statusText ? e.statusText : ""
          }`,
          buttons: [
            {
              label: "Okay",
              action: "close",
              buttonColor: "bg-tabsColor",
              textColor: "text-white",
            },
          ],
          hideClose: true,
          handleClick: function (button) {
            if (button === "close") {
              handleShowModal(false);
              location.reload();
            }
          },
        };
        handleShowModal(true, modalData);
      });
  };

  // const handleLogin = () => {
  //   Otp(number).then(
  //     () => {
  //       history.push("/contactus");
  //       // saveNumber(number);
  //     },
  //     (err) => {
  //       console.log("Promise rejected...", err);
  //     }
  //   );
  // };

  const handleChangeN = (e) => {
    const { value } = e.target;
    if (value.length > 8) {
      return;
    }
    setNum(value.toString());
    if (
      value.includes(".") ||
      value.includes("e") ||
      value.includes("E") ||
      value.includes("-")
    ) {
      setInvalidChar(true);
    } else {
      setInvalidChar(false);
    }
    if (!props.otp) {
      setNumber(value);
      // setNumber(selectedCode + "" + value);
    }
    
    
  };

  const handleSelect = (code, flag) => {
    updateCode(code);
    setSelectedCode(code);
    setSelectedFlag(flag);
  };

  return (
    <>
    <form className="w-full h-full bg-primary" onSubmit={handleSubmit}>
      {invalidChar && (
        <Text
          tag="p"
          scale={true}
          styles="text-red-900 font-bold text-left text-xl px-8 2xs:px-4 3xs:px-2"
          text={"* Entered number contains invalid char."}
          fontweight="normal"
          alignment="left"
        />
      )}
      {isLogin && (
        <div className="flex flex-col items-center px-6 1xs:px-4 2xs:px-3 3xs:px-2 pt-2">
          <div className="flex shadow appearance-none border-2 border-lightPurple rounded-lg w-full h-12 leading-loose focus:outline-none focus:shadow-outline bg-placeholder">
            <Dropdown
              open={open}
              onClick={() => setOpen(!open)}
              itemList={props.countryCode}
              selectedCode={selectedCode}
              handleSelect={handleSelect}
              countryFlag={selectedFlag}
            />

            <div className="flex items-center pl-2">
              <div className="text-center max-w-2/5 min-w-max	border-lightPurple focus:outline-none bg-placeholder text-white text-base  1xs:text-base xs:text-lg mr-2">
                {selectedCode}
              </div>
              <input
                className="placeholder-lightPurple w-full border-lightPurple focus:outline-none bg-placeholder text-white text-base  1xs:text-base xs:text-lg mr-2"
                type="number"
                id="phone"
                name="phone"
                placeholder={text.placeholder[lang]}
                value={number}
                pattern="/^(\+\d{1,3}[- ]?)?\d{10}$/"
                title="not a number"
                maxLength="8"
                required
                onChange={handleChangeN}
                onKeyDown={blockInvalidChar}
                disabled={disableInput}
              ></input>
            </div>
          </div>
          <div className="flex items-center w-full mt-6 h-12 rounded-full focus:outline-none">
            <div className="flex items-center justify-center">
              <label className="container focus:outline-none focus:shadow-outline">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleCheckbox}
                  className="focus:outline-none"
                />
                <span className="checkmark"></span>
              </label>
            </div>

            <div className="ml-2 mt-3 h-full flex items-center justify-center">
              <Text
                tag="lable"
                scale={true}
                styles="text-lightPurple mr-1 mt-1 font-bold text-xs"
                text={text.iAccept[lang]}
                fontweight="normal"
                alignment="center"
              />
              <Anchor
                item={{ title: text.termsOfService[lang] }}
                classes="underline text-terms font-extrabold"
                redirectPath="/TermsAndConditions"
                tag="lable"
                textStyle = "text-xs  "
              />
            </div>
          </div>
          <div className="w-full">
            <Button
              type="submit"
              size="medium"
              label={text.login[lang]}
              styles="rounded-xl my-8 font-extrabold text-tabsColor bg-white"
              isDisabled={loginDisable}
              textTransform ="uppercase"
            />
          </div>
        </div>
      )}

      {isOtp && (
        <div className="flex flex-col items-center px-8 mb-4 text-white">
          <OtpInput
            value={otpNum}
            onChange={(data) => updateOtpNum(data)}
            numInputs={4}
            separator={<span className="mx-2"></span>}
            placeholder="••••"
            shouldAutoFocus={true}
            isInputNum={true}
            inputStyle={{
              color: "white",
              width: "1.7rem",
              margin: "auto 3px",
              fontSize: "2rem",
              fontWeight: "bold",
              borderBottom: "4px solid white",
              background: "#25023B",
              outline: "none",
            }}
          />

          <Text
            tag="h5"
            scale={true}
            styles="pb-4 xs:px-8 text-lightPurple mt-8 mb-2"
            text={`${text.otpMsgOne[lang]} ${code}${number} ${text.otpMsgTwo[lang]}`}
            fontweight="normal"
            alignment="center"
          />

          <div className="w-full">
            <Button
              type="submit"
              size="medium"
              label={text.verify[lang]}
              styles="rounded-xl my-5 font-bold bg-white text-tabsColor"
              isDisabled={disabled}
              textTransform ="uppercase"
            />
          </div>
          <div className="w-full flex flex-col justify-center items-center mb-3">
            <div className="flex">
              <Text
                tag="h5"
                scale={true}
                styles="text-white"
                text={text.bottomText[lang]}
                fontweight="normal"
                alignment="center"
              />
            </div>
            {timeLeft === 0 ? (
              
              <Anchor
                clickEvent={() => timeLeft === 0 && resendOTP()}
                item={""}
                showTitle={true}
                classes={`${
                  timeLeft === 0 ? "text-yellow-400" : "text-gray-500"
                } font-bold underline`}
                tag={"h5"}
                redirectPath="/contactus"
                isActive={false}
                textTransform="uppercase"
              />
            ) : (
              <div className="flex">
                <Text
                  tag="h5"
                  scale={true}
                  styles="text-green-500 px-2"
                  text={`00:${timeLeft}`}
                  fontweight="bold"
                  alignment="center"
                />
                
              </div>
            )}
            
            <div className="w-full text-center text-white my-4">
                  <p>
                    {text.resendCode[lang]}
                    <span
                      className="text-orange ml-1"
                      onClick={resendOTP}>
                        {"Дахин илгээнэ үү"}
                    </span>
                  </p>
                </div>
          </div>
          {/* {!isKeyboardVisible && <div className="w-full fixed bottom-0 text-center text-white my-4">
      <p>
        {text.notAbleToLogin[lang]}
        <span
          className="text-orange ml-1"
          onClick={handleGuest}>
             {text.playAsGuest[lang]}
        </span>
      </p>
          </div>} */}
        </div>
      )}
      
          
    </form>
    
    
              </>
  );
}

LoginForm.propTypes = {
  handleEvent: PropTypes.func.isRequired,
  number: PropTypes.string,
  setNumber: PropTypes.func,
  isLogin: PropTypes.bool,
  isOtp: PropTypes.bool,
  sub: PropTypes.string,
  terms: PropTypes.string,
  footer: PropTypes.string,
  resendText: PropTypes.string,
  config: PropTypes.object,
  countryCode: PropTypes.array,
  otp: PropTypes.string,
  timeLeft: PropTypes.number,
  resetTimer: PropTypes.func,
  otpNum: PropTypes.string,
  updateOtpNum: PropTypes.func,
  text: PropTypes.any,
  lang: PropTypes.string,
};

export default LoginForm;
