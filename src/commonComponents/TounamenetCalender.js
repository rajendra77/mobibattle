
import React, { useEffect, useState } from 'react'
import Text from '../commonComponents/Text';
import {reactLocalStorage} from 'reactjs-localstorage'

const TournamentCalender = ({  handleSelectDate, activeDate,lang,text }) => {

    const [calanderArr, setcalanderArr] = useState([])

    const getCalander = (numberOfDays) => {
        const currentDate = new Date()
        let weekdays = new Array(7);
        weekdays[0] = "Sun";
        weekdays[1] = "Mon";
        weekdays[2] = "Tue";
        weekdays[3] = "Wed";
        weekdays[4] = "Thu";
        weekdays[5] = "Fri";
        weekdays[6] = "Sat";
        let calanderArr = []
        for (let i = 0; i < numberOfDays; i++) {
            let dayInterval = 1
            if (i === 0) {
                dayInterval = 0
            }
            currentDate.setDate(currentDate.getDate() + dayInterval);
            let dayName = weekdays[currentDate.getDay()];
            let date = currentDate.getDate()
            calanderArr.push({ id: i, date: date, day: dayName })
        }
        setcalanderArr(calanderArr)
    }

    useEffect(() => {
        getCalander(reactLocalStorage.get("noOfDaysShown"))
    }, [])
    
    

    return (
        <div className="p-2 overflow-x-auto no-scrollbar flex">
            {calanderArr.map((item, index) =>
                <div
                    className={`rounded-xl flex flex-col justify-center items-center ${item.date == activeDate ? "bg-tabsColor" : "bg-tViolet"}  py-1 px-3 mx-1`}
                    key={index}
                    onClick={() => handleSelectDate(item.date)}
                >
                    <Text
                        tag={"h3"}
                        scale={true}
                        text={item.date}
                        styles={` ${item.date == activeDate ? "text-white" : "text-lightPurple"} font-bold `}
                    />
                    <Text
                        tag={"h6"}
                        scale={true}
                        text={item.day}
                        styles={` ${item.date == activeDate ? "text-white" : "text-lightPurple"} font-medium `}
                    />
                </div>
            )}

        </div>

    )
}

export default TournamentCalender


