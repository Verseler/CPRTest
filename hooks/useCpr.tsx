import { useRef, useState, useEffect } from "react";
import { Accelerometer } from "expo-sensors";
import {
  getDepthScore,
  getOverallScore,
  getTimingScore,
  playAudioCue,
} from "./helper";
import usePreloadedAudio from "./usePreloadedAudio";
import useTimer from "./useTimer";
import { type Compression } from "./useCpr.types";

const DEFAULT_COMPRESSION: Compression = {
  depthAttempt: 0,
  depthScore: null,
  timingScore: null,
  overallScore: null,
};

const useCpr = () => {
  const soundsRef = usePreloadedAudio(); // Load the audio files
  const [subscription, setSubscription] = useState<boolean>(false);
  const prevZ = useRef<number>(0);
  const depth = useRef<number>(0);
  const { msCounter, timer, timerOn, setTimerOn, resetTimer, resetMsCounter } =
    useTimer();

  const [currentCompressionScore, setCurrentCompressionScore] =
    useState<Compression>(DEFAULT_COMPRESSION);
  const prevCompressionScore = useRef<Compression>(DEFAULT_COMPRESSION); //it is used for voice cue

  useEffect(() => {
    if (timerOn) {
      if (msCounter === 500) playAudioCue(prevCompressionScore, soundsRef);
      else if (msCounter === 600) getCompressionScore();
      if (msCounter >= 600) resetMsCounter();
    }
  }, [timerOn, msCounter]);

  const calculateDepth = (z: number): void => {
    const deltaZ: number = z - prevZ.current;
    const calibrationFactor: number = 4.5;
    const gForceToInches: number = 0.3937;
    const compressionDepth: number = Math.abs(
      deltaZ * calibrationFactor * gForceToInches
    );
    depth.current = Number(compressionDepth.toFixed(1));
    prevZ.current = z;
  };

  const getCompressionScore = (): void => {
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

      setTimeout(() => {
        setCurrentCompressionScore(DEFAULT_COMPRESSION);
      }, 150);
    }
  };

  const subscribe = (): void => {
    Accelerometer.setUpdateInterval(16);

    const subscription = Accelerometer.addListener((data) => {
      calculateDepth(data.z);
    });

    if (subscription) setSubscription(true);
  };

  const unsubscribe = (): void => {
    Accelerometer.removeAllListeners();
    setSubscription(false);
    depth.current = 0;
    prevCompressionScore.current = DEFAULT_COMPRESSION;
    setCurrentCompressionScore(DEFAULT_COMPRESSION);
    resetTimer();
  };

  const toggleStartAndStop = (): void => {
    subscription ? unsubscribe() : subscribe();
    setTimerOn(!timerOn);
  };

  return {
    timerOn,
    timer,
    toggleStartAndStop,
    currentCompressionScore,
    depth: depth.current,
  };
};

export default useCpr;
