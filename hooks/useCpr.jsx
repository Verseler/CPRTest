import { useState, useEffect, useRef } from "react";
import { Accelerometer } from "expo-sensors";

const useCpr = () => {
  //It determine if there is a subscription to accelerometer. It used to determine if the CPR is started or not
  const [subscription, setSubscription] = useState(null);
  //raw acceleration data. Z value is only used
  const [{ z }, setData] = useState({ z: 0 });
  //previous z value, it is used for calculating the depth
  const [previousZ, setPreviousZ] = useState(1);
  //depth value(inches) on everytime z value changes
  const [depth, setDepth] = useState(0);
  //depth value on every 0.6 seconds compression attempt
  const [depthAttempt, setDepthAttempt] = useState(null);
  //timing status on every 0.6 seconds compression attempt
  const [timingAttempt, setTimingAttempt] = useState(null);
  //boolean value that determine if the timer started or not
  const [timerOn, setTimerOn] = useState(false);
  //raw timer value
  const [time, setTime] = useState(0);
  //formatted timer value in Minutes:Seconds format
  const timer = formatTime(time);
  //reference to the timer. this value will be changed every 1 second
  const timerRef = useRef(null);
  //reference to the compression interval Timer. this value will be changed every 0.6 second
  const compressionIntervalTimerRef = useRef(null);
  //reference to the depth. This is needed for checking the timing
  const depthRef = useRef(depth);

  /**
   *
   * Start CPR
   *
   */
  const subscribe = () => {
    // Every 100 ms or 0.1 seconds the accelerometer data will be updated
    Accelerometer.setUpdateInterval(100);

    setSubscription(
      Accelerometer.addListener((data) => {
        // Update the data state with the new accelerometer data
        setData(data);
        // Calculate the depth based on the new accelerometer data
        calculateDepth(data);
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
    setDepth(0);
    setData({ z: 1 });

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
  const calculateDepth = ({ z }) => {
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
    //set the depth based on computation result
    setDepth(compressionDepth.toFixed(1));

    //this is needed to be able to see the changes in depth on checkTiming function
    depthRef.current = compressionDepth.toFixed(1);

    //set the previous z value
    //it is used for calculating the depth next time
    setPreviousZ(z);
  };

  /**
   *
   * Check timing
   *
   */
  const checkTiming = () => {
    //check timingAttempt when timer is on
    if (timerOn) {
      //if the depth is greater than 1 inch, it means that compression is performed
      //during the time this function is called
      if (depthRef.current >= 1) {
        setTimingAttempt("Good");
      } else {
        setTimingAttempt("Bad");
      }

      //set the depthAttempt to the latest depth value
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
      }, 100);
    }
  };

  //This where timer counting happens
  useEffect(() => {
    //everytime timerOn is true, start the timer counting
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      //everytime timerOn is true, start the compression timer counting to
      //determine the interval between each compression
      compressionIntervalTimerRef.current = setInterval(() => {
        checkTiming(); // Check for timing every 600ms or 0.6 seconds
      }, 600);
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
    z,
    depth,
    timer,
    timerOn,
    depthAttempt,
    timingAttempt,
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
