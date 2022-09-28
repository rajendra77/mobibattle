import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Button from "../commonComponents/Button";
import Image from "../commonComponents/Image";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import SliderLandingPage from "../commonComponents/SliderLandingPage";
import "./LandingPage.scss";
import { LandingPageText as text } from "../Database/Text";
import { Context } from "../context/Context";
import { reactLocalStorage } from "reactjs-localstorage";
import _ from "lodash";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import { Base64 } from "js-base64";
import config from "../config/Config";
import useSubscribe from "../network/useSubscribe";
import useRegister from "../network/useRegister";
import { SendGuiDataEvents } from "../commonScript";
import { setStartTimes } from "../utils/util";
import queryString from "query-string";

function LandingPage() {
  const [lang, setLang] = useState("en");
  const [landingSliderData, setLandingSliderData] = useState([]);
  const { getLanguage } = useContext(Context);
  const history = useHistory();
  const [loader, showLoader] = useState(true);
  const { checkSubscriptionHE } = useSubscribe();
  const { register } = useRegister();
  let { search } = useLocation();
  let { msisdn } = queryString.parse(search);

  const mobibattle =
    require("../assets/mtncongo/btc_mobibattle_splash_logo.png").default;


  useEffect(() => {
    setStartTimes();
    const userProfile = reactLocalStorage.getObject("userProfile");
    if (msisdn) {
      checkHeSubscription(msisdn)
    } else if (_.isEmpty(userProfile) === false && _.has(userProfile, "uniqueId")) {
      history.push("/home");
    }else if (reactLocalStorage.get("redirect") !== "false") {
      //send gui events
      let guiDataEvent = {};
      guiDataEvent["page"] = "he_req";
      guiDataEvent["event"] = "open";
      SendGuiDataEvents(guiDataEvent);
      logEvent(
        {
          screen: screen.landing_p,
          event: events.open,
        },
        {
          title: "he url redirect",
        }
      );
      window.open(config.get("heUrl"), "_self");
      reactLocalStorage.set("redirect", false);
    } else {
      //send gui events
      let guiDataEvent = {};
      guiDataEvent["page"] = "landing";
      guiDataEvent["event"] = "open";
      const p = window.location.href.split("?p=")[1];
      // const p= "eyJzdGF0dXMiOiJmYWlsZWQiLCJtc2lzZG4iOiIifQ=="
      let newP;
      if (p) {
        newP = JSON.parse(Base64.decode(p));
        logEvent(
          {
            screen: screen.landing_p,
            event: events.open,
          },
          {
            title: "he object found",
            mobile: newP.msisdn,
            others: {
              type: "HE",
              newP,
            },
          }
        );
      }
      loggedIn(newP);
    }
    setTimeout(() => {
      showLoader(false);
    }, 1000);
  }, [reactLocalStorage.get("redirect")]);

  useEffect(() => {
    const lang = getLanguage();
    setLang(lang);
    const sliderData = [
      {
        image: require("../assets/landing-page/onboarding.png").default,
        title: text.slide3.title[lang],
        subtitle: text.slide3.subtitle[lang],
        color: "text-green-400",
      },
      {
        image: require("../assets/landing-page/onboarding1A.png").default,
        title: text.slide1.title[lang],
        subtitle: text.slide1.subtitle[lang],
        color: "text-yellow-400",
      },
      {
        image: require("../assets/landing-page/onboarding2.png").default,
        title: text.slide2.title[lang],
        subtitle: text.slide2.subtitle[lang],
        color: "text-green-400",
      },
    ];
    setLandingSliderData(sliderData);
  }, []);

  const handleButton = () => {
    logEvent(
      {
        screen: screen.landing_p,
        event: events.playNow,
      },
      {
        title: "user redirected to login page",
      }
    );
    history.push("/login");
  };

  const loggedIn = (newP) => {
    if (newP) {
      if (newP.status === "success") {
        console.log("-------4-------->");
        logEvent(
          {
            screen: screen.landing_p,
            event: events.open,
          },
          {
            title: "user redirected to subcription page",
            mobile: newP.msisdn,
            others: {
              type: "HE",
              newP,
            },
          }
        );
        if (newP.msisdn.toString().length > 9) {
          let a = newP.msisdn.split("");
          a.splice(0, 3);
          a = a.join("");
          reactLocalStorage.set("msisdn", a);
          checkHeSubscription(a);
        } else {
          reactLocalStorage.set("msisdn", newP.msisdn);
          checkHeSubscription(newP.msisdn);
        }
      } else {
        logEvent(
          {
            screen: screen.landing_p,
            event: events.open,
          },
          {
            title: "user redirected to subcription page",
            others: {
              type: "NON-HE",
            },
          }
        );
        history.push(`/subscription`);
      }
    } else {
      logEvent(
        {
          screen: screen.landing_p,
          event: events.open,
        },
        {
          title: "user redirected to login page",
          others: {
            type: "NON-HE",
          },
        }
      );
      history.push(`/subscription`);
    }
  };

  const checkHeSubscription = (msisdn) => {
    let code = "+976";
    let otp = "";
    checkSubscriptionHE(msisdn).then((response) => {
      if (
        response.currentStatus.toLowerCase() === "susbscribed" ||
        response.currentStatus.toLowerCase() === "active"
      ) {
        register(msisdn.substring(3), "HE", code, otp)
          .then(
            (res) => {
              if (res.status.toUpperCase() === "SUCCESS") {
                reactLocalStorage.setObject("tempObj", {
                  number: msisdn,
                  code: code,
                });
                showLoader(false);
                history.push(`/home?mode=${Base64.encode("subscribe")}`);
              }
            },
            (err) => {
              showLoader(false);
              console.log("Promise rejected...", err);
            }
          )
          .catch((err) => {
            showLoader(false);
            console.log("error is", err);
          });
      } else {
        history.push(`/subscription`);
      }
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

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <>
      {loader && <Loader />}
      <div className="w-full px-8 module">
        {/* <script
        dangerouslySetInnerHTML={{
          __html:
            `(function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking".split(" "), 0);
            `
        }}
      /> */}
        <div className={`${loaderClass} module relative flex flex-col`}>
          <Image url={mobibattle} styles="m-auto p-4 mt-10" />
          <SliderLandingPage data={landingSliderData} />
          <div className="w-full pt-4 pb-8">
            <Button
              faIconLast={faPlay}
              iconClass={"text-lg pl-1"}
              label={text.playNow[lang]}
              shape={"pill"}
              size={"medium"}
              textStyles={"font-bold uppercase ml-2"}
              eventHandler={handleButton}
              styles="text-purple-600 bg-white"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
