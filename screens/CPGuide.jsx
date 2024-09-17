import { Accelerometer } from "expo-sensors";
import { useState, useEffect, useCallback, useRef } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import {
  isCompressionPerformed,
  isCompressionEnded,
  getAcceleration,
  getDeltaTime,
  getLowestZ,
} from "./helper";

// Constants for compression depth conversion and threshold tuning
const UPDATE_INTERVAL = 16; // 60hz
const EXPECTED_COMPRESSION_RATE = 0.6; // 0.6 seconds per compression

const CPRGuide = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const compressionDepth = useRef(null);
  const compressionAcceleration = useRef(null);
  const compressionCount = useRef(0);
  const previousCompressionTime = useRef(null); // Store time of the previous compression
  const [timingFeedback, setTimingFeedback] = useState("N/A");

  const [timer, setTimer] = useState(0); // Timer state
  const startTime = useRef(null); // Reference to hold the start time

  // Variables to track previous state
  const [previousZ, setPreviousZ] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const lowestZ = useRef(null);
  const previousTime = useRef(null);

  useEffect(() => {
    if (isSubscribed) {
      Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
      const subscription = Accelerometer.addListener((data) => {
        const currentTime = Date.now();
        processCompression(data.z, currentTime);
        updateTimer(currentTime); // Update the timer based on real time
      });

      // Record the start time when subscribing
      startTime.current = Date.now();

      return () => {
        subscription && subscription.remove();
      };
    }
  }, [isSubscribed, previousZ]);

  const updateTimer = (currentTime) => {
    if (startTime.current) {
      // Calculate the difference between the current time and the start time
      const elapsedTime = (currentTime - startTime.current) / 1000; // Convert ms to seconds
      setTimer(elapsedTime);
    }
  };

  const subscribe = () => {
    setIsSubscribed(true);
  };

  const unsubscribe = () => {
    Accelerometer.removeAllListeners();
    setIsSubscribed(false);
    resetTimer(); // Reset the timer when unsubscribed
  };

  const resetTimer = () => {
    setTimer(0);
    startTime.current = null; // Clear the start time
  };

  const clear = () => {
    unsubscribe();
    compressionDepth.current = null;
    compressionCount.current = 0;
    setPreviousZ(null);
    lowestZ.current = null;
    previousCompressionTime.current = null;
    setTimingFeedback("N/A");
    resetTimer(); // Reset the timer
  };

  // This will observe the acceleration to check if compression is performed
  const processCompression = useCallback(
    (currentZ, currentTime) => {
      const deltaT = getDeltaTime(previousTime.current, currentTime);
      const currentLowestZ = getLowestZ(lowestZ.current, currentZ);

      if (previousZ !== null && deltaT > 0) {
        //* Detect if compression is performed
        if (isCompressionPerformed(previousZ, currentZ)) {
          setIsCompressing(true);

          // Record current lowestZ to be used for next processCompression
          lowestZ.current = currentLowestZ;

          //* Calculate compression acceleration
          const acceleration = getAcceleration(previousZ, currentZ, deltaT);
          compressionAcceleration.current = acceleration;
        }

        //* Detect if the compression ends
        if (isCompressionEnded(previousZ, currentZ, isCompressing)) {
          const currentCompressionDepth = calculateDepth(
            currentLowestZ,
            currentZ
          );

          compressionDepth.current = currentCompressionDepth.toFixed(2);
          compressionCount.current = compressionCount.current + 1;

          // Check compression timing and give feedback
          checkCompressionTiming(currentTime);

          resetCompressionState(); // Reset values after compression
        }
      }

      setPreviousZ(currentZ);
      previousTime.current = currentTime;
    },
    [isSubscribed, previousZ]
  );

  // Reset compression-related state after each compression
  const resetCompressionState = () => {
    setIsCompressing(false);
    lowestZ.current = null;
    setPreviousZ(null);
  };

  // Function to calculate compression depth in inches
  const calculateDepth = (lowestZ, currentZ) => {
    const depthInMeters = Math.abs(currentZ - lowestZ);
    const gForceToInches = 0.3937;
    const calibrationFactor = 4.5;
    return Math.abs(depthInMeters * calibrationFactor * gForceToInches);
  };

  // Function to check the timing of each compression
  const checkCompressionTiming = (currentTime) => {
    if (previousCompressionTime.current !== null) {
      const timeDiff = (currentTime - previousCompressionTime.current) / 1000; // Convert ms to seconds

      if (timeDiff === EXPECTED_COMPRESSION_RATE) {
        setTimingFeedback("Perfect timing");
      } else if (timeDiff < EXPECTED_COMPRESSION_RATE) {
        setTimingFeedback("Too early");
      } else {
        setTimingFeedback("Too late");
      }
    }
    previousCompressionTime.current = currentTime; // Update with the current compression time
  };

  return (
    <View>
      <Text>Compression Count: {compressionCount.current}</Text>
      <Text>
        Compression Depth:{" "}
        {compressionDepth.current
          ? `${compressionDepth.current} inches`
          : "N/A"}
      </Text>
      <Text>
        Compression Acceleration:{" "}
        {compressionAcceleration.current
          ? `${compressionAcceleration.current} g`
          : "N/A"}
      </Text>
      <Text>Timing Feedback: {timingFeedback}</Text>

      {/* Display the timer */}
      <Text>Timer: {timer.toFixed(2)} seconds</Text>

      <Button mode="contained" onPress={subscribe}>
        Start
      </Button>
      <Button mode="outlined" onPress={unsubscribe}>
        Stop
      </Button>
      <Button mode="contained-tonal" onPress={clear}>
        Clear
      </Button>
    </View>
  );
};

export default CPRGuide;
