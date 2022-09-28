import React, { useState, useContext } from "react";
import Button from "../commonComponents/Button";
import TournamentInfoGrid from "./TournamentInfoGrid";
import TournamentCardHeader from "./TournamentCardHeader";
import { useLocation, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import queryString from "query-string";
import _ from "lodash";
import { Context } from "../context/Context";
import { reactLocalStorage } from "reactjs-localstorage";
import { TournamentText } from "../Database/Text";

const lang = "en";

function TournamentCard({
  data,
  category,
  showModal,
  setTid,
  tId,
  isRegistered,
  setSpectateURL,
  setEntryFee,
}) {
  const lowBalanceIcon =
    require("../assets/modal-icons/low_wallet_balance_icon.svg").default;
  const history = useHistory();
  let { search } = useLocation();
  const [disable, setDisable] = useState(false);

  const { gId } = queryString.parse(search);
  const { updateGameId, updateTournamentId, walletBalance, handleShowModal } =
    useContext(Context);
  const handleClick = (isRegistered) => {
    if (isRegistered) {
      setSpectateURL();
      history.push(`/viewmore?gId=${gId}&tId=${tId}`);
    } else {
      //TODO : Wallet logic .....
      setDisable(true);
      updateGameId(gId);
      updateTournamentId(tId);
      const tournamentInfo = _.has(data, "info")
        ? data.info.find((item) => item.label === "entryFee")
        : {};
      const price =
        !_.isEmpty(tournamentInfo) && _.has(tournamentInfo, "value")
          ? tournamentInfo.value
          : 0;
      console.log(
        "tournamentInfo",
        price,
        parseInt(walletBalance),
        price - parseInt(walletBalance)
      );
      setEntryFee(price);
      if (price <= parseInt(walletBalance)) {
        setTid(data.tId);
        showModal(true);
      } else {
        const modalData = {
          title: TournamentText.lowBalance[lang],
          body: TournamentText.lowBalanceMSg[lang],
          icon: lowBalanceIcon,
          buttons: [
            {
              label: TournamentText.addMoney[lang],
              action: "addMoney",
              buttonColor: "bg-tabsColor",
              textColor: "text-white",
            },
          ],
          handleClick: function (button) {
            if (button === "addMoney") {
              handleShowModal(false);
              history.push("/addamount");
            }
          },
        };
        handleShowModal(true, modalData);
      }
    }
  };

  return (
    <div className="w-full mb-2 rounded-2xl overflow-hidden bg-tournamentCards">
      <TournamentCardHeader
        category={category}
        data={{
          title: data.title,
          icons: data.icons,
          date: data.date,
          time: data.time,
          filled: data.filled,
          unfilled: data.unfilled,
        }}
      />
      <TournamentInfoGrid data={data.info} />
      {category === "upcoming" ? (
        <>
          <div className="px-4 pb-4 pt-1">
            <Button
              label={
                isRegistered
                  ? TournamentText.joinNow[lang]
                  : TournamentText.register[lang]
              }
              size="medium"
              eventHandler={handleClick}
              textTag="h4"
              styles="font-bold text-white bg-tabsColor"
              action={isRegistered}
              isDisabled = {disable}
            />
          </div>
        </>
      ) : category === "ongoing" ? (
        <div className="flex items-center justify-between px-4 pb-4 pt-1">
          <Button
            label={TournamentText.spectate[lang]}
            size="medium"
            eventHandler={() => {
              window.open(data.spectateURL);
            }}
            textTag="h4"
            styles="bg-tournamentCardsButton text-white font-bold w-1/2 mr-3"
          />
          <Button
            label={
              isRegistered
                ? TournamentText.playNow[lang]
                : TournamentText.notJoined[lang]
            }
            size="medium"
            eventHandler={() => {
              if (isRegistered) {
                history.push(`/viewmore?gId=${gId}&tId=${tId}`);
              }
            }}
            textTag="h4"
            styles="bg-tabsColor text-white font-bold w-1/2 ml-3"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 pb-4 pt-1">
          <Button
            label={TournamentText.viewResult[lang]}
            size="medium"
            eventHandler={() => {
              // updateTournamentTitle(data.title);
              reactLocalStorage.setObject("tournamentResData", data);
              history.push(`/tournamentLeaderBoard?gId=${gId}&tId=${tId}`);
              // history.push("/tournamentLeaderBoard");
            }}
            textTag="h4"
            styles="bg-tournamentCardsButton text-white font-bold w-1/2 mr-3"
          />
          <Button
            label={TournamentText.notJoined[lang]}
            size="medium"
            eventHandler={() => {}}
            textTag="h4"
            styles="bg-tabsColor text-white font-bold w-1/2 ml-3"
          />
        </div>
      )}
    </div>
  );
}

TournamentCard.propTypes = {
  data: PropTypes.object,
  category: PropTypes.string,
  showModal: PropTypes.func,
  tId: PropTypes.string,
  setTid: PropTypes.func,
  isRegistered: PropTypes.string,
  setSpectateURL: PropTypes.func,
  setEntryFee: PropTypes.func,
};

export default TournamentCard;
