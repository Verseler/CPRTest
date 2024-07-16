import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function CPR() {
  const [{ z }, setData] = useState({ z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [depth, setDepth] = useState(0);
  const [previousZ, setPreviousZ] = useState(1);

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100); // 100ms is the interval of the accelerometer data (z, x, y)
    setSubscription(
      Accelerometer.addListener((data) => {
        setData(data);
        calculateDepth(data);
      })
    );
  };

  const _unsubscribe = () => {
    //remove the eventListener in Accelerometer
    Accelerometer.removeAllListeners();
    //remove also the subscription value
    setSubscription(null);
    //set depth and z data back to default value
    setDepth(0);
    setData({ z: 1 });
  };

  const calculateDepth = ({ z }) => {
    const deltaZ = z - previousZ;
    //Change this part to get the accurate value of depth
    const calibrationFactor = 4.5; //you can change it to  1 meter = 39.37 inches
    const compressionDepth = Math.abs(deltaZ * calibrationFactor);
    setDepth(compressionDepth.toFixed(1));

    setPreviousZ(z);
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Z : {z.toFixed(1)}</Text>
      <Text style={styles.text}>Compression Depth: {depth} in</Text>
      {DepthMessage()}

      <TouchableOpacity
        onPress={subscription ? _unsubscribe : _subscribe}
        style={styles.button}
      >
        <Text>{subscription ? "On" : "Off"}</Text>
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
