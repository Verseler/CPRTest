import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Accelerometer } from "expo-sensors";

// Function to calculate RMS value of acceleration
const calculateRMS = (x, y, z) => {
  return Math.sqrt(x * x + y * y + z * z);
};

// Function to calculate compression depth in inches
const calculateCompressionDepth = (rms, baselineRMS) => {
  const depthInCm = Math.abs(rms - baselineRMS) * 100;
  return depthInCm / 2.54;
};

// Function to compute the exponential moving average
const exponentialMovingAverage = (currentValue, previousEMA, alpha = 0.1) => {
  return alpha * currentValue + (1 - alpha) * previousEMA;
};

const App = () => {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [depth, setDepth] = useState(0);
  const [baselineRMS, setBaselineRMS] = useState(null);
  const [emaRMS, setEmaRMS] = useState(0);
  const maxDepth = 2.4; // Maximum compression depth in inches

  // Function to subscribe to accelerometer updates
  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
        const rms = calculateRMS(
          accelerometerData.x,
          accelerometerData.y,
          accelerometerData.z
        );

        setEmaRMS((prevEmaRMS) => {
          const newEmaRMS = exponentialMovingAverage(rms, prevEmaRMS);

          if (baselineRMS === null) {
            setBaselineRMS(newEmaRMS);
          } else {
            const compressionDepth = calculateCompressionDepth(
              newEmaRMS,
              baselineRMS
            );
            setDepth(compressionDepth);
          }

          return newEmaRMS;
        });
      })
    );
  };

  // Function to unsubscribe from accelerometer updates
  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Effect to handle component mount and unmount
  useEffect(() => {
    Accelerometer.setUpdateInterval(16); // 60 Hz
    _subscribe();
    return () => _unsubscribe();
  }, [baselineRMS]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
      }}
    >
      <Text style={{ color: "white" }}>z: {z.toFixed(1)}</Text>
      <Text style={{ color: "white" }}>
        Compression Depth: {depth.toFixed(1)} inches
      </Text>
      {depth >= 2 && depth <= maxDepth ? (
        <Text style={{ color: "green" }}>Good Compression Depth!</Text>
      ) : depth > maxDepth ? (
        <Text style={{ color: "orange" }}>
          Warning: Compression Depth is too much!
        </Text>
      ) : (
        <Text style={{ color: "red" }}>Compression Depth is too shallow!</Text>
      )}
      <Button
        title="Calibrate"
        onPress={() => setBaselineRMS(null)}
        color="#841584"
      />
    </View>
  );
};

export default App;
