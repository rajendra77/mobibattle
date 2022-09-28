import { React, useState, useEffect, useContext } from "react";
import Image from "../commonComponents/Image";
import Tab from "../subComponents/Tab";
import PropTypes from "prop-types";
import { Context } from "../context/Context";
import {tournamentText as text} from '../Database/Text'
import {SendGuiDataEvents} from '../commonScript';
import { reactLocalStorage } from "reactjs-localstorage";


const TournamentRules = () => {
  const [lang, setLang] = useState("en");
  const { getLanguage } = useContext(Context);
  const [activeTab, setActiveTab] = useState("rules");

  useEffect(()=>{
    //send gui events
    let guiDataEvent = {}
    guiDataEvent['page'] = 'tournament_rules';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
    setLang(getLanguage())
  },[])

  const tabs = [
    { id: 1, label: "rules", title: {en: "Rules", fr : "Des règles", mg : "Дүрэм" } },
    { id: 2, label: "howToPlay", title: {en: "How to Play", fr : "Comment jouer",mg : "Хэрхэн тоглох бэ"} },
  ];
  const rules = [
    {
      text: text.rules.text1[lang],
    },
    {
      text: text.rules.text2[lang],
    },
    {
      text: text.rules.text3[lang],
    },
    {    text: text.rules.text4[lang], },
    {    text: text.rules.text5[lang], },
    {    text: text.rules.text6[lang],},
    {   text: text.rules.text7[lang],},
    {    text: text.rules.text8[lang], },
    {
      text: text.rules.text9[lang],
    },
    {
      text: text.rules.text10[lang],
    },
    {
      text: text.rules.text11[lang],
    },
  ];

  const howToPlay = [
    {
      text: text.howToPlay.text1[lang],
      image: require("../assets/tImages/StartButton.png").default,
    },
    {
      text: text.howToPlay.text2[lang],
      image: require("../assets/tImages/RoomClick.png").default,
    },
    {
      text: text.howToPlay.text3[lang],
      image: "",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  function RenderSwitch(param) {
    return param === "howToPlay" ? (
      <Component data={howToPlay} />
    ) : (
      <Component data={rules} />
    );
  }

  function changeTab(tab) {
    setActiveTab(tab);
  }

  return (
    <div className="mt-16">
      <Tab
        data={tabs}
        activeTab={activeTab}
        setHeaderTitle={"tttt"}
        changeTab={changeTab}
        lang={lang}
      />
      <div className="flex flex-wrap justify-around p-2">
        {RenderSwitch(activeTab)}
      </div>
    </div>
  );
};

const Component = ({ data }) => {
  return (
    <div className="px-2">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex text-white p-2 my-2 bg-walletCardPurple rounded-lg w-full">
            <div className="bg-tViolet font-bold min-w-8 rounded-lg py-2 px-3">
              {i + 1}.
            </div>
            <div className="p-2 flex items-center">{item.text}</div>
          </div>
          {item.image && <Image url={item.image} />}
        </div>
      ))}
    </div>
  );
};

Component.propTypes = {
  data: PropTypes.object,
};

export default TournamentRules;
