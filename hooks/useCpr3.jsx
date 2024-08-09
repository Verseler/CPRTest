import { useRef, useState, useEffect } from "react";
import { Accelerometer } from "expo-sensors";
import {
  formatTime,
  getDepthScore,
  getOverallScore,
  getTimingScore,
  playAudioCue,
} from "./helper";

const DEFAULT_COMPRESSION_ATTEMPT = {
  depthAttempt: 0,
  depthScore: "",
  timingScore: "",
  overallScore: 0,
};

const useCpr3 = () => {
  const [subscription, setSubscription] = useState(null);
  const prevZ = useRef(0); //previous z value after each depth calculation
  const depth = useRef(0); //depth value results after each depth calculation

  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null); //reference for timer
  const [time, setTime] = useState(0); //raw time value that increments every 100ms
  const timer = formatTime(time); //formatted time value in readable format
  const msCounter = useRef(0); //timer for every 0.6 second. It is use as counter to determine when to play the audio cue and get compression attempt score

  //store all scores for every compression attempt
  const [compressionAttemptScore, setCompressionAttemptScore] = useState(
    DEFAULT_COMPRESSION_ATTEMPT
  );
  //previous compression attempt score
  const prevScores = useRef(0);

  //This is where counting happens
  useEffect(() => {
    if (timerOn) {
      const startTime = Date.now(); // Track start time

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime; // Calculate elapsed time

        //this update the timer for every 100ms
        setTime(elapsed);
        //msCounter or milisecondsCounter is used to count the time between 0.1 to 6 second
        //its purpose is to determine the time the compression attempt should be performed
        //because the compression attempt is need to be performed every 0.6 second based on 120 compression per minute
        msCounter.current = elapsed % 600;
        console.log(msCounter.current);
        //every 0.5 second an audio cue will be played
        //i allocate an advance 100ms to play the audio cue a bit in advance so that the user has a small time to react
        if (msCounter.current >= 500 && msCounter.current < 600) {
          playAudioCue(prevScores);
        }

        //every 0.6 second the timing and depth score will be calculated
        if (msCounter.current >= 600 || msCounter.current < 100) {
          msCounter.current = 100; // Reset msCounter to start the next cycle
          getCompressionAttemptScore();
        }
      }, 100);
    }
    //clean up
    else if (timerRef.current) clearInterval(timerRef.current);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerOn]);

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
  const getCompressionAttemptScore = () => {
    if (timerOn) {
      const depthAttempt = depth.current;
      const depthScore = getDepthScore(depthAttempt);
      const timingScore = getTimingScore(depthAttempt);
      const overallScore = getOverallScore(depthScore, timingScore);

      const currentScore = {
        depthAttempt,
        depthScore,
        timingScore,
        overallScore,
      };

      //set current compression attempt score
      setCompressionAttemptScore(currentScore);

      //record the previous compression attempt score
      prevScores.current = currentScore;

      //this determine the duration the scores will be displayed
      //after a delay reset the value of compression attempt so that
      setTimeout(() => {
        setCompressionAttemptScore(DEFAULT_COMPRESSION_ATTEMPT);
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

    //reset and cleanup
    setSubscription(null);
    depth.current = 0;
    msCounter.current = 0;
    setCompressionAttemptScore(DEFAULT_COMPRESSION_ATTEMPT);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerOn(false);
      setTime(0);
    }
  };

  const toggleStartAndStop = () => {
    subscription ? unsubscribe() : subscribe();

    setTimerOn(!timerOn);
  };

  return {
    timerOn,
    timer,
    msCounter,
    toggleStartAndStop,
    compressionAttemptScore,
    depth: depth.current,
  };
};

export default useCpr3;
