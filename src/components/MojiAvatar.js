import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import Button from "../commonComponents/Button";
import Image from "../commonComponents/Image";
import Title from "../commonComponents/LoginTitle";
import Text from "../commonComponents/Text";
import useMojiAvatar from "../network/useMojiAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Anchor from "../commonComponents/Anchor";
import queryString from "query-string";
import _ from "lodash";
import cx from "classnames";
import ContentPlaceholder from "../commonComponents/ContentPlaceholder";
import RedirectHook from "../myhooks/RedirectHook";
import ApiNotFound from "./ApiNotFound";
import "../App.scss";
import { MojiAvatarText as text } from "../Database/Text";
import { Context } from "../context/Context";
import {logEvent} from '../Analytics/AnalyticsEvent';
import {screen, events} from '../Analytics/EventName';
import {SendGuiDataEvents} from '../commonScript';

function MojiAvatar() {
  const userProfile = reactLocalStorage.getObject("userProfile");
  const [avatarList, setAvatarList] = useState([]);
  const [activeImgId, setActiveImgId] = useState("");
  const [activeImgUrl, setActiveImgUrl] = useState("");
  const [error, setError] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const { getMojiAvatarData, sendMojiAvatarData } = useMojiAvatar();
  const {  updateRedirectHome } = useContext(Context);
  let history = useHistory();
  const { location } = history;
  let { pathname } = useLocation();
  let params = queryString.parse(location.search);
  const { unblock } = RedirectHook();
  console.log(" >>> ---- params ----", params);
  const tempObj = reactLocalStorage.getObject("tempObj");
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

  const display =
    _.isEmpty(params) === false && _.has(params, "sk") && params.sk === "h"
      ? false
      : true;

  useEffect(() => {
    let guiDataEvent = {}
     guiDataEvent['page'] = 'moji_avatar';
      guiDataEvent['event'] = 'open';
      SendGuiDataEvents(guiDataEvent);
    setLang(getLanguage());
    return () => {
      // unblock();
      updateRedirectHome(true)
    };
  },[]);
  
  useEffect(() => {
    const uniqueId = userProfile.uniqueId;
    getMojiAvatarData(uniqueId)
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          console.log(">>>>> GET AVATAR API SUCCESS >>>>>", res.avatarList);
        const reason = res.reason ? res.reason : "null";
        logEvent(
            {
              screen: screen.moji_p,
              event: events.avatarApiSuccess
            }, 
            {
              title: "getMojiAvatarData request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                resStatus: res.status,
                resReason: reason
              }
            });

        // ReactGA.event({
        //     category: "mojiavatar_p",
        //     action: `getMojiAvatarData request made - mobile - ${tempObj.number}, , date - ${new Date()}, resStatus - ${res.status}, resReason - ${reason}`,
        // });
        delete res.avatarList[0];
        let avatarListItem = [];
        if (
          _.isEmpty(userProfile) === false &&
          _.has(userProfile, "avatarUrl") &&
          userProfile.avatarUrl.length > 0
        ) {
          avatarListItem = res.avatarList.map((item) => {
            if (item.url === userProfile.avatarUrl) {
              setActiveImgId(item.avatarId);
              setActiveImgUrl(item.url);
            }
            return item;
          });
        } else {
          avatarListItem = res.avatarList;
        }

        setAvatarList(avatarListItem);
        }else {
          const reason = res.reason ? res.reason : "null";
          logEvent(
            {
              screen: screen.moji_p,
              event: events.avatarApiFailure
            }, 
            {
              title: "getMojiAvatarData request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                resStatus: res.status,
                resReason: reason
              }
            });
        }
      })
      .catch((err) => {
        let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
        console.log(">>>>> GET AVATAR API ERROR >>>>>", err);
        logEvent(
            {
              screen: screen.moji_p,
              event: events.avatarApiFailure
            }, 
            {
              title: "getMojiAvatarData request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                err: errObj
              }
            });
        // ReactGA.event({
        //   category: "mojiavatar_p",
        //   action: `getMojiAvatarData inside catch - mobile - ${tempObj.number}, err - ${err}, , date - ${new Date()}`,
        // });
        setApiFailed(true);
      });
      
  }, []);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  const handleImgClick = (id, url) => {
    setActiveImgId(id);
    setActiveImgUrl(url);
    setError("");
  };

  const handleSkip = () => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'moji_avatar';
    guiDataEvent['event'] = 'skip_click';
    SendGuiDataEvents(guiDataEvent);
    if (display) {
      console.log("skip");
      sendMojiAvatarData("").then(
        (res) => {
          if (res.status.toUpperCase() === "SUCCESS") {
            const reason = res.reason ? res.reason : "null";
            logEvent(
            {
              screen: screen.moji_p,
              event: events.createProfileApiSuccess
            }, 
            {
              title: "Profile created with default moji, Skip button clicked",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                resStatus: res.status,
                resReason: reason
              }
            });
          // ReactGA.event({
          //   category: "mojiavatar_p",
          //   action: `createProfile request made, no moji selected and skip button clicked - mobile - ${tempObj.number}, date - ${new Date()}, , resStatus - ${res.status}, resReason - ${reason}`,
          // });
          console.log("res", res);
          history.push("/home");
          }else {
            const reason = res.reason ? res.reason : "null";
            logEvent(
            {
              screen: screen.moji_p,
              event: events.createProfileApiFailure
            }, 
            {
              title: "createProfile request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                resStatus: res.status,
                resReason: reason
              }
            });
          }
          
        },
        (err) => {
          logEvent(
            {
              screen: screen.moji_p,
              event: events.createProfileApiFailure
            }, 
            {
              title: "createProfile request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                err: err
              }
            });
          console.log(err);
        }
      );
    } else {
      console.log("cancel");
      logEvent(
            {
              screen: screen.moji_p,
              event: events.cancelClick
            }, 
            {
              title: "no moji selected and cancel button clicked",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number
            });
      history.push("/myprofile");
    }
  };

  const handleClick = () => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'moji_avatar';
    guiDataEvent['event'] = 'update_click';
    SendGuiDataEvents(guiDataEvent);
    console.log("submitting the form ::", activeImgId, activeImgUrl);
    if (activeImgId === "") {
      console.log("No image selected...");
      logEvent(
            {
              screen: screen.moji_p,
              event: events.continueBtnClick
            }, 
            {
              title: "No image selected and continue button clicked",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
            });
      setError(true);
    } else {
      sendMojiAvatarData(activeImgUrl).then(
        (res) => {
          if (res.status.toUpperCase() === "SUCCESS") {
            const reason = res.reason ? res.reason : "null";
            logEvent(
            {
              screen: screen.moji_p,
              event: events.createProfileApiSuccess
            }, 
            {
              title: "createProfile request successfull",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                selectedMojiavatarUrl: activeImgUrl,
                resStatus: res.status,
                resReason: reason
              }
            });
          const getObj = { ...userProfile, avatarUrl: activeImgUrl };
          reactLocalStorage.setObject("userProfile", getObj);
          console.log("res", res);
          if (_.isEmpty(params) === false && _.has(params, "sk") && params.sk === "h") {
            history.push("/myprofile");
          }else {
            history.push("/home");
          }
            
          
          
          }else {
            const reason = res.reason ? res.reason : "null";
            logEvent(
            {
              screen: screen.moji_p,
              event: events.createProfileApiFailure
            }, 
            {
              title: "createProfile request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                resStatus: res.status,
                resReason: reason
              }
            });
          }          
        },
        (err) => {
          logEvent(
            {
              screen: screen.moji_p,
              event: events.createProfileApiFailure
            }, 
            {
              title: "createProfile request failed",
              date: new Date(),
              code: tempObj.code,
              mobile: tempObj.number,
              others: {
                err: err
              }
            });
          console.log(err);
        }
      );
    }
  };
  const avatars =
    avatarList.length > 0
      ? avatarList.map((item) => {
          return (
            <div
              key={item.avatarId}
              className={` pl-4 pr-4 ${activeImgId == item.avatarId ? 'p-4' : 'p-5'} w-1/3 justify-center items-center ${
                activeImgId == item.avatarId ? "relative" : ""
              }`}
              onClick={() => {
                logEvent(
                  {
                    screen: screen.moji_p,
                    event: events.mojiClick
                  }, 
                  {
                    title: "mojiavatar selected",
                    date: new Date(),
                    code: tempObj.code,
                    mobile: tempObj.number,
                    others: {
                      avatarId: item.avatarId,
                      avatartUrl: item.url,
                    }
                  });
                  handleImgClick(item.avatarId, item.url)
                  }    
                }
            >
              <Image
                fullHeight
                fullWidth
                styles={
                  activeImgId == item.avatarId
                    ? "aspect-w-1 aspect-h-1 rounded-full border-2 border-green-400 m-auto"
                    : "aspect-w-1 aspect-h-1 rounded-full"
                }
                url={item.url}
              />
              {activeImgId == item.avatarId && (
                <span
                  className="border-green-400 z-10"
                  style={{ position: "absolute", left: "74%", top: "21%" }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    color="#6EBC47"
                    className={"text-lg"}
                    style={{ backgroundColor: "white", borderRadius: "50%" }}
                  />
                </span>
              )}
            </div>
          );
        })
      : [];

  let loaderClass = cx(
    "flex flex-wrap w-full pb-4 1xs:pb-8 2xs:pb-24 3xs:pb-28 ",
    {
      visible: avatars.length > 0,
      invisible: avatars.length <= 0,
    }
  );

  return (
    <section className="w-full justify-center items-center max-w-500px module">
      <div className="fixed top-0 w-full max-w-500px">
        <Title
          title={
            <>
              {text.title.text1[lang]}{" "}
              <span className="text-blueMoji">{text.title.text2[lang]}</span>{" "}
              <span className="text-orange italic">
                {text.title.text3[lang]}{" "}
              </span>{" "}
              {text.title.text4[lang]}
            </>
          }
          titleTag="h4"
          subtitle={text.subtitle[lang]}
          subTitleColor={"lightPurple"}
        />
        <div className="pt-2">
          <Text
            tag="h5"
            scale={true}
            styles="pb-4 p-5 text-white"
            text={text.header[lang]}
            fontweight="bold"
            alignment="center"
            textTransform={"uppercase"}
          />
        </div>
      </div>
      {/* pb-10 xs:h-70v 2xs:h-60v overflow-auto */}
      <div
        className="w-full max-w-500px flex flex-wrap justify-around px-2 pb-10 fixed top-40 overflow-y-auto contentContainer "
        style={{ height: "calc(100% - 30%)" }}
      >
        {avatars.length <= 0 && (
          <>
            <ContentPlaceholder />
            <ContentPlaceholder />
            <ContentPlaceholder />
            <ContentPlaceholder />
          </>
        )}
        <div className={loaderClass}>{avatars}</div>
      </div>

      <div className="w-full pt-2 pb-4 px-3 fixed bottom-0 max-w-500px m-auto bg-primary z-10">
        {error && (
          <div className="w-full relative">
            <Text
              tag="h6"
              scale={true}
              styles="text-red-500 pb-1"
              text={text.helper[lang]}
              fontweight="bold"
              alignment="center"
            />
          </div>
        )}
        <Button
          type="button"
          label={display ? text.continue[lang] : "Үргэлжлүүлэх"}
          action={display ? "continue" : "update"}
          size={"medium"}
          styles={"font-bold text-lg bg-white text-purple-600"}
          eventHandler={() => handleClick()}
        />
        <div className="w-full text-center pt-3">
          <Anchor
            clickEvent={() => handleSkip()}
            item={{ title: display ? text.skip[lang] : "Дараагийн хуудас" }}
            classes="text-white font-bold text-lg"
            tag={"h5"}
          />
        </div>
      </div>
    </section>
  );
}

export default MojiAvatar;
