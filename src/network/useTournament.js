import { useState, useContext } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "../context/Context";
import { useHistory } from "react-router-dom";

const useTournament = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);
  const { uniqueId, number } = reactLocalStorage.getObject("userProfile");
  const { handleShowModal, getLanguage } = useContext(Context);
  const history = useHistory();
  const lang = getLanguage();



  const getTournamentSummary = () => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("tournamentSummary");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        // method: "GET",
        headers: header,
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getTournamentDetails = (tournamentSummaryId, selectedDate, endDate) => {
    const header = config.get("headers");
    const body = {
      "userId": uniqueId,
      "startRows": 0,
      "numberofRows": 10,
      // "date": selectedDate,
      endDate : endDate,
      startDate : selectedDate,
      "tournamentSummaryId": tournamentSummaryId,
    };
    const url = config.get("base") + config.get("tournamentDetails");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };


  const getGameId = (gameId) => {
    const header = config.get("headers");
    const body = {
      "userId": uniqueId,
      "tournamentSummaryId": reactLocalStorage.get("tournamentSummaryId"),
      "userGameId": gameId
    };
    const url = config.get("base") + config.get("addGameId");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const joinTournament = (tournamentId, tournamentSummaryId, userGameId) => {
    const header = config.get("headers");
    const body = {
      squadIds: "",
      squadType: "",
      userId: uniqueId,
      tournamentId: tournamentId,
      tournamentSummaryId: tournamentSummaryId,
      userGameId:userGameId,
    };
    const url = config.get("base") + config.get("joinTournament");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);

          } else{
            reject(response)
          }
         
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const registeredUser = () => {
    const userGameId = reactLocalStorage.get("userGameId")
    const header = config.get("headers");
    const body = {
      userId: uniqueId,
      squadType: 'solo',
      squadIds: '',
      userGameId: userGameId,
      "tournamentId": 1,
      "tournamentSummaryId": 1,
    };
    const url = config.get("base") + config.get("joinTournament");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
            const modalData = {
              title: "Congratulations",
              body: "Tournament joined sucessfully",
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
                  history.push('/tournaments');
                  // window.location.reload();
                }
              },
            };
            handleShowModal(true, modalData);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const clearRegisteredUser = (tournamentId) => {
    const header = config.get("headers");
    const body = {
      userId: uniqueId,
      tournamentId: tournamentId,
      tournamentSummaryId: reactLocalStorage.get("tournamentSummaryId"),
    };
    const url = config.get("base") + config.get("clearRegisteredUser");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const reportUser = () => {
    const header = config.get("headers");
    const body = {
    };

    const url = config.get("base") + config.get("reportUser");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            if (data.status.toUpperCase() === "SUCCESS") {
              setStatus("fetched");
              resolve(data);
            } else {
              reject(data);
            }
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const claimCoins = () => {
    const header = config.get("headers");
    const body = {
      uniqueId: uniqueId,
    };
    const url = config.get("base") + config.get("claimCoins");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getPrize = (id) => {
    console.log('------id------>', id);
    const header = config.get("headers");
    // const body = {
    //   userId: uniqueId,
    //   tournamentId: Number(id)
    // };
    const url = config.get("base") + config.get("prizePool") + "/" + Number(id);
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        // method: "POST",
        headers: header,
        // body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getTournamentHistory = (tournamentSummaryId) => {
    const header = config.get("headers");
    const body = {
      userId: uniqueId,
      tournamentSummaryId: Number(tournamentSummaryId)

    };
    const url = config.get("base") + config.get("tournamentHistory");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const debitCoinsTournament = (tournamentId, userGameId) => {
    const header = config.get("headers");
    const body = {
      "squadIds": "",
      "squadType": "",
      "tournamentId": tournamentId,
      "userGameId": userGameId,
      "userId": uniqueId
    };
    const url = config.get("base") + config.get("debitCoinsTournament");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getWinnersList = (tournamentId) => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("winnersList")  + `/${tournamentId}/SUBMIT`;
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers: header,
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setData(data);
            setStatus("fetched");
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return {
    status,
    data,
    getTournamentSummary,
    getTournamentDetails,
    getGameId,
    joinTournament,
    reportUser,
    clearRegisteredUser,
    registeredUser,
    claimCoins,
    getPrize,
    getTournamentHistory,
    debitCoinsTournament,
    getWinnersList
  };
};

export default useTournament;
