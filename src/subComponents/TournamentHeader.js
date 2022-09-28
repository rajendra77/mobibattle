
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Image from '../commonComponents/Image';
import Text from '../commonComponents/Text';
import {reactLocalStorage} from 'reactjs-localstorage';
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import ReactGA from "react-ga";
import { Base64 } from "js-base64";

const TournamentHeader = ({userGameId, text, lang}) => {
    const [tournamentName, setTournamentName] = useState('');
    const [tournamentSummaryId, setTournamentSummaryId] = useState('');
    const history = useHistory();
    const back_icon = require("../assets/svg-icons/back_arrow_white.svg").default;
    const past_icon = require("../assets/tImages/past_tournaments_icon.svg").default;
    const edit_icon = require("../assets/tImages/pubg_username_edit_icon.svg").default;
    const rules_icon = require("../assets/svg-icons/rules_button.svg").default;
    const curveLine = require("../assets/tImages/curve_line.svg").default;
    const tempObj = reactLocalStorage.getObject("tempObj");
    const userName = reactLocalStorage.getObject("userProfile").name;
    const guest = (userName === "Guest") ? 1 : 0

    useEffect(() => {
        setTournamentName(reactLocalStorage.get("tournamentName"));
        setTournamentSummaryId(reactLocalStorage.get("tournamentSummaryId"));
    }, [])
    
    return (
        <div className=" w-full max-w-500px bg-tHeader flex flex-col pt-4">
            <div className="flex justify-between items-center">


                <div className="px-2" onClick={() => {
                    ReactGA.event({
                    category: "header_p",
                    action: `back button clicked from tournament page and user redirected to homepage - code - ${tempObj.code}, mobile - ${
                        tempObj.number
                    }, date - ${new Date()}`,
                    });
                    history.goBack()
                    }}>
                        
                    <img src={back_icon} alt="backIcon"></img>
                </div>
                <div className="flex justify-center items-center pl-8">
                    <div className="flex flex-col justify-center items-center">
                        <Text
                            tag={"h5"}
                            scale={true}
                            text={`${tournamentName} ${text.username[lang]}`}
                            styles="text-white float-right pr-2"
                        />
                        <Text
                            tag={"h5"}
                            scale={true}
                            text={(!userGameId || userGameId==="null")  ? text.addUsername[lang] : Base64.decode(userGameId)}
                            styles="text-orange float-right pr-2"
                        />
                    </div>

                    <div className="px-2" >
                        <Image url={edit_icon} handleClick = {()=>{
                            logEvent(
                            {
                                screen: screen.tournamentList_p,
                                event: events.editUserNameClick
                            }, 
                            {
                            title: "Edit UserName Button Clicked",
                            date: new Date(),
                            code: tempObj.code,
                            mobile: tempObj.number,
                            others: {
                                tournamentName: tournamentName,
                                tournamentId: tournamentSummaryId
                            }
                            });
                            if (guest === 0) {
                                history.push('/tournamentUserName')
                            }else {
                                history.push(`/subscription?subType=${Base64.encode("combo")}`)
                            }
                            
                        }}/>
                    </div>
                </div>
                <div className="px-2" >
                    <Image
                        url={rules_icon}
                        handleClick = {()=>{
                            logEvent(
                            {
                                screen: screen.tournamentList_p,
                                event: events.tournamentRulesClick
                            }, 
                            {
                            title: "Match Rules Button Clicked",
                            date: new Date(),
                            code: tempObj.code,
                            mobile: tempObj.number,
                            others: {
                                tournamentName: tournamentName,
                                tournamentId: tournamentSummaryId
                            }
                            });
                            history.push('/tournamentRules')
                        }}
                        styles={"h-10 w-10 "}
                    />
                </div>
            </div>
            <div className="">
                <Image url={curveLine} styles="w-full" />
            </div>
            <div className="flex justify-between bg-primary pl-3" >
                <div className="flex flex-col" >
                    <Text
                        tag={"h5"}
                        scale={true}
                        text={`${text.battleArena[lang]}`}
                        styles="text-white float-right pr-2 font-medium tracking-wider"
                    />
                    <Text
                        tag={"div"}
                        scale={true}
                        text={text.roomClosesMsg[lang]}
                        styles="text-tLightViolet float-right font-medium pr-2 text-xs"
                    />
                </div>
                <div className="flex justify-between items-center" onClick={()=> {
                    if (guest === 0) {
                    logEvent(
                            {
                                screen: screen.tournamentList_p,
                                event: events.pastTournamentClick
                            }, 
                            {
                            title: "Past Tournament Button Clicked",
                            date: new Date(),
                            code: tempObj.code,
                            mobile: tempObj.number,
                            others: {
                                tournamentName: tournamentName,
                                tournamentId: tournamentSummaryId
                            }
                            });
                    history.push('/tournamentHistory');
                    }else {
                        history.push('/subscription');
                    }
                    }}>
                    <Image url={past_icon}  styles={"h-7 w-9 2xs:w-9 1xs:w-8 2xs:h-6 1xs:h-6 mr-1"} />
                    <div className="">
                        <Text
                        tag={"lable"}
                        scale={true}
                        text={text.pastMatches[lang]}
                        fontweight="bold"
                        styles="text-white float-right pr-2 text-xs tracking-wider"
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TournamentHeader



