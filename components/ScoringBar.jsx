import { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

import COLORS from "../utils/Colors";

const ScoreBar = ({ score }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  const SCORE_PROGRESS_VALUE = {
    0: 0, //0-24
    1: 27, //25-49
    2: 50, //50-74
    3: 75, //75-99
    4: 90, //100
  };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: SCORE_PROGRESS_VALUE[score || 0],
      duration: 5, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  }, [score]);

  const progressPosition = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { left: progressPosition }]} />
      <View
        style={[
          styles.scoreBox,
          { backgroundColor: COLORS.gray, left: "0%", width: "17%" },
        ]}
      />
      <View
        style={[
          styles.scoreBox,
          { backgroundColor: COLORS.yellow, left: "17%", width: "22%" },
        ]}
      />
      <View
        style={[
          styles.scoreBox,
          { backgroundColor: COLORS.green, left: "39%", width: "22%" },
        ]}
      />
      <View
        style={[
          styles.scoreBox,
          { backgroundColor: COLORS.red, right: "17%", width: "22%" },
        ]}
      />
      <View
        style={[
          styles.scoreBox,
          { backgroundColor: COLORS.darkRed, right: 0, width: "17%" },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 35,
    borderRadius: 6,
    margin: 10,
    width: 350,
    position: "relative",
  },
  bar: {
    height: 35,
    width: 12,
    zIndex: 90,
    position: "absolute",
    top: 0,
    backgroundColor: "white",
    borderRightWidth: 2,
    borderLeftWidth: 2,
  },
  scoreBox: {
    height: 35,
    position: "absolute",
    top: 0,
    zIndex: 0,
  },
});

export default ScoreBar;
