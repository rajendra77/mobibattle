
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import Image from '../commonComponents/Image';
import Loader from '../commonComponents/Loader';
import Text from '../commonComponents/Text';
import TournamentHomeCard from '../commonComponents/TournamentHomeCard';
import { Context } from '../context/Context';
import { tournamentText } from '../Database/Text';
import useTournament from '../network/useTournament';
import ApiNotFound from './ApiNotFound';
import {SendGuiDataEvents} from '../commonScript';
import { reactLocalStorage } from "reactjs-localstorage";


const TournamentAll = () => {
    const history = useHistory();
    const {getLanguage} = useContext(Context);
    const { getTournamentSummary } = useTournament();
    const [tournamentData, setTournamentData] = useState([])
    const [loader, showLoader] = useState(true);  
    const [apiFailed, setApiFailed] = useState(false);
    const [lang, setLang] = useState('')


    const back_icon = require("../assets/svg-icons/back_arrow_white.svg").default;
    const curveLine = require("../assets/tImages/curve_line.svg").default;

    useEffect(() => {
        window.scrollTo(0, 0);
        const lang = getLanguage();
        setLang(lang)
        getTournamentSummary()
            .then((res) => {
                showLoader(false);
                setTournamentData(res.tournamentSummaryClassResponse);
            })
            .catch((err) => {
                showLoader(false);
                setApiFailed(true);
                console.log(">>>>> err >>>>>", err);
            });
            let guiDataEvent = {}
            guiDataEvent['page'] = 'viewall_tour';
            guiDataEvent['event'] = 'open';
            SendGuiDataEvents(guiDataEvent);
    }, []);

    if (apiFailed) {
        return <ApiNotFound />;
    }

    return (
        <div className="flex flex-col bg-primary mt-28">
             {loader && <Loader />}
            <div className="w-full max-w-500px bg-tHeader flex flex-col fixed top-0 z-50 pt-8">
                <div className="flex items-center px-2 pb-4">
                    <Image url={back_icon} styles="h-7 w-7" handleClick={() => history.goBack()} />
                    <Text
                        tag={"h4"}
                        scale={true}
                        text={tournamentText.battleArena[lang]}
                        styles="text-white font-bold float-right pl-2 tracking-wider"
                    />
                </div>
                <Image url={curveLine} styles="w-full" />
            </div>
            <div className="px-1">
                {tournamentData.map((item, index) =>
                    <TournamentHomeCard
                        image={item.backgroundImage}
                        noOfDaysShown={item.noOfDaysShown}
                        won={item.totalCoinsWon}
                        tournamentSummaryId={item.id}
                        tournamentName={item.name}
                        upcomingMatches={item.upcomingTournaments}
                        totolMatchesPlayed={item.totalTournamentPlayed}
                        // background={index % 2 === 0 ? "bg-gradient-to-b from-tRed to-tRedDark" : "bg-gradient-to-b from-tLightBlue to-tDarkBlue"}
                        background="bg-primary"
                        key={index}
                        text = {tournamentText}
                        lang={lang}
                    />
                )}
            </div>
        </div>
    );
};


export default TournamentAll;
