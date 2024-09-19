import { useEffect, useRef, useCallback, useState } from "react";
import { Accelerometer } from "expo-sensors";
import { type DepthScore, type TimingScore } from "./useCpr.types";

import {
  isCompressionStarted,
  isCompressionEnded,
  getTimeGap,
  getLowestZ,
  getTimingScore,
  getDepthScore,
  isCompressionMissed,
  getOverallScore,
} from "./useCpr.helper";
import useTimer from "../useTimer";
import useAudioCue from "../useAudioCue";
import { Compression } from "../useCpr.types";

// Initial empty compression value
const EMPTY_COMPRESSION_VALUE: Compression = {
  compressionDepth: null,
  depthScore: null,
  timingScore: null,
  overallScore: null,
};

const useCpr = () => {
  const { playAudioCue } = useAudioCue();
  const { timer, msCounter, resetMsCounter, setTimerOn, resetTimer } =
    useTimer();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const compressionCount = useRef(0);
  const [currentCompressionScore, setCurrentCompressionScore] =
    useState<Compression>(EMPTY_COMPRESSION_VALUE);

  // Variables to track previous state
  const prevCompressionScores = useRef<Compression>(EMPTY_COMPRESSION_VALUE);
  const prevZ = useRef(0);
  const lowestZ = useRef(0);
  const isCompressing = useRef(false);
  const prevCompressionTime = useRef(0);

  useEffect(() => {
    if (isSubscribed) {
      Accelerometer.setUpdateInterval(16);
      const subscription = Accelerometer.addListener((data) => {
        const currentTime = Date.now();

        processCompression(data.z, currentTime);
      });

      return () => {
        subscription && subscription.remove();
      };
    }

    return () => Accelerometer.removeAllListeners();
  }, [isSubscribed, prevZ.current]);

  // This will observe the acceleration of z data to check if there is movement or compression is performed
  const processCompression = (currentZ: number, currentTime: number) => {
    const currentLowestZ: number = getLowestZ(lowestZ.current, currentZ);

    if (prevZ.current - currentZ > 0.3) {
      isCompressing.current = true;
      lowestZ.current = currentLowestZ;
    }
    // console.log(isCompressing.current);
    //
    else if (currentZ - prevZ.current > 0.3 && isCompressing.current) {
      const { depthScore, compressionDepth } = calculateCompressionDepth(
        currentLowestZ,
        currentZ
      );
      const timingScore = calculateCompressionTiming(currentTime);
      const overallScore = getOverallScore(timingScore, depthScore);

      const currentCompressionScore: Compression = {
        depthScore,
        compressionDepth,
        overallScore,
        timingScore,
      };
      setCurrentCompressionScore(currentCompressionScore);
      prevCompressionScores.current = currentCompressionScore;

      //play audio feedback cue based on previous score
      playAudioCue(currentCompressionScore);
      increaseCompressionCount();
      resetCompressionState();
    }
    if (msCounter >= 500 && msCounter < 600) {
      console.log(isCompressing.current);
    }
    //  else if (
    //   isCompressionMissed(
    //     prevCompressionTime.current,
    //     currentTime,
    //     isCompressing.current
    //   )
    // ) {
    //   const missedCompressionScore: Compression = {
    //     ...EMPTY_COMPRESSION_VALUE,
    //     timingScore: "Missed",
    //   };
    //   setCurrentCompressionScore(missedCompressionScore);
    //   prevCompressionScores.current = missedCompressionScore;

    //   resetCompressionState();
    //   //play audio cue for previous missed compression
    //   playAudioCue(missedCompressionScore);
    // }

    prevZ.current = currentZ;
  };

  const calculateCompressionDepth = useCallback(
    (currentLowestZ: number, currentZ: number) => {
      const compressionDepth: number = calculateDepth(currentLowestZ, currentZ);
      const depthScore: DepthScore | null = getDepthScore(compressionDepth);

      return { depthScore, compressionDepth };
    },
    []
  );

  const calculateCompressionTiming = useCallback((currentTime: number) => {
    prevCompressionTime.current = currentTime;
    const timeGap = getTimeGap(prevCompressionTime.current, currentTime);
    const currentTimingScore = getTimingScore(timeGap);

    return currentTimingScore;
  }, []);

  // Function to calculate compression depth in inches
  const calculateDepth = useCallback((lowestZ: number, currentZ: number) => {
    /*
     * LowestZ is the peak of the compression z data
     * currentZ is based z data after the end of compression
     */
    const peakGap = Math.abs(currentZ - lowestZ);
    const gForceToInches = 0.3937;
    const calibrationFactor = 4; //* for tuning accuracy
    const depthInInches = Math.abs(
      peakGap * calibrationFactor * gForceToInches
    );
    return Number(depthInInches.toFixed(1));
  }, []);

  const increaseCompressionCount = () => {
    compressionCount.current = compressionCount.current + 1;
  };

  // Reset compression-related state after each compression
  const resetCompressionState = () => {
    isCompressing.current = false;
    lowestZ.current = 0;
    prevZ.current = 0;

    //the delay is the duration the score UI will be shown
    setTimeout(() => {
      setCurrentCompressionScore(EMPTY_COMPRESSION_VALUE);
    }, 150);
  };

  const start = () => {
    setTimerOn(true);
    setIsSubscribed(true);
  };

  const stop = () => {
    resetTimer();
    resetMsCounter();
    setIsSubscribed(false);
    Accelerometer.removeAllListeners();
    clear();
  };

  const clear = () => {
    lowestZ.current = 0;
    compressionCount.current = 0;
    prevCompressionTime.current = 0;
    prevZ.current = 0;
  };

  return {
    start,
    stop,
    compressionCount: compressionCount.current,
    currentCompressionScore,
    timer,
    msCounter,
  };
};

export default useCpr;
