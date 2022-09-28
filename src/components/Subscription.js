import React, { useState, useEffect, useContext } from "react";
import Image from "../commonComponents/Image";
import SubscriptionDataNew from "../Database/SubscriptionDataNew";
import SubscriptionPack from "../commonComponents/SubscriptionPack";
import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { reactLocalStorage } from "reactjs-localstorage";
import useSubscribe from "../network/useSubscribe";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import { Context } from "../context/Context";
import ProcessingPage from "../commonComponents/ProcessingPage";
import mobibattle from "../assets/gmobileMongolia/2-min.png";
import thumbmnail from "../assets/gmobileMongolia/thumbnail.png";
import horizontal_line from "../assets/subscription/horizontal_line.png";
import useRegister from "../network/useRegister";
import _ from "lodash";
import useProceedToPay from "../network/useProceedToPay";
import { Link } from "react-router-dom";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { events, screen } from "../Analytics/EventName";
import {SubscriptionText as text} from '../Database/Text'
import {SendGuiDataEvents} from '../commonScript';
import gb1 from '../assets/gmobileMongolia/1Gb.png';
import gb2 from '../assets/gmobileMongolia/2Gb.png';
import gb4 from '../assets/gmobileMongolia/4Gb.png';
import { Base64 } from "js-base64";

