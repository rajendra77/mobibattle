
import React, { useContext, useEffect, useState } from 'react';
import Button from './Button';
import Image from './Image';
import Text from './Text';
import { logEvent } from '../Analytics/AnalyticsEvent';
import { screen, events } from '../Analytics/EventName';
import { reactLocalStorage } from "reactjs-localstorage";
import {tournamentText as text} from '../Database/Text'
import { Context } from '../context/Context';
import { useHistory } from "react-router-dom";


const TournamentCard = ({
    id,
    image,
    time,
    displayStatus,
    tournamentStatus,
    joininginfoMessage,
    players,
    capacity,
    map,
    teamType,
    prizeMoney,
    entryFees,
    backgroundColor,
    weeklyTournament,
    type,
    cashWon,
    rank,
    totalWinners,
    date,
    kill,
    children,
    showResult,
    roomId,
    password,
    handleCopyText,
    handleShowPrizeModal,
    handleJoinTournament,
    tournamentId,
    activeResult,
    statusBtnColor,
    disableJoinBtn,
    setDisableJoinBtn

}) => {

    const {getLanguage } = useContext(Context);
    const [lang, setLang] = useState('');
    const history = useHistory();
    const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;
    const copyIcon = require("../assets/tImages/room_id_password_copy_icon.svg").default;
    const tempObj = reactLocalStorage.getObject("tempObj");
    const userName = reactLocalStorage.getObject("userProfile").name;
    const guest = (userName === "Guest") ? 1 : 0

    useEffect(() => {
        setLang(getLanguage());
    }, []);
    

    const showTournamnetDetails = () => {
        return (
            <div className={`flex justify-between flex-wrap w-full py-1 px-1 ${displayStatus === "RESULT" && 'pt-6'}`}>
                <Text
                    tag={"lable"}
                    scale={true}
                    text={type === 'current' ? `${text.players[lang]} : ${players}/${capacity}` : `${text.cashWon[lang]} : ${cashWon}`}
                    styles={`${weeklyTournament ? "text-black" : "text-white"} text-xs 1xs:text-xxs 2xs:text-xxs font-medium `}

                />
                <Text
                    tag={"lable"}
                    scale={true}
                    textTransform="uppercase"
                    text={type === 'current' ? `${map!=='' ? `${map}-` : ""} ${teamType}` : `${text.fees[lang]} : ${entryFees}`}
                    styles={`${weeklyTournament ? "text-black" : "text-white"} text-xs 1xs:text-xxs 2xs:text-xxs font-medium `}

                />
            </div>
        )
    }

    const showTournamnetDetails1 = () => {
        return (
            <div className="flex justify-between flex-wrap w-full ">
                <div className="text-left p-1">
                    <Text
                        tag={"lable"}
                        scale={true}
                        text={type === 'current' ? text.prizeMoney[lang] : text.prizeMoney[lang]}
                        textTransform="uppercase"
                        styles={`${weeklyTournament ? "text-black" : "text-white"} font-bold text-xs `}
                    />
                    <div className="flex justify-start items-center">
                        <Image url={coinIcon} styles="h-5 w-5 mr-1" />
                        <Text
                            tag={"h5"}
                            scale={true}
                            text={prizeMoney}
                            styles={`${weeklyTournament ? "text-black" : "text-white"} font-black`}
                        />
                    </div>
                </div>

                <div className="text-right p-1">
                    <Text
                        tag={"lable"}
                        scale={true}
                        text={type === 'current' ? text.entryFees[lang]: text.totalWinners[lang]}
                        alignment="right"
                        textTransform="uppercase"
                        styles={`${weeklyTournament ? "text-black" : "text-white"} font-bold text-xs`}
                    />
                    <div className="flex justify-center items-center">
                        {type === 'current' && <Image url={coinIcon} styles="h-5 w-5 mr-1" />}
                        <Text
                            tag={"h5"}
                            scale={true}
                            text={type === 'current' ? entryFees : totalWinners}
                            alignment="right"
                            styles={`${weeklyTournament ? "text-black" : "text-white"} font-black`}
                        />
                    </div>
                </div>
            </div>
        )
    }



    const showTournamnetDetails2 = () => {
        return (
            <div className="flex justify-between flex-wrap py-2 pr-1">
                <div className="text-center">
                    {type === 'current' ? <div onClick={() => {
                        const display = weeklyTournament ? "PRIZE POOL" : "PRIZE LIST";
                        logEvent(
                        {
                            screen: screen.tournamentList_p,
                            event: events.tournamentCardPrizeBtnClick
                        }, 
                        {
                            title: `${display} Button Clicked`,
                            date: new Date(),
                            code: tempObj.code,
                            mobile: tempObj.number,
                            others: {
                            tournamentId: tournamentId,
                        }
                      });
                         handleShowPrizeModal(weeklyTournament, tournamentId, capacity, players, prizeMoney)
                        
                        }} className={"w-24"}>
                         <Button
                                    type="submit"
                                    size="small"
                                    textTag ="h6"
                                    label={`${weeklyTournament ? text.prizePool[lang] :text.prizeList[lang]}`}
                                    styles={` uppercase text-white rounded-full py-2 2xs:py-1.5 px-1 bg-black ${weeklyTournament ? "" : "bg-opacity-50 border-2 border-white"}`}
                                />
                        {/* <Text
                            tag="lable"
                            text={`${weeklyTournament ? text.prizePool[lang] :text.prizeList[lang]}`}
                            textTransform="uppercase"
                            styles="text-white text-sm"
                        /> */}
                    </div> :
                        <div className="flex flex-col justify-center items-start text-sm">
                            <Text
                                tag={"h6"}
                                scale={true}
                                text={time}
                                fontweight="bold"
                                styles="text-white float-right pr-2"
                            />
                            <Text
                                tag={"lable"}
                                scale={true}
                                text={date}
                                styles="text-white text-opacity-80 float-right pr-2 text-xs font-bold"
                            />
                        </div>
                    }
                </div>
                {displayStatus === "RESULT" && activeResult == id ?
                    <div className="flex flex-col justify-center items-end">
                        <Text
                            tag={"lable"}
                            scale={true}
                            text={map}
                            fontweight="bold"
                            textTransform="uppercase"
                            styles="text-white text-sm"
                        />
                        <Text
                            tag={"lable"}
                            scale={true}
                            text={teamType}
                            fontweight="bold"
                            textTransform="uppercase"
                            styles="text-white text-sm"
                        />
                    </div> : 
                     displayStatus!=='' &&  <div className="text-center">
                        <div className="w-24"  disabled={disableJoinBtn}  onClick={() => {
                            logEvent(
                                {
                                    screen: screen.tournamentList_p,
                                    event: events[displayStatus]
                                }, 
                                {
                                    title: `${displayStatus} Button Clicked`,
                                    date: new Date(),
                                    code: tempObj.code,
                                    mobile: tempObj.number,
                                    others: {
                                        tournamentId: tournamentId
                                    }
                                });
                            
                            if (displayStatus === "RESULT" && guest === 0) {
                                showResult(id,totalWinners, tournamentStatus)
                            } else if (displayStatus === "JOIN" && guest === 0) {
                                setDisableJoinBtn(true)
                                handleJoinTournament(tournamentId, entryFees)
                            }else if(guest === 1){
                                history.push(`/subscription`)
                            }
                            
                        }}>
    
                                <Button
                                    type="submit"
                                    size="medium"
                                    label={text.displayTxt[displayStatus.toLowerCase()][lang]}
                                    styles={`font-extrabold text-white rounded-full py-2 px-6 2xs:px-3 1xs:px-4 ${statusBtnColor}`}
                                />
                        </div>
                    </div>}
            </div>
        )
    }
    return (
        <div className={`px-3 ${weeklyTournament ? "pl-2" : "pl-8 1xs:pl-7 2xs:pl-7 "} py-1`} key={id}>
            <div className={`  w-full ${backgroundColor} rounded-xl pt-1 text-right`}>
                <div className="flex flex-col relative">
                    {weeklyTournament && <div className="flex justify-between">
                        <Text
                            tag={"lable"}
                            scale={true}
                            text={text.weeklyTournament[lang]}
                            fontweight="bold"
                            styles="text-white bg-red-600 text-left text-sm m-2 p-1 rounded"
                        />
                        <Text
                            tag={"h5"}
                            scale={true}
                            text={time}
                            fontweight="bold"
                            styles="text-black float-right pr-2"
                        />
                    </div>}

                    <div className={"flex"}>
                        <div className="w-1/3">
                            {displayStatus === "RESULT" && <Text
                                tag={"h6"}
                                scale={true}
                                text={  (kill===-1 && rank ===-1 ) ? text.notPlayed[lang] : 
                                     kill===-1 ? `${text.rank[lang]} : ${rank}` : `${text.kills[lang]} : ${kill}`}
                                fontweight="bold"
                                textTransform ="uppercase"
                                styles="text-white float-left pl-2"
                            />
                            }
                            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-2/3 left-16 1xs:left-14 2xs:left-12 rounded-2xl">
                                {!weeklyTournament &&
                                    <div>
                                        <Image
                                            url={image}
                                            styles="h-full w-32 1xs:w-28 2xs:w-24 3xs:w-24 object-contain rounded-2xl"
                                            objectCover={false}
                                            objectContain={true}
                                        />
                                        {displayStatus === 'RESULT' && kill !==-1 &&
                                            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3 bg-t-kill px-1 py-1 rounded-sm">
                                                <Text
                                                    tag={"label"}
                                                    scale={true}
                                                    text={`${text.kills[lang]} : ${kill}`}
                                                    fontweight="bold"
                                                    styles="text-black float-right text-xs 1xs:text-xxs 2xs:text-ts"
                                                />
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        {weeklyTournament && <div className="w-1/3 flex flex-col justify-center items-center">

                            <Image
                                url={image}
                                styles="object-contain rounded-2xl"
                                objectCover={false}
                                objectContain={true}
                            />
                        </div>}
                        <div className="w-3/4">
                            <div className="flex flex-col justify-between pr-1 2xs:pr-0">
                                {!weeklyTournament && type === 'current' && <div className="text-right pr-1">
                                    <Text
                                        tag={"h5"}
                                        scale={true}
                                        text={time}
                                        styles="text-white float-right font-black"

                                    />
                                </div>}
                                {showTournamnetDetails()}
                                {showTournamnetDetails1()}
                                {showTournamnetDetails2()}

                            </div>
                        </div>
                    </div>

                </div>
                {displayStatus === "JOINED" && <div className={`w-full bg-black bg-opacity-40 text-center `}>
                    {tournamentStatus==='REGIS_CLOSED' || tournamentStatus==='START' ?
                        <div className="grid grid-cols-2 divide-x divide-lightPurple text-center bg-black pt-2 pb-1 px-1">
                            <div className="flex flex-col justify-center items-start pl-8">
                                <Text
                                    tag={"lable"}
                                    scale={true}
                                    text={text.roomId[lang]}
                                    fontweight="bold"
                                    textTransform="uppercase"
                                    styles="text-white text-sm"

                                />
                                <div className="flex">
                                    <Text
                                        tag={"lable"}
                                        scale={true}
                                        text={roomId}
                                        fontweight="bold"
                                        styles="text-white text-xs"
                                    />
                                    {roomId &&<Image
                                        url={copyIcon}
                                        styles={"h-5 w-5 ml-2"}
                                        handleClick={() => handleCopyText(roomId, false)}
                                    />}
                                </div>

                            </div>
                            <div className="flex flex-col justify-center items-start pl-8">
                                <Text
                                    tag={"lable"}
                                    scale={true}
                                    text={text.password[lang]}
                                    fontweight="bold"
                                    textTransform="uppercase"
                                    styles="text-white text-sm"
                                />
                                <div className="flex">
                                    <Text
                                        tag={"lable"}
                                        scale={true}
                                        text={password}
                                        fontweight="bold"
                                        styles="text-white text-xs"
                                    />
                                    {password && <Image
                                        url={copyIcon}
                                        styles={"h-5 w-5 ml-2"}
                                        handleClick={() => handleCopyText(password, true)}
                                    />}
                                </div>
                            </div>

                        </div>
                        :
                        <div className="pt-2 pb-1 px-1">
                            <Text
                                tag={"div"}
                                scale={true}
                                text ={joininginfoMessage}
                                fontweight="bold"
                                styles="text-white text-sm "
                            />
                        </div>
                    }
                </div>}
                {children}
            </div>

        </div>
    )
}

export default TournamentCard
