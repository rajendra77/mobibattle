import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Button from "../commonComponents/Button";
import Input from "../commonComponents/Input";
import Text from "../commonComponents/Text";
import { Context } from "../context/Context";
import useProceedToPay from "../network/useProceedToPay";
import { RegisterSquadText } from "../Database/Text";

function RegisterModal({ handleSubmit, playersData, tid, entryFee }) {
  const { showRegisterModal, handleRegisterModal, getLanguage } =
    useContext(Context);
  // handleRegisterModal(showModal);
  const { blockBalance } = useProceedToPay();
  const [players, setPlayers] = useState([]);
  const [inputFocus, setInputFocus] = useState(false);
  const [lang, setLang] = useState("");

  useEffect(() => {
    setLang(getLanguage());
    playersData = playersData.map((item) => {
      item["value"] = "";
      return item;
    });
    setPlayers(playersData);
    return () => {
      document.body.style.overflow = null;
    };
  }, [playersData]);

  function handleInputChange(e) {
    if (e.target.value === " ") {
      return;
    }
    const { name, value } = e.target;
    setPlayers((prev) => {
      const playerList = prev.map((player) => {
        if (player.name == name) {
          player.value = value;
        }
        return player;
      });
      return playerList;
      // ...players,
      // [name]: value,
    });
  }

  // function handleFormSubmit() {
  //   handleRegisterModal(false);
  //   handleSubmit(players);
  // }

  const handleFormSubmit = () => {
    handleRegisterModal(false);
    console.log("HANDLE SUBMIT ::: ", players);
    blockBalance(tid, entryFee)
      .then(() => {
        // setTid(data.tId);
        handleSubmit(players);
        // showModal(true);
      })
      .catch((err) => {
        console.log("----err---->", err);
      });
  };

  return (
    <>
      {showRegisterModal ? (
        <>
          <div
            className={`max-w-500px m-auto justify-center items-center fixed bottom-0 z-50 outline-none focus:outline-none`}
          >
            <div className="relative">
              {/*content*/}
              <div className="rounded-t-3xl shadow-lg relative pt-6 flex flex-col w-full bg-primary outline-none focus:outline-none">
                {/*body*/}
                <form
                  // onSubmit={() => handleFormSubmit()}
                  className={
                    inputFocus &&
                    "h-60v xs:h-60v 1xs:h-50v 2xs:h-60v 3xs:h-60v overflow-auto bg-primary"
                  }
                >
                  <div className="pl-3 pr-3 flex-auto text-center">
                    <div className="w-12 border-b-2 border-t-2 rounded-full border-white border-opacity-50 m-auto"></div>

                    <div
                      className="flex justify-center items-center absolute top-0 right-1 h-8 w-8 text-2xl text-white font-bold leading-6 z-10 text-center cursor-pointer"
                      onClick={() => {
                        document.body.style.overflow = null;
                        handleRegisterModal(false);
                      }}
                    >
                      &times;
                    </div>

                    <br />
                    <Text
                      tag="h2"
                      scale={true}
                      styles=""
                      text={RegisterSquadText.register[lang]}
                      fontweight="bold"
                      textColor={"text-white"}
                    />
                    <br />

                    {players.map((item, index) => {
                      return (
                        <div className="2xs:py-1 py-2" key={item.id}>
                          <div className=" py-1 rounded-2xl">
                            <Input
                              styles="px-4 2xs:py-2 py-3 w-full rounded-lg bg-tournamentCards text-white border border-lightPurple placeholder-lightPurple outline-none"
                              type="text"
                              name={item.name}
                              value={item.value}
                              placeholderText={item.placeholder}
                              eventHandler={handleInputChange}
                              required={index === 0 ? true : false}
                              onFocus={() => setInputFocus(true)}
                              onFocusOut={() => setInputFocus(false)}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <Text
                      tag="h6"
                      scale={true}
                      styles="text-left my-2"
                      text={RegisterSquadText.note[lang]}
                      textColor={"text-white text-opacity-60"}
                    />
                  </div>
                  <div className="flex items-center justify-evenly pt-3 px-4 pb-6 rounded-b">
                    <Button
                      textTag="h4"
                      label={"Cancel"}
                      eventHandler={() => {
                        document.body.style.overflow = null;
                        handleRegisterModal(false);
                      }}
                      styles={
                        "mx-2 font-bold bg-tournamentCardsButton text-white"
                      }
                      size={"medium"}
                    />
                    <Button
                      textTag="h4"
                      type="submit"
                      label={"Next"}
                      styles={"mx-2 font-bold bg-register-purple text-white"}
                      size={"medium"}
                      eventHandler={() => handleFormSubmit()}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

RegisterModal.propTypes = {
  handleSubmit: PropTypes.func,
  playersData: PropTypes.array,
  tid: PropTypes.string,
  entryFee: PropTypes.number,
};

export default RegisterModal;
