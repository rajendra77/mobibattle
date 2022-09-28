
import React, { } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import Image from './Image'
import Text from './Text'

const TournamentResultCard = ({
    id,
    image,
    rank,
    kills,
    prize,
    battleName,
    handleReportUser,
    displayName,
    userGameId,
    text,
    lang
}) => {

    const coinIcon = require("../assets/svg-icons/mbc_coin_icon.svg").default;

    const showTournamnetDetails1 = () => {
        return (
            <div className="flex justify-between flex-wrap w-full ">
                <div className=" p-2 flex flex-col items-start justify-start">
                    <Text
                        tag={"lable"}
                        scale={true}
                        text={userGameId}
                        styles="text-white font-bold text-xs"
                    />
                    <Text
                        tag={"h5"}
                        scale={true}
                        text={rank}
                        styles="text-white font-bold "

                    />
                </div>

                <div className=" p-2 flex flex-col items-start justify-start">
                    <Text
                        tag={"lable"}
                        scale={true}
                        text={kills===-1  ? text.rank[lang] : text.kills[lang]}
                        styles="text-white font-bold text-xs uppercase"
                        alignment="right"
                    />
                    <Text
                        tag={"h5"}
                        scale={true}
                        text={kills===-1  ? rank : kills}
                        styles="text-white font-bold text-right"
                    />
                </div>

                <div className=" p-2 flex flex-col items-start justify-start">
                    <Text
                        tag={"lable"}
                        scale={true}
                        text={text.prize[lang]}
                        styles="text-white font-bold text-xs uppercase "
                        alignment="right"
                    />
                    <div className="flex justify-center items-center">
                        <Image
                            url={coinIcon}
                            styles="h-4 w-4 mr-1"
                        />
                        <Text
                            tag={"h5"}
                            scale={true}
                            text={prize}
                            styles="text-white font-bold text-right"
                        />
                    </div>

                </div>

            </div>
        )
    }

    const showTournamnetDetails2 = () => {
        return (
            <div className="flex justify-between flex-wrap">
                <div className="w-2/3 p-2 text-center">

                    <div className="flex flex-col justify-center items-start">
                        <Text
                            tag={"lable"}
                            scale={true}
                            text={reactLocalStorage.get("tournamentName")}
                            fontweight="bold"
                            styles="text-white float-right pr-2 text-xs 2xs:text-ts"
                        />
                        <Text
                            tag={"lable"}
                            scale={true}
                            text={battleName}
                            styles="text-white float-right pr-2 pt-1 text-xs 2xs:text-ts"
                        />
                    </div>
                </div>
                {/* <div className="text-center w-1/3 px-1 py-2">
                    <div onClick={handleReportUser} className="py-1 rounded border-dashed  border border-light-blue-500">
                        <Text
                            tag="span"
                            text={text.reportUser[lang]}
                            styles=" text-white text-xxs 2xs:text-ts font-medium"
                        />
                    </div>
                </div> */}
            </div>
        )
    }

    return (
        <div className={`px-3 "pl-8"  py-1`}>
            <div className={`w-full bg-black bg-opacity-30 rounded-xl pt-1 text-right relative`}>
                <div className="flex flex-col">

                    <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-2/3 left-3 rounded-2xl">
                        <div>
                            <Image
                                url={image}
                                styles="h-full w-16 object-contain rounded-2xl"
                                objectCover={false}
                                objectContain={true}
                            />
                        </div>
                    </div>

                    <div className="pl-8 mx-2 grid  divide-y divide-white-500">

                        {showTournamnetDetails1()}

                        {showTournamnetDetails2()}

                    </div>


                </div>
            </div>
        </div>
    )
}

export default TournamentResultCard
