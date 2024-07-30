import { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

import COLORS from "../utils/Colors";

const ScoreBar = ({ score }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const SCORE_PROGRESS_VALUE = {
    0: 0,
    1: 5,
    2: 24,
    3: 46,
    4: 68,
    5: 90,
  };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: SCORE_PROGRESS_VALUE[score || 0],
      duration: 10,
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
          {
            backgroundColor: COLORS.gray,
            width: "17%",
          },
        ]}
      />
      <View
        style={[
          styles.scoreBox,
          { backgroundColor: COLORS.yellow, width: "22%" },
        ]}
      />
      <View
        style={[
          styles.scoreBox,
          { backgroundColor: COLORS.green, width: "22%" },
        ]}
      />
      <View
        style={[styles.scoreBox, { backgroundColor: COLORS.red, width: "22%" }]}
      />
      <View
        style={[
          styles.scoreBox,
          {
            backgroundColor: COLORS.darkRed,
            width: "17%",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 3,
    margin: 10,
    width: 350,
    borderWidth: 2,
    flexDirection: "row",
  },
  bar: {
    height: 46,
    width: 24,
    zIndex: 90,
    position: "absolute",
    bottom: -5,
    backgroundColor: "white",
    borderWidth: 3,
  },
  scoreBox: {
    height: "100%",
    zIndex: 0,
  },
});

export default ScoreBar;