function Subscription() {
  const gbIcons = [gb1, gb2, gb4];
  const [subscriptionData, setSubscriptionData] = useState([]);
  const { getLanguage, handleShowModal } = useContext(Context);
  const [lang, setLang] = useState("mg");
  const [currItem, setCurrItem] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [loader, showLoader] = useState(true);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [disableSkip, setDisableSkip] = useState(false);
  const [disableSub, setDisableSub] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topups, setTopups] = useState([]);
  const history = useHistory();
  let { search, pathname } = useLocation();
  const { result, mode } = queryString.parse(search);
  const [subType, setsubType] = useState("sub");
  const { getPacks, subscribe, checkSubscription } = useSubscribe();
  const { register, guestRegister } = useRegister();
  const { getTopupsData } = useProceedToPay();
  const userProfile = reactLocalStorage.getObject("userProfile");
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = userName === "Guest" ? 1 : 0;
  const notSubscribed =
    require("../assets/mtncongo/oops_busy_player.png").default;
    useEffect (() => {
      //send gui events
      let guiDataEvent = {}
      guiDataEvent['page'] = 'subscription';
      guiDataEvent['event'] = 'open';
      SendGuiDataEvents(guiDataEvent);
    },[])


  useEffect(() => {
    window.scrollTo(0, 0);
    // reactLocalStorage.remove('redirect');
    setLang(getLanguage());
    if (_.isEmpty(userProfile) === false && _.has(userProfile, "uniqueId")) {
      setIsLoggedIn(true);
    }
    setTimeout(() => {
      setShowSkip(true);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (history.action === "POP" && result == "true") {
        console.log("-------browser back fired------->");
        history.push("/home");
      }
    };
  });

  useEffect(() => {
    if (subType === "combo") {
      getTopupsData()
        .then((res) => {
          const packs = JSON.parse(res.packs);
          packs.sort((a, b) => {
            return a.amount - b.amount;
          });
          setTopups(packs);
          getSubscriptionPacks("combo");
        })
        .catch((err) => {
          console.error(err);
          showLoader(false);
        });
    } else {
      getSubscriptionPacks("normal");
    }
  }, []);

  const getSubscriptionPacks = (subType) => {
    getPacks()
      .then((res) => {
        let data = JSON.parse(res.packs);
        data.sort((a, b) => {
          return a.amount - b.amount;
        });
        console.log("sub packs", data);
        data = data.filter((item) => {
          if (subType === "normal") {
            return item.linkedEventId == null;
          } else {
            return item.linkedEventId != null;
          }
        });
        data.length > 0 && setDisableSub(false);
        setSubscriptionData(data);
        let activeIndex = Math.floor(data.length / 2);
        // setActiveId(activeIndex);
        // setCurrItem(data[activeIndex]);
        showLoader(false);
        if (mode === "registered") {
          const modalData = {
            icon: notSubscribed,
            title: "",
            body: text.notSubscribed[lang],
            buttons: [
              {
                label: text.okay[lang],
                action: "okay",
                buttonColor: "bg-tabsColor",
                textColor: "text-white",
              },
            ],
            handleClick: function (button) {
              if (button === "okay") {
                handleShowModal(false);
              }
            },
          };
          handleShowModal(true, modalData);
        }
      })
      .catch((err) => {
        console.error(err);
        showLoader(false);
      });
  };

  const handleSubscribe = (item) => {
    //send gui events
    let guiDataEvent = {}
    guiDataEvent["page"] = "subscription";
    guiDataEvent["event"] = "sub_click";
    guiDataEvent["pack"] = item.name;
    SendGuiDataEvents(guiDataEvent);
    reactLocalStorage.setObject("currItem", item);
    const msisdn = reactLocalStorage.get("msisdn");
    const heRegister = reactLocalStorage.get("heRegister");
    if (msisdn) {
      setShowProcessing(true);
      let code = "+976";
      let otp = "";
      register(msisdn.substring(3), "HE", code, otp)
        .then((res) => {
          if (res.status.toUpperCase() === "SUCCESS") {
            reactLocalStorage.setObject("tempObj", {
              number: msisdn,
              code: code,
            });
            checkSubscription(res.uniqueId).then((response) => {
              reactLocalStorage.set(
                "subStatus",
                response.currentStatus.toLowerCase()
              );
              if (
                response.currentStatus.toLowerCase() === "susbscribed" ||
                response.currentStatus.toLowerCase() === "pending" ||
                response.currentStatus.toLowerCase() === "active"
              ) {
                history.push("/home?mode=subscribe");
              } else if (
                response.currentStatus.toLowerCase() === "grace" ||
                response.currentStatus.toLowerCase() === "parking"
              ) {
                history.push("/home");
              } else if (
                response.currentStatus.toLowerCase() === "new" ||
                response.currentStatus.toLowerCase() === "unsubscribed" ||
                response.currentStatus.toLowerCase() === "unsub"
              ) {
                subscribe(item, res.uniqueId)
                  .then((res) => {
                    let guiDataEvent = {};
                    guiDataEvent["page"] = "subscription";
                    guiDataEvent["event"] = `sub_api_${res.status.toLowerCase()}`;
                    SendGuiDataEvents(guiDataEvent);

                    if (res.walletResponse) {
                      let currentStatus = JSON.parse(
                        res.walletResponse
                      ).currentStatus;
                      reactLocalStorage.set("subStatus", currentStatus);
                    }
                    console.log(">>>>> SUBSCRIBE API SUCCESS >>>>>", res);
                    setShowProcessing(false);
                    if (msisdn) {
                      reactLocalStorage.set("heRegister", true);
                      history.push(`/subStatus?status=${res.status}`);
                    } else {
                      history.push(`/subStatus?status=${res.status}`);
                    }
                  })
                  .catch((err) => {
                    console.log(">>>>> SUBSCRIBE API ERROR >>>>>", err);
                  });
              }
            });
          }
        })
        .catch((err) => {
          console.log("error is", err);
        });
    } else if (heRegister === "true") {
      setShowProcessing(true);
      subscribe(item)
        .then((res) => {
          console.log(">>>>> SUBSCRIBE API SUCCESS >>>>>", res);
          setShowProcessing(false);
          if (msisdn) {
            history.push(`/subStatus?status=${Base64.encode(res.status)}`);
          } else {
            history.push(`/subStatus?status=${Base64.encode(res.status)}`);
          }
        })
        .catch((err) => {
          console.log(">>>>> SUBSCRIBE API ERROR >>>>>", err);
        });
    } else {
      const userProfile = reactLocalStorage.getObject("userProfile");
      if (_.isEmpty(userProfile) === false && _.has(userProfile, "uniqueId")) {
        const { name, uniqueId } = userProfile;
        if (name === "Guest") {
          history.push(`/login?mode=${Base64.encode("subscribe")}`);
        } else {
          setShowProcessing(true);
          // const activeObj = reactLocalStorage.getObject("currItem");
          subscribe(item, uniqueId)
            .then((res) => {
              console.log(">>>>> SUBSCRIBE API SUCCESS >>>>>", res);
              setShowProcessing(false);
              history.push(`/subStatus?status=${Base64.encode(res.status)}`);
            })
            .catch((err) => {
              console.log(">>>>> SUBSCRIBE API ERROR >>>>>", err);
            });
        }
      } else {
        history.push(`/login?mode=${Base64.encode("subscribe")}`);
      }
    }
  };
  const handleClick = (id, item) => {
    setCurrItem(item);
    setActiveId(id);
    handleSubscribe(item);
  };

  const handleSkip = () => {
    //send gui events
     let guiDataEvent = {}
    guiDataEvent["page"] = "subscription";
    guiDataEvent["event"] = "skip_click";
    SendGuiDataEvents(guiDataEvent);
    logEvent(
      {
        screen: screen.subscription_p,
        event: events.click,
      },
      {
        title: "Skip button clicked",
      }
    );
    setDisableSkip(true);
    const msisdn = reactLocalStorage.get("msisdn");
    let code = "+976";
    if (msisdn) {
      let otp = "";
      register(msisdn.substring(3), "HE", code, otp)
        .then(
          (res) => {
            if (res.status.toUpperCase() === "SUCCESS") {
              reactLocalStorage.set("heRegister", true);
              reactLocalStorage.setObject("tempObj", {
                number: msisdn,
                code: code,
              });
              history.push("/home");
            }
          },
          (err) => {
            console.log("Promise rejected...", err);
          }
        )
        .catch((err) => {
          console.log("error is", err);
        });
    } else {
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
  };

  const handleBack = () => {
    history.goBack();
  };

  const submitAlreadySubcribed = () => {
    //send gui events
let guiDataEvent = {}
    guiDataEvent["page"] = "subscription";
    guiDataEvent["event"] = "already_reg_click";
    SendGuiDataEvents(guiDataEvent);
    const msisdn = reactLocalStorage.get("msisdn");
    if (msisdn) {
      setShowProcessing(true);
      let code = "+976";
      let otp = "";
      register(msisdn, "HE", code, otp)
        .then(
          (res) => {
            if (res.status.toUpperCase() === "SUCCESS") {
              reactLocalStorage.setObject("tempObj", {
                number: msisdn,
                code: code,
              });
              checkSubscription(res.uniqueId).then((response) => {
                setShowProcessing(false);
                if (response.status.toUpperCase() === "SUCCESS") {
                  history.push("/home");
                } else {
                  const modalData = {
                    icon: notSubscribed,
                    title: "",
                    body: text.notSubscribed[lang],
                    buttons: [
                      {
                        label: text.okay[lang],
                        action: "okay",
                        buttonColor: "bg-tabsColor",
                        textColor: "text-white",
                      },
                    ],
                    handleClick: function (button) {
                      if (button === "okay") {
                        handleShowModal(false);
                      }
                    },
                  };
                  handleShowModal(true, modalData);
                }
              });
            }
          },
          (err) => {
            setShowProcessing(false);
            console.log("Promise rejected...", err);
          }
        )
        .catch((err) => {
          setShowProcessing(false);
          console.log("error is", err);
        });
    }else{
      history.push(`/login?mode=${Base64.encode("subscribed")}`);
    }
  };

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  // const [iconIndx, setIconIndx] = useState(-1);

  return (
    <>
      {loader && <Loader />}
      {showProcessing ? (
        <ProcessingPage />
      ) : (
        <div className={`px-2 mt-2 flex flex-col ${loaderClass}`}>
          <div className="flex justify-end relative">
            <Image
              url={mobibattle}
              styles="my-2 mx-0 w-14 left-0 right-0 mx-auto absolute"
            />
            {!isLoggedIn && showSkip && (
              <div className="px-2 my-4">
                <Button
                  size="medium"
                  label={text.skip[lang]}
                  styles="rounded-lg font-medium text-white text-opacity-60 border border-lightPurple py-1"
                  eventHandler={disableSkip ? null : handleSkip}
                />
              </div>
            )}
            {(guest === 1 || isLoggedIn) && mode !== "registered" && (
              <div className="px-2 my-4">
                <Button
                  size="medium"
                  label={text.close[lang]}
                  styles="rounded-lg font-medium text-white text-opacity-60 border border-lightPurple py-1"
                  eventHandler={handleBack}
                />
              </div>
            )}
            {/* {mode === "registered" && (
            <div className="px-2 my-4">
              <Button
                size="medium"
                label={text.skip[lang]}
                styles="rounded-lg font-medium text-white text-opacity-60 border border-lightPurple py-1"
                eventHandler={() => {
                  history.push("/home");
                }}
              />
            </div>
          )} */}
          </div>

          <Image url={thumbmnail} styles=" mb-4 rounded-xl" />

          <div className="flex flex-col justify-center items-center w-full px-2">
            <Text
              tag="h6"
              text=" Санамж: Та дараах багцуудаас идэвхжүүлж нэвтрэх эрхээ баталгаажуулна уу"
              styles="text-white"
            />
            {subscriptionData &&
              subscriptionData.map((item, index) => {
                if (subType === "combo") {
                  // var iconIndex = -1;
                  for (let i = 0; i < topups.length; i++) {
                    let coinAmount = topups[i].credits;
                    if (topups[i].packId === item.linkedEventId) {
                      return (
                        <SubscriptionPack
                          type="combo"
                          subType={subType}
                          key={index}
                          item={item}
                          name={item.name}
                          gbIcon={gbIcons[index]}
                          description={item.description}
                          amount={item.amount}
                          currency={SubscriptionDataNew.currency}
                          activeId={activeId}
                          handleClick={handleClick}
                          id={index}
                          lang={lang}
                          coinAmount={coinAmount}
                        />
                      );
                    }
                  }
                } else if (subType !== "combo") {
                  return (
                    <SubscriptionPack
                      type="sub"
                      subType={subType}
                      key={index}
                      item={item}
                      name={item.name}
                      description={item.description}
                      amount={item.amount}
                      gbIcon={gbIcons[index]}
                      currency={SubscriptionDataNew.currency}
                      activeId={activeId}
                      handleClick={handleClick}
                      id={index}
                      lang={lang}
                    />
                  );
                }
                return null;
              })}
          </div>
          <div className="px-2">
            {(_.isEmpty(userProfile) === true || guest === 1) && (
              <p className="text-center text-white my-4">
                {text.alreadyReg[lang]}
                <span
                  className="text-orange ml-1 underline"
                  onClick={() => {
                    submitAlreadySubcribed();
                  }}
                >
                  {text.clickHere[lang]}
                </span>
              </p>
            )}
          </div>

          <Image url={horizontal_line} styles="my-5" />

          <div className=" flex justify-evenly items-center divide-x divide-white px-2 pb-4">
            <Link to={"/PrivacyPolicy"}>
              <Text
                tag="h6"
                text={text.links.link1[lang]}
                styles="px-4 font-bold text-white text-center text-opacity-90"
              />
            </Link>

            <Link to={"/TermsAndConditions"}>
              <Text
                tag="h6"
                text={text.links.link2[lang]}
                styles="px-4 font-bold text-white text-center text-opacity-90"
              />
            </Link>
            <Link to={"/contact-us"}>
              <Text
                tag="h6"
                text={"Холбоо барих"}
                styles="px-4 font-bold text-white text-center text-opacity-90"
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Subscription;
