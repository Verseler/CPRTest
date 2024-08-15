import { useRef, useState, useEffect, useMemo, useCallback, act } from "react";
import { Accelerometer } from "expo-sensors";

const useCpr2 = () => {
  const [active, setActive] = useState(false);
  const z = useRef(0);
  const prevZ = useRef(1);
  // const [prevZ, setPrevZ] = useState(1);
  const depthRef = useRef(0);

  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [time, setTime] = useState(0);
  const msCounter = useRef(0);

  const DEFAULT_COMPRESSION_ATTEMPT = {
    depthAttempt: null,
    depthScore: null,
    timingScore: null,
    overallScore: null,
  };
  const [compressionAttempt, setCompressionAttempt] = useState(
    DEFAULT_COMPRESSION_ATTEMPT
  );

  console.log("re-rendered");
  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 500);
        msCounter.current += 500;
      }, 500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [active]);

  const subscribe = () => {
    setActive(true);
    Accelerometer.setUpdateInterval(16);
    Accelerometer.addListener((data) => {
      z.current = data.z;

      calculateDepth(data.z);
    });
  };

  const calculateDepth = useMemo(
    () => (z) => {
      const deltaZ = z - prevZ.current;
      const calibrationFactor = 4.5;
      const compressionDepth = Math.abs(deltaZ * calibrationFactor);
      depthRef.current = compressionDepth.toFixed(1);

      prevZ.current = z;
    },
    []
  );

  useEffect(() => {
    if (msCounter.current === 500) {
      // console.log("audio cue");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        // console.log("compression Attempt");
        getCompressionAttemptScore();
      }, 100);
    }

    if (msCounter.current === 1000) {
      msCounter.current = 0;
    }
  }, [time]);

  const getCompressionAttemptScore = () => {
    if (active) {
      const depthAttempt = depthRef.current;
      const depthScore = getDepthScore(depthAttempt);
      const timingScore = getTimingScore(depthAttempt);
      const overallScore = getOverallScore(depthScore, timingScore);

      setCompressionAttempt({
        depthAttempt,
        depthScore,
        timingScore,
        overallScore,
      });

      setTimeout(() => {
        setCompressionAttempt(DEFAULT_COMPRESSION_ATTEMPT);
      }, 100);
    }
  };

  const unsubscribe = () => {
    Accelerometer.removeAllListeners();
    z.current = 1;
    depthRef.current = 0;
    setActive(false);
    setCompressionAttempt(DEFAULT_COMPRESSION_ATTEMPT);
  };

  //!
  // useEffect(() => {
  //   subscribe();
  //   return () => {
  //     unsubscribe();
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //     }
  //   };
  // }, []);

  const toggleStartAndStop = () => {
    active ? unsubscribe() : subscribe();

    setActive(!active);
  };

  return {
    active,
    time,
    toggleStartAndStop,
    compressionAttempt,
  };
};

export default useCpr2;

const getTimingScore = (depth) => (depth >= 0.5 ? "Perfect" : "Bad");

const getDepthScore = (depth) => {
  if (depth >= 2 && depth <= 2.5) return "Perfect";
  else if (depth > 2.5) return "Too much";
  else if (depth >= 0.5 && depth < 2) return "Too little";
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
