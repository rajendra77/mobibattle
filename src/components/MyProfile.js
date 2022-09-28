import React, { useEffect, useState, useContext } from "react";
import Image from "../commonComponents/Image";
import UserProfileData from "../Database/UserProfileData";
import _ from "lodash";
import Loader from "../commonComponents/Loader";
import cx from "classnames";
import { Link, useHistory } from "react-router-dom";
import useSubscribe from "../network/useSubscribe";
import useProfile from "../network/useProfile";
import Profile from "../commonComponents/Profile";
import { Context } from "../context/Context";
import { MyProfileText as text } from "../Database/Text";
import { reactLocalStorage } from "reactjs-localstorage";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { screen, events } from "../Analytics/EventName";
import Text from "../commonComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import useProceedToPay from "../network/useProceedToPay";
import {SendGuiDataEvents} from '../commonScript';



function MyProfile() {
  const [userData, setUserData] = useState({
    gameStats: [],
    gameDetails: [],
    tournamentStats: { upcoming: {}, datetime: {} },
    menu: [],
  });

  const [loader, showLoader] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [winnings, setWinnings] = useState(0);
  const [balance, setBalance] = useState();
  const [mainBalance, setMainBalance] = useState();
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const history = useHistory();
  const { checkSubscription } = useSubscribe();
  const { getBalanceData } = useProceedToPay();
  const { getProfile } = useProfile();

  const tempObj = reactLocalStorage.getObject("tempObj");
  console.log("------subscribed------>", subscribed);
  const userName = reactLocalStorage.getObject("userProfile").name;
  const guest = (userName === "Guest") ? 1 : 0


  useEffect(() => {
    window.scrollTo(0, 0);
    let guiDataEvent = {}
    setUserData(UserProfileData);
    setLang(getLanguage());
    guiDataEvent['page'] = 'myprofile';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  }, []);

  useEffect(() => {
    checkSubscription()
      .then((res) => {
        if (res.status.toUpperCase() === "SUCCESS") {
          setSubscribed(true);
        } else if (res.status.toUpperCase() === "FAILURE" || res.status.toUpperCase() === "PENDING") {
          setSubscribed(false);
          getBalanceData().then((res) => {
           console.log(res);
           (guest === 0) ? setBalance(res.main_balance + res.winning_balance) : setBalance(0);
          //  logEvent(
          //    {
          //      screen: screen.header,
          //      event: events.balanceApiSuccess
          //    }, 
          //    {
          //      title: "getBalance request successfull",
          //      date: new Date(),
          //      code: tempObj.code,
          //      mobile: tempObj.number,
          //      others: {
          //        balance: balance,
          //        resCode: res.statusCode,
          //        resReason: res.reason
          //      }
          //    });
         }).catch((err) => {
          //  let errObj;
          // const msg = err.message;
          // if (msg === "Failed to fetch") {
          //   errObj = `${msg} due to internet disconnected, statusCode: 503`
          // }else {
          //   errObj = err;
          // }
          //  logEvent(
          //    {
          //      screen: screen.header,
          //      event: events.balanceApiFailure
          //    }, 
          //    {
          //      title: "getBalance request failed",
          //      date: new Date(),
          //      code: tempObj.code,
          //      mobile: tempObj.number,
          //      others: {
          //        err: errObj
          //      } 
          //    }
          //  );
           console.log(">>>>> GET BALANCE API ERROR >>>>>", err)
         }); 
        }
      })
      .catch((err) => {
        console.log("------err------>", err);
        setSubscribed(false);
      });
    getProfile()
      .then((res) => {
        const reason = res.reason ? res.reason : "null";
        logEvent(
          {
            screen: screen.myProfile_p,
            event: events.apiSuccess,
          },
          {
            title: "myProfile request successfull",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
            others: {
              resStatus: res.status,
              resReason: reason,
            },
          }
        );
        console.log(">>>>> CHECK SUBSCRIPTION API SUCCESS >>>>>", res);
        setGamesPlayed(res.gamesPlayedCountFree + res.gamesPlayedCountPot);
        setGamesWon(res.winningBattlesFree + res.winningBattlesPot);
        setWinnings(res.winning_balance);
        showLoader(false);
      })
      .catch((err) => {
        let errObj;
        const msg = err.message;
        if (msg === "Failed to fetch") {
          errObj = `${msg} due to internet disconnected, statusCode: 503`;
        } else {
          errObj = err;
        }
        logEvent(
          {
            screen: screen.myProfile_p,
            event: events.apiFailure,
          },
          {
            title: "myProfile request failure",
            date: new Date(),
            code: tempObj.code,
            mobile: tempObj.number,
            others: {
              err: errObj,
            },
          }
        );
        console.log(">>>>> CHECK SUBSCRIPTION API ERROR >>>>>", err);
        showLoader(false);
        // setApiFailed(true);
      });
  }, []);

  const logout = () => {
    reactLocalStorage.clear();
    history.push("/");
  };

  let loaderClass = cx({
    visible: loader === false,
    invisible: loader === true,
  });

  return (
    <>
    
      {loader && <Loader />}
      <div className={`min-w-screen bg-myProfile ${loaderClass}`}>
        <div className="px-3">
          <Profile
            subscribed={subscribed}
            gamesPlayed={gamesPlayed}
            gameWon={gamesWon}
            winnings={winnings}
            text={text}
            lang={lang}
            balance={balance}
          />
        </div>

        <div className="bg-bg-myProfile">
          <div className="mt-8 bg-myProfileItemsBg pt-3">
            {_.has(UserProfileData, "menu") &&
              userData.menu.map((item, i) => {
                console.log("item::", item, item.id, i);
                const redirect = (guest === 1) ? "/subscription?subType=combo" : item.link
                return (
                  <Link
                    key={i}
                    to={redirect}
                    onClick={() => {
                      logEvent(
                        {
                          screen: screen.myProfile_p,
                          event: events.click,
                        },
                        {
                          title: `${item.link} button clicked`,
                          date: new Date(),
                          code: tempObj.code,
                          mobile: tempObj.number,
                        }
                      );
                    }}
                  >
                    <div
                      className="flex justify-between items-center w-full pl-2 py-3 relative text-white "
                      key={i}
                    >
                      <div className="w-full pl-4 flex items-center">
                        {item.icon && (
                          <Image
                            url={
                              require(`../assets/svg-icons/${item.icon}`)
                                .default
                            }
                            styles="pr-4 pb-3 w-10 h-10"
                          />
                        )}
                        <div
                          className={
                            i !== 1
                              ? "w-full flex justify-between pb-3 border-b-2 border-profileItemBorder"
                              : "w-full flex justify-between pb-3"
                          }
                        >
                          <div className="font-medium text-lg 2xs:text-base 3xs:text-sm">
                            {item.title[lang]}
                          </div>
                          <div className="px-4">
                            {item.icon && (
                              <Image
                                url={
                                  require(`../assets/svg-icons/${item.next_icon}`)
                                    .default
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
          {/* <div
            className="border border-gray-500 rounded-xl m-5 bg-darkPurple flex items-center justify-center"
            onClick={logout}
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              color="white"
              className={"ml-1 text-lg"}
            />
            <Text
              tag="h5"
              scale={true}
              text={UserProfileData.logout[lang]}
              textColor={"text-white"}
              alignment="center"
              styles={"p-3"}
            />
          </div> */}
        </div>
      </div>
    </>
  );
}

export default MyProfile;
