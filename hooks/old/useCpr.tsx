import { useEffect, useRef, useCallback, useState } from "react";
import { Accelerometer } from "expo-sensors";

import { type TimingScore, type Compression } from "./useCpr.types";
import {
  isCompressionStarted,
  isCompressionEnded,
  getTimeGap,
  getLowestZ,
  getTimingScore,
  getDepthScore,
  getOverallScore,
} from "./useCpr.helper";
import useTimer from "./useTimer";
import useAudioCue from "./useAudioCue";

// Initial empty compression value
const EMPTY_COMPRESSION_VALUE: Compression = {
  compressionDepth: null,
  depthScore: null,
  timingScore: null,
  overallScore: null,
};

const useCpr = () => {
  const { playAudioCue } = useAudioCue();
  const { timer, msCounter, resetMsCounter, startTimer, resetTimer } =
    useTimer();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const timingScore = useRef<TimingScore | null>(null);
  const compressionDepth = useRef<number | null>(null);
  const [currentCompressionScore, setCurrentCompressionScore] =
    useState<Compression>(EMPTY_COMPRESSION_VALUE);

  // Variables to track previous state
  const prevCompressionScores = useRef<Compression>(EMPTY_COMPRESSION_VALUE);
  const prevZ = useRef(0);
  const lowestZ = useRef(0);
  const isCompressing = useRef(false);
  const prevCompressionTime = useRef(0);

  useEffect(() => {
    if (msCounter >= 500 && msCounter < 600) {
      playAudioCue(prevCompressionScores.current);
    }
    if (msCounter >= 600) {
      getCompressionScores();
      resetMsCounter();
    }
  }, [msCounter]);

  // this will be executed when start and stop cpr is called
  useEffect(() => {
    if (isSubscribed) {
      Accelerometer.setUpdateInterval(16);

      const subscription = Accelerometer.addListener((data) => {
        const currentTime = Date.now();
        observeAcceleration(data.z, currentTime);
      });
      return () => subscription && subscription.remove();
    }

    return () => Accelerometer.removeAllListeners();
  }, [isSubscribed]);

  // This will observe the acceleration of z data to check if there is movement or compression is performed
  const observeAcceleration = useCallback(
    (currentZ: number, currentTime: number) => {
      const currentLowestZ = getLowestZ(lowestZ.current, currentZ);

      if (isCompressionStarted(prevZ.current, currentZ)) {
        isCompressing.current = true;
        lowestZ.current = currentLowestZ;
      }
      if (isCompressionEnded(prevZ.current, currentZ, isCompressing.current)) {
        const calculatedDepth = calculateDepth(currentLowestZ, currentZ);
        compressionDepth.current = calculatedDepth;

        const calculatedTimingScore = calculateCompressionTiming(currentTime);
        timingScore.current = calculatedTimingScore;

        //reset compression state
        isCompressing.current = false;
        lowestZ.current = 0;
        prevZ.current = 0;
      }

      prevZ.current = currentZ;
    },
    []
  );

  const getCompressionScores = useCallback(() => {
    const currentCompressionDepth = compressionDepth.current;
    const currentTimingScore = timingScore.current ?? "Missed";
    const currentDepthScore = getDepthScore(currentCompressionDepth);
    const currentOverallScore = getOverallScore(
      timingScore.current,
      currentDepthScore
    );

    const currentCompressionScore: Compression = {
      depthScore: currentDepthScore,
      compressionDepth: currentCompressionDepth,
      overallScore: currentOverallScore,
      timingScore: currentTimingScore,
    };
    setCurrentCompressionScore(currentCompressionScore);
    prevCompressionScores.current = currentCompressionScore;

    //The timeout delay is the duration the score ui will be shown
    setTimeout(() => {
      compressionDepth.current = null;
      timingScore.current = null;
      setCurrentCompressionScore(EMPTY_COMPRESSION_VALUE);
    }, 150);
  }, []);

  const calculateCompressionTiming = useCallback(
    (currentTime: number): TimingScore => {
      const timeGap = getTimeGap(prevCompressionTime.current, currentTime);
      timingScore.current = getTimingScore(timeGap);

      prevCompressionTime.current = currentTime;
      return timingScore.current;
    },
    []
  );

  // Function to calculate compression depth in inches
  const calculateDepth = useCallback(
    (lowestZ: number, currentZ: number): number => {
      const zAccelerationPeakGap = Math.abs(currentZ - lowestZ);
      const gForceToInches = 0.3937;
      //* for tuning accuracy, the greater the number the more sensitive
      const calibrationFactor = 4;
      const depthInInches = Math.abs(
        zAccelerationPeakGap * calibrationFactor * gForceToInches
      );
      return Number(depthInInches.toFixed(1));
    },
    []
  );

  const start = () => {
    startTimer();
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
    prevCompressionTime.current = 0;
    prevZ.current = 0;
    timingScore.current = null;
    compressionDepth.current = null;
  };

  return {
    start,
    stop,
    currentCompressionScore,
    timer,
    msCounter,
  };
};

export default useCpr;
