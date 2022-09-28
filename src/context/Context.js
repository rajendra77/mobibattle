import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import { reactLocalStorage } from "reactjs-localstorage";
// import _ from "lodash";
const Context = createContext();
// console.log('-----&&&&context----->', Context);
const { Provider } = Context;

function ThemeContextProvider(props) {
  const [code, setCode] = useState("+976");
  const [gameId, setGameId] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [show, setShow] = useState(false);
  const [battleData, setBattleData] = useState({});
  const [gameResult, setGameResult] = useState({});
  // const [battleResult, setBattleResult] = useState([]);
  const [catId, setCatId] = useState({});
  const [gameEnd, setGameEnd] = useState(0);
  const [curScore, setCurScore] = useState(0);
  const [number, setNumber] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [currentGameData, setCurrentGameData] = useState({});
  const [walletBalance, setWalletBalance] = useState("");
  const [battleScore, setBattleScore] = useState({});
  const [redirectHome, setRedirectHome] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [tournamentTab, setTournamentTab] = useState("upcoming");
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [clean, setClean] = useState(false);
  const [resendOtpCount, setResendOtpCount] = useState(0);
  const [score, setScore] = useState(0);
  const [oppOutRes, setOppOutRes] = useState({});
  const [isOppOut, setIsOppOut] = useState(false);


  const updateValue = (val) => {
    setShow(val);
  };
  const updateCode = (data) => {
    setCode(data);
  };
  const updateMyScore = (data) => {
    console.log("data::", data);
    setScore(data);
  }
  const oppOutResult = (data) => {
    console.log(">>> oppOutResult Data for context :::", data);
    setOppOutRes(data);
  };
  const oppOutStatus = (isOut) => {
    console.log(">>> oppOutStatus :::", isOut);
    setIsOppOut(isOut);
  };
  const endGameResult = (data) => {
    console.log(">>> endGame Data for context :::", data);
    setGameResult(data);
  };
  const updateScore = (score) => {
    console.log("Update score function called ---- ", score);
    setCurScore(score);
  };
  const gameEndState = (state) => {
    setGameEnd(state);
  };
  const updateBattle = (battle) => {
    console.log("Update battle data function called :::: ", battle);
    // if (battle && _.has(battle, "img") && battle.img.length > 0) {
    //   console.log("Update battle data with delayed image ::: ", battle.img);
    //   battle.img =
    //     "https://deelay.me/5000/http://sandbox.mobibattle.co/res/assets/avatar/user-avatar5.svg";
    // }
    setBattleData(battle);
  };
  const battleCatId = (data) => {
    setCatId(data);
  };
  const saveResultTable = (data) => {
    console.log(">>> my result data saveResultTable:::", data);
    // setBattleResult(data);
  };
  const saveNumber = (data) => {
    console.log(">>> my number saveNumber:::", data);
    setNumber(data);
  };
  const saveUniqueId = (data) => {
    console.log(">>> my number saveUniqueId:::", data);
    setUniqueId(data);
  };
  const updateData = (data) => {
    console.log("------>>>>>>> data", data);
    setData(data);
  };
  const updateWalletBalance = (data) => {
    console.log("Wallet balance updated...context.js", data);
    setWalletBalance(data);
  };
  const updateBattleScore = (data) => {
    console.log("Context :: Update battle score called :: ", data);
    setBattleScore(data);
  };

  const updateRedirectHome = (data) => {
    console.log("Context :: Update Redirect home :: ", data);
    setRedirectHome(data);
  };

  const cleanData = () => {
    setClean(true);
  };

  const handleRegisterModal = (state) => setShowRegisterModal(state);

  const handleShowModal = (state, data) => {
    console.log(">>> Handle show modal func in context::: ", state);
    setShowModal(state);

    /** If no data (title, body, buttons) is passed to handleShowModal function, set default values with custom error message */
    let title =
      data && (data.title || data.title === "")
        ? data.title
        : "Something went wrong!";
    let body =
      data && data.body
        ? data.body
        : "There was an error. Please try after sometime.";
    let description = data && data.description ? data.description : "";
    let subDescription = data && data.subDescription ? data.subDescription : "";
    let icon = data && data.icon ? data.icon : "";
    let link = data && data.link ? data.link : {};
    let hideClose = data && data.hideClose ? data.hideClose : false;
    let buttons =
      data && data.buttons
        ? data.buttons
        : [
            {
              label: "Okay",
              action: "close",
              buttonColor: "bg-tabsColor",
              textColor: "text-white",
            },
          ];
    let handleClick =
      data && data.handleClick
        ? data.handleClick
        : function () {
            handleShowModal(false);
          };
    data = {
      title: title,
      body: body,
      description: description,
      subDescription : subDescription,
      icon: icon,
      buttons: buttons,
      link: link,
      handleClick: handleClick,
      hideClose: hideClose,
    };

    setModalData(data);
  };
  const saveCurrentGame = (data) => {
    console.log(">>> my current game data:::", data);
    setCurrentGameData(data);
  };

  const saveTournamentTab = (tab) => {
    setTournamentTab(tab);
  };
  const updateGameId = (data) => {
    console.log("------>>>>>>> data", data);
    setGameId(data);
  };
  const updateTournamentId = (data) => {
    console.log("------>>>>>>> data", data);
    setTournamentId(data);
  };
  const updateTournamentTitle = (data) => {
    console.log("------>>>>>>> data", data);
    setTournamentTitle(data);
  };


  const setLanguage = (lang) => {
    reactLocalStorage.getObject("lang", lang);
  };

  const updateResendCount = (data) =>{
    setResendOtpCount(data)
  }

  const getLanguage = () => {
    const lang =
      reactLocalStorage.getObject("lang") &&
      reactLocalStorage.getObject("lang").length > 0
        ? reactLocalStorage.getObject("lang")
        : "en";
    // return lang;
    return 'mg';


  };
  const { children } = props;
  return (
    <Provider
      value={{
        code,
        number,
        saveNumber,
        uniqueId,
        saveUniqueId,
        show,
        updateValue,
        gameResult,
        endGameResult,
        battleData,
        updateBattle,
        catId,
        battleCatId,
        gameEnd,
        clean,
        gameEndState,
        saveResultTable,
        curScore,
        updateScore,
        data,
        updateData,
        showModal,
        modalData,
        handleShowModal,
        updateCode,
        currentGameData,
        saveCurrentGame,
        walletBalance,
        updateWalletBalance,
        battleScore,
        updateBattleScore,
        redirectHome,
        updateRedirectHome,
        handleRegisterModal,
        showRegisterModal,
        tournamentTab,
        saveTournamentTab,
        updateGameId,
        updateTournamentId,
        gameId,
        tournamentId,
        updateTournamentTitle,
        tournamentTitle,
        setLanguage,
        getLanguage,
        cleanData,
        resendOtpCount,
        updateResendCount,
        updateMyScore,
        score,
        oppOutResult,
        oppOutStatus,
        oppOutRes,
        isOppOut
      }}
    >
      {children}
    </Provider>
  );
}

ThemeContextProvider.propTypes = {
  children: PropTypes.element,
};

export { Context, ThemeContextProvider };
