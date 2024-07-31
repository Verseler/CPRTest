import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Accelerometer } from "expo-sensors";

const useCpr = () => {
  //It determine if there is a subscription to accelerometer.
  // in the other word it determine if the CPR is started or not
  const [subscription, setSubscription] = useState(null);

  //raw acceleration z data
  const zRef = useRef(0);
  //previous z value, it is used for next depth computation
  const [previousZ, setPreviousZ] = useState(1);
  //depth value(in) results from depth computation
  const depthRef = useRef(0);

  //timer for compression attempt where the value will be changed every 0.6 seconds
  //this is use as timer for compression attempt that happens every 0.6 seconds
  const compressionIntervalTimerRef = useRef(null);

  //timer for time where the value will be changed every 1 second
  //this is use for computing the time value
  const timerRef = useRef(null);
  //boolean value that determine if the timer started or not
  const [timerOn, setTimerOn] = useState(false);
  //raw timer value
  const [time, setTime] = useState(0);
  //formatted timer value in Minutes:Seconds format
  const timer = useMemo(() => formatTime(time), [time]);

  const DEFAULT_COMPRESSION_ATTEMPT = {
    depthAttempt: null,
    depthScore: null,
    timingScore: null,
    overallScore: null,
  };
  const [compressionAttempt, setCompressionAttempt] = useState(
    DEFAULT_COMPRESSION_ATTEMPT
  );

  /**
   *
   * Start CPR
   *
   */
  const subscribe = () => {
    // Every 100 ms or 0.1 seconds the accelerometer data will be updated
    Accelerometer.setUpdateInterval(16);

    setSubscription(
      Accelerometer.addListener((data) => {
        // Update the data state with the new accelerometer data
        zRef.current = data.z;
        // Calculate the depth based on the new accelerometer data
        calculateDepth(data.z);
      })
    );
  };

  /**
   *
   * Stop or end CPR
   *
   */
  const unsubscribe = () => {
    //remove all listeners attached to the accelerometer to avoid bugs
    Accelerometer.removeAllListeners();

    //set the subscription to null which means the CPR is not running
    setSubscription(null);

    //set Depth and AccelerometerData (or Z) to default value
    depthRef.current = 0;
    zRef.current = 1;

    if (compressionIntervalTimerRef.current) {
      clearInterval(compressionIntervalTimerRef.current);
    }

    if (timerRef.current) {
      //clear timer reference interval to avoid bugs
      clearInterval(timerRef.current);
      //set timer and time to off or default values
      setTimerOn(false);
      setTime(0);

      //set timingAttempt to null or default value
      //this remove the unchanged timingAttempt value bugs
      setCompressionAttempt(DEFAULT_COMPRESSION_ATTEMPT);
    }
  };

  /**
   *
   * Calculate the depth using the z accelerometer value
   *
   */
  const calculateDepth = useMemo(
    () => (z) => {
      // computes the difference between the current z value and the previous z value
      const deltaZ = z - previousZ;
      /**
       * Adjust this to fine-tune the sensitivity and accuracy of the depth calculation.
       * the greater the value the more sensitive the calculation is
       */
      const calibrationFactor = 4.5;
      /**
       * The change in vertical acceleration (deltaZ) is multiplied by the calibrationFactor
       * to scale the acceleration change into a depth measurement.
       *
       * Math.abs() is used to ensure that the depth value is always positive.
       * Since depth cannot be negative.
       *
       * compressionDepth variable represents the estimated depth of the chest
       * compression based on the current and previous accelerometer readings
       *
       */
      const compressionDepth = Math.abs(deltaZ * calibrationFactor);
      //this is needed to be able to see the changes in depth on checkTiming function
      depthRef.current = compressionDepth.toFixed(1);

      //set the previous z value
      //it is used for calculating the depth next time
      setPreviousZ(z);
    },
    []
  );

  /**
   *
   * get the  current compression depth, timing and overall score
   * this will only be called every 600 miliseconds or 0.6 seconds
   *
   */
  const getCurrentCompressionAttemptScore = () => {
    if (timerOn) {
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

      /**
       * after 300ms or 0.3 seconds reset the value of compression attempt so that
       * in the ui the compression values such as depth score, timing score, and overall score
       * will be removed.
       */
      setTimeout(() => {
        setCompressionAttempt(DEFAULT_COMPRESSION_ATTEMPT);
      }, 300);
    }
  };

  /**
   *
   * get the  timing score based on the depth
   *
   */
  const getTimingScore = (depth) => {
    /**
     * if during the 0.6 interval or the attempt time
     * if there is no changes or the depth is less than 0.5 inches which means there is changes
     * but it is not considered as performing a compression
     * which means that during the attempt time the user did not perform compression
     *
     * 0.3 inches depth and above are considered performing a compression
     *
     */
    return depth >= 0.5 ? "Perfect" : "Bad";
  };

  /**
   *
   * get the depth score based on the depth
   *
   */
  const getDepthScore = (depth) => {
    //2 - 2.5 inches are recommended depth for each compression
    if (depth >= 2 && depth <= 2.5) return "Perfect";
    else if (depth > 2.5) return "Too much";
    else if (depth >= 0.5 && depth < 2) return "Too little";

    //if depth is below 0 - 0.4 inches it is considered inactive
    //or the user did'nt perform a compression during the attempt time
    return "Inactive";
  };

  /**
   *
   * get the overall score based on the depth score and timing score
   *
   */
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
  console.log(1);
  /**
   *
   * This is where timer counting happens
   *
   */
  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      //everytime timerOn is true, start the compression timer counting to
      //determine the interval between each compression
      // Check for timing every 600ms or 0.6 seconds
      compressionIntervalTimerRef.current = setInterval(
        getCurrentCompressionAttemptScore,
        600
      );
    } else {
      //clean up timer interval when timerOn is false
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (compressionIntervalTimerRef.current) {
        clearInterval(compressionIntervalTimerRef.current);
      }
    }

    //clean up timer interval to avoid bugs
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (compressionIntervalTimerRef.current) {
        clearInterval(compressionIntervalTimerRef.current);
      }
    };
  }, [timerOn]);

  /**
   *
   * This function is used to start and stop the timer
   * Or in other word this function start and stop the CPR
   *
   */
  const toggleStartAndStop = () => {
    subscription ? unsubscribe() : subscribe();
    setTimerOn(!timerOn);
  };

  return {
    timer,
    timerOn,
    toggleStartAndStop,
    compressionAttempt,
  };
};

export default useCpr;

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};
