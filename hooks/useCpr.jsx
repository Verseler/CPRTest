import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Accelerometer } from "expo-sensors";

const useCpr = () => {
  //It determine if there is a subscription to accelerometer. It used to determine if the CPR is started or not
  const [subscription, setSubscription] = useState(null);
  //raw acceleration data. Z value is only used
  const zRef = useRef(0);
  //previous z value, it is used for calculating the depth
  const [previousZ, setPreviousZ] = useState(1);
  //depth value(inches) on everytime z value changes
  const depthRef = useRef(0);
  //depth value on every 0.6 seconds compression attempt
  const [depthAttempt, setDepthAttempt] = useState(null);
  //timing status on every 0.6 seconds compression attempt
  const [timingAttempt, setTimingAttempt] = useState(null);
  //boolean value that determine if the timer started or not
  const [timerOn, setTimerOn] = useState(false);
  //raw timer value
  const [time, setTime] = useState(0);
  //formatted timer value in Minutes:Seconds format
  const timer = useMemo(() => formatTime(time), [time]);
  //reference to the timer. this value will be changed every 1 second
  const timerRef = useRef(null);
  //reference to the compression interval Timer. this value will be changed every 0.6 second
  const compressionIntervalTimerRef = useRef(null);

  //overall scores based on depth and timing
  const [overallScore, setOverallScore] = useState(0);
  //every time timingAttempt and depthAttempt changes which means every 0.6 seconds, this function will be called
  //the overall score will be updated based on the depth and timing
  useEffect(() => {
    if (timingAttempt != null && depthAttempt != null) {
      setOverallScore(getScore(depthAttempt, timingAttempt));
    }
  }, [timingAttempt, depthAttempt]);

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

    if (timerRef.current) {
      //clear timer reference interval to avoid bugs
      clearInterval(timerRef.current);
      //set timer and time to off or default values
      setTimerOn(false);
      setTime(0);

      //set timingAttempt to null or default value
      //this remove the unchanged timingAttempt value bugs
      setTimingAttempt(null);
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
   * Check timing
   * this will only be called every 600 miliseconds or 0.6 seconds
   *
   */
  const getAttemptScore = () => {
    /*
     *
     * Get Timing Attempt Score
     *
     */
    if (timerOn) {
      /**
       * if the depth is greater than 1 inch, it means that compression is performed
       * during the time this function is called
       * if depth is greater than 0.1 inch, it means that compression is performed
       * therefore the user perform a compression during the 0.6 interval which mean the
       * timing is perfect
       */
      if (depthRef.current >= 0.1) {
        setTimingAttempt("Perfect");
      } else {
        setTimingAttempt("Bad");
      }

      /*
       *
       * Get Depth Attempt Score
       *
       */
      setDepthAttempt(depthRef.current);
      /**
       *
       * after 100ms or 0.1 seconds set the timingAttempt and depthAttempt to null or their default value
       * its purpose is to remove the timing and depth attempt value when 0.6 seconds have passed
       * so that the UI only the display the timing and depth attempt value on every 0.6 seconds interval
       *
       * if this code is not present the UI will display the latest timing and depth attempt value always
       * where it supposed to only be displayed every 0.6 seconds interval
       */
      setTimeout(() => {
        setTimingAttempt(null);
        setDepthAttempt(null);
        setOverallScore(null);
      }, 100);
    }
  };

  //Get the score based on the depth and timing
  const getScore = useMemo(
    () => (depth, timing) => {
      if (depth < 0.3 && timing == "Bad") return 0;
      else if (depth >= 0.3 && depth < 2 && timing == "Bad") return 1;
      else if (depth >= 0.3 && depth < 2 && timing == "Perfect") return 2;
      else if (depth >= 2 && depth <= 2.5 && timing == "Bad") return 2;
      else if (depth >= 2 && depth <= 2.5 && timing == "Perfect") return 3;
      else if (depth > 2.5 && timing == "Perfect") return 4;
      else if (depth > 2.5 && timing == "Bad") return 5;

      return 0;
    },
    []
  );

  //This where timer counting happens
  useEffect(() => {
    //everytime timerOn is true, start the timer counting
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      //everytime timerOn is true, start the compression timer counting to
      //determine the interval between each compression
      // Check for timing every 600ms or 0.6 seconds
      compressionIntervalTimerRef.current = setInterval(getAttemptScore, 600);
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
    depthRef,
    timer,
    timerOn,
    depthAttempt,
    timingAttempt,
    overallScore,
    toggleStartAndStop,
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
