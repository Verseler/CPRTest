import { useRef, useState, useEffect, useCallback } from "react";
import { Accelerometer } from "expo-sensors";
import {
  getDepthScore,
  getOverallScore,
  getTimingScore,
} from "./useCpr.helper";
import useAudioCue from "./useAudioCue";
import useTimer from "./useTimer";
import { type Compression } from "./useCpr.types";
import useCompressionHistory from "./useCompressionHistory";

// Initial empty compression value
const EMPTY_COMPRESSION_VALUE: Compression = {
  depthAttempt: null,
  depthScore: null,
  timingScore: null,
  overallScore: null,
};

const useCpr = () => {
  const { playAudioCue } = useAudioCue();
  const [isSubscribed, setIsSubscribed] = useState < boolean > false;
  const prevZ = useRef < number > 0;
  const depth = useRef < number > 0;
  const {
    msCounter,
    rawTimer,
    timer,
    timerOn,
    setTimerOn,
    resetTimer,
    resetMsCounter,
  } = useTimer();
  const {
    clearCompressionHistory,
    compressionHistory,
    recordCompressionHistory,
  } = useCompressionHistory();

  const [currentCompressionScore, setCurrentCompressionScore] =
    useState < Compression > EMPTY_COMPRESSION_VALUE;
  const prevCompressionScore = useRef < Compression > EMPTY_COMPRESSION_VALUE; //it is used for voice cue
  const formattedTime = (rawTimer * 0.001).toFixed(1);

  // play Audio Cue and getting compression score when conditions are met
  useEffect(() => {
    if (timerOn) {
      if (msCounter >= 500 && msCounter < 600) {
        playAudioCue(prevCompressionScore);
      }
      if (msCounter >= 600) {
        getCompressionScore(formattedTime);
        resetMsCounter();
      }
    }
  }, [timerOn, msCounter]);

  const calculateDepth = useCallback(
    (z: number): void => {
      const deltaZ: number = z - prevZ.current;
      const gForceToInches = 0.3937;
      const calibrationFactor = 10;
      const compressionDepth = Math.abs(
        deltaZ * calibrationFactor * gForceToInches
      );
      depth.current = Number(compressionDepth.toFixed(1));
      prevZ.current = z;
    },
    [isSubscribed]
  );

  const getCompressionScore = useCallback(
    (formattedTime: string): void => {
      if (timerOn) {
        const depthAttempt = depth.current;
        const depthScore = getDepthScore(depthAttempt);
        const timingScore = getTimingScore(depthAttempt);
        const overallScore = getOverallScore(depthScore, timingScore);

        const currentScore: Compression = {
          depthAttempt,
          depthScore,
          timingScore,
          overallScore,
        };

        setCurrentCompressionScore(currentScore);
        prevCompressionScore.current = currentScore;

        // Record the current compression score with a timestamp
        recordCompressionHistory(currentScore, formattedTime);

        // Clear the current compression score after a brief delay
        // the delay is the duration the score is displayed on the screen
        setTimeout(() => {
          setCurrentCompressionScore(EMPTY_COMPRESSION_VALUE);
        }, 150);
      }
    },
    [timerOn]
  );

  const subscribe = useCallback((): void => {
    Accelerometer.setUpdateInterval(16);

    const subscription = Accelerometer.addListener((data) => {
      calculateDepth(data.z);
    });

    if (subscription) setIsSubscribed(true);
  }, [isSubscribed]);

  const unsubscribe = (): void => {
    Accelerometer.removeAllListeners();
    setIsSubscribed(false);
    depth.current = 0;
    prevCompressionScore.current = EMPTY_COMPRESSION_VALUE;
    setCurrentCompressionScore(EMPTY_COMPRESSION_VALUE);
    resetTimer();
    clearCompressionHistory();
  };

  const startCpr = (): void => {
    subscribe();
    setTimerOn(true);
  };

  const stopCpr = (): void => {
    unsubscribe();
    setTimerOn(false);
  };

  return {
    timerOn,
    timer,
    startCpr,
    stopCpr,
    currentCompressionScore,
    depth: depth.current,
    compressionHistory: compressionHistory.current,
  };
};

export default useCpr;
