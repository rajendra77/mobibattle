import { useContext } from "react";

import { reactLocalStorage } from "reactjs-localstorage";
import config from "../config/Config";
import _ from "lodash";
import { Context } from "../context/Context";
import { updateData } from "../myhooks/SocketManagerIO";
import ReactGA from "react-ga";

const BattleResultHooks = () => {
  const { handleShowModal } = useContext(Context);
  const { number, uniqueId, deviceId } =
    reactLocalStorage.getObject("userProfile");
  const tempObj = reactLocalStorage.getObject("tempObj");

  /** ------- Commit score to leader board hook starts ------- */
  const commitScoreUrl = config.get("base") + config.get("commitScore");
  const handleCommitScore = (id, score, cat) => {
    console.log("------inside handle commit score------>");
    const reqBody = {
      method: "POST",
      cache: "no-cache",
      headers: config.get("headers"),
      body: JSON.stringify({
        state: "gameEnd",
        gameId: id,
        score: score,
        type: cat,
        winner: "",
        uniqueId: uniqueId,
        deviceId: deviceId,
      }),
    };
    return new Promise((resolve, reject) => {
      fetch(commitScoreUrl, reqBody)
        .then(async (res) => {
          const data = await res.json();
          console.log("RESPONSE STATUS _", res.status);
          if (res.status === 200) {
            console.log("RESPONSE STATUS IS 200");
            if (data.status.toUpperCase() === "SUCCESS") {
              console.log("DATA STATUS IS SUCCESS");
              const n = data.entries.length;
              const _commitArr = [];
              data.entries.map((item, i) => {
                _commitArr[i] = item;
                _commitArr[i]["commitState"] = true;
              });
              for (let i = n; i < 5; i++) {
                _commitArr.push({ id: i + 1, commitState: false });
              }
              console.log("COMMITED SCORE ARRAY ----- ", _commitArr);
              resolve({ scores: _commitArr, numOfCommits: n });
            } else {
              console.log("DATA STATUS IS FAILURE");
              const modalData = {
                title: "",
                body: "You can only commit 5 scores to the leaderboard!",
                buttons: [
                  {
                    label: "Okay",
                    action: "close",
                    buttonColor: "tabsColor",
                    textColor: "text-white",
                  },
                ],
                handleClick: function (button) {
                  if (button === "close") {
                    handleShowModal(false);
                  }
                },
              };
              handleShowModal(true, modalData);
            }
          } else {
            console.log("Handle commit error 1");
            reject(data);
          }
        })
        .catch((err) => {
          console.log("Handle commit error 2");
          reject(err);
        });
    });
  };
  /** ------- Commit score to leader board hook ends ------- */

  /** ------- Get commited scores for solo games hook starts ------- */
  const getCommitedScoreUrl = config.get("base") + config.get("commitedScore");
  const getCommitedScore = () => {
    console.log("------inside get commited score------>");
    const reqBody = {
      method: "POST",
      cache: "no-cache",
      headers: config.get("headers"),
      body: JSON.stringify({
        requestSource: "WEB",
        uniqueId: uniqueId,
        deviceId: number,
        type: "solo",
      }),
    };
    return new Promise((resolve, reject) => {
      fetch(getCommitedScoreUrl, reqBody)
        .then(async (res) => {
          const data = await res.json();
          let _commitArr = [];
          if (res.status === 200 && data.status.toUpperCase() === "SUCCESS") {
            let n = 0;
            if (data.entries != null) {
              n = data.entries.length;
              data.entries.map((item, i) => {
                _commitArr[i] = item;
                _commitArr[i]["commitState"] = true;
              });
            }

            for (let i = n; i < 5; i++) {
              _commitArr.push({ id: i + 1, commitState: false });
            }
            console.log("COMMITED SCORE ARRAY ----- ", _commitArr);
            resolve(_commitArr);
          } else {
            reject(data);
          }
        })
        .catch((err) => reject(err));
    });
  };
  /** ------- Get commited scores for solo games hook ends ------- */

  /** ------- Reset commited score hook starts ------- */
  const resetScoreUrl = config.get("base") + config.get("resetScore");
  const handleResetScore = () => {
    const reqBody = {
      method: "POST",
      cache: "no-cache",
      headers: config.get("headers"),
      body: JSON.stringify({
        requestSource: "WEB",
        uniqueId: uniqueId,
        deviceId: number,
      }),
    };
    return new Promise((resolve, reject) => {
      fetch(resetScoreUrl, reqBody)
        .then(async (res) => {
          const data = await res.json();
          if (res.status === 200) {
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch((err) => reject(err));
    });
  };
  /** ------- Reset commited score hook ends ------- */

  /** ------- End game hook starts ------- */
  const endGameUrl = config.get("base") + config.get("endGame");
  const scoreReq = (id, score, cat) => {
    const reqBody = {
      method: "POST",
      cache: "no-cache",
      headers: config.get("headers"),
      body: JSON.stringify({
        state: "gameEnd",
        score: score,
        type: cat,
        winner: "",
        uniqueId: uniqueId,
        deviceId: deviceId,
      }),
    };
    return new Promise((resolve, reject) => {
      fetch(endGameUrl, reqBody)
        .then(async (res) => {
          const data = await res.json();
          if (res.status === 200) {
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch((err) => {
          reject(err)
        });
    });
  };
  /** ------- End game hook ends ------- */

  /** ------- Order result hook starts ------- */
  const orderResult = (data, scoreData = {}) => {
    let current;
    if (_.isEmpty(scoreData) === false) {
      current = [...data].map((item) => {
        if (item.userid === scoreData.bparty) {
          item.score = scoreData.score;
        }
        return item;
      });
    }
    current = current
      .sort((a, b) => {
        return b.score - a.score;
      })
      .map((item, i) => {
        item.rank = i + 1;
        item.class = i === 0 ? "bg-theme-green" : "is-theme-violate-light";
        return item;
      });
    return current;
  };
  /** ------- Order result hook starts ------- */

  /** ------- Battle result hook starts ------- */
  const battleResultUrl = config.get("base") + config.get("battleResult");
  const getBattleResult = (id, isEnd) => {
    const reqBody = {
      method: "POST",
      cache: "no-cache",
      headers: config.get("headers"),
      body: JSON.stringify({
        gameId: id,
        requestSource: "WEB",
        battleId: _.has(updateData, "battleId") ? updateData.battleId : "",
        uniqueId: uniqueId,
        deviceId: deviceId,
      }),
    };
    return new Promise((resolve, reject) => {
      console.log(
        " >>> get battle result function called ---- battle id : updateData ",
        updateData
      );
      fetch(battleResultUrl, reqBody)
        .then(async (res) => {
          let data = await res.json();
          const reason = res.reason ? data.reason : "null";
          ReactGA.event({
            category: "game_result",
            action: `battle result request made - mobile - ${tempObj.number},isEnd - ${isEnd}, date-${new Date()}, resStatus - ${data.status}, resReason - ${reason}`,
        });
          
          if (res.status === 200) {
            resolve(data);
          } else {
            reject(data);
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
          ReactGA.event({
            category: "game_result",
            action: `battle result request failed - mobile - ${tempObj.number}, date-${new Date()}, err - ${errObj}`,
          });
          reject(err)
        });
    });
  };
  /** ------- Battle result hook ends ------- */

  return {
    scoreReq,
    getBattleResult,
  };
};

BattleResultHooks.propTypes = {};

export default BattleResultHooks;
