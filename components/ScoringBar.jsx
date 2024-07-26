import { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

import COLORS from "../utils/Colors";

const ScoreBar = ({ score }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  const SCORE_PROGRESS_VALUE = {
    0: 0, //0-24
    1: 26, //25-49
    2: 48, //50-74
    3: 70, //75-99
    4: 90, //100
  };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: SCORE_PROGRESS_VALUE[score || 0],
      duration: 5,
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
            left: "0%",
            width: "17%",
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          },
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
          { backgroundColor: COLORS.red, left: "61%", width: "22%" },
        ]}
      />
      <View
        style={[
          styles.scoreBox,
          {
            backgroundColor: COLORS.darkRed,
            left: "83%",
            width: "17%",
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
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
    position: "relative",
    borderWidth: 1,
  },
  bar: {
    height: "100%",
    width: 12,
    zIndex: 90,
    position: "absolute",
    top: 0,
    backgroundColor: "white",
    borderRightWidth: 2,
    borderLeftWidth: 2,
  },
  scoreBox: {
    height: "100%",
    position: "absolute",
    top: 0,
    zIndex: 0,
  },
});

export default ScoreBar;
