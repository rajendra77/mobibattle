import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { reactLocalStorage } from "reactjs-localstorage";
import Config from "../Database/newConfig";
import CountryCodes from "../Database/CountryCodes.json";
import { Context } from "../context/Context";
import Title from "../commonComponents/LoginTitle";
import Form from "../commonComponents/LoginForm";
import useOtpRequest from "../network/useOtpRequest";
import Image from "../commonComponents/Image";
import "../App.scss";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { GeneralText, LoginPageText as text } from "../Database/Text";
import config from "../config/Config";
import { guiDataEvent, SendGuiDataEvents } from "../commonScript";
import { Base64 } from "js-base64";


function Login() {
  const [lang, setLang] = useState("en");
  const [configText, setConfig] = useState({});
  const [number, setNumber] = useState("");
  const history = useHistory();
  const { Otp } = useOtpRequest();
  let { search, pathname } = useLocation();
  let { mode } = queryString.parse(search);
  mode = mode && Base64.decode(mode)
  const { saveNumber, code, handleShowModal, getLanguage } =
    useContext(Context);


  useEffect(() => {
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'login';
    guiDataEvent["event"] = "open";
    SendGuiDataEvents(guiDataEvent);

    window.scrollTo(0, 0);
    const lang = getLanguage();
    setLang(lang);
    setConfig(Config.loginScreen);

  }, []);

  const handleLogin = (number) => {
     // send gui events
     let guiDataEvent = {}
    guiDataEvent["page"] = "login";
    guiDataEvent["event"] = "login_click";
    SendGuiDataEvents(guiDataEvent);

    let suffix1 = Number(number.substring(0, 2));
    let suffix2 = Number(number.substring(0, 3));
    if (
      !(
        config.get("NUMBER_SERIES_VALID").includes(suffix1) ||
        config.get("NUMBER_SERIES_VALID").includes(suffix2)
      )
    ) {
      const modalData = {
        title: "",
        body: GeneralText.wrongNumber[lang],
        icon: require("../assets/mtncongo/oops_busy_player.png").default,
        buttons: [
          {
            label: "Үнэгүй тоглох",
            action: "close",
            buttonColor: "bg-tabsColor",
            textColor: "text-white",
          },
        ],
        hideClose: true,
        handleClick: function (button) {
          if (button === "close") {
            handleShowModal(false);
          }
        },
      };
      handleShowModal(true, modalData);
      return;
    }
    Otp(number, code)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          const reason = res.reason ? res.reason : "null";
          saveNumber(number);
          reactLocalStorage.set("mobileNumber", number);
          reactLocalStorage.set("code", code);
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
          history.push(`/otp?mode=${Base64.encode(mode)}`);
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
          errObj = `${msg} due to internet disconnected, statusCode: 503`;
        } else {
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
              err: errObj,
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
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  // We listen to the resize event
  window.addEventListener("resize", () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
  const login_icon = require("../assets/svg-icons/login_page_icon.svg").default;
  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-center bg-cover bg-no-repeat">
      <div className="2xs:mt-6 mt-16 2xs:mb-0 mb-6">
        <Image url={login_icon} styles={"2xs:h-28 2xs:w-28 h-32 w-32"} />
      </div>

      <div>
        <div className="pb-2">
          <Title
            title={text.title[lang]}
            subTitleColor={"lightPurple"}
            showLock={false}
            titleTag={"h2"}
          />
        </div>
        <Form
          isLogin={true}
          button="true"
          config={configText.cardText}
          countryCode={CountryCodes}
          handleEvent={handleLogin}
          number={number}
          setNumber={setNumber}
          sub={configText.subtitle}
          text={text}
          lang={lang}
        />
      </div>
    </main>
  );
}

export default Login;
