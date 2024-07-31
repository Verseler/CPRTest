import { useRef, useState, useEffect, useMemo, useCallback, act } from "react";
import { Accelerometer } from "expo-sensors";

const useCpr2 = () => {
  const [subscription, setSubscription] = useState(null);
  const z = useRef(0); //raw z accelerometer value
  const prevZ = useRef(1); //previous z value after each depth calculation
  const depth = useRef(0); //depth value results after each depth calculation

  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null); //reference for timer
  const timeoutRef = useRef(null); //use for timeout reference for every 0.6s compression attempt
  const [time, setTime] = useState(0); //raw time value in 100ms increments
  const timer = formatTime(time); //formatted time value
  const msCounter = useRef(0); //timer for every 1 second. this counts between 100ms to 1000ms or 1s

  const DEFAULT_COMPRESSION_ATTEMPT = {
    depthAttempt: null,
    depthScore: null,
    timingScore: null,
    overallScore: null,
  };
  //store all scores for every compression attempt
  const [compressionAttempt, setCompressionAttempt] = useState(
    DEFAULT_COMPRESSION_ATTEMPT
  );

  //This is where counting happens
  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
        msCounter.current += 100;
      }, 100);
    }
    //clean up
    else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timerOn]);

  //calculate the depth based on the current and previous z values
  const calculateDepth = useMemo(
    () => (z) => {
      const deltaZ = z - prevZ.current;
      const calibrationFactor = 4.5;
      const compressionDepth = Math.abs(deltaZ * calibrationFactor);
      depth.current = compressionDepth.toFixed(1);

      prevZ.current = z;
    },
    []
  );

  useEffect(() => {
    //msCounter or milisecondsCounter is used to count the time between 0.1 to 1 second

    //every 0.5 second an audio cue will be played
    if (msCounter.current === 500) {
      // console.log("audio cue: Push");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      //every 0.6 the timing and depth score will be calculated
      timeoutRef.current = setTimeout(() => {
        // console.log("compression Attempt");
        getCompressionAttemptScore();
      }, 100);
    }

    //every 1 second the msCounter will be reset
    if (msCounter.current === 1000) {
      msCounter.current = 0;
    }
  }, [time]);

  //calculate the timing, depth, and overall score
  const getCompressionAttemptScore = () => {
    if (timerOn) {
      const depthAttempt = depth.current;
      const depthScore = getDepthScore(depthAttempt);
      const timingScore = getTimingScore(depthAttempt);
      const overallScore = getOverallScore(depthScore, timingScore);

      setCompressionAttempt({
        depthAttempt,
        depthScore,
        timingScore,
        overallScore,
      });

      //this determine the duration the scores will be displayed
      //after 300ms or 0.3 seconds reset the value of compression attempt so that
      setTimeout(() => {
        setCompressionAttempt(DEFAULT_COMPRESSION_ATTEMPT);
      }, 300);
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
        z.current = data.z;

        calculateDepth(data.z);
      })
    );
  };

  const unsubscribe = () => {
    Accelerometer.removeAllListeners();

    setSubscription(null);
    depth.current = 0;
    z.current = 1;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerOn(false);
      setTime(0);
      setCompressionAttempt(DEFAULT_COMPRESSION_ATTEMPT);
    }
  };

  const toggleStartAndStop = () => {
    subscription ? unsubscribe() : subscribe();

    setTimerOn(!timerOn);
  };

  return {
    timerOn,
    timer,
    toggleStartAndStop,
    compressionAttempt,
    depth: depth.current,
  };
};

export default useCpr2;

const getTimingScore = (depth) => (depth >= 0.5 ? "Perfect" : "Bad");

const getDepthScore = (depth) => {
  if (depth >= 2 && depth <= 2.5) return "Perfect";
  else if (depth > 2.5) return "Too much";
  else if (depth >= 0.2 && depth < 2) return "Too little";
  return "Inactive";
};

const getOverallScore = (depthScore, timingScore) => {
  if (depthScore == "Inactive") return 0;
  else if (depthScore == "Too little" && timingScore == "Bad") return 1;
  else if (depthScore == "Too little" && timingScore == "Perfect") return 2;
  else if (depthScore == "Too little" && timingScore == "Bad") return 2;
  else if (depthScore == "Perfect" && timingScore == "Perfect") return 3;
  else if (depthScore == "Too much" && timingScore == "Perfect") return 4;
  else if (depthScore == "Too much" && timingScore == "Bad") return 5;

  return 0;
};

const formatTime = (time) => {
  const totalSeconds = Math.floor(time / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};
