import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { Accelerometer } from "expo-sensors";

// Constants for thresholds
const COMPRESSION_THRESHOLD = 0.85; // Minimum z-value for compression start
const UPDATE_INTERVAL = 16; // Update interval for accelerometer in ms
const INCHES_PER_METER = 39.3701; // Conversion factor

//* the calculation of compression assume a straight-line motion

export default function CPRGuide0() {
  const accelerationData = useRef([]);
  const [zAcceleration, setZAcceleration] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (isSubscribed) {
      const timestamp = Date.now();
      console.log("cpr 0")
      if (zAcceleration < COMPRESSION_THRESHOLD) {
        accelerationData.current.push({ timestamp, z: zAcceleration });
        //console.log("start ", accelerationData.current);

        setIsCompressing(true);
      }
      if (zAcceleration > COMPRESSION_THRESHOLD && isCompressing) {
        accelerationData.current.push({ timestamp, z: zAcceleration });

        const start = accelerationData.current[0];
        const end =
          accelerationData.current[accelerationData.current.length - 1];
        const deltaTime = (end.timestamp - start.timestamp) / 1000;

        //* Calculate change in velocity (Δv)
        const averageAcceleration = (start.z + end.z) / 2;
        // Δv=a⋅Δt
        const deltaVelocity = averageAcceleration * deltaTime; //const deltaVelocity = averageAcceleration * deltaTime;

        //* Calculate velocity at time t
        const velocity0 = 0; // initial velocity
        const velocity = velocity0 + deltaVelocity;

        //* Calculate displacement (Δd)
        const deltaDistance = velocity * deltaTime;
        const distance0 = 0; // initial distance
        const distance = deltaDistance + distance0; // in meter unit

        // convert meters to inches
        const calibration = 1.0;
        const depth = distance * INCHES_PER_METER * calibration;
        console.log("Depth (inches): ", depth);
        //console.log("end ", accelerationData.current);

        // Calculate velocity and depth
        //* const deltaV = averageAcceleration * deltaTime;
        //* const depth = 0.5 * averageAcceleration * Math.pow(deltaTime, 2);

        setIsCompressing(false);
        accelerationData.current = [];
      }
    }
  }, [isSubscribed, zAcceleration]);

  const start = () => {
    if (!isSubscribed) {
      setIsSubscribed(true);

      Accelerometer.setUpdateInterval(UPDATE_INTERVAL); // Set update interval in ms
      Accelerometer.addListener(({ z }) => setZAcceleration(z));
    }
  };

  const stop = () => {
    Accelerometer.removeAllListeners();
    setIsSubscribed(false);
  };

  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        title={isSubscribed ? "Stop" : "Start"}
        onPress={isSubscribed ? stop : start}
      />
      <View style={styles.content}>
        <Text style={styles.text}>Z Value: {zAcceleration.toFixed(2)}</Text>
        <Text style={styles.text}>
          {isCompressing ? "Compressing" : "Not compressing"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
