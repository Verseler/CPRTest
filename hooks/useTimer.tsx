import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime } from "./useCpr.helper";

type Timer = {
  rawTimer: number;
  timerOn: boolean;
  timer: string;
  msCounter: number;
  setTimerOn: React.Dispatch<React.SetStateAction<boolean>>;
  resetTimer: () => void;
  resetMsCounter: () => void;
};

export default function useTimer(): Timer {
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [rawTimer, setRawTimer] = useState<number>(0); //raw time value that increments every 100ms
  const timer: string = useMemo(() => formatTime(rawTimer), [rawTimer]); //formatted time value with readable format
  const msCounter = useRef<number>(100); //timer for every 0.6 second. It is use as counter to determine when to play the audio cue and get compression attempt score
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    if (timerOn) {
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        //this update the timer for every 100ms
        setRawTimer(elapsed);

        //msCounter or milisecondsCounter is used to count the time between 0.1 to 6 second
        //its purpose is to determine the time the compression attempt should be performed
        //because the compression attempt is needed to be performed every 0.6 second based on 120 compression per minute
        const delta = currentTime - lastUpdateTime.current;
        lastUpdateTime.current = currentTime;

        msCounter.current += delta;
        if (msCounter.current >= 600) {
          resetMsCounter();
        }
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
    lastUpdateTime.current = Date.now();
  };

  return {
    rawTimer,
    timer,
    timerOn,
    setTimerOn,
    msCounter: msCounter.current,
    resetTimer,
    resetMsCounter,
  };
}
