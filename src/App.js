import React, { useState, useContext, useEffect } from "react";
import "./App.scss";
import { Route, Switch, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import SingleGame from "./components/SingleGame";
import Error from "./components/Error";
import Login from "./components/Login";
import Otp from "./components/Otp";
import HomePage from "./components/HomePage";
import BattleInfo from "./components/BattleInfo";
import GameResult from "./components/GameResult";
import Faqs from "./components/Faqs";
import MyProfile from "./components/MyProfile";
import ComingSoon from "./components/ComingSoon";
import Header from "./subComponents/Header";
import UserProfileData from "./Database/UserProfileData";
import Modal from "./subComponents/Modal";
import LandingPage from "./components/LandingPage";
import cx from "classnames";
import { Context } from "./context/Context";
import MojiAvatar from "./components/MojiAvatar";
import SideMenu from "./components/SideMenu";
import LeaderBoardFinalDesign from "./components/LeaderBoardFinalDesign";
import AddAmount from "./components/AddAmount";
import AddCoinsStatus from "./components/AddCoinsStatus";
import PaymentConfirmation from "./components/PaymentConfirmation";
import { reactLocalStorage } from "reactjs-localstorage";
import showBackOption from "./Database/ShowBackOption";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Offline from "./components/Offline";
import useNetwork from "./myhooks/useNetworkHook";
import TournamentLeaderBoard from "./components/TournamentLeaderBoard";
import LeaderBoardStats from "./components/LeaderBoardStats";
import AllTransaction from "./components/AllTransaction";
import WalletNew from "./components/WalletNew";
import Withdraw from "./components/Withdraw";
import WithdrawSuccess from "./components/WithdrawSuccess";
import Contact from "./components/ContactUs";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import config from "./config/Config";
import TournamentUserName from "./components/TournamentUserName";
import Tournaments from "./components/Tournaments";
import TournamentHistory from "./components/TournamentHistory";
import TournamentAll from "./components/TournamentAll";
import TournamentRules from "./components/TournamentRules";
import DeviceInfo from "./utils/deviceInfo";
import Notifications from "./utils/Notification";
import GetAndroidApk from "./utils/getAndroidApk";
import Subscription from "./components/Subscription";
import SubscriptionProcessing from "./components/SubscriptionProcessing";
import SubStatus from "./components/SubStatus";
import CancelSubscription from "./components/CancelSubscription";
import CancelSubProcessing from "./components/CancelSubProcessing";
import ProcessingPage from "./commonComponents/ProcessingPage";
import PWA from './utils/pwaComponent'
import CancelSubStatus from "./components/CancelSubStatus";
import _ from "lodash";
import ContactUsNew from './components/ContactUsNew'

function App() {
  const { pathname } = useLocation();
  const [sideMenu, setSideMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPwa, setShowPwa] = useState(false)
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const history = useHistory();
  
  const {
    modalData,
    updateRedirectHome,
  } = useContext(Context);
  const tempObj = reactLocalStorage.getObject("tempObj");

  useEffect(() => {
    setLang(getLanguage());
    const ga_tag = config.get("ga_tag");
    const ga_debug = config.get("ga_debug");
    console.log("GOOGLE ANALYTICS DEBUG :: ", ga_tag, " :: ", ga_debug);
    ReactGA.initialize(ga_tag, {
      debug: ga_debug,
      titleCase: false,
      gaOptions: {
        userId: tempObj.number,
        cookieFlags: 'SameSite=None;Secure'
      },
    });
    // to report page view
    history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    });
  }, []);

  // useEffect(() => {
  //   window.addEventListener("beforeinstallprompt", (e) => {
  //     e.preventDefault()
  //     setDeferredPrompt(e)
  //     setShowPwa(true)
  //   });
  // }, []);

  // const handlePwaClick = () =>{
  //   if (deferredPrompt !== null) {
  //     setShowPwa(false)
  //     deferredPrompt.prompt();
  //     const { outcome } = deferredPrompt.userChoice;
  //     if (outcome === "accepted") {
  //       setDeferredPrompt(null)
  //     }
  //   }
  // }

  const showHeader = [
    "home",
    "addamount",
    "myprofile",
    "leaderBoard",
    "PrivacyPolicy",
    "TermsAndConditions",
    "faqs",
    "viewmore",
    "viewmatch",
    "tournamentLeaderBoard",
    "gameHistory",
    "alltransaction",
    "wallet",
    "withdraw",
    "contactus",
    "tournamentUserName",
    "tournamentHistory",
    "tournamentRules",
    "paymentConf",
    "contact-us"
  ];

  const matched = showHeader.find((path) => pathname.includes(path));
  let show = matched && matched.length > 0;
  if (pathname.length === 1) {
    show = false;
  }
  let classRouter = cx({
    "mt-20": show,
  });

  let showBack = false;
  let headerTitle = reactLocalStorage.getObject("userProfile").name;

  showBackOption.map((item) => {
    if (pathname.includes(item.path)) {
      headerTitle = item.title[lang];
      showBack = true;
    }
  });
  const showHomeList = ["myprofile", "leaderBoard"];
  const home = showHomeList.find((path) => pathname.includes(path));
  let showHome = home && home.length > 0;
  const status = useNetwork();
  if (!status) {
    return <Offline />;
  }

  const handleBackRedirection = [""];
  const backRedirectHome = handleBackRedirection.find((path) =>
    pathname.includes(path)
  );
  if (backRedirectHome) {
    updateRedirectHome(true);
  }
  

  return (
    <div className="App bg-primary fix-width h-full min-h-screen">
      {/* {showPwa && <PWA
         handlePwaClick = {handlePwaClick}
         handlePwaCancel = {()=>setShowPwa(false)}/>} */}
         {modalData &&  <Modal data={modalData} /> }
      <Notifications />
      <div className={classRouter}>
        {show && (
          <Header
            back={showBack}
            profileImg={showBack ? "" : UserProfileData.img}
            title={headerTitle}
            wallet={
              pathname === "/subscription" ||
              pathname === "/tournamentLeaderBoard" ||
              pathname === "/viewmatch" ||
              pathname === "/alltransaction" ||
              pathname === "/TermsAndConditions" ||
              pathname === "/contactus" ||
              pathname === "/PrivacyPolicy" ||
              pathname === "/faqs" ||
              pathname === "/contact-us" ||
              pathname === "/tournamentHistory" ||
              pathname === "/wallet" ||
              pathname === "/withdraw" ||
              pathname === "/addamount" ||
              pathname === "/paymentConf" ||
              pathname === "/withdrawSuc"
                ? false
                : true
            }
            hamburger={!showBack}
            setSideMenu={setSideMenu}
            home={showHome}
          />
        )}
        <SideMenu sideMenu={sideMenu} setSideMenu={setSideMenu} />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/otp" component={Otp} />
          <Route exact path="/contactus" component={Contact} />
          <Route path="/getAndroidApk" component={GetAndroidApk} />
          <Route path="/deviceInfo" component={DeviceInfo} />
          <Route path="/TermsAndConditions" component={TermsAndConditions} />
          <ProtectedRoute exact path="/home" component={HomePage} />
          <ProtectedRoute
            path="/singlegame/:category/:id"
            component={SingleGame}
          />
          <ProtectedRoute path="/battleinfo" component={BattleInfo} />
          {/* <ProtectedRoute path="/tournaments" component={Tournaments} /> */}
          <ProtectedRoute path="/gameresult" component={GameResult} />
          <Route path="/subscription" component={Subscription} />
          <ProtectedRoute
            path="/processing"
            component={SubscriptionProcessing}
          />
          <ProtectedRoute
            path="/cancelSubStatus"
            component={CancelSubStatus}
          />
          <ProtectedRoute path="/processingPage" component={ProcessingPage} />
          <Route path="/subStatus" component={SubStatus} />
          <ProtectedRoute path="/subscribed" component={CancelSubscription} />
          <ProtectedRoute
            path="/cancelSubProcessing"
            component={CancelSubProcessing}
          />
          
          <Route path="/faqs" component={Faqs} />
          <Route path="/contact-us" component={ContactUsNew} />
          <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
          <ProtectedRoute
            path="/leaderBoard"
            component={LeaderBoardFinalDesign}
          />
          <ProtectedRoute path="/gameHistory" component={LeaderBoardStats} />
          <ProtectedRoute path="/myprofile" component={MyProfile} />
          <Route path="/comingsoon" component={ComingSoon} />
          <ProtectedRoute path="/mojiavatar" component={MojiAvatar} />
          <ProtectedRoute path="/addamount" component={AddAmount} />
          {/* <ProtectedRoute path="/addamount" component={AddCoinsNew} /> */}

          <Route path="/addstatus" component={AddCoinsStatus} />
          <Route path="/offline" component={Offline} />
          <ProtectedRoute
            path="/tournamentLeaderBoard"
            component={TournamentLeaderBoard}
          />
          <ProtectedRoute path="/alltransaction" component={AllTransaction} />
          <ProtectedRoute path="/wallet" component={WalletNew} />
          {/* <ProtectedRoute path="/withdraw" component={WithdrawNew} /> */}
          <ProtectedRoute path="/withdraw" component={Withdraw} />
          <ProtectedRoute path="/withdrawSuc" component={WithdrawSuccess} />
          <ProtectedRoute path="/paymentConf" component={PaymentConfirmation} />
          <ProtectedRoute
            path="/tournamentUserName"
            component={TournamentUserName}
          />
          <ProtectedRoute path="/tournaments" component={Tournaments} />
          <ProtectedRoute
            path="/tournamentHistory"
            component={TournamentHistory}
          />
          <ProtectedRoute path="/allTournament" component={TournamentAll} />
          <ProtectedRoute path="/tournamentRules" component={TournamentRules} />
          <Route path="*" component={Error} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
