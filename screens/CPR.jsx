import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function CPR() {
  const [{ z }, setData] = useState({ z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [depth, setDepth] = useState(0);
  const [previousZ, setPreviousZ] = useState(1);
  const [timerOn, setTimerOn] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const depthRef = useRef(depth);

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100);
    setSubscription(
      Accelerometer.addListener((data) => {
        setData(data);
        calculateDepth(data);
      })
    );
  };

  const _unsubscribe = () => {
    Accelerometer.removeAllListeners();
    setSubscription(null);
    setDepth(0);
    setData({ z: 1 });

    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerOn(false);
      setTime(0);
    }
  };

  const calculateDepth = ({ z }) => {
    const deltaZ = z - previousZ;
    const calibrationFactor = 4.5;
    const compressionDepth = Math.abs(deltaZ * calibrationFactor);
    setDepth(compressionDepth.toFixed(1));
    setPreviousZ(z);
  };

  useEffect(() => {
    depthRef.current = depth;
  }, [depth]);

  const DepthMessage = () => {
    if (depth >= 2 && depth <= 2.5) {
      return <Text style={[styles.message, { color: "green" }]}>Good</Text>;
    } else if (depth > 2.5) {
      return (
        <Text style={[styles.message, { color: "red" }]}>Bad: Too much!</Text>
      );
    } else {
      return (
        <Text style={[styles.message, { color: "orange" }]}>
          Bad: Too little!
        </Text>
      );
    }
  };

  const checkCompression = () => {
    if (timerOn) {
      if (depthRef.current >= 1) {
        console.log("Compression performed!"); // You can replace this with your preferred feedback mechanism
      } else {
        console.log("No compression detected.");
      }
    }
  };

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        console.log("depth: ", depthRef.current);
        checkCompression(); // Check for compression every 0.6 seconds (600ms)
      }, 600);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerOn]);

  const handleToggleTimer = () => {
    subscription ? _unsubscribe() : _subscribe();
    setTimerOn(!timerOn);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Z : {z.toFixed(1)}</Text>
      <Text style={styles.text}>Compression Depth: {depth} in</Text>
      {DepthMessage()}
      <Text style={styles.text}>Time: {time / 10} seconds</Text>

      <TouchableOpacity onPress={handleToggleTimer} style={styles.button}>
        <Text>{timerOn ? "Stop" : "Start"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#121212",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
  },
  message: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    width: 300,
    maxWidth: "90%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
});
