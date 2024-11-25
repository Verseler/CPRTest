import { useEffect, useRef, useState } from "react";
import { formatTime } from "./useCpr.helper";

type Timer = {
  timerOn: boolean;
  timer: string;
  msCounter: number;
  startTimer: () => void;
  resetTimer: () => void;
  resetMsCounter: () => void;
};

export default function useTimer(): Timer {
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timer, setTimer] = useState<string>("00:00");

  const [msCounter, setMsCounter] = useState<number>(100);
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    if (timerOn) {
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        //this update the timer for every 100ms
        const formattedTime = formatTime(elapsed);
        setTimer(formattedTime);

        //msCounter or milisecondsCounter is used to count the time between 0.1 to 6 second
        //its purpose is to determine the time the compression attempt should be performed
        //because the compression attempt is needed to be performed every 0.6 second based on 120 compression per minute
        const delta = currentTime - lastUpdateTime.current;
        lastUpdateTime.current = currentTime;

        setMsCounter((prevMsCounter) => prevMsCounter + delta);
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
      setTimer("00:00");
      resetMsCounter();
    }
  };

  const startTimer = (): void => {
    setTimerOn(true);
  };

  const resetMsCounter = (): void => {
    setMsCounter(100);
    lastUpdateTime.current = Date.now();
  };

  return {
    timer,
    timerOn,
    msCounter,
    resetTimer,
    startTimer,
    resetMsCounter,
  };
}
