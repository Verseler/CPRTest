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
  const [timingMetrics, setTimingMetrics] = useState(null);
  const [depthMetrics, setDepthMetrics] = useState(null);
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
      setTimingMetrics(null);
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

  const checkCompression = () => {
    if (timerOn) {
      console.log("depth: ", depthRef.current);
      if (depthRef.current >= 1) {
        setTimingMetrics("green");
      } else {
        setTimingMetrics("red");
      }

      setDepthMetrics(depthRef.current);

      setTimeout(() => {
        setTimingMetrics(null);
        setDepthMetrics(null);
      }, 200);
    }
  };

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
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
      <Text style={styles.text}>Time: {time} seconds</Text>

      <TouchableOpacity onPress={handleToggleTimer} style={styles.button}>
        <Text>{timerOn ? "Stop" : "Start"}</Text>
      </TouchableOpacity>

      {timingMetrics && (
        <Text style={[styles.feedback, { backgroundColor: timingMetrics }]}>
          {timingMetrics === "green" ? "Good Timing" : "Bad Timing"}
        </Text>
      )}
      {depthMetrics && DepthMessage(depthMetrics)}
    </View>
  );
}

const DepthMessage = (depth) => {
  if (depth >= 2 && depth <= 2.5) {
    return (
      <Text style={[styles.depthMetrics, { backgroundColor: "green" }]}>
        {depth} Good
      </Text>
    );
  } else if (depth > 2.5) {
    return (
      <Text style={[styles.depthMetrics, { backgroundColor: "red" }]}>
        {depth} Bad: Too much!
      </Text>
    );
  } else {
    return (
      <Text style={[styles.depthMetrics, { backgroundColor: "orange" }]}>
        {depth} Bad: Too little!
      </Text>
    );
  }
};

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
  button: {
    width: 300,
    maxWidth: "90%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  feedback: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    padding: 10,
    position: "absolute",
    bottom: 0,
  },
  depthMetrics: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 20,
    color: "white",
    padding: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
    fontSize: 16,
    marginVertical: 20,
  },
});
