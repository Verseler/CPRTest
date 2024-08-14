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

const DEFAULT_COMPRESSION = {
  depthAttempt: 0,
  depthScore: "",
  timingScore: "",
  overallScore: 0,
};

const useCpr3 = () => {
  const soundsRef = usePreloadedAudio(); // Load the audio files
  const [subscription, setSubscription] = useState(null);
  const prevZ = useRef(0); //previous z value after each depth calculation
  const depth = useRef(0); //depth value results after each depth calculation

  const { msCounter, timer, timerOn, setTimerOn, resetTimer, resetMsCounter } =
    useTimer();

  //store all scores for every compression attempt
  const [currentCompressionScore, setCurrentCompressionScore] =
    useState(DEFAULT_COMPRESSION);
  const prevCompressionScore = useRef(0);

  useEffect(() => {
    if (timerOn) {
      //every 0.4 second play the audio cue
      if (msCounter >= 400 && msCounter < 600) {
        playAudioCue(prevCompressionScore, soundsRef);
      }
      //every 0.6 second the timing and depth score will be calculated
      if (msCounter >= 600 || msCounter < 100) {
        resetMsCounter();
        getCompressionScore();
      }
    }
  }, [timerOn, msCounter]);

  //calculate the depth based on the current and previous z values
  const calculateDepth = (z) => {
    //computes the difference between the current z value and the previous z value
    const deltaZ = z - prevZ.current;
    /* Adjust this to fine-tune the sensitivity and accuracy of the depth calculation  */
    const calibrationFactor = 3; // Empirical value for scaling
    const gForceToInches = 0.3937; // Approximate conversion factor for g-force to inches

    const compressionDepth = Math.abs(
      deltaZ * calibrationFactor * gForceToInches
    );
    depth.current = compressionDepth.toFixed(1);

    prevZ.current = z;
  };

  //calculate the timing, depth, and overall score
  const getCompressionScore = () => {
    if (timerOn) {
      const depthAttempt = depth.current; //depth attempt value in inches
      const depthScore = getDepthScore(depthAttempt);
      const timingScore = getTimingScore(depthAttempt);
      const overallScore = getOverallScore(depthScore, timingScore);

      const currentScore = {
        depthAttempt,
        depthScore,
        timingScore,
        overallScore,
      };

      //set current compression attempt score and record the previous compression attempt score
      setCurrentCompressionScore(currentScore);
      prevCompressionScore.current = currentScore;

      /*
       * After a 100ms delay, reset the value of compression attempt so that the
       * score ui will be removed.
       *
       * this determine the duration of scores will be displayed.
       */
      setTimeout(() => {
        setCurrentCompressionScore(DEFAULT_COMPRESSION);
      }, 100);
    }
  };

  /**
   *
   *
   *
   *
   *
   *
   */

  const subscribe = () => {
    Accelerometer.setUpdateInterval(16);
    setSubscription(
      Accelerometer.addListener((data) => {
        calculateDepth(data.z);
      })
    );
  };

  const unsubscribe = () => {
    Accelerometer.removeAllListeners();

    //reset
    setSubscription(null);
    depth.current = 0;
    prevCompressionScore.current = 0;
    setCurrentCompressionScore(DEFAULT_COMPRESSION);
    resetTimer();
  };

  const toggleStartAndStop = () => {
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

export default useCpr3;
