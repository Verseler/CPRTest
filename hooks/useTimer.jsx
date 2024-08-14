import { useEffect, useRef, useState } from "react";
import { formatTime } from "./helper";

export default function useTimer() {
  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null); //reference for timer
  const [time, setTime] = useState(0); //raw time value that increments every 100ms
  const timer = formatTime(time); //formatted time value in readable format
  const msCounter = useRef(0); //timer for every 0.6 second. It is use as counter to determine when to play the audio cue and get compression attempt score

  //This is where counting happens
  useEffect(() => {
    if (timerOn) {
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        // Calculate elapsed time
        const elapsed = Date.now() - startTime;

        //this update the timer for every 100ms
        setTime(elapsed);

        //msCounter or milisecondsCounter is used to count the time between 0.1 to 6 second
        //its purpose is to determine the time the compression attempt should be performed
        //because the compression attempt is needed to be performed every 0.6 second based on 120 compression per minute
        msCounter.current = elapsed % 600;
      }, 100);
    }
    //clean up
    else if (timerRef.current) clearInterval(timerRef.current);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerOn]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerOn(false);
      setTime(0);
      resetMsCounter();
    }
  };

  const resetMsCounter = () => {
    msCounter.current = 0;
  };

  return {
    timer,
    timerOn,
    setTimerOn,
    msCounter: msCounter.current,
    resetTimer,
    resetMsCounter,
  };
}
