import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function App() {
  const [data, setData] = useState({});
  const [depth, setDepth] = useState(0);
  const [previousZ, setPreviousZ] = useState(null);

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100); // Update interval in milliseconds
    Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
      calculateDepth(accelerometerData);
    });
  };

  const _unsubscribe = () => {
    Accelerometer.removeAllListeners();
  };

  const calculateDepth = ({ z }) => {
    if (previousZ !== null) {
      const deltaZ = z - previousZ;
      // Simple conversion for demonstration; calibration needed
      const compressionDepth = Math.abs(deltaZ * 3.937); // 1 meter = 39.37 inches
      setDepth(compressionDepth.toFixed(2));
    }
    setPreviousZ(z);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Compression Depth: {depth} inches</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
