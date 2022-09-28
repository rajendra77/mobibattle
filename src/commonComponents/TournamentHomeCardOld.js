import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import Image from "../commonComponents/Image";
// import Text from "../commonComponents/Text";
import calculateTimeLeft from "../myhooks/CountdownTimer";
import { reactLocalStorage } from "reactjs-localstorage";
import "./GameCard.scss";
import moment from "moment";
import ReactGA from "react-ga";

function TournamentHomeCard({ data, text, lang }) {
  const history = useHistory();
  const tempObj = reactLocalStorage.getObject("tempObj");
  // const coin_icon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
  return (
    <div
      className="relative mb-4"
      onClick={() => {
        // console.log(data.gameId);
        // if (data.gameId === "freefire") {
        //   location.assign("https://mobibattle-v2-0.vercel.app/free-fire");
        // }
        // else {
        //   location.assign("https://mobibattle-v2-0.vercel.app/pubg-mobile");
        // }
        

        ReactGA.event({
            category: "home_p",
            action: `Trending Card Clicked - mobile - ${tempObj.number}, gameId - ${data.gameId}, gameName - ${data.name}, date - ${new Date()}`,
          });
        history.push(`/tournaments?gId=${data.gameId}`);
      }}
    >
      <div className="w-full absolute bottom-48 right-0 text-xs z-10 flex justify-center">

        
        <img src={data.img["360x480"]} className="absolute"/>
      </div>
      <TournamentStats data={data} text={text} lang={lang} />
      {data && (
        <Image
          styles={"rounded-2xl squareImage aspect-w-1 aspect-h-1"}
          url={data["x256x256"]}
        />
        
        
        
      )}
      {/* <div className="w-full z-10 absolute bottom-6 left-6 rounded-b-2xl">
        <div className="flex w-full items-center">
          <Image url={coin_icon} styles={"w-6 h-6 rounded-full"} />
          <div className="pl-2 flex items-center">
            <Text
              tag="h4"
              scale={true}
              text={"500,000"}
              fontweight="bold"
              textColor={"white"}
              styles="mr-2"
            />
            <Text
              tag="p"
              scale={true}
              text={text.won[lang]}
              fontweight="bold"
              textColor={"white"}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Text
            tag="h4"
            scale={true}
            text={data.name}
            fontweight="bold"
            alignment="left"
            textColor="white"
          />
        </div>
      </div> */}
    </div>
  );
}

TournamentHomeCard.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    x256x256: PropTypes.string,
    gameId: PropTypes.string,
    gameName: PropTypes.string
  }),
  text: PropTypes.object,
  lang: PropTypes.string,
};

export default TournamentHomeCard;

const TournamentStats = ({ data, text, lang }) => {
  const slot_icon = require("../assets/svg-icons/slots_left_icon.svg").default;
  const prize_icon = require("../assets/svg-icons/entry_fees_icon.svg").default;
  const entry_icon =
    require("../assets/svg-icons/prize_money_icon.svg").default;
  const time = reactLocalStorage.getObject("countDown");
  const countDownDate = moment(time);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(countDownDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(countDownDate));
    }, 1000);
    // Clear timeout if the component is unmounted

    return () => clearTimeout(timer);
  });

  return (
    <div className="bg-tournamentCardFooter bg-opacity-60 w-full text-white p-2 rounded-b-2xl absolute bottom-0 right-0 text-xs z-10 flex justify-between">
      <div clas="w-1/2">
        <div className="font-bold text-base 1xs:text-base 2xs:text-sm 3xs:text-xs mb-1">
          {text.nextMatch[lang]} :
        </div>
        <div className="flex justify-around items-start font-bold text-xl">
          <div>
            <div className="flex justify-start items-center">
              <TimerBox value={Math.round(timeLeft.hours / 10)} />
              <TimerBox value={Math.round(timeLeft.hours % 10)} />
            </div>
            <div className="text-xs 2xs:text-2xs 3xs:text-2xs leading-none ml-0.5 text-white">
              {text.hours[lang]}
            </div>
          </div>
          <div className="pl-1 pr-2 mt-1">:</div>
          <div>
            <div className="flex justify-around">
              <TimerBox value={Math.round(timeLeft.minutes / 10)} />
              <TimerBox value={Math.round(timeLeft.minutes % 10)} />
            </div>
            <div className="text-xs 2xs:text-2xs 3xs:text-2xs leading-none ml-0.5 text-white">
              {text.minutes[lang]}
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm pl-2">
        <Stats
          icon={slot_icon}
          label={data.slotsLeft}
          value={text.slotsLeft[lang]}
        />
        <Stats
          icon={prize_icon}
          label={`${data.currency}${data.entryFees}`}
          value={text.entryFees[lang]}
        />
        <Stats
          icon={entry_icon}
          label={`${data.currency}${data.prizeMoney}`}
          value={text.prizeMoney[lang]}
        />
      </div>
    </div>
  );
};

const Stats = ({ icon, label, value }) => {
  return (
    <div className="flex w-full justify-start items-center my-1">
      <Image
        url={icon}
        styles={"w-6 2xs:w-4 3xs:w-4 h-6 2xs:h-4 3xs:h-4 mr-2"}
      />
      <div className="text-base 1xs:text-sm 2xs:text-xs 3xs:text-2xs">
        {label} : {value}
      </div>
    </div>
  );
};

const TimerBox = ({ value }) => {
  return (
    <div className="bg-black-50 px-2 m-1 ml-0 w-8 2xs:w-7 3xs:w-6 h-8 2xs:h-7 3xs:h-6 flex justify-center items-center border border-white text-base 2xs:text-sm 3xs:text-xs">
      {value}
    </div>
  );
};

TournamentStats.propTypes = {
  data: PropTypes.shape({
    slotsLeft: PropTypes.number,
    currency: PropTypes.string,
    entryFees: PropTypes.any,
    prizeMoney: PropTypes.any,
  }),
  text: PropTypes.object,
  lang: PropTypes.string,
};

Stats.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
};

TimerBox.propTypes = {
  value: PropTypes.number,
};
