import {useState, useEffect} from 'react';
const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(20);
    let intervalId;

    useEffect(() => {
        if (!timeLeft) return;
        intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
          }, 1000);
        return () => clearInterval(intervalId);
      }, [timeLeft]);

  const stopTimer = () => {
        console.log('running the start timer::',  timeLeft);
        clearInterval(intervalId);
    }
  
    return {timeLeft, stopTimer};
  };

  export default Timer;