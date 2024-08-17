import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime } from "./helper";

type Timer = {
  timerOn: boolean;
  timer: string;
  msCounter: number;
  setTimerOn: React.Dispatch<React.SetStateAction<boolean>>;
  resetTimer: () => void;
  resetMsCounter: () => void;
};

export default function useTimer(): Timer {
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const timerRef = useRef<number>(0);
  const [rawTimer, setRawTimer] = useState<number>(0); //raw time value that increments every 100ms
  const timer: string = useMemo(() => formatTime(rawTimer), [rawTimer]); //formatted time value with readable format
  const msCounter = useRef<number>(100); //timer for every 0.6 second. It is use as counter to determine when to play the audio cue and get compression attempt score

  useEffect(() => {
    if (timerOn) {
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        // Calculate elapsed time
        const elapsed = Date.now() - startTime;

        //this update the timer for every 100ms
        setRawTimer(elapsed);

        //msCounter or milisecondsCounter is used to count the time between 0.1 to 6 second
        //its purpose is to determine the time the compression attempt should be performed
        //because the compression attempt is needed to be performed every 0.6 second based on 120 compression per minute
        msCounter.current += 100;
      }, 100);
    }
    //clean up
    else if (timerRef.current) clearInterval(timerRef.current);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerOn]);

  const resetTimer = (): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerOn(false);
      setRawTimer(0);
      resetMsCounter();
    }
  };

  const resetMsCounter = (): void => {
    msCounter.current = 100;
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
