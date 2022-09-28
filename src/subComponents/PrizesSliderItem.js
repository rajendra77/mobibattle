import React from "react";
import PropTypes from "prop-types";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";
import Button from "../commonComponents/Button";
import { useHistory } from "react-router-dom";
import { Base64 } from "js-base64";


function PrizesSliderItem(props) {
  let {
    data,
    handleClick,
    activeCategory,
    setActiveCategory,
    subscribed,
    text,
    lang,
    balance,
    disabled
  } = props;
  const history = useHistory();
  const battle_icon =
    require("../assets/svg-icons/battle_card_icon.svg").default;
  const free_icon = require("../assets/svg-icons/free_battle.svg").default;
  const lock_icon =
    require("../assets/svg-icons/premium_card_lock.svg").default;
  const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  const lockIcon =
    require("../assets/mtncongo/play_with_coins_lock_icon.png").default;
  let subStatus = subscribed;
  // data =data.concat(data)

  return (
    <>
      {data && (
        <div
          id="card"
          className={`h-50v rounded-2xl m-2 p-2 flex flex-col justify-between items-center bg-paid-card`}
        >
          <div className="flex justify-center items-center relative w-full">
            <div className="flex">
              <Image
                url={battle_icon}
                styles={"mx-1 h-6"}
                objectContain={true}
                objectCover={false}
              />

              <Text
                tag="h4"
                scale={true}
                text={text.momoCard.title[lang]}
                fontweight="bold"
                alignment="center"
                textColor="text-white"
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            {activeCategory === 0 ? (
              <div>
                <Image
                  url={free_icon}
                  styles={
                    "h-36 w-36 xs:h-32 xs:w-32 1xs:h-28 1xs:w-28 2xs:h-24 2xs:w-24 3xs:h-20 3xs:w-20  bg-black-10 rounded-full border-lightPurple "
                  }
                />
              </div>
            ) : (
              <div
                className={`h-36 w-36 xs:h-32 xs:w-32 1xs:h-28 1xs:w-28 2xs:h-24 2xs:w-24 3xs:h-20 3xs:w-20  p-2 border-2 bg-black-50 border-blueAnchor
                 rounded-full flex flex-col items-center justify-center`}
              >
                {subscribed ? (
                  <>
                    <Text
                      tag="h5"
                      text={text.momoCard.win[lang]}
                      textColor="text-white"
                      styles="text-center"
                    />
                    <div className="flex items-center justify-center">
                      <Image
                        url={coinIcon}
                        styles="w-8 h-8  mr-1"
                      />
                      <Text
                        tag="label"
                        text={2 * data[activeCategory].price}
                        textColor="text-white"
                        fontweight="bold"
                        styles="text-3xl 1xs:text-2xl 2xs:text-1xl "
                      />
                    </div>
                  </>
                ) : (
                  <div
                    className={
                      "h-20 w-16 xs:h-16 xs:w-12 1xs:h-16 1xs:w-12 2xs:h-10 2xs:w-10 3xs:h-12 3xs:w-8 3xs:mb-4 mb-6"
                    }
                  >
                    <Image
                      url={lock_icon}
                      handleClick={() => {
                        history.push(`/subscription?subType=${Base64.encode("combo")}`);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-full text-center">
            <div className="flex overflow-x-auto no-scrollbar space-x-8 space-y-4 w-full 2xs:pb-2 pb-4">
              {/* <div className="flex justify-evenly 2xs:pb-2 pb-4"> */}
              {data.map(
                (item, i) =>
                  // item && i!==4 &&
                  item &&
                  item.planType !== "LEADERBOARD" && (
                    <div
                      key={i}
                      // style={{ borderRadius: '33px'}}
                      onClick={() => {
                        if (item.planType !== "FREE" && !subStatus) {
                          if (balance > 0) {
                            history.push(`/subscription`);
                          } else {
                            history.push(`/subscription?subType=${Base64.encode("combo")}`);
                          }
                        } else {
                          setActiveCategory(i);
                        }
                      }}
                      className={`flex-shrink-0 rounded-full h-16 w-20 2xs:h-12 2xs:w-16  border-2 ${
                        // className={`rounded-full h-16 w-16 2xs:h-12 2xs:w-12  border-2 ${
                        activeCategory === i
                          ? "bg-gradient-to-t from-dullPurple to-shinyPurple  border-orange"
                          : "bg-black-30 border-lightPurple"
                      }  flex flex-col items-center justify-center relative mt-4`}
                    >
                      {item.planType !== "FREE" && !subStatus && (
                        <Image
                          key={i}
                          url={lockIcon}
                          styles="absolute bottom-11"
                          handleClick={() => {
                            // history.push("/subscription?subType=combo");
                            if (balance > 0) {
                              console.log("subscription::");
                              history.push(`/subscription`);
                            } else {
                              console.log("subscription?subType=combo::");
                              history.push(`/subscription?subType=${Base64.encode("combo")}`);
                            }
                          }}
                        />
                      )}

                      <div className="flex items-center justify-center">
                        {item.planType !== "FREE" && (
                          <Image url={coinIcon} styles="h-5 w-5 mr-1" />
                        )}
                        <Text
                          tag={item.planType === "FREE" ? "h6" : "h3"}
                          text={
                            item.planType === "FREE"
                              ? text.momoCard.freePlay[lang]
                              : item.price
                          }
                          textColor={
                            activeCategory === i
                              ? "text-white"
                              : "text-lightPurple"
                          }
                          fontweight={activeCategory === i ? "bold" : ""}
                        />
                      </div>
                    </div>
                  )
              )}
            </div>

            <Button
              label={
                data[activeCategory].price === 0 ? (
                  <div className="text-white 3xs:text-xs 2xs:text-sm 1xs:text-base xs:text-lg sm:text-xl">
                    {text.momoCard.playForFree[lang]}
                  </div>
                ) : (
                  <div className="flex items-center justify center">
                    <Text
                      tag="h5"
                      text={text.momoCard.playFor[lang]}
                      textColor="text-white"
                      fontweight="normal"
                    />
                    <Image url={coinIcon} styles="w-4 h-4 mx-1" />
                    <Text
                      tag="h5"
                      text={data[activeCategory].price}
                      textColor="text-white"
                      fontweight="normal"
                    />
                  </div>
                )
              }
              // isDisabled={data[activeCategory].price !== 0 && !subStatus}
              shape={"pill"}
              styles={
                data[activeCategory].price === 0
                  ? "py-3 text-white bg-button-green"
                  : !subStatus
                  ? "py-3 text-white bg-button-gray"
                  : "py-3 text-white bg-button-green"
              }
              textStyles={"font-bold ml-2 2xs:ml-1"}
              iconStyle="2xs:h-3 2xs:w-4 h-4 w-6"
              isDisabled={disabled}
              eventHandler={() => {
                console.log(
                  "-----planType----->",
                  data[activeCategory].planType
                );
                handleClick({
                  planType: data[activeCategory].planType,
                  pack: data[activeCategory],
                });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

PrizesSliderItem.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleClick: PropTypes.func,
  activeCategory: PropTypes.number,
  setActiveCategory: PropTypes.func,
  subscribed: PropTypes.bool,
  text: PropTypes.object,
  lang: PropTypes.string,
};

export default PrizesSliderItem;
